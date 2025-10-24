<?php
$config = require __DIR__ . '/../config/env.php';
$pdo = new PDO($config['db']['dsn'], $config['db']['user'], $config['db']['pass'], [
  PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
  PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
]);
