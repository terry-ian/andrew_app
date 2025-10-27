import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import LoginPage from "@/pages/auth/LoginPage"
import RegisterPage from "@/pages/auth/RegisterPage"
import ForgotPasswordPage from "@/pages/auth/ForgotPasswordPage"
import HomePage from "@/pages/dashboard/HomePage"
import routeConfigs from "@/pages/routes/Routes.ts"
import PrivateRoute from "@/components/auth/PrivateRoute"

// 建立 QueryClient 實例
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: 1,
            refetchOnWindowFocus: false,
        },
    },
})

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                <Routes>
                    {/* 認證路由 */}
                    <Route path={routeConfigs.LOGIN} element={<LoginPage />} />
                    <Route path={routeConfigs.REGISTER} element={<RegisterPage />} />
                    <Route path={routeConfigs.forget} element={<ForgotPasswordPage />} />

                    {/* 儀表板路由 */}
                    <Route
                        path={routeConfigs.DASHBOARD}
                        element={
                            <PrivateRoute>
                                <HomePage />
                            </PrivateRoute>
                        }
                    />

                    {/* 預設重導向到登入頁 */}
                    <Route path="/" element={<Navigate to="/login" replace />} />

                    {/* 404 頁面 */}
                    <Route path="*" element={<Navigate to="/login" replace />} />
                </Routes>
            </BrowserRouter>
            <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
    )
}

export default App
