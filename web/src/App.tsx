import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import LoginPage from "@/pages/auth/LoginPage"
import RegisterPage from "@/pages/auth/RegisterPage"
import ForgotPasswordPage from "@/pages/auth/ForgotPasswordPage"
import HomePage from "@/pages/dashboard/HomePage"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 認證路由 */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot" element={<ForgotPasswordPage />} />

        {/* 儀表板路由 */}
        <Route path="/dashboard" element={<HomePage />} />

        {/* 預設重導向到登入頁 */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* 404 頁面 */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
