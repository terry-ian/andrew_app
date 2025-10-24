<?php
/**
 * Docker 環境配置檔案
 *
 * 此檔案用於 Docker 容器環境，透過環境變數來設定配置
 * 請不要直接修改此檔案，而是透過 .env 或 docker-compose.yml 設定環境變數
 */

return [
  "db" => [
    "dsn" => sprintf(
      "mysql:host=%s;port=%s;dbname=%s;charset=utf8mb4",
      getenv("DB_HOST") ?: "mysql",
      getenv("DB_PORT") ?: "3306",
      getenv("DB_NAME") ?: "vcc_app"
    ),
    "user" => getenv("DB_USER") ?: "vcc_user",
    "pass" => getenv("DB_PASS") ?: "vcc_password",
  ],
  "mail" => [
    "host" => getenv("MAIL_HOST") ?: "smtp.example.com",
    "port" => (int)(getenv("MAIL_PORT") ?: 587),
    "user" => getenv("MAIL_USER") ?: "no-reply@example.com",
    "pass" => getenv("MAIL_PASS") ?: "",
    "from_name" => getenv("MAIL_FROM_NAME") ?: "VCC System"
  ],
  "app" => [
    "base_url" => getenv("APP_BASE_URL") ?: "http://localhost:8000",
    "jwt_secret" => getenv("JWT_SECRET") ?: "change_me_random_secret_key",
  ]
];
