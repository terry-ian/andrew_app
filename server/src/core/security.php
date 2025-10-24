<?php
function hash_password($raw){ return password_hash($raw, PASSWORD_BCRYPT); }
function verify_password($raw,$hash){ return password_verify($raw,$hash); }
function csrf_token(){ if(empty($_SESSION['csrf'])) $_SESSION['csrf']=bin2hex(random_bytes(16)); return $_SESSION['csrf']; }
function check_csrf(){ if($_SERVER['REQUEST_METHOD']==='POST'){ if(($_POST['csrf']??'')!==($_SESSION['csrf']??'')) die('CSRF'); } }
function e($s){ return htmlspecialchars($s ?? '', ENT_QUOTES, 'UTF-8'); }
