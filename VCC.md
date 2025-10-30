# VCC Pool API 文檔

## 📋 基本資訊

- **API Gateway**: `https://matewalker.com/api`
- **官方文檔**: https://docs.vccpool.com/openapi-docs/reference/api-reference/
- **認證方式**: Bearer Token
- **API Token**: `3325|R8dNDP78EtOidNtFXizYOHXt02RGzYAQhRRrneSe8c5fe31a`
- **Authorization Header**: `Authorization: Bearer <token>`
- **回應格式**:
  ```json
  {
    "code": 200,
    "msg": "success",
    "data": {...}
  }
  ```

## 🔐 認證流程

1. 申請通過後,系統會發送 Token
2. 在所有請求的 Header 中加入: `Authorization: Bearer <token>`

---

## 📦 API 類別

### 1️⃣ Product API (產品管理)

#### GET /product/list

列出所有產品

**查詢參數**:

- `page` (integer, 可選) - 頁碼,例如: 1
- `limit` (integer, 可選) - 每頁筆數,例如: 20

**回應欄位**:

- `id` - 產品 ID
- `sid` - 系統 ID
- `bin` - BIN 碼
- `osn` - 訂單序號
- `type` - 類型
- `cuy` - 貨幣
- `mode` - 模式
- `area` - 地區
- `sort` - 排序
- `inventory` - 庫存
- `status` - 狀態
- `count` - 總數量

#### GET /product/info

獲取單個產品的詳細資訊

**查詢參數**:

- `id` (integer, 可選) - 產品 ID,例如: 1

**回應**: 包含上述相同欄位的單個產品資訊

#### GET /product/maintenance/list

列出產品維護記錄

**查詢參數**:

- `pid` (integer, 可選) - 產品 ID
- `page` (integer, 可選) - 頁碼
- `limit` (integer, 可選) - 每頁筆數

**回應欄位**:

- `id` - 維護記錄 ID
- `is_create` (boolean) - 是否建立
- `is_recharge` (boolean) - 是否充值
- `is_trade` (boolean) - 是否交易
- 時間戳記欄位

---

### 2️⃣ Wallet API (錢包管理)

#### GET /wallet/list

列出所有錢包

**回應結構**:

```json
{
  "list": [
    {
      "amt": "金額",
      "cuy": "貨幣代碼"
    }
  ],
  "count": "總數"
}
```

#### GET /wallet/flow/list

查詢錢包流水記錄

**查詢參數**:

- `wid` (integer, 可選) - 錢包 ID
- `page` (integer, 可選) - 頁碼
- `limit` (integer, 可選) - 每頁筆數

**回應欄位**:

- 交易 ID
- 用戶 ID
- 錢包 ID
- 訂單序號
- 交易類型
- 金額
- 餘額
- 時間戳記

---

### 3️⃣ Card API (卡片管理)

#### 查詢功能

##### GET /card/list

獲取卡片列表

**查詢參數**:

- `page` (integer, 可選) - 頁碼
- `limit` (integer, 可選) - 每頁筆數

##### GET /card/info

取得特定卡片詳細資訊

**查詢參數**:

- `id` (integer, 必填) - 卡片 ID

##### GET /card/balance

查詢卡片餘額和額度限制

**查詢參數**:

- `id` (integer, 必填) - 卡片 ID

**回應欄位**:

- 卡片編號
- 額度
- 餘額
- 狀態

#### 管理功能

##### GET /card/cancel

取消卡片

**查詢參數**:

- `id` (integer, 必填) - 卡片 ID

##### GET /card/pin/resend

重新發送卡片 PIN

**查詢參數**:

- `id` (integer, 必填) - 卡片 ID

##### POST /card/pin/decode

解碼卡片 PIN

**請求參數**:

- `id` (integer, 必填) - 卡片 ID
- `pin` (string, 必填) - PIN 碼

#### 交易相關

##### GET /card/trade/list

列出卡片交易記錄

**查詢參數**:

- `cid` (integer, 可選) - 卡片 ID
- `page` (integer, 可選) - 頁碼
- `limit` (integer, 可選) - 每頁筆數

##### GET /card/trade/info

獲取特定交易詳細資訊

**查詢參數**:

- `id` (integer, 必填) - 交易 ID

##### GET /card/cycle/list

查詢卡片帳單週期

**查詢參數**:

- `cid` (integer, 必填) - 卡片 ID

---

### 4️⃣ Trade API (交易處理)

#### GET /trade/list

查詢交易記錄列表

**查詢參數**:

- `osn` (string, 可選) - 訂單號碼
- `page` (integer, 可選) - 頁碼,預設值: 1
- `limit` (integer, 可選) - 每頁筆數,預設值: 20

**回應**: 包含交易陣列和總數統計

#### GET /trade/info

檢索單筆交易的完整資訊

**查詢參數**:

- `id` (integer, 可選) - 交易 ID

#### POST /trade/create

建立新交易

**請求參數**:

- `pid` (integer, 必填) - 產品 ID
- `amt` (number, 必填) - 金額
- `wid` (integer, 必填) - 錢包 ID
- `osn` (string, 必填) - 訂單號碼

#### POST /trade/recharge

處理充值操作

**請求參數**:

- `cid` (integer, 必填) - 卡片 ID
- `amt` (number, 必填) - 充值金額
- `wid` (integer, 必填) - 錢包 ID
- `osn` (string, 必填) - 訂單號碼

---

### 5️⃣ Tron API (區塊鏈相關)

文檔中提到但詳細資訊待補充。

---

## 📝 HTTP 狀態碼

- `200` - 成功
- `500` - 失敗/錯誤

---

## 🚀 建議實作流程

1. **測試 API 連線**
    - 使用 Token 測試基本的 API 呼叫 (如 `/product/list`)

2. **建立 API 服務層**
    - 建立一個服務類別封裝 API 呼叫
    - 統一處理認證 Header
    - 統一處理錯誤回應

3. **實作核心功能**
    - 產品瀏覽和選擇
    - 虛擬卡片建立和管理
    - 充值功能
    - 交易記錄查詢

4. **安全性考量**
    - Token 應存放在環境變數中
    - 不要將 Token 提交到版本控制系統
    - 實作 API 呼叫的錯誤處理和重試機制

---

## 📌 注意事項

- 所有金額相關的參數請注意精度問題
- 訂單序號 (osn) 建議使用唯一值避免重複
- 建議實作 API 呼叫的日誌記錄功能以便追蹤問題
- 注意 API 的速率限制 (Rate Limit) - 待確認官方限制
