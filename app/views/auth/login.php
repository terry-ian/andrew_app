<!doctype html>
<html lang="zh-Hant">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>登入</title>
    <link rel="stylesheet" href="/assets/css/style.css" />
  </head>
  <body>
    <main class="auth-card" role="main" aria-labelledby="title">
      <?php if(isset($_GET['registered'])): ?>
        <div class="alert">註冊成功，請前往信箱收取驗證信。</div>
      <?php endif; if(isset($_GET['verified'])): ?>
        <div class="alert">Email 已驗證，現在可以登入。</div>
      <?php endif; if(isset($_GET['err'])): ?>
        <div class="alert">帳號或密碼錯誤。</div>
      <?php endif; ?>
      <h1 id="title">歡迎回來</h1>
      <p class="sub">請登入以進入後台系統</p>
      <form method="post" action="/auth/login" novalidate>
        <input type="hidden" name="csrf" value="<?= e(csrf_token()) ?>">
        <div class="form-row">
          <label for="email">Email</label>
          <input id="email" name="email" type="email" autocomplete="username" required placeholder="you@example.com">
        </div>
        <div class="form-row">
          <label for="password">密碼</label>
          <input id="password" name="password" type="password" autocomplete="current-password" minlength="8" required placeholder="至少 8 碼">
        </div>
        <button class="primary" type="submit">登入</button>
        <div class="actions">
          <span>沒有帳號？<a href="/register">建立帳號</a></span>
          <a href="/forgot">忘記密碼</a>
        </div>
      </form>
      <p class="footer-note">網頁全程SSL加密，確保安全性最佳實務。</p>
    </main>
    <script src="/assets/js/app.js"></script>
  </body>
</html>
