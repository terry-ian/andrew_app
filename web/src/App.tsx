import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import LoginPage from "@/pages/auth/LoginPage"
import RegisterPage from "@/pages/auth/RegisterPage"
import ForgotPasswordPage from "@/pages/auth/ForgotPasswordPage"
import HomePage from "@/pages/dashboard/HomePage"
import routeConfigs from "@/pages/routes/Routes.ts";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* 認證路由 */}
                <Route path={routeConfigs.LOGIN} element={<LoginPage />} />
                <Route path={routeConfigs.REGISTER} element={<RegisterPage />} />
                <Route path={routeConfigs.forget} element={<ForgotPasswordPage />} />

                {/* 儀表板路由 */}
                <Route path={routeConfigs.DASHBOARD} element={<HomePage />} />

                {/* 預設重導向到登入頁 */}
                <Route path="/" element={<Navigate to="/login" replace />} />

                {/* 404 頁面 */}
                <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
        </BrowserRouter>
    )
}

export default App
