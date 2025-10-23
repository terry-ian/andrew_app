<?php
function require_login(){ if(empty($_SESSION['uid'])){ header('Location:/login'); exit; } }
function is_admin($pdo,$uid){
  $st=$pdo->prepare('SELECT 1 FROM user_roles WHERE user_id=? AND role_id=9');
  $st->execute([$uid]);
  return (bool)$st->fetch();
}
function require_admin($pdo){ require_login(); if(!is_admin($pdo,$_SESSION['uid'])) die('Forbidden'); }
