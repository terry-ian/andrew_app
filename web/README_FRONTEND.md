# 前端專案 - 虛擬信用卡服務系統

使用 React + Vite + TypeScript + Tailwind CSS + Vitest 建構的前端應用。

## 🚀 快速開始

### 本地開發

```bash
# 安裝依賴
pnpm install

# 啟動開發伺服器
pnpm dev

# 開啟瀏覽器訪問
# http://localhost:5173
```

### 可用指令

```bash
pnpm dev          # 啟動開發伺服器
pnpm build        # 建構生產版本
pnpm preview      # 預覽生產版本
pnpm test         # 執行測試（watch 模式）
pnpm test:run     # 執行測試（單次）
pnpm lint         # 執行 ESLint 檢查
```

## 📁 專案結構

```
web/
├── src/
│   ├── components/          # 共用元件
│   ├── pages/              # 頁面元件
│   │   ├── auth/           # 認證相關頁面（登入、註冊等）
│   │   └── dashboard/      # 儀表板頁面
│   ├── hooks/              # 自定義 React Hooks
│   ├── services/           # API 服務層
│   │   ├── api.ts          # API 客戶端基礎
│   │   └── auth.ts         # 認證服務
│   ├── types/              # TypeScript 類型定義
│   ├── utils/              # 工具函數
│   ├── test/               # 測試設定
│   ├── App.tsx             # 應用程式根元件（路由配置）
│   ├── main.tsx            # 應用程式入口
│   └── index.css           # 全域樣式（Tailwind）
├── public/                 # 靜態資源
├── .env.example            # 環境變數範例
└── vite.config.ts          # Vite 配置
```

## 🛣️ 路由配置

- \`/login\` - 登入頁面
- \`/register\` - 註冊頁面
- \`/forgot\` - 忘記密碼頁面
- \`/dashboard\` - 儀表板首頁
- \`/\` - 預設重導向至登入頁

## 🔧 技術棧

- **框架**: React 19 + Vite 7
- **語言**: TypeScript 5
- **路由**: React Router 7
- **樣式**: Tailwind CSS 4
- **測試**: Vitest + Testing Library
- **套件管理**: pnpm

## 🌐 環境變數

複製 \`.env.example\` 為 \`.env\` 並修改：

```bash
# API 後端地址
VITE_API_BASE_URL=http://localhost:8000

# 應用程式名稱
VITE_APP_NAME="虛擬信用卡服務系統"
```

## 📝 開發規範

### 路徑別名

使用 \`@/\` 作為 \`src/\` 的別名：

```typescript
import { authService } from "@/services/auth"
import type { User } from "@/types"
```

### API 呼叫

所有 API 請求都通過 \`src/services/\` 中的服務進行：

```typescript
import { authService } from "@/services/auth"

const response = await authService.login({ email, password })
```

## 🐳 Docker 開發

在根目錄執行：

```bash
docker-compose up frontend
```

前端會在 \`http://localhost:5173\` 啟動。
