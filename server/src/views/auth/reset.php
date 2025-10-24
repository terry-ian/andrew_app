<!doctype html>
<html lang="zh-Hant">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>重設密碼</title>
  <link rel="stylesheet" href="/assets/css/style.css" />
</head>
<body>
  <main class="auth-card">
    <h1>重設密碼</h1>
    <form method="post" action="/auth/perform-reset">
      <input type="hidden" name="csrf" value="<?= e(csrf_token()) ?>">
      <input type="hidden" name="token" value="<?= e($token) ?>">
      <div class="form-row">
        <label for="password">新密碼</label>
        <input id="password" type="password" name="password" minlength="8" required>
      </div>
      <button class="primary" type="submit">更新密碼</button>
      <div class="actions">
        <a href="/login">返回登入</a>
      </div>
    </form>
  </main>
</body>
</html>
