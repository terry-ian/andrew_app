<?php
require_once __DIR__ . '/../core/security.php';
require_once __DIR__ . '/../core/mailer.php';

class PasswordController {
  public static function requestReset($pdo, $config){
    check_csrf();
    $email = strtolower(trim($_POST['email'] ?? ''));
    if(!filter_var($email, FILTER_VALIDATE_EMAIL)){ header('Location:/forgot?err=1'); return; }
    $stmt = $pdo->prepare('SELECT id FROM users WHERE email=?');
    $stmt->execute([$email]);
    $u = $stmt->fetch();
    // 統一回覆，避免洩漏帳號是否存在
    if(!$u){ header('Location:/login?reset=sent'); return; }

    $token = bin2hex(random_bytes(32));
    $expires = (new DateTime('+1 hour'))->format('Y-m-d H:i:s');
    $pdo->prepare('INSERT INTO password_resets(user_id, token, expires_at) VALUES(?,?,?)')
        ->execute([$u['id'], $token, $expires]);

    $link = rtrim($config['app']['base_url'], '/') . '/reset?token=' . urlencode($token);
    $subject = '重設您的密碼';
    $body = "請點擊下列連結重設密碼（1 小時內有效）：\n\n{$link}\n\n如果不是您本人操作，請忽略此信。";
    send_mail($email, $subject, $body);

    header('Location:/login?reset=sent'); // 統一回覆
  }

  public static function performReset($pdo){
    check_csrf();
    $token = $_POST['token'] ?? '';
    $pass  = $_POST['password'] ?? '';
    if(strlen($pass) < 8){ header('Location:/reset?token='.urlencode($token).'&weak=1'); return; }

    $st = $pdo->prepare('SELECT * FROM password_resets WHERE token=? AND used_at IS NULL AND expires_at>NOW()');
    $st->execute([$token]);
    $row = $st->fetch();
    if(!$row){ header('Location:/login?reset=invalid'); return; }

    $pdo->beginTransaction();
    $pdo->prepare('UPDATE users SET password_hash=? WHERE id=?')
        ->execute([password_hash($pass, PASSWORD_BCRYPT), $row['user_id']]);
    $pdo->prepare('UPDATE password_resets SET used_at=NOW() WHERE id=?')
        ->execute([$row['id']]);
    $pdo->commit();

    header('Location:/login?reset=done');
  }
}
