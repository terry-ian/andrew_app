# Andrew App - 虛擬信用卡服務系統

前後端分離專案

## 專案結構

```
andrew_app/
├── server/                    # 後端 PHP 服務
│   ├── public/
│   │   ├── index.php         # API 入口點
│   │   └── assets/           # 靜態資源
│   ├── src/
│   │   ├── config/           # 配置檔案
│   │   ├── controllers/      # 控制器
│   │   ├── core/             # 核心功能
│   │   ├── services/         # 業務邏輯服務
│   │   └── views/            # 視圖（未來可能移除）
│   └── composer.json         # PHP 依賴管理（待建立）
│
├── web/                      # 前端應用（待建立）
│   ├── src/
│   ├── public/
│   └── package.json
│
├── package.json             # 根目錄配置（統一指令）
└── README.md
```

## 快速開始

### 使用 Docker（推薦）

Docker 環境會自動包含所有需要的服務（PHP、MySQL、phpMyAdmin）

```bash
# 1. 複製環境變數範例檔案
cp .env.example .env

# 2. 啟動所有服務（首次啟動會自動建立資料庫）
docker-compose up -d

# 3. 查看服務狀態
docker-compose ps

# 4. 查看服務日誌
docker-compose logs -f web

# 5. 停止所有服務
docker-compose down

# 6. 停止並刪除所有資料（包含資料庫）
docker-compose down -v
```

啟動後可以透過以下網址訪問：
- **後端服務**: http://localhost:8000
- **phpMyAdmin**: http://localhost:8080

### 本機開發（不使用 Docker）

如果您不想使用 Docker，可以使用本機的 PHP 和 MySQL：

```bash
# 1. 確保已安裝 PHP 8.4+ 和 MySQL 8.0+

# 2. 建立資料庫
mysql -u root -p < server/database/init.sql

# 3. 設定環境變數
# 編輯 server/src/config/env.php

# 4. 啟動 PHP 開發伺服器
npm run dev:server
# 或
cd server && php -S localhost:8000 -t public
```

### 前端開發（待框架確定後更新）

```bash
npm run dev:web
```

## 相關資源

- **Github**: https://github.com/terry-ian/andrew_app
- **後台**: https://admin.world5168.com/
- **VCC API 文檔**: https://www.vccpool.com/resource/api/

## 串接廠商

- VCC Pool: https://www.vccpool.com/resource/api/

## 開發狀態

- ✅ 後端程式碼已遷移至 `server/` 目錄
- ⏳ 前端框架待確定
- ⏳ API 重構為純 JSON API（待規劃）
