# 前後台分離實作計劃

> **專案**: andrew_app - 虛擬卡片管理系統
> **日期**: 2025-10-25
> **目標**: 在當前 Web 架構下實現前台（使用者介面）與後台（管理員介面）的分離

---

## 📋 目錄

1. [可行性分析](#可行性分析)
2. [認證方案選擇](#認證方案選擇)
3. [路由結構設計](#路由結構設計)
4. [後端 API 實作](#後端-api-實作)
5. [最終檔案結構](#最終檔案結構)
6. [執行順序](#執行順序)
7. [安全性考量](#安全性考量)
8. [資料庫相關](#資料庫相關)
9. [已知問題與解決方案](#已知問題與解決方案)

---

## ✅ 可行性分析

### 在當前 web 架構下支援前後台是**完全可行**的

**現有基礎**：
- ✅ 資料庫已設計角色系統（`user` / `admin`）
- ✅ 後端已有 `require_admin()` 權限檢查函數
- ✅ React Router 可以輕鬆擴展路由結構
- ✅ 前後端已分離（React + PHP API）

**需要補充的部分**：
- ⚠️ 前端缺少全局狀態管理 → 參考 [web/README_FRONTEND.md](./web/README_FRONTEND.md)
- ⚠️ 缺少權限守衛組件（Protected Routes） → 參考 [web/README_FRONTEND.md](./web/README_FRONTEND.md)
- ⚠️ 缺少角色檢查機制 → 後端需補充 API
- ⚠️ 後台介面尚未建立 → 參考 [web/README_FRONTEND.md](./web/README_FRONTEND.md)

---

## 🔐 認證方案選擇

### **方案 A：單一認證系統（已選擇）**

**設計理念**：
- 使用**同一個認證 session/token**
- 根據**用戶角色**（user/admin）顯示不同介面
- 管理員可以同時訪問前台和後台

**優點**：
- ✅ 實作簡單，維護容易
- ✅ 用戶體驗更好（不需要重複登入）
- ✅ 安全性統一管理
- ✅ 管理員可無縫切換前後台

**適用場景**：
- 管理員需要同時查看前台和後台
- 權限控制基於角色而非完全隔離
- 中小型應用系統

**技術實現**：
```typescript
// 認證狀態結構（前端）
interface AuthState {
  user: {
    id: number
    email: string
    full_name: string
    roles: string[]  // ["user"] 或 ["user", "admin"]
  } | null
  isLoading: boolean
  isAuthenticated: boolean
  isAdmin: boolean  // 根據 roles 計算
}
```

---

## 🗺️ 路由結構設計

### **路徑前綴區分方式（已選擇）**

#### 🔓 公開路由（無需登入）
```
/login                  → 登入頁面
/register               → 註冊頁面
/forgot                 → 忘記密碼
/reset?token=xxx        → 重設密碼
/verify?token=xxx       → Email 驗證
```

#### 👤 前台路由（需登入，role: user）
```
/dashboard              → 使用者首頁（儀表板總覽）
/dashboard/profile      → 個人資料設定
/dashboard/wallet       → 錢包管理（餘額、充值、提現）
/dashboard/cards        → 虛擬卡片管理
/dashboard/transactions → 交易記錄查詢
/dashboard/deposit      → 存款申請
/dashboard/settings     → 帳號設定
```

#### 🛡️ 後台路由（需管理員權限，role: admin）
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

#### 🔄 重導向邏輯
```
已登入 + 訪問 /login      → 重導向到 /dashboard
已登入 + 訪問 /register   → 重導向到 /dashboard
未登入 + 訪問受保護路由   → 重導向到 /login
一般用戶 + 訪問 /admin/*  → 重導向到 /dashboard（顯示權限錯誤）
```

> **註**：前端路由實作細節請參考 [web/README_FRONTEND.md](./web/README_FRONTEND.md)

---

## 🚀 後端 API 實作

### **目標**
新增 API 端點，支援前端自動檢查認證狀態。

### **需要新增的 API**

#### 1. `GET /api/auth/check` - 檢查認證狀態
**功能**：返回當前 Session 中的用戶資訊（含角色）

**請求**：
```http
GET /api/auth/check HTTP/1.1
Host: localhost:8000
Cookie: PHPSESSID=xxx
```

**回應（已登入）**：
```json
{
  "success": true,
  "data": {
    "id": 1,
    "email": "user@example.com",
    "full_name": "Test User",
    "roles": ["user"],
    "email_verified": true
  }
}
```

**回應（未登入）**：
```json
{
  "success": false,
  "message": "未登入"
}
```

**實作位置**：`server/src/controllers/AuthController.php`

```php
// AuthController.php 新增方法
public static function checkAuth($pdo) {
    header('Content-Type: application/json');

    if (empty($_SESSION['uid'])) {
        echo json_encode([
            'success' => false,
            'message' => '未登入'
        ]);
        return;
    }

    $stmt = $pdo->prepare('
        SELECT u.id, u.email, u.full_name, u.email_verified,
               GROUP_CONCAT(r.name) as roles
        FROM users u
        LEFT JOIN user_roles ur ON u.id = ur.user_id
        LEFT JOIN roles r ON ur.role_id = r.id
        WHERE u.id = ?
        GROUP BY u.id
    ');
    $stmt->execute([$_SESSION['uid']]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$user) {
        echo json_encode([
            'success' => false,
            'message' => '用戶不存在'
        ]);
        return;
    }

    // 轉換角色為陣列
    $user['roles'] = $user['roles'] ? explode(',', $user['roles']) : [];

    echo json_encode([
        'success' => true,
        'data' => $user
    ]);
}
```

#### 2. 更新路由配置
**檔案**：`server/public/index.php`

```php
// 新增路由
if ($path === '/api/auth/check' && $_SERVER['REQUEST_METHOD'] === 'GET') {
    require_once __DIR__.'/../src/controllers/AuthController.php';
    AuthController::checkAuth($pdo);
    exit;
}
```

### **需要調整的 API**

#### 更新登入 API 回應格式
確保 `/auth/login` 回應包含角色資訊：

```php
// AuthController.php - login 方法
$user['roles'] = $user['roles'] ? explode(',', $user['roles']) : [];

echo json_encode([
    'success' => true,
    'data' => $user,
    'message' => '登入成功'
]);
```

### **Session 管理機制**

#### 後端 Session 設定
```php
// server/public/index.php
session_start([
    'cookie_lifetime' => 86400,    // 24小時
    'cookie_httponly' => true,     // 防止 JS 訪問
    'cookie_secure' => false,      // 本地開發為 false，生產環境改為 true
    'cookie_samesite' => 'Lax'     // CSRF 防護
]);
```

---

## 📂 最終檔案結構

```
andrew_app/
├── server/                        # 後端 PHP 服務
│   ├── public/
│   │   └── index.php             # API 路由（新增 /api/auth/check）
│   ├── src/
│   │   ├── controllers/
│   │   │   └── AuthController.php # 新增 checkAuth 方法
│   │   └── core/
│   │       └── auth.php          # require_admin() 等函數
│   └── database/
│       └── init.sql              # 角色表（已存在）
│
└── web/                           # 前端 React 應用
    └── README_FRONTEND.md        # 前端完整實作計劃
```

> **註**：前端檔案結構詳見 [web/README_FRONTEND.md](./web/README_FRONTEND.md)

---

## 🚀 執行順序

### **建議的實作順序**

| 階段 | 任務 | 預估時間 | 優先級 | 負責 |
|------|------|----------|--------|------|
| 1 | 安裝 Zustand 並建立 authStore | 30 分鐘 | ⭐⭐⭐ | 前端 |
| 2 | 建立 useAuth Hook | 20 分鐘 | ⭐⭐⭐ | 前端 |
| 3 | 後端新增 `/api/auth/check` API | 30 分鐘 | ⭐⭐⭐ | 後端 |
| 4 | 實作 authStore 的 `checkAuth()` 方法 | 20 分鐘 | ⭐⭐⭐ | 前端 |
| 5 | 在 main.tsx 中新增啟動時認證檢查 | 10 分鐘 | ⭐⭐⭐ | 前端 |
| 6 | 建立 PrivateRoute 守衛組件 | 20 分鐘 | ⭐⭐⭐ | 前端 |
| 7 | 建立 AdminRoute 守衛組件 | 20 分鐘 | ⭐⭐⭐ | 前端 |
| 8 | 建立 RedirectIfAuthenticated 組件 | 15 分鐘 | ⭐⭐ | 前端 |
| 9 | 建立 DashboardLayout 組件 | 1 小時 | ⭐⭐⭐ | 前端 |
| 10 | 建立 AdminLayout 組件 | 1 小時 | ⭐⭐⭐ | 前端 |
| 11 | 重構 App.tsx 路由結構 | 40 分鐘 | ⭐⭐⭐ | 前端 |
| 12 | HomePage 重命名為 DashboardPage 並調整 | 30 分鐘 | ⭐⭐ | 前端 |
| 13 | 建立 AdminDashboardPage | 1 小時 | ⭐⭐⭐ | 前端 |
| 14 | 建立其他前台頁面（Profile, Wallet 等） | 2-3 小時 | ⭐⭐ | 前端 |
| 15 | 建立其他後台頁面（Users, Deposits 等） | 2-3 小時 | ⭐⭐ | 前端 |
| 16 | 整合測試（前後台切換、權限檢查） | 1 小時 | ⭐⭐⭐ | 全端 |

**總預估時間**：12-15 小時

### **最小可行產品（MVP）範圍**

如果需要快速驗證架構，可以先完成以下核心功能：

**必做**（4-5 小時）：
1. ✅ 階段 1-5：完整的認證狀態管理
2. ✅ 階段 6-8：三個路由守衛組件
3. ✅ 階段 9-11：兩個 Layout + 路由重構
4. ✅ 階段 13：AdminDashboardPage（簡單版）

**MVP 成果**：
- 用戶可登入並訪問前台
- 管理員可訪問後台
- 前後台可自由切換
- 權限檢查正常運作

**後續擴展**（8-10 小時）：
- 補充前台功能頁面（錢包、卡片、交易）
- 補充後台管理頁面（用戶管理、審核）
- 完善 UI/UX 設計
- 新增更多業務邏輯

---

## 🔒 安全性考量

### **1. CSRF 防護**
- 所有 POST 請求都需要包含 CSRF Token
- Token 儲存在 Session 中
- 前端從 Cookie 或 API 獲取 Token

### **2. XSS 防護**
- React 預設防護（自動轉義輸出）
- 避免使用 `dangerouslySetInnerHTML`
- 後端使用 `htmlspecialchars()` 處理輸出

### **3. Session 安全**
```php
session_start([
    'cookie_httponly' => true,      // 防止 JS 訪問
    'cookie_secure' => true,        // 僅 HTTPS（生產環境）
    'cookie_samesite' => 'Strict'   // CSRF 防護
]);
```

### **4. 權限檢查**
- 前端：路由守衛檢查（防止 UI 誤導）
- 後端：每個 API 都需要檢查權限（真正的安全保障）

**範例**：
```php
// 後端 API 中
require_admin($pdo);  // 管理員專用 API 必須檢查
```

### **5. 密碼安全**
- 使用 `PASSWORD_BCRYPT` 加密
- 最少 8 字元要求
- 密碼重設 Token 有效期限制

### **6. CORS 設定**
```php
// server/public/index.php
header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
```

---

## 📊 資料庫相關

### **角色表結構**（已存在）

```sql
-- roles 表
CREATE TABLE `roles` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `description` varchar(255),
  PRIMARY KEY (`id`)
);

INSERT INTO `roles` VALUES
  (1, 'user', '一般用戶'),
  (9, 'admin', '系統管理員');

-- user_roles 表（用戶角色關聯）
CREATE TABLE `user_roles` (
  `user_id` int NOT NULL,
  `role_id` int NOT NULL,
  PRIMARY KEY (`user_id`, `role_id`)
);
```

### **如何設定管理員**

```sql
-- 將 user_id=1 的用戶設為管理員
INSERT INTO user_roles (user_id, role_id) VALUES (1, 9);

-- 查詢管理員列表
SELECT u.id, u.email, u.full_name
FROM users u
JOIN user_roles ur ON u.id = ur.user_id
WHERE ur.role_id = 9;
```

---

## 🐛 已知問題與解決方案

### **問題 1：頁面刷新後丟失登入狀態**
**原因**：authStore 是記憶體狀態，刷新後重置

**解決方案**：
- 應用啟動時調用 `checkAuth()` API
- 後端檢查 Session 有效性
- 恢復前端狀態

> **詳見**：[web/README_FRONTEND.md - 狀態持久化策略](./web/README_FRONTEND.md#4-狀態持久化策略)

### **問題 2：CORS 跨域問題**
**原因**：前端（localhost:5173）和後端（localhost:8000）不同源

**解決方案**：
```php
// server/public/index.php
header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Credentials: true');
```

### **問題 3：Cookie 無法跨域發送**
**原因**：預設情況下，Fetch 不會帶上 Cookie

**解決方案**：
```typescript
// services/api.ts
credentials: "include"  // 強制帶上 Cookie
```

---

## 📚 參考資源

### **技術文件**
- [PHP Session 文件](https://www.php.net/manual/en/book.session.php)
- [OWASP 安全指南](https://owasp.org/www-project-top-ten/)
- [RESTful API 設計指南](https://restfulapi.net/)

### **專案文件**
- [前端實作計劃](./web/README_FRONTEND.md) - 完整的前端開發指南
- [後端 API 文件](./server/README.md) - 後端 API 規格（待建立）

---

## 🎯 下一步行動

### **立即開始**
1. ✅ 確認計劃無誤
2. ✅ 後端新增 `/api/auth/check` API
3. ✅ 更新登入 API 回應格式
4. ✅ 前端參考 [web/README_FRONTEND.md](./web/README_FRONTEND.md) 開始實作

### **後續追蹤**
- 定期測試各階段成果
- 記錄遇到的問題和解決方案
- 根據實際情況調整計劃

---

## ✅ 總結

**可行性**：完全可行，當前架構已具備基礎條件

**認證方案**：單一認證系統（Session-based）

**路由結構**：路徑前綴區分（`/dashboard/*` vs `/admin/*`）

**實作時間**：
- MVP（核心功能）：4-5 小時
- 完整版（所有頁面）：12-15 小時

**技術棧**：
- 前端：React 19 + React Router 7 + Zustand + Tailwind CSS
- 後端：PHP 8.4 + MySQL 8.0 + Session
- 工具：Vite + TypeScript + Docker

**預期成果**：
- ✅ 前台：使用者可管理錢包、卡片、交易
- ✅ 後台：管理員可管理用戶、審核存款、監控交易
- ✅ 權限控制：基於角色的訪問控制
- ✅ 無縫切換：管理員可在前後台之間自由切換

---

**如有問題或需要調整，請隨時提出！** 🚀
