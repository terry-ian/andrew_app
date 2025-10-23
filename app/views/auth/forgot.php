<!doctype html>
<html lang="zh-Hant">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>忘記密碼</title>
  <link rel="stylesheet" href="/assets/css/style.css" />
</head>
<body>
  <main class="auth-card">
    <h1>忘記密碼</h1>
    <p class="sub">輸入你的 Email，我們會寄送重設連結。</p>
    <form method="post" action="/auth/request-reset">
      <input type="hidden" name="csrf" value="<?= e(csrf_token()) ?>">
      <div class="form-row">
        <label for="email">Email</label>
        <input id="email" type="email" name="email" required>
      </div>
      <button class="primary" type="submit">寄送重設信</button>
      <div class="actions">
        <a href="/login">返回登入</a>
      </div>
    </form>
  </main>
</body>
</html>
