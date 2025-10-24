<?php
return [
  'db' => [
    'dsn' => 'mysql:host=127.0.0.1;port=3306;dbname=vcc_app;charset=utf8mb4',
    'user' => 'vcc_user',
    'pass' => 'CHANGE_ME',
  ],
  'mail' => [
    'host' => 'smtp.example.com',
    'port' => 587,
    'user' => 'no-reply@example.com',
    'pass' => 'CHANGE_ME',
    'from_name' => 'VCC System'
  ],
  'app' => [
    'base_url' => 'http://localhost',
    'jwt_secret' => 'CHANGE_ME_RANDOM',
  ]
];
