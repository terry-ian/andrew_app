<?php
require_once __DIR__ . '/../core/security.php';

class AuthController
{
    // API 版本：JSON 輸入/輸出
    public static function apiRegister($pdo)
    {
        $input = get_json_input();
        $email = strtolower(trim($input['email'] ?? ''));
        $pass = $input['password'] ?? '';
        $name = trim($input['full_name'] ?? '');

        // 驗證輸入
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            json_response(['success' => false, 'message' => 'Email 格式不正確'], 400);
        }
        if (strlen($pass) < 8) {
            json_response(['success' => false, 'message' => '密碼至少需要 8 個字元'], 400);
        }
        if (empty($name)) {
            json_response(['success' => false, 'message' => '姓名為必填'], 400);
        }

        try {
            // 檢查 email 是否已存在
            $stmt = $pdo->prepare('SELECT id FROM users WHERE email = ?');
            $stmt->execute([$email]);
            if ($stmt->fetch()) {
                json_response(['success' => false, 'message' => '此 Email 已被註冊'], 400);
            }

            $pdo->beginTransaction();
            $stmt = $pdo->prepare('INSERT INTO users(email,password_hash,full_name) VALUES (?,?,?)');
            $stmt->execute([$email, password_hash($pass, PASSWORD_BCRYPT), $name]);
            $uid = $pdo->lastInsertId();
            $pdo->prepare('INSERT INTO user_roles(user_id, role_id) VALUES(?,1)')->execute([$uid]);
            $pdo->prepare('INSERT INTO wallets(user_id,currency) VALUES(?,"USD")')->execute([$uid]);

            // email verification token
            $token = bin2hex(random_bytes(32));
            $expires = (new DateTime('+2 hours'))->format('Y-m-d H:i:s');
            $pdo->prepare('INSERT INTO email_verifications(user_id,token,expires_at) VALUES(?,?,?)')->execute([$uid, $token, $expires]);
            $pdo->commit();

            json_response([
                'success' => true,
                'message' => '註冊成功，請檢查您的 Email 進行驗證',
                'data' => [
                    'user_id' => $uid,
                    'email' => $email
                ]
            ], 201);
        } catch (Exception $e) {
            if ($pdo->inTransaction()) {
                $pdo->rollBack();
            }
            json_response(['success' => false, 'message' => '註冊失敗，請稍後再試'], 500);
        }
    }

    // 傳統表單版本（保留向後相容）
    public static function register($pdo)
    {
        check_csrf();
        $email = strtolower(trim($_POST['email'] ?? ''));
        $pass = $_POST['password'] ?? '';
        $name = trim($_POST['full_name'] ?? '');
        if (!filter_var($email, FILTER_VALIDATE_EMAIL) || strlen($pass) < 8) {
            http_response_code(400);
            echo 'Invalid';
            return;
        }

        $pdo->beginTransaction();
        $stmt = $pdo->prepare('INSERT INTO users(email,password_hash,full_name) VALUES (?,?,?)');
        $stmt->execute([$email, password_hash($pass, PASSWORD_BCRYPT), $name]);
        $uid = $pdo->lastInsertId();
        $pdo->prepare('INSERT INTO user_roles(user_id, role_id) VALUES(?,1)')->execute([$uid]);
        $pdo->prepare('INSERT INTO wallets(user_id,currency) VALUES(?,"USD")')->execute([$uid]);

        // email verification token
        $token = bin2hex(random_bytes(32));
        $expires = (new DateTime('+2 hours'))->format('Y-m-d H:i:s');
        $pdo->prepare('INSERT INTO email_verifications(user_id,token,expires_at) VALUES(?,?,?)')->execute([$uid, $token, $expires]);
        $pdo->commit();
        header('Location: /login?registered=1');
    }

    public static function verify($pdo)
    {
        $token = $_GET['token'] ?? '';
        $stmt = $pdo->prepare('SELECT * FROM email_verifications WHERE token=? AND used_at IS NULL AND expires_at>NOW()');
        $stmt->execute([$token]);
        $row = $stmt->fetch();
        if (!$row) {
            echo 'Invalid or expired';
            return;
        }
        $pdo->beginTransaction();
        $pdo->prepare('UPDATE users SET email_verified=1 WHERE id=?')->execute([$row['user_id']]);
        $pdo->prepare('UPDATE email_verifications SET used_at=NOW() WHERE id=?')->execute([$row['id']]);
        $pdo->commit();
        header('Location: /login?verified=1');
    }

    // API 版本：JSON 輸入/輸出
    public static function apiLogin($pdo)
    {
        $input = get_json_input();
        $email = strtolower(trim($input['email'] ?? ''));
        $pass = $input['password'] ?? '';

        // 驗證輸入
        if (empty($email) || empty($pass)) {
            json_response(['success' => false, 'message' => 'Email 和密碼為必填'], 400);
        }

        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            json_response(['success' => false, 'message' => 'Email 格式不正確'], 400);
        }

        try {
            $stmt = $pdo->prepare('SELECT * FROM users WHERE email=?');
            $stmt->execute([$email]);
            $u = $stmt->fetch();

            if (!$u || !password_verify($pass, $u['password_hash'])) {
                json_response(['success' => false, 'message' => 'Email 或密碼錯誤'], 401);
            }

            // 設置 session
            $_SESSION['uid'] = $u['id'];
            $_SESSION['name'] = $u['full_name'];

            json_response([
                'success' => true,
                'message' => '登入成功',
                'data' => [
                    'user_id' => $u['id'],
                    'email' => $u['email'],
                    'full_name' => $u['full_name']
                ]
            ], 200);
        } catch (Exception $e) {
            json_response(['success' => false, 'message' => '登入失敗，請稍後再試'], 500);
        }
    }

    // API 版本：登出
    public static function apiLogout($pdo)
    {
        session_destroy();
        json_response([
            'success' => true,
            'message' => '登出成功'
        ], 200);
    }

    // API 版本：取得當前用戶資訊
    public static function apiGetCurrentUser($pdo)
    {
        // 檢查是否已登入
        if (empty($_SESSION['uid'])) {
            json_response([
                'success' => false,
                'message' => '未登入'
            ], 401);
            return;
        }

        try {
            // 查詢用戶資訊及角色
            $stmt = $pdo->prepare('
        SELECT u.id, u.email, u.full_name, u.email_verified,
               GROUP_CONCAT(r.name) as roles
        FROM users u
        LEFT JOIN user_roles ur ON u.id = ur.user_id
        LEFT JOIN roles r ON ur.role_id = r.id
        WHERE u.id = ?
        GROUP BY u.id
      ');
            $stmt->execute([$_SESSION['uid']]);
            $user = $stmt->fetch(PDO::FETCH_ASSOC);

            if (!$user) {
                json_response([
                    'success' => false,
                    'message' => '用戶不存在'
                ], 404);
                return;
            }

            // 轉換角色為陣列
            $user['roles'] = $user['roles'] ? explode(',', $user['roles']) : [];

            // 轉換 email_verified 為布林值
            $user['email_verified'] = (bool)$user['email_verified'];

            json_response([
                'success' => true,
                'data' => $user
            ], 200);
        } catch (Exception $e) {
            json_response([
                'success' => false,
                'message' => '取得用戶資訊失敗'
            ], 500);
        }
    }

    // 傳統表單版本（保留向後相容）
    public static function login($pdo)
    {
        check_csrf();
        $email = strtolower(trim($_POST['email'] ?? ''));
        $pass = $_POST['password'] ?? '';
        $stmt = $pdo->prepare('SELECT * FROM users WHERE email=?');
        $stmt->execute([$email]);
        $u = $stmt->fetch();
        if (!$u || !password_verify($pass, $u['password_hash'])) {
            header('Location: /login?err=1');
            return;
        }
        $_SESSION['uid'] = $u['id'];
        $_SESSION['name'] = $u['full_name'];
        header('Location: /');
    }
}
