# Andrew App - 本地開發指南

這份文件說明如何在本地環境進行開發。

## 目錄

- [環境要求](#環境要求)
- [專案結構](#專案結構)
- [開發方式](#開發方式)
  - [方案一：使用 Docker（推薦）](#方案一使用-docker推薦)
  - [方案二：本機開發](#方案二本機開發)
- [常用指令](#常用指令)
- [開發注意事項](#開發注意事項)

## 環境要求

### 使用 Docker 開發
- Docker Desktop（已安裝 Docker 和 Docker Compose）
- Git

### 本機開發
- PHP 8.4+
- MySQL 8.0+
- Node.js 18+
- pnpm
- Git

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
│   │   └── views/            # 視圖
│   ├── database/
│   │   └── init.sql          # 資料庫初始化腳本
│   └── Dockerfile            # PHP 容器配置
│
├── web/                      # 前端 React + Vite 應用
│   ├── src/                  # 前端源代碼
│   ├── public/               # 靜態資源
│   ├── package.json          # 前端依賴
│   └── vite.config.ts        # Vite 配置
│
├── docker-compose.yml        # Docker 服務編排
├── .env                      # 環境變數
├── package.json              # 根目錄配置
└── README.md                 # 專案說明
```

## 開發方式

### 方案一：使用 Docker（推薦）

Docker 環境會自動包含所有需要的服務，是最簡單的開發方式。

#### 1. 確認環境變數

專案已包含 `.env` 檔案，如需修改配置：

```bash
# 編輯 .env 檔案
# 主要配置項目：
# - MYSQL_ROOT_PASSWORD: MySQL root 密碼
# - DB_NAME: 資料庫名稱
# - DB_USER: 資料庫使用者
# - DB_PASS: 資料庫密碼
# - JWT_SECRET: JWT 加密密鑰
```

#### 2. 啟動所有服務

```bash
# 首次啟動或重新建立映像檔
docker-compose up -d --build

# 後續啟動（不重新建立）
docker-compose up -d
```

#### 3. 驗證服務狀態

```bash
# 查看所有服務狀態
docker-compose ps

# 服務應該都是 "Up" 狀態
```

#### 4. 訪問服務

啟動成功後，可透過以下網址訪問：

| 服務 | 網址 | 說明 |
|------|------|------|
| 前端應用 | http://localhost:5173 | React + Vite 開發伺服器 |
| 後端 API | http://localhost:8000 | PHP Apache 伺服器 |
| phpMyAdmin | http://localhost:8080 | 資料庫管理介面 |
| MySQL | localhost:3306 | 資料庫服務 |

#### 5. 開始開發

**前端開發：**
- 編輯 `web/` 目錄下的檔案
- Vite 會自動熱重載，瀏覽器即時更新

**後端開發：**
- 編輯 `server/` 目錄下的檔案
- 檔案會透過 volume mapping 自動同步到容器
- 重新整理瀏覽器即可看到變更

#### 6. 查看日誌

```bash
# 查看所有服務日誌
docker-compose logs -f

# 查看特定服務日誌
docker-compose logs -f web        # PHP 後端
docker-compose logs -f frontend   # React 前端
docker-compose logs -f mysql      # 資料庫
```

#### 7. 停止服務

```bash
# 停止所有服務（保留資料）
docker-compose down

# 停止並刪除所有資料（包含資料庫）
docker-compose down -v
```

#### 8. 重啟服務

```bash
# 重啟所有服務
docker-compose restart

# 重啟特定服務
docker-compose restart frontend
docker-compose restart web
```

---

### 方案二：本機開發

如果不想使用 Docker，可以使用本機的 PHP、MySQL 和 Node.js。

#### 1. 確認環境

```bash
# 檢查 PHP 版本（需要 8.4+）
php -v

# 檢查 MySQL 版本（需要 8.0+）
mysql --version

# 檢查 Node.js 版本（需要 18+）
node -v

# 檢查 pnpm
pnpm -v
```

#### 2. 設置資料庫

```bash
# 登入 MySQL
mysql -u root -p

# 執行初始化腳本
mysql -u root -p < server/database/init.sql

# 或者手動建立資料庫
# CREATE DATABASE vcc_app;
# CREATE USER 'vcc_user'@'localhost' IDENTIFIED BY 'vcc_password';
# GRANT ALL PRIVILEGES ON vcc_app.* TO 'vcc_user'@'localhost';
```

#### 3. 設置後端環境變數

編輯 `server/src/config/env.php`，確認資料庫連線設定：

```php
// 根據你的本機 MySQL 設定修改
define('DB_HOST', 'localhost');
define('DB_NAME', 'vcc_app');
define('DB_USER', 'vcc_user');
define('DB_PASS', 'vcc_password');
```

#### 4. 啟動後端服務

```bash
# 方式一：使用 npm script
pnpm dev:server

# 方式二：直接使用 PHP
cd server
php -S localhost:8000 -t public
```

後端會在 http://localhost:8000 啟動

#### 5. 安裝前端依賴並啟動

```bash
# 進入前端目錄
cd web

# 安裝依賴（首次需要）
pnpm install

# 啟動開發伺服器
pnpm dev
```

前端會在 http://localhost:5173 啟動

#### 6. 同時啟動前後端（可選）

在專案根目錄執行：

```bash
# 需要先安裝根目錄依賴
pnpm install

# 同時啟動前後端
pnpm dev
```

---

## 常用指令

### Docker 相關

```bash
# 查看容器狀態
docker-compose ps

# 查看日誌
docker-compose logs -f [service_name]

# 進入容器
docker-compose exec web bash        # 進入 PHP 容器
docker-compose exec mysql bash      # 進入 MySQL 容器
docker-compose exec frontend sh     # 進入前端容器

# 重啟服務
docker-compose restart [service_name]

# 停止服務
docker-compose down

# 停止並刪除資料
docker-compose down -v

# 重新建立映像檔
docker-compose build --no-cache
```

### 前端開發

```bash
cd web

# 安裝依賴
pnpm install

# 啟動開發伺服器
pnpm dev

# 建立生產版本
pnpm build

# 預覽生產版本
pnpm preview

# 執行測試
pnpm test

# 執行 Lint
pnpm lint
```

### 後端開發

```bash
cd server

# 啟動 PHP 開發伺服器
php -S localhost:8000 -t public

# 檢查 PHP 語法
php -l public/index.php
```

### 資料庫管理

```bash
# 使用 phpMyAdmin（Docker）
# 訪問 http://localhost:8080

# 使用 MySQL 命令列（Docker）
docker-compose exec mysql mysql -u vcc_user -p vcc_app

# 使用 MySQL 命令列（本機）
mysql -u vcc_user -p vcc_app

# 匯出資料庫
docker-compose exec mysql mysqldump -u vcc_user -p vcc_app > backup.sql

# 匯入資料庫
docker-compose exec -T mysql mysql -u vcc_user -p vcc_app < backup.sql
```

---

## 開發注意事項

### 環境變數

- Docker 環境會自動讀取根目錄的 `.env` 檔案
- 前端有獨立的 `web/.env` 檔案用於 Vite 環境變數
- **不要將 `.env` 檔案提交到 Git**（已在 .gitignore 中）

### 資料庫

- Docker 會在首次啟動時自動執行 `server/database/init.sql`
- 資料庫資料會持久化在 Docker volume 中
- 使用 `docker-compose down -v` 會刪除所有資料

### 熱重載

- **前端**：Vite 支援熱模組替換（HMR），修改後立即生效
- **後端**：PHP 需要重新整理瀏覽器才能看到變更
- 修改 Docker 配置需要重新建立容器：`docker-compose up -d --build`

### 端口衝突

如果端口已被占用，可以修改 `docker-compose.yml` 中的端口映射：

```yaml
ports:
  - "新端口:容器內端口"

# 例如：
ports:
  - "8001:80"  # 將後端改為 8001
  - "5174:5173"  # 將前端改為 5174
```

### 檔案權限

Docker 容器內建立的檔案可能會有權限問題，可以執行：

```bash
# macOS/Linux
sudo chown -R $USER:$USER .

# 或在 Docker 中執行
docker-compose exec web chown -R www-data:www-data /var/www/html
```

### 開發流程建議

1. **每次開始開發前**：
   - 確認 Docker 服務正在運行
   - 拉取最新的程式碼
   - 檢查是否有新的依賴需要安裝

2. **開發期間**：
   - 前端改動會自動重載
   - 後端改動需要重新整理瀏覽器
   - 定期查看 Docker 日誌確認沒有錯誤

3. **結束開發後**：
   - 可選擇保持 Docker 運行或關閉：`docker-compose down`
   - 提交變更前先測試功能是否正常

### 疑難排解

#### Docker 無法啟動

```bash
# 清理所有容器和映像檔
docker-compose down -v
docker system prune -a

# 重新建立
docker-compose up -d --build
```

#### 前端無法連接後端

檢查 `web/.env` 中的 API 網址：
```env
VITE_API_BASE_URL=http://localhost:8000
```

#### 資料庫連接失敗

1. 確認 MySQL 容器正在運行：`docker-compose ps`
2. 檢查 `.env` 中的資料庫設定
3. 查看 MySQL 日誌：`docker-compose logs mysql`

#### 端口被占用

```bash
# 查看端口占用（macOS）
lsof -i :8000
lsof -i :5173
lsof -i :3306

# 殺掉進程
kill -9 <PID>
```

---

## 相關資源

- **專案 README**: [README.md](./README.md)
- **前端文件**: [web/README_FRONTEND.md](./web/README_FRONTEND.md)
- **Docker Compose 文件**: [docker-compose.yml](./docker-compose.yml)
- **VCC API 文檔**: https://www.vccpool.com/resource/api/

## 技術支援

如遇到問題，請：
1. 查看 Docker 日誌：`docker-compose logs -f`
2. 檢查服務狀態：`docker-compose ps`
3. 參考本文件的疑難排解章節
