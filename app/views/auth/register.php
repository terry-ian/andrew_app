<!doctype html>
<html lang="zh-Hant">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>註冊</title>
    <link rel="stylesheet" href="/assets/css/style.css" />
  </head>
  <body>
    <main class="auth-card" role="main">
      <h1>建立帳號</h1>
      <p class="sub">使用 Email 註冊並完成驗證</p>
      <form method="post" action="/auth/register" novalidate>
        <input type="hidden" name="csrf" value="<?= e(csrf_token()) ?>">
        <div class="form-row">
          <label for="full_name">姓名</label>
          <input id="full_name" name="full_name" type="text" required placeholder="王小明">
        </div>
        <div class="form-row">
          <label for="email">Email</label>
          <input id="email" name="email" type="email" required placeholder="you@example.com">
        </div>
        <div class="form-row">
          <label for="password">密碼</label>
          <input id="password" name="password" type="password" minlength="8" required placeholder="至少 8 碼">
        </div>
        <button class="primary" type="submit">註冊</button>
        <div class="actions">
          <span>已經有帳號？<a href="/login">前往登入</a></span>
        </div>
      </form>
    </main>
    <script src="/assets/js/app.js"></script>
  </body>
</html>
