import { Navigate, useLocation } from "react-router-dom"
import { useAuth } from "@/hooks/useAuth"
import * as React from "react";
import routeConfigs from "@/pages/routes/Routes.ts";

interface PrivateRouteProps {
    children: React.ReactNode
}

export default function PrivateRoute({ children }: PrivateRouteProps) {
    const { isAuthenticated, isLoading } = useAuth()
    const location = useLocation()

    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <div className="text-lg">載入中...</div>
            </div>
        )
    }

    if (!isAuthenticated) {
        // 儲存當前路徑，登入後可返回
        return <Navigate to={routeConfigs.LOGIN} state={{ from: location }} replace />
    }

    return <>{children}</>
}
