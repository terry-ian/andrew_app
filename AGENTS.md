# Repository Guidelines

## Project Structure & Module Organization

- 根目錄使用 PNPM 管理，`package.json` 提供同時啟動前後端的腳本。
- `server/` 為 PHP API，業務邏輯集中於 `server/src/{controllers,services,core}`，設定與環境常數位於 `server/src/config`，
  資料庫腳本存放在 `server/database/`。
- `web/` 為 React + Vite 專案，以 `web/src/main.tsx` 為入口；路由頁面放在 `web/src/pages`，共享 UI 於 `web/src/
  components`，狀態與 hooks 位於 `web/src/{stores,hooks}`，測試樣板在 `web/src/test`。
- 靜態資源請分別維護於 `server/public/assets` 與 `web/public`，避免跨模組引用。

## Build, Test, and Development Commands

- `pnpm install`：於根目錄安裝前後端依賴（建議使用 PNPM 8+）。
- `pnpm dev`：並行啟動 PHP 內建伺服器與 Vite 開發伺服器，預設分別監聽 `:8000` 與 `:5173`。
- `pnpm build:web`：在 `web/` 進行 TypeScript build 與 Vite bundle，產出部署用 `web/dist`。
- `pnpm lint:web` / `pnpm test:web`：在前端專案執行 ESLint 與 Vitest；確保 PR 前兩者皆通過。

## Coding Style & Naming Conventions

- React/TypeScript 使用 Prettier（含 Tailwind 外掛）與 ESLint 預設 2 空白縮排；元件與頁面採 PascalCase，hooks 以 `use` 作
  為前綴。
- Tailwind 類別請依 Prettier 自動排序；共用樣式集中於 `web/src/index.css` 或對應元件的模組檔。
- PHP 類別採 PascalCase，方法與變數使用 camelCase；保持檔頭 `require_once` 與命名空間在最上方，避免混用 tab 與空白。

## Testing Guidelines

- 前端採 Vitest + React Testing Library，測試檔命名為 `*.test.ts(x)` 並放在與被測元件相同目錄或 `web/src/test`。
- 撰寫狀態邏輯（Zustand store）時請新增 selector 與行為測試，確保認證流程或路由守門邏輯涵蓋主要 happy path 與錯誤情境。
- 後端暫無自動化測試；更新控制器時至少以 `pnpm dev:server` 啟動後使用 `curl` 或 REST 客戶端驗證 JSON API 響應。

## Commit & Pull Request Guidelines

- Commit 採用帶 emoji 的 Conventional Commits（如 `✨ feat: ...`、`♻️ refactor: ...`），一個主題一個提交，描述動機與範圍。
- PR 說明需包含：變更摘要、測試結果（指令與輸出摘要）、相關 Issue 連結；若影響 UI，附上截圖或錄影。
- 在提交前確認未提交敏感資訊，並更新相關說明文件（例如 `README.md` 或設定檔範例）。

## Security & Configuration Tips

- `.env` 檔請由 `.env.example` 複製並依照 `server/src/config` 需求補齊；切勿將實際金鑰或憑證提交至版本庫。
- 若新增外部整合服務，請在 `FRONTEND_BACKEND_SEPARATION_PLAN.md` 或對應設定檔描述授權流程與回呼端點，確保同仁可快速重現
  環境。