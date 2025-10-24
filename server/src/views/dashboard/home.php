<!doctype html>
<html lang="zh-Hant">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>控制台</title>
  <link rel="stylesheet" href="/assets/css/style.css" />
  <style>.wrap{max-width:960px;margin:40px auto;padding:0 16px}.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:14px}.card{background:#111834;border:1px solid rgba(255,255,255,.08);border-radius:14px;padding:16px}</style>
</head>
<body>
  <main class="wrap">
    <h1>👋 嗨，<?= e($name) ?>！</h1>
    <p class="sub">這是你的後台控制台範例頁。之後可把各功能導到這裡。</p>
    <div class="grid">
      <div class="card"><h3>錢包餘額</h3><p>（之後接 DB）</p></div>
      <div class="card"><h3>卡片管理</h3><p>（之後接 API）</p></div>
      <div class="card"><h3>刷卡明細</h3><p>（之後做篩選）</p></div>
      <div class="card"><h3>推廣報表</h3><p>（之後串漏斗）</p></div>
    </div>
    <p class="footer-note"><a href="/logout">登出</a></p>
  </main>
</body>
</html>
