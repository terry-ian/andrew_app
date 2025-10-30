import * as React from "react"
import { useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { useMutation } from "@tanstack/react-query"
import { authService } from "@/services/auth"
import routeConfigs from "@/pages/routes/Routes.ts"
import { useAuth } from "@/hooks/useAuth"

export default function LoginPage() {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const resetSuccess = searchParams.get("reset") === "success"
    const { setUser } = useAuth()

    const loginMutation = useMutation({
        mutationFn: authService.login,
        onSuccess: (data) => {
            if (data.success && data.data) {
                setUser(data.data)
                navigate(routeConfigs.DASHBOARD)
            }
        },
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        loginMutation.mutate({ email, password })
    }

    return (
        <div className="bg-radial-auth flex min-h-screen items-center justify-center">
            <div className="bg-login-form-wrapper w-full max-w-md rounded-2xl p-8">
                <h1 className="mb-2 text-2xl font-bold text-white">歡迎回來</h1>
                <p className="text-muted mb-6">請登入以進入後台系統</p>

                {resetSuccess && (
                    <div className="mb-4 rounded bg-green-50 p-3 text-sm text-green-600">
                        密碼重設成功！請使用新密碼登入。
                    </div>
                )}

                {loginMutation.isError && (
                    <div className="mb-4 rounded bg-red-50 p-3 text-sm text-red-600">
                        {loginMutation.error instanceof Error
                            ? loginMutation.error.message
                            : "登入失敗，請稍後再試"}
                    </div>
                )}

                {loginMutation.data && !loginMutation.data.success && (
                    <div className="mb-4 rounded bg-red-50 p-3 text-sm text-red-600">
                        {loginMutation.data.message || "登入失敗"}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label
                            htmlFor="email"
                            className="mb-1 block text-sm font-medium text-gray-300"
                        >
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="you@example.com"
                            className="w-full rounded-md border border-gray-300 px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="password"
                            className="mb-1 block text-sm font-medium text-gray-300"
                        >
                            密碼
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            minLength={8}
                            placeholder="至少 8 碼"
                            className="w-full rounded-md border border-gray-300 px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loginMutation.isPending}
                        className="w-full cursor-pointer rounded-md bg-blue-500 px-4 py-2 text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400"
                    >
                        {loginMutation.isPending ? "登入中..." : "登入"}
                    </button>

                    <div className="flex justify-between text-sm">
            <span className="text-gray-300">
              沒有帳號？{" "}
                <a href="/register" className="text-muted hover:underline">
                建立帳號
              </a>
            </span>
                        <a href="/forgot" className="text-muted hover:underline">
                            忘記密碼
                        </a>
                    </div>
                </form>

                <p className="mt-6 text-center text-xs text-gray-500">
                    網頁全程SSL加密，確保安全性最佳實務。
                </p>
            </div>
        </div>
    )
}
