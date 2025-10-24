-- Andrew App - 虛擬信用卡服務系統資料庫初始化腳本

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for roles
-- ----------------------------
DROP TABLE IF EXISTS `roles`;
CREATE TABLE `roles` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL COMMENT '角色名稱',
  `description` varchar(255) DEFAULT NULL COMMENT '角色描述',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='角色表';

-- ----------------------------
-- Table structure for users
-- ----------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL COMMENT '電子郵件',
  `password_hash` varchar(255) NOT NULL COMMENT '密碼雜湊',
  `full_name` varchar(100) NOT NULL COMMENT '全名',
  `email_verified` tinyint(1) DEFAULT '0' COMMENT '是否已驗證 Email',
  `status` enum('active','inactive','suspended') DEFAULT 'active' COMMENT '帳號狀態',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_email` (`email`),
  KEY `idx_status` (`status`),
  KEY `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用戶表';

-- ----------------------------
-- Table structure for user_roles
-- ----------------------------
DROP TABLE IF EXISTS `user_roles`;
CREATE TABLE `user_roles` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL COMMENT '用戶 ID',
  `role_id` int NOT NULL COMMENT '角色 ID',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_user_role` (`user_id`,`role_id`),
  KEY `fk_role_id` (`role_id`),
  CONSTRAINT `fk_user_roles_role_id` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_user_roles_user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用戶角色關聯表';

-- ----------------------------
-- Table structure for email_verifications
-- ----------------------------
DROP TABLE IF EXISTS `email_verifications`;
CREATE TABLE `email_verifications` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL COMMENT '用戶 ID',
  `token` varchar(64) NOT NULL COMMENT '驗證 Token',
  `expires_at` timestamp NOT NULL COMMENT '過期時間',
  `used_at` timestamp NULL DEFAULT NULL COMMENT '使用時間',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_token` (`token`),
  KEY `fk_email_verifications_user_id` (`user_id`),
  KEY `idx_expires_at` (`expires_at`),
  CONSTRAINT `fk_email_verifications_user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Email 驗證表';

-- ----------------------------
-- Table structure for password_resets
-- ----------------------------
DROP TABLE IF EXISTS `password_resets`;
CREATE TABLE `password_resets` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL COMMENT '用戶 ID',
  `token` varchar(64) NOT NULL COMMENT '重設 Token',
  `expires_at` timestamp NOT NULL COMMENT '過期時間',
  `used_at` timestamp NULL DEFAULT NULL COMMENT '使用時間',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_token` (`token`),
  KEY `fk_password_resets_user_id` (`user_id`),
  KEY `idx_expires_at` (`expires_at`),
  CONSTRAINT `fk_password_resets_user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='密碼重設表';

-- ----------------------------
-- Table structure for wallets
-- ----------------------------
DROP TABLE IF EXISTS `wallets`;
CREATE TABLE `wallets` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL COMMENT '用戶 ID',
  `currency` varchar(10) NOT NULL DEFAULT 'USD' COMMENT '幣別',
  `available` decimal(20,6) DEFAULT '0.000000' COMMENT '可用餘額',
  `frozen` decimal(20,6) DEFAULT '0.000000' COMMENT '凍結餘額',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_user_currency` (`user_id`,`currency`),
  CONSTRAINT `fk_wallets_user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='錢包表';

-- ----------------------------
-- Table structure for deposit_rules
-- ----------------------------
DROP TABLE IF EXISTS `deposit_rules`;
CREATE TABLE `deposit_rules` (
  `id` int NOT NULL AUTO_INCREMENT,
  `method` varchar(50) NOT NULL COMMENT '存款方式',
  `min_amount` decimal(20,6) NOT NULL COMMENT '最小金額',
  `max_amount` decimal(20,6) NOT NULL COMMENT '最大金額',
  `fee_percent` decimal(5,4) DEFAULT '0.0000' COMMENT '手續費百分比',
  `eta_minutes` int DEFAULT '30' COMMENT '預計到帳時間（分鐘）',
  `active` tinyint(1) DEFAULT '1' COMMENT '是否啟用',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_method_active` (`method`,`active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='存款規則表';

-- ----------------------------
-- Table structure for deposit_requests
-- ----------------------------
DROP TABLE IF EXISTS `deposit_requests`;
CREATE TABLE `deposit_requests` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL COMMENT '用戶 ID',
  `method` varchar(50) NOT NULL COMMENT '存款方式',
  `amount` decimal(20,6) NOT NULL COMMENT '存款金額',
  `fee_amount` decimal(20,6) DEFAULT '0.000000' COMMENT '手續費',
  `net_amount` decimal(20,6) NOT NULL COMMENT '實收金額',
  `status` enum('pending','confirmed','expired','cancelled') DEFAULT 'pending' COMMENT '狀態',
  `confirmed_at` timestamp NULL DEFAULT NULL COMMENT '確認時間',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_deposit_requests_user_id` (`user_id`),
  KEY `idx_status` (`status`),
  KEY `idx_created_at` (`created_at`),
  CONSTRAINT `fk_deposit_requests_user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='存款請求表';

-- ----------------------------
-- Table structure for deposit_usdt_trc20
-- ----------------------------
DROP TABLE IF EXISTS `deposit_usdt_trc20`;
CREATE TABLE `deposit_usdt_trc20` (
  `id` int NOT NULL AUTO_INCREMENT,
  `deposit_request_id` int NOT NULL COMMENT '存款請求 ID',
  `address` varchar(100) NOT NULL COMMENT '存款地址',
  `txn_hash` varchar(100) DEFAULT NULL COMMENT '交易雜湊',
  `confirmations` int DEFAULT '0' COMMENT '當前確認數',
  `required_confirmations` int DEFAULT '20' COMMENT '需要確認數',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_deposit_request_id` (`deposit_request_id`),
  KEY `idx_address` (`address`),
  KEY `idx_txn_hash` (`txn_hash`),
  CONSTRAINT `fk_deposit_usdt_trc20_request_id` FOREIGN KEY (`deposit_request_id`) REFERENCES `deposit_requests` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='USDT TRC20 存款表';

-- ----------------------------
-- Table structure for cards
-- ----------------------------
DROP TABLE IF EXISTS `cards`;
CREATE TABLE `cards` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL COMMENT '用戶 ID',
  `card_number` varchar(19) NOT NULL COMMENT '卡號（部分遮蔽）',
  `card_type` varchar(20) DEFAULT 'virtual' COMMENT '卡片類型',
  `status` enum('active','inactive','frozen','expired') DEFAULT 'active' COMMENT '卡片狀態',
  `balance_limit` decimal(20,6) DEFAULT '0.000000' COMMENT '餘額限制',
  `expires_at` date DEFAULT NULL COMMENT '到期日',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_cards_user_id` (`user_id`),
  KEY `idx_status` (`status`),
  CONSTRAINT `fk_cards_user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='卡片表';

-- ----------------------------
-- Table structure for transactions
-- ----------------------------
DROP TABLE IF EXISTS `transactions`;
CREATE TABLE `transactions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `card_id` int NOT NULL COMMENT '卡片 ID',
  `user_id` int NOT NULL COMMENT '用戶 ID',
  `mcc` varchar(10) DEFAULT NULL COMMENT '商戶類別代碼',
  `amount` decimal(20,6) NOT NULL COMMENT '交易金額',
  `currency` varchar(10) DEFAULT 'USD' COMMENT '幣別',
  `status` enum('authorized','captured','declined','refunded','cancelled') DEFAULT 'authorized' COMMENT '交易狀態',
  `auth_at` timestamp NULL DEFAULT NULL COMMENT '授權時間',
  `captured_at` timestamp NULL DEFAULT NULL COMMENT '清算時間',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_transactions_card_id` (`card_id`),
  KEY `fk_transactions_user_id` (`user_id`),
  KEY `idx_status` (`status`),
  KEY `idx_created_at` (`created_at`),
  CONSTRAINT `fk_transactions_card_id` FOREIGN KEY (`card_id`) REFERENCES `cards` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_transactions_user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='交易表';

-- ----------------------------
-- Table structure for journals
-- ----------------------------
DROP TABLE IF EXISTS `journals`;
CREATE TABLE `journals` (
  `id` int NOT NULL AUTO_INCREMENT,
  `jtype` varchar(50) NOT NULL COMMENT '日誌類型',
  `ref_id` int DEFAULT NULL COMMENT '參考 ID',
  `description` varchar(255) DEFAULT NULL COMMENT '描述',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_jtype` (`jtype`),
  KEY `idx_ref_id` (`ref_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='會計日誌表';

-- ----------------------------
-- Table structure for ledger_entries
-- ----------------------------
DROP TABLE IF EXISTS `ledger_entries`;
CREATE TABLE `ledger_entries` (
  `id` int NOT NULL AUTO_INCREMENT,
  `journal_id` int NOT NULL COMMENT '日誌 ID',
  `wallet_id` int NOT NULL COMMENT '錢包 ID',
  `entry_type` enum('debit','credit') NOT NULL COMMENT '分錄類型：debit=借方, credit=貸方',
  `amount` decimal(20,6) NOT NULL COMMENT '金額',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_ledger_entries_journal_id` (`journal_id`),
  KEY `fk_ledger_entries_wallet_id` (`wallet_id`),
  CONSTRAINT `fk_ledger_entries_journal_id` FOREIGN KEY (`journal_id`) REFERENCES `journals` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_ledger_entries_wallet_id` FOREIGN KEY (`wallet_id`) REFERENCES `wallets` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='分類帳表';

-- ----------------------------
-- Insert initial data
-- ----------------------------

-- 插入角色
INSERT INTO `roles` (`id`, `name`, `description`) VALUES
(1, 'user', '一般用戶'),
(9, 'admin', '系統管理員');

-- 插入存款規則（USDT TRC20）
INSERT INTO `deposit_rules` (`method`, `min_amount`, `max_amount`, `fee_percent`, `eta_minutes`, `active`) VALUES
('usdt_trc20', 10.000000, 50000.000000, 0.0100, 30, 1);

SET FOREIGN_KEY_CHECKS = 1;
