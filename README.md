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

### 後端開發

```bash
# 啟動 PHP 開發伺服器
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
