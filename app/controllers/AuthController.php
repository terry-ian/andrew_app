<?php
require_once __DIR__ . '/../core/security.php';
class AuthController {
  public static function register($pdo){
    check_csrf();
    $email = strtolower(trim($_POST['email']??''));
    $pass  = $_POST['password']??'';
    $name  = trim($_POST['full_name']??'');
    if(!filter_var($email,FILTER_VALIDATE_EMAIL) || strlen($pass)<8){ http_response_code(400); echo 'Invalid'; return; }

    $pdo->beginTransaction();
    $stmt=$pdo->prepare('INSERT INTO users(email,password_hash,full_name) VALUES (?,?,?)');
    $stmt->execute([$email, password_hash($pass, PASSWORD_BCRYPT), $name]);
    $uid=$pdo->lastInsertId();
    $pdo->prepare('INSERT INTO user_roles(user_id, role_id) VALUES(?,1)')->execute([$uid]);
    $pdo->prepare('INSERT INTO wallets(user_id,currency) VALUES(?,"USD")')->execute([$uid]);

    // email verification token
    $token=bin2hex(random_bytes(32));
    $expires=(new DateTime('+2 hours'))->format('Y-m-d H:i:s');
    $pdo->prepare('INSERT INTO email_verifications(user_id,token,expires_at) VALUES(?,?,?)')->execute([$uid,$token,$expires]);
    $pdo->commit();
    header('Location: /login?registered=1');
  }

  public static function verify($pdo){
    $token = $_GET['token'] ?? '';
    $stmt=$pdo->prepare('SELECT * FROM email_verifications WHERE token=? AND used_at IS NULL AND expires_at>NOW()');
    $stmt->execute([$token]);
    $row=$stmt->fetch();
    if(!$row){ echo 'Invalid or expired'; return; }
    $pdo->beginTransaction();
    $pdo->prepare('UPDATE users SET email_verified=1 WHERE id=?')->execute([$row['user_id']]);
    $pdo->prepare('UPDATE email_verifications SET used_at=NOW() WHERE id=?')->execute([$row['id']]);
    $pdo->commit();
    header('Location: /login?verified=1');
  }

  public static function login($pdo){
    check_csrf();
    $email = strtolower(trim($_POST['email']??''));
    $pass  = $_POST['password']??'';
    $stmt=$pdo->prepare('SELECT * FROM users WHERE email=?');
    $stmt->execute([$email]);
    $u=$stmt->fetch();
    if(!$u || !password_verify($pass, $u['password_hash'])){
      header('Location: /login?err=1'); return;
    }
    $_SESSION['uid']=$u['id'];
    $_SESSION['name']=$u['full_name'];
    header('Location: /');
  }
}
