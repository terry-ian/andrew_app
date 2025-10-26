# 前端專案 - 虛擬卡片管理系統

> **專案**: andrew_app - 前端應用
> **框架**: React 19 + Vite 7 + TypeScript 5 + React Router 7
> **目標**: 實現前台（使用者介面）與後台（管理員介面）的完整功能

---

## 📋 目錄

1. [快速開始](#快速開始)
2. [專案結構](#專案結構)
3. [技術棧](#技術棧)
4. [技術實作細節](#技術實作細節)
5. [實作檢查清單](#實作檢查清單)
6. [UI/UX 設計原則](#uiux-設計原則)
7. [路由結構設計](#路由結構設計)
8. [實作計劃](#實作計劃)
9. [開發規範](#開發規範)
10. [環境變數](#環境變數)

---

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

---

## 📂 專案結構

```
web/
├── src/
│   ├── components/
│   │   ├── auth/              # 路由守衛組件
│   │   │   ├── PrivateRoute.tsx
│   │   │   ├── AdminRoute.tsx
│   │   │   └── RedirectIfAuthenticated.tsx
│   │   ├── layout/            # 佈局組件
│   │   │   ├── DashboardLayout.tsx
│   │   │   └── AdminLayout.tsx
│   │   └── shared/            # 共用組件
│   │       ├── Button.tsx
│   │       ├── Card.tsx
│   │       └── Modal.tsx
│   │
│   ├── hooks/                 # Custom Hooks
│   │   ├── useAuth.ts
│   │   └── useApi.ts
│   │
│   ├── pages/
│   │   ├── auth/              # 認證頁面
│   │   │   ├── LoginPage.tsx
│   │   │   ├── RegisterPage.tsx
│   │   │   └── ForgotPasswordPage.tsx
│   │   ├── dashboard/         # 前台頁面
│   │   │   ├── DashboardPage.tsx
│   │   │   ├── ProfilePage.tsx
│   │   │   ├── WalletPage.tsx
│   │   │   ├── CardsPage.tsx
│   │   │   └── TransactionsPage.tsx
│   │   └── admin/             # 後台頁面
│   │       ├── AdminDashboardPage.tsx
│   │       ├── UserManagementPage.tsx
│   │       ├── DepositApprovalPage.tsx
│   │       └── TransactionMonitorPage.tsx
│   │
│   ├── services/
│   │   ├── api.ts             # API 客戶端基礎
│   │   ├── auth.ts            # 認證服務
│   │   └── admin.ts           # 管理員服務
│   │
│   ├── stores/                # Zustand 狀態管理
│   │   └── authStore.ts
│   │
│   ├── types/
│   │   ├── index.ts           # 通用型別
│   │   └── auth.ts            # 認證型別
│   │
│   ├── utils/                 # 工具函數
│   │   ├── validators.ts
│   │   └── formatters.ts
│   │
│   ├── test/                  # 測試設定
│   ├── App.tsx                # 路由配置
│   ├── main.tsx               # 應用程式入口
│   └── index.css              # 全域樣式（Tailwind）
│
├── public/                    # 靜態資源
├── .env.example               # 環境變數範例
└── vite.config.ts             # Vite 配置
```

---

## 🔧 技術棧

- **框架**: React 19 + Vite 7
- **語言**: TypeScript 5
- **路由**: React Router 7
- **狀態管理**: Zustand
- **樣式**: Tailwind CSS 4
- **測試**: Vitest + Testing Library
- **套件管理**: pnpm

---

## 🔧 技術實作細節

### **1. 認證流程圖**

```
┌─────────────────────────────────────────────────────────────┐
│                     用戶訪問頁面                              │
└───────────────────────┬─────────────────────────────────────┘
                        ▼
┌─────────────────────────────────────────────────────────────┐
│           檢查 authStore 中的 isLoading 狀態                 │
└───────────────┬───────────────────┬─────────────────────────┘
                │                   │
        isLoading=true      isLoading=false
                │                   │
                ▼                   ▼
        ┌──────────────┐    ┌──────────────────┐
        │  顯示載入中  │    │ 檢查 user 狀態   │
        └──────────────┘    └─────┬────────────┘
                                   │
                    ┌──────────────┼──────────────┐
                    │                             │
                user=null                    user 存在
                    │                             │
                    ▼                             ▼
        ┌────────────────────────┐    ┌─────────────────────┐
        │  調用 checkAuth() API   │    │ 檢查用戶角色        │
        │  GET /api/auth/check    │    │ isAdmin?            │
        └───────┬────────────────┘    └──────┬──────────────┘
                │                             │
    ┌───────────┴──────────┐        ┌────────┴────────┐
    │                      │        │                 │
Session有效          Session無效   是管理員        一般用戶
    │                      │        │                 │
    ▼                      ▼        ▼                 ▼
┌────────┐          ┌────────┐  ┌─────────┐    ┌──────────┐
│ 設定   │          │ 清空   │  │ 可訪問  │    │ 可訪問   │
│ user   │          │ user   │  │ /admin  │    │/dashboard│
│ 狀態   │          │ 重導向 │  │ 和      │    │          │
│        │          │ 登入頁 │  │/dashboard│    │          │
└────────┘          └────────┘  └─────────┘    └──────────┘
```

### **2. 角色權限檢查邏輯**

```typescript
// useAuth Hook 中的角色計算
const isAdmin = computed(() => {
  return user.value?.roles?.includes("admin") ?? false
})

// AdminRoute 組件中的權限檢查
if (!isAuthenticated) {
  // 未登入 → 跳轉登入頁
  return <Navigate to="/login" replace />
}

if (!isAdmin) {
  // 已登入但非管理員 → 跳轉前台並顯示錯誤訊息
  return <Navigate to="/dashboard" state={{ error: "權限不足" }} replace />
}

// 通過檢查 → 渲染後台頁面
return <>{children}</>
```

### **3. 前端 Cookie 處理**

```typescript
// services/api.ts
credentials: "include"  // 確保每次請求都帶上 Session Cookie
```

### **4. 狀態持久化策略**

**問題**：頁面刷新後，authStore 中的狀態會丟失

**解決方案**：
1. 應用啟動時調用 `checkAuth()` API
2. 後端檢查 Session 是否有效
3. 若有效，返回用戶資訊並恢復前端狀態

**實作**：
```typescript
// main.tsx
import { useAuthStore } from "./stores/authStore"

// 應用啟動時立即檢查認證狀態
useAuthStore.getState().checkAuth()

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
```

### **5. API 回應統一格式**

所有 API 回應遵循統一格式：

```typescript
interface ApiResponse<T = any> {
  success: boolean       // 請求是否成功
  data?: T               // 回應資料（成功時）
  message?: string       // 錯誤訊息或提示
  errors?: Record<string, string[]>  // 表單驗證錯誤
}
```

**範例**：
```json
// 成功回應
{
  "success": true,
  "data": {
    "id": 1,
    "email": "user@example.com",
    "roles": ["user", "admin"]
  },
  "message": "操作成功"
}

// 錯誤回應
{
  "success": false,
  "message": "Email 或密碼錯誤",
  "errors": {
    "email": ["Email 格式不正確"],
    "password": ["密碼至少需要 8 個字元"]
  }
}
```

### **6. 路由守衛執行順序**

```
用戶訪問 /admin/users
    ↓
App.tsx 路由匹配
    ↓
AdminRoute 守衛檢查
    ↓
1. isLoading? → 顯示載入中
    ↓
2. isAuthenticated? → 否 → 重導向 /login
    ↓
3. isAdmin? → 否 → 重導向 /dashboard
    ↓
4. 全部通過 → 渲染 AdminLayout
    ↓
AdminLayout 渲染側邊欄和 <Outlet />
    ↓
Outlet 渲染子路由 UserManagementPage
```

---

## 📝 實作檢查清單

### **階段一：狀態管理**
- [ ] 安裝 `zustand` 依賴
- [ ] 建立 `src/stores/authStore.ts`
- [ ] 建立 `src/hooks/useAuth.ts`
- [ ] 建立 `src/types/auth.ts`
- [ ] 測試 authStore 基本功能

### **階段二：路由結構**
- [ ] 更新 `src/App.tsx`（三層路由）
- [ ] 測試路由導航

### **階段三：路由守衛**
- [ ] 建立 `components/auth/PrivateRoute.tsx`
- [ ] 建立 `components/auth/AdminRoute.tsx`
- [ ] 建立 `components/auth/RedirectIfAuthenticated.tsx`
- [ ] 測試守衛邏輯

### **階段四：前端整合後端 API**
- [ ] 更新 `authStore` 的 `checkAuth()` 方法
- [ ] 在 `main.tsx` 中新增啟動檢查
- [ ] 測試認證狀態恢復

### **階段五：Layout 組件**
- [ ] 建立 `components/layout/DashboardLayout.tsx`
- [ ] 建立 `components/layout/AdminLayout.tsx`
- [ ] 測試 Layout 渲染和導航

### **階段六：頁面實作**
- [ ] 重命名 `HomePage` → `DashboardPage`
- [ ] 建立 `pages/admin/AdminDashboardPage.tsx`
- [ ] 建立 `pages/dashboard/ProfilePage.tsx`
- [ ] 建立 `pages/dashboard/WalletPage.tsx`
- [ ] 建立 `pages/dashboard/CardsPage.tsx`
- [ ] 建立 `pages/dashboard/TransactionsPage.tsx`
- [ ] 建立 `pages/admin/UserManagementPage.tsx`
- [ ] 建立 `pages/admin/DepositApprovalPage.tsx`
- [ ] 建立 `pages/admin/TransactionMonitorPage.tsx`

### **整合測試**
- [ ] 測試登入後訪問前台
- [ ] 測試管理員訪問後台
- [ ] 測試一般用戶無法訪問後台
- [ ] 測試前後台切換
- [ ] 測試頁面刷新後狀態恢復
- [ ] 測試登出功能

---

## 🎨 UI/UX 設計原則

### **前台（使用者介面）**
- 淺色主題（白色、藍色為主）
- 簡潔易用的導航
- 強調核心功能（錢包、卡片、交易）
- 卡片式佈局

### **後台（管理員介面）**
- 深色主題（深灰、紫色為主）
- 數據可視化（統計圖表）
- 清晰的操作提示
- 表格式數據展示

### **共通設計**
- 使用 Tailwind CSS 保持一致性
- 響應式設計（支援手機、平板）
- 載入狀態提示
- 錯誤訊息顯示

---

## 🗺️ 路由結構設計

### 🔓 公開路由（無需登入）
```
/login                  → 登入頁面
/register               → 註冊頁面
/forgot                 → 忘記密碼
/reset?token=xxx        → 重設密碼
/verify?token=xxx       → Email 驗證
```

### 👤 前台路由（需登入，role: user）
```
/dashboard              → 使用者首頁（儀表板總覽）
/dashboard/profile      → 個人資料設定
/dashboard/wallet       → 錢包管理（餘額、充值、提現）
/dashboard/cards        → 虛擬卡片管理
/dashboard/transactions → 交易記錄查詢
/dashboard/deposit      → 存款申請
/dashboard/settings     → 帳號設定
```

### 🛡️ 後台路由（需管理員權限，role: admin）
```
/admin                     → 管理員儀表板（統計數據）
/admin/users               → 用戶管理（列表、編輯、停用）
/admin/deposits            → 存款審核（待審核列表）
/admin/transactions        → 交易監控（全站交易）
/admin/cards               → 卡片管理（所有用戶的卡片）
/admin/wallets             → 錢包總覽（所有用戶餘額）
/admin/settings            → 系統設定（存款規則、手續費等）
/admin/roles               → 角色權限管理
/admin/logs                → 操作日誌
```

### 🔄 重導向邏輯
```
已登入 + 訪問 /login      → 重導向到 /dashboard
已登入 + 訪問 /register   → 重導向到 /dashboard
未登入 + 訪問受保護路由   → 重導向到 /login
一般用戶 + 訪問 /admin/*  → 重導向到 /dashboard（顯示權限錯誤）
```

---

## 🚀 實作計劃

### **階段一：建立全局狀態管理**

#### 目標
使用 Zustand 管理用戶認證狀態，解決當前頁面刷新後丟失登入狀態的問題。

#### 需要做的事情
1. 安裝 Zustand 狀態管理庫
2. 建立 `authStore.ts`（儲存 user、isLoading、isAuthenticated）
3. 建立 `useAuth` Hook（封裝認證邏輯）
4. 實作自動登入機制（檢查後端 Session）

#### 檔案結構
```
web/src/
├── stores/
│   └── authStore.ts          # Zustand 認證 Store
├── hooks/
│   └── useAuth.ts             # 認證 Hook（封裝 Store）
└── types/
    └── auth.ts                # 認證相關 TypeScript 型別
```

#### 核心代碼示例

**authStore.ts**
```typescript
import { create } from "zustand"
import { User } from "../types"

interface AuthState {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  isAdmin: boolean

  setUser: (user: User | null) => void
  setLoading: (isLoading: boolean) => void
  logout: () => void
  checkAuth: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isLoading: true,
  isAuthenticated: false,
  isAdmin: false,

  setUser: (user) => set({
    user,
    isAuthenticated: !!user,
    isAdmin: user?.roles?.includes("admin") ?? false,
  }),

  setLoading: (isLoading) => set({ isLoading }),

  logout: () => set({
    user: null,
    isAuthenticated: false,
    isAdmin: false,
  }),

  checkAuth: async () => {
    set({ isLoading: true })

    try {
      const response = await apiClient.get<User>("/api/auth/check")

      if (response.success && response.data) {
        get().setUser(response.data)
      } else {
        get().setUser(null)
      }
    } catch (error) {
      console.error("檢查認證失敗:", error)
      get().setUser(null)
    } finally {
      set({ isLoading: false })
    }
  },
}))
```

**useAuth.ts**
```typescript
import { useAuthStore } from "../stores/authStore"

export function useAuth() {
  const user = useAuthStore((state) => state.user)
  const isLoading = useAuthStore((state) => state.isLoading)
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const isAdmin = useAuthStore((state) => state.isAdmin)
  const setUser = useAuthStore((state) => state.setUser)
  const logout = useAuthStore((state) => state.logout)
  const checkAuth = useAuthStore((state) => state.checkAuth)

  return {
    user,
    isLoading,
    isAuthenticated,
    isAdmin,
    setUser,
    logout,
    checkAuth,
  }
}
```

#### 預期成果
- ✅ 全局可訪問的認證狀態
- ✅ 頁面刷新後自動恢復登入狀態
- ✅ 統一的認證邏輯入口

---

### **階段二：建立路由結構**

#### 目標
重構現有路由，建立前台、後台、公開路由的清晰結構。

#### 需要做的事情
1. 更新 `App.tsx`，實作三層路由結構
2. 建立路由配置檔案（方便管理）
3. 實作路由守衛佔位符（Phase 3 補充實作）

#### 核心代碼示例

**App.tsx（更新後）**
```typescript
import { BrowserRouter, Routes, Route, Navigate } from "react-router"
import { useAuth } from "./hooks/useAuth"

// 公開頁面
import LoginPage from "./pages/auth/LoginPage"
import RegisterPage from "./pages/auth/RegisterPage"
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage"

// 前台頁面
import DashboardPage from "./pages/dashboard/DashboardPage"
import ProfilePage from "./pages/dashboard/ProfilePage"
import WalletPage from "./pages/dashboard/WalletPage"
import CardsPage from "./pages/dashboard/CardsPage"
import TransactionsPage from "./pages/dashboard/TransactionsPage"

// 後台頁面
import AdminDashboardPage from "./pages/admin/AdminDashboardPage"
import UserManagementPage from "./pages/admin/UserManagementPage"
import DepositApprovalPage from "./pages/admin/DepositApprovalPage"

// Layout
import DashboardLayout from "./components/layout/DashboardLayout"
import AdminLayout from "./components/layout/AdminLayout"

// 路由守衛（Phase 3 實作）
import PrivateRoute from "./components/auth/PrivateRoute"
import AdminRoute from "./components/auth/AdminRoute"
import RedirectIfAuthenticated from "./components/auth/RedirectIfAuthenticated"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 公開路由 */}
        <Route path="/login" element={
          <RedirectIfAuthenticated>
            <LoginPage />
          </RedirectIfAuthenticated>
        } />
        <Route path="/register" element={
          <RedirectIfAuthenticated>
            <RegisterPage />
          </RedirectIfAuthenticated>
        } />
        <Route path="/forgot" element={<ForgotPasswordPage />} />

        {/* 前台路由（需登入） */}
        <Route path="/dashboard" element={
          <PrivateRoute>
            <DashboardLayout />
          </PrivateRoute>
        }>
          <Route index element={<DashboardPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="wallet" element={<WalletPage />} />
          <Route path="cards" element={<CardsPage />} />
          <Route path="transactions" element={<TransactionsPage />} />
        </Route>

        {/* 後台路由（需管理員權限） */}
        <Route path="/admin" element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }>
          <Route index element={<AdminDashboardPage />} />
          <Route path="users" element={<UserManagementPage />} />
          <Route path="deposits" element={<DepositApprovalPage />} />
        </Route>

        {/* 預設重導向 */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
```

#### 預期成果
- ✅ 清晰的三層路由結構
- ✅ 支援嵌套路由（Layout + 子頁面）
- ✅ 路由守衛佔位符就位

---

### **階段三：實作權限守衛組件**

#### 目標
建立路由守衛組件，根據認證狀態和用戶角色控制頁面訪問權限。

#### 需要建立的組件

##### 1. PrivateRoute（需要登入）
```typescript
// components/auth/PrivateRoute.tsx
import { Navigate, useLocation } from "react-router"
import { useAuth } from "../../hooks/useAuth"

interface PrivateRouteProps {
  children: React.ReactNode
}

export default function PrivateRoute({ children }: PrivateRouteProps) {
  const { isAuthenticated, isLoading } = useAuth()
  const location = useLocation()

  if (isLoading) {
    return <div>載入中...</div>
  }

  if (!isAuthenticated) {
    // 儲存當前路徑，登入後可返回
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return <>{children}</>
}
```

##### 2. AdminRoute（需要管理員權限）
```typescript
// components/auth/AdminRoute.tsx
import { Navigate } from "react-router"
import { useAuth } from "../../hooks/useAuth"

interface AdminRouteProps {
  children: React.ReactNode
}

export default function AdminRoute({ children }: AdminRouteProps) {
  const { isAuthenticated, isAdmin, isLoading } = useAuth()

  if (isLoading) {
    return <div>載入中...</div>
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (!isAdmin) {
    // 一般用戶嘗試訪問後台，返回前台並顯示錯誤
    return <Navigate to="/dashboard" replace />
  }

  return <>{children}</>
}
```

##### 3. RedirectIfAuthenticated（已登入則重導向）
```typescript
// components/auth/RedirectIfAuthenticated.tsx
import { Navigate } from "react-router"
import { useAuth } from "../../hooks/useAuth"

interface RedirectIfAuthenticatedProps {
  children: React.ReactNode
}

export default function RedirectIfAuthenticated({
  children,
}: RedirectIfAuthenticatedProps) {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return <div>載入中...</div>
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  return <>{children}</>
}
```

#### 預期成果
- ✅ 未登入用戶無法訪問受保護路由
- ✅ 一般用戶無法訪問後台路由
- ✅ 已登入用戶訪問 login/register 會自動跳轉

---

### **階段四：建立前後台 Layout**

#### 目標
建立前台和後台的共用佈局組件，提供導航、側邊欄、用戶資訊等共用 UI。

#### 需要建立的組件

##### 1. DashboardLayout（前台 Layout）
**功能**：
- 頂部導航欄（Logo、用戶資訊、登出按鈕）
- 側邊導航欄（錢包、卡片、交易等連結）
- 內容區域（子路由渲染）
- 麵包屑導航

**檔案**：`components/layout/DashboardLayout.tsx`

```typescript
import { Outlet, Link, useNavigate } from "react-router"
import { useAuth } from "../../hooks/useAuth"

export default function DashboardLayout() {
  const { user, isAdmin, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate("/login")
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* 頂部導航欄 */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">虛擬卡片系統</h1>

          <div className="flex items-center gap-4">
            {isAdmin && (
              <Link
                to="/admin"
                className="px-4 py-2 bg-purple-600 text-white rounded"
              >
                管理後台
              </Link>
            )}

            <span className="text-gray-700">{user?.full_name}</span>

            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 text-white rounded"
            >
              登出
            </button>
          </div>
        </div>
      </header>

      {/* 側邊欄 + 內容區 */}
      <div className="flex">
        {/* 側邊導航 */}
        <aside className="w-64 bg-white shadow min-h-screen p-4">
          <nav className="space-y-2">
            <Link
              to="/dashboard"
              className="block px-4 py-2 rounded hover:bg-gray-100"
            >
              首頁
            </Link>
            <Link
              to="/dashboard/wallet"
              className="block px-4 py-2 rounded hover:bg-gray-100"
            >
              錢包管理
            </Link>
            <Link
              to="/dashboard/cards"
              className="block px-4 py-2 rounded hover:bg-gray-100"
            >
              虛擬卡片
            </Link>
            <Link
              to="/dashboard/transactions"
              className="block px-4 py-2 rounded hover:bg-gray-100"
            >
              交易記錄
            </Link>
            <Link
              to="/dashboard/profile"
              className="block px-4 py-2 rounded hover:bg-gray-100"
            >
              個人資料
            </Link>
          </nav>
        </aside>

        {/* 內容區域 */}
        <main className="flex-1 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
```

##### 2. AdminLayout（後台 Layout）
**功能**：
- 頂部導航欄（後台標識、切換前台按鈕、用戶資訊）
- 側邊導航欄（用戶管理、審核、統計等）
- 內容區域
- 統計數據顯示（可選）

**檔案**：`components/layout/AdminLayout.tsx`

```typescript
import { Outlet, Link, useNavigate } from "react-router"
import { useAuth } from "../../hooks/useAuth"

export default function AdminLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate("/login")
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* 頂部導航欄 */}
      <header className="bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-purple-400">管理後台</h1>
            <span className="px-3 py-1 bg-purple-600 rounded text-sm">
              管理員模式
            </span>
          </div>

          <div className="flex items-center gap-4">
            <Link
              to="/dashboard"
              className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700"
            >
              切換到前台
            </Link>

            <span className="text-gray-300">{user?.full_name}</span>

            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 rounded hover:bg-red-700"
            >
              登出
            </button>
          </div>
        </div>
      </header>

      {/* 側邊欄 + 內容區 */}
      <div className="flex">
        {/* 側邊導航 */}
        <aside className="w-64 bg-gray-800 min-h-screen p-4">
          <nav className="space-y-2">
            <Link
              to="/admin"
              className="block px-4 py-2 rounded hover:bg-gray-700"
            >
              儀表板
            </Link>
            <Link
              to="/admin/users"
              className="block px-4 py-2 rounded hover:bg-gray-700"
            >
              用戶管理
            </Link>
            <Link
              to="/admin/deposits"
              className="block px-4 py-2 rounded hover:bg-gray-700"
            >
              存款審核
            </Link>
            <Link
              to="/admin/transactions"
              className="block px-4 py-2 rounded hover:bg-gray-700"
            >
              交易監控
            </Link>
            <Link
              to="/admin/settings"
              className="block px-4 py-2 rounded hover:bg-gray-700"
            >
              系統設定
            </Link>
          </nav>
        </aside>

        {/* 內容區域 */}
        <main className="flex-1 p-8 bg-gray-900">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
```

#### 預期成果
- ✅ 前台有統一的導航和側邊欄
- ✅ 後台有獨立的深色主題 UI
- ✅ 管理員可在前後台之間切換
- ✅ 共用的用戶資訊顯示和登出功能

---

### **階段五：實作頁面**

#### 目標
建立前台和後台的核心頁面。

#### 前台頁面（依優先順序）

##### 1. ✅ 已完成
- `LoginPage.tsx` - 登入頁面
- `RegisterPage.tsx` - 註冊頁面
- `ForgotPasswordPage.tsx` - 忘記密碼頁面

##### 2. 🔄 需調整
**HomePage.tsx → DashboardPage.tsx**
- 重新命名為 `DashboardPage`
- 顯示用戶儀表板總覽
- 顯示錢包餘額、最近交易、快捷操作

**檔案**：`pages/dashboard/DashboardPage.tsx`

```typescript
import { useAuth } from "../../hooks/useAuth"

export default function DashboardPage() {
  const { user } = useAuth()

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">歡迎回來，{user?.full_name}</h1>

      <div className="grid grid-cols-3 gap-6">
        {/* 錢包餘額卡片 */}
        <div className="bg-white p-6 rounded shadow">
          <h3 className="text-lg font-semibold mb-2">錢包餘額</h3>
          <p className="text-3xl font-bold text-blue-600">$0.00</p>
        </div>

        {/* 虛擬卡片數量 */}
        <div className="bg-white p-6 rounded shadow">
          <h3 className="text-lg font-semibold mb-2">虛擬卡片</h3>
          <p className="text-3xl font-bold text-green-600">0</p>
        </div>

        {/* 待處理交易 */}
        <div className="bg-white p-6 rounded shadow">
          <h3 className="text-lg font-semibold mb-2">待處理交易</h3>
          <p className="text-3xl font-bold text-orange-600">0</p>
        </div>
      </div>

      {/* 最近交易 */}
      <div className="mt-8 bg-white p-6 rounded shadow">
        <h2 className="text-xl font-bold mb-4">最近交易</h2>
        <p className="text-gray-500">暫無交易記錄</p>
      </div>
    </div>
  )
}
```

##### 3. ✨ 需新建

**ProfilePage.tsx** - 個人資料設定
```typescript
export default function ProfilePage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">個人資料</h1>
      {/* 表單：姓名、Email、密碼修改等 */}
    </div>
  )
}
```

**WalletPage.tsx** - 錢包管理
```typescript
export default function WalletPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">錢包管理</h1>
      {/* 顯示餘額、充值、提現操作 */}
    </div>
  )
}
```

**CardsPage.tsx** - 虛擬卡片管理
```typescript
export default function CardsPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">虛擬卡片</h1>
      {/* 卡片列表、申請新卡 */}
    </div>
  )
}
```

**TransactionsPage.tsx** - 交易記錄
```typescript
export default function TransactionsPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">交易記錄</h1>
      {/* 交易列表、篩選、搜尋 */}
    </div>
  )
}
```

#### 後台頁面（全新建立）

##### AdminDashboardPage.tsx - 管理員儀表板
```typescript
export default function AdminDashboardPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">管理員儀表板</h1>

      <div className="grid grid-cols-4 gap-6">
        <div className="bg-gray-800 p-6 rounded border border-gray-700">
          <h3 className="text-lg mb-2">總用戶數</h3>
          <p className="text-3xl font-bold text-blue-400">0</p>
        </div>

        <div className="bg-gray-800 p-6 rounded border border-gray-700">
          <h3 className="text-lg mb-2">待審核存款</h3>
          <p className="text-3xl font-bold text-yellow-400">0</p>
        </div>

        <div className="bg-gray-800 p-6 rounded border border-gray-700">
          <h3 className="text-lg mb-2">今日交易額</h3>
          <p className="text-3xl font-bold text-green-400">$0</p>
        </div>

        <div className="bg-gray-800 p-6 rounded border border-gray-700">
          <h3 className="text-lg mb-2">活躍卡片</h3>
          <p className="text-3xl font-bold text-purple-400">0</p>
        </div>
      </div>
    </div>
  )
}
```

##### UserManagementPage.tsx - 用戶管理
```typescript
export default function UserManagementPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">用戶管理</h1>
      {/* 用戶列表、搜尋、編輯、停用功能 */}
    </div>
  )
}
```

##### DepositApprovalPage.tsx - 存款審核
```typescript
export default function DepositApprovalPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">存款審核</h1>
      {/* 待審核存款列表、審核/拒絕操作 */}
    </div>
  )
}
```

##### TransactionMonitorPage.tsx - 交易監控
```typescript
export default function TransactionMonitorPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">交易監控</h1>
      {/* 全站交易列表、即時監控、異常警告 */}
    </div>
  )
}
```

#### 預期成果
- ✅ 前台有完整的用戶功能頁面
- ✅ 後台有基礎的管理功能頁面
- ✅ 所有頁面可正常訪問和導航

---

## 📝 開發規範

### 路徑別名

使用 `@/` 作為 `src/` 的別名：

```typescript
import { authService } from "@/services/auth"
import type { User } from "@/types"
```

### API 呼叫

所有 API 請求都通過 `src/services/` 中的服務進行：

```typescript
import { authService } from "@/services/auth"

const response = await authService.login({ email, password })
```

### 字串規範

所有字串型別的內容使用 double quotes（雙引號）。

---

## 🌐 環境變數

複製 `.env.example` 為 `.env` 並修改：

```bash
# API 後端地址
VITE_API_BASE_URL=http://localhost:8000

# 應用程式名稱
VITE_APP_NAME="虛擬信用卡服務系統"
```

---

## 🐳 Docker 開發

在根目錄執行：

```bash
docker-compose up frontend
```

前端會在 `http://localhost:5173` 啟動。

---

## 📚 參考資源

### 技術文件
- [React Router v7 官方文件](https://reactrouter.com/)
- [Zustand 官方文件](https://zustand-demo.pmnd.rs/)
- [Tailwind CSS 官方文件](https://tailwindcss.com/)

### 最佳實踐
- [React 認證最佳實踐](https://react.dev/learn/you-might-not-need-an-effect#fetching-data)
- [RESTful API 設計指南](https://restfulapi.net/)

---

## 🎯 下一步行動

### 立即開始
1. ✅ 確認計劃無誤
2. ✅ 安裝 Zustand：`pnpm add zustand`
3. ✅ 建立 `authStore.ts` 和 `useAuth.ts`
4. ✅ 實作路由守衛組件
5. ✅ 建立前後台 Layout
6. ✅ 實作各個功能頁面

### 後續追蹤
- 定期測試各階段成果
- 記錄遇到的問題和解決方案
- 根據實際情況調整計劃

---

## ✅ 總結

**技術棧**：
- 前端：React 19 + React Router 7 + Zustand + Tailwind CSS
- 工具：Vite + TypeScript + Docker

**預期成果**：
- ✅ 前台：使用者可管理錢包、卡片、交易
- ✅ 後台：管理員可管理用戶、審核存款、監控交易
- ✅ 權限控制：基於角色的訪問控制
- ✅ 無縫切換：管理員可在前後台之間自由切換

**實作時間**：
- MVP（核心功能）：4-5 小時
- 完整版（所有頁面）：12-15 小時

---

**如有問題或需要調整，請隨時提出！** 🚀
