<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);
session_start();

$config = require __DIR__ . '/../src/config/env.php';
require_once __DIR__ . '/../src/core/db.php';
require_once __DIR__ . '/../src/core/security.php';
require_once __DIR__ . '/../src/core/auth.php';

require_once __DIR__ . '/../src/controllers/AuthController.php';
require_once __DIR__ . '/../src/controllers/PasswordController.php';

// 處理 CORS(必須在任何輸出之前)
handle_cors();

function render($view, $vars = []) { extract($vars); include __DIR__ . '/../src/views/' . $view . '.php'; }

$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$method = $_SERVER['REQUEST_METHOD'];

// API 路由(JSON 格式,無 CSRF 檢查)
if (strpos($path, '/auth/') === 0) {
  $contentType = $_SERVER['CONTENT_TYPE'] ?? '';

    // 判斷是否為 JSON API 請求 (POST 必須是 JSON, GET 直接允許)
    if (strpos($contentType, 'application/json') !== false || $method === 'GET') {
        if ($path === '/auth/register' && $method === 'POST') {
            AuthController::apiRegister($pdo);
            exit;
        }
        if ($path === '/auth/login' && $method === 'POST') {
            AuthController::apiLogin($pdo);
            exit;
        }
        if ($path === '/auth/logout' && $method === 'POST') {
            AuthController::apiLogout($pdo);
            exit;
        }
        if ($path === '/auth/user' && $method === 'GET') {
            AuthController::apiGetCurrentUser($pdo);
            exit;
        }
        if ($path === '/auth/request-reset' && $method === 'POST') {
            PasswordController::apiRequestReset($pdo, $config);
            exit;
        }
        if ($path === '/auth/perform-reset' && $method === 'POST') {
            PasswordController::apiPerformReset($pdo);
            exit;
        }
  }
}

$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

// Root: go dashboard if logged-in
if ($path === '/') {
  if (!empty($_SESSION['uid'])) {
    header('Location: /dashboard'); exit;
  } else {
    render('auth/login'); exit;
  }
}

// Auth pages
if ($path === '/login') { render('auth/login'); exit; }
if ($path === '/register') { render('auth/register'); exit; }
if ($path === '/forgot') { render('auth/forgot'); exit; }
if ($path === '/reset' && $_SERVER['REQUEST_METHOD']==='GET') { render('auth/reset', ['token' => $_GET['token'] ?? '' ]); exit; }

// Actions
if ($path === '/auth/register' && $_SERVER['REQUEST_METHOD']==='POST') { AuthController::register($pdo); exit; }
if ($path === '/auth/login' && $_SERVER['REQUEST_METHOD']==='POST') { AuthController::login($pdo); exit; }
if ($path === '/auth/request-reset' && $_SERVER['REQUEST_METHOD']==='POST') { PasswordController::requestReset($pdo, $config); exit; }
if ($path === '/auth/perform-reset' && $_SERVER['REQUEST_METHOD']==='POST') { PasswordController::performReset($pdo); exit; }
if ($path === '/verify' && $_SERVER['REQUEST_METHOD']==='GET') { AuthController::verify($pdo); exit; }
if ($path === '/logout') { session_destroy(); header('Location: /login'); exit; }

// Protected
if ($path === '/dashboard') {
  require_login();
  render('dashboard/home', ['name' => $_SESSION['name'] ?? 'User']);
  exit;
}

// 404
http_response_code(404);
echo '404 Not Found';
