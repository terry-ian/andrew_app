<?php
function hash_password($raw){ return password_hash($raw, PASSWORD_BCRYPT); }
function verify_password($raw,$hash){ return password_verify($raw,$hash); }
function csrf_token(){ if(empty($_SESSION['csrf'])) $_SESSION['csrf']=bin2hex(random_bytes(16)); return $_SESSION['csrf']; }
function check_csrf(){ if($_SERVER['REQUEST_METHOD']==='POST'){ if(($_POST['csrf']??'')!==($_SESSION['csrf']??'')) die('CSRF'); } }
function e($s){ return htmlspecialchars($s ?? '', ENT_QUOTES, 'UTF-8'); }

// 讀取 JSON 請求 body
function get_json_input() {
    $input = file_get_contents('php://input');
    if (empty($input)) {
        return [];
    }
    $data = json_decode($input, true);
    return is_array($data) ? $data : [];
}

// 回傳 JSON 回應
function json_response($data, $status = 200) {
    http_response_code($status);
    header('Content-Type: application/json');
    echo json_encode($data);
    exit;
}

// 處理 CORS
function handle_cors() {
    $allowed_origins = [
        'http://localhost:3000',
        'http://localhost:5173'
    ];

    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';

    if (in_array($origin, $allowed_origins)) {
        header("Access-Control-Allow-Origin: $origin");
        header("Access-Control-Allow-Credentials: true");
        header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Authorization");
    }

    // 處理 OPTIONS 預檢請求
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        http_response_code(200);
        exit;
    }
}
