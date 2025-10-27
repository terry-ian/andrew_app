import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import "./index.css"
import App from "./App.tsx"
import { useAuthStore } from "./stores/authStore"

// 應用啟動時立即檢查認證狀態
useAuthStore.getState().checkAuth()

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <App />
    </StrictMode>
)
