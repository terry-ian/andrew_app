<?php
// 根據環境選擇配置檔案
$envFile = getenv("DOCKER_ENV") === "true" ? "env.docker.php" : "env.php";
$config = require __DIR__ . "/../config/{$envFile}";

$pdo = new PDO($config["db"]["dsn"], $config["db"]["user"], $config["db"]["pass"], [
  PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
  PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
]);
