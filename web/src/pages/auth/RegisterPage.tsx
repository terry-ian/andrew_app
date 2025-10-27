import * as React from "react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useMutation } from "@tanstack/react-query"
import { authService } from "@/services/auth"
import routeConfigs from "@/pages/routes/Routes.ts"
import routes from "@/pages/routes/Routes.ts"

export default function RegisterPage() {
    const navigate = useNavigate()
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [validationError, setValidationError] = useState("")

    const registerMutation = useMutation({
        mutationFn: authService.register,
        onSuccess: (data) => {
            if (data.success) {
                navigate(routeConfigs.LOGIN)
            }
        },
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setValidationError("")

        if (password !== confirmPassword) {
            setValidationError("密碼與確認密碼不一致")
            return
        }

        registerMutation.mutate({ full_name: name, email, password })
    }

    return (
        <div className="bg-radial-auth flex min-h-screen items-center justify-center">
            <div className="bg-login-form-wrapper w-full max-w-md rounded-2xl p-8">
                <h1 className="mb-2 text-2xl font-bold text-white">建立帳號</h1>
                <p className="text-muted mb-6">使用 Email 註冊並完成驗證</p>

                {validationError && (
                    <div className="mb-4 rounded bg-red-50 p-3 text-sm text-red-600">
                        {validationError}
                    </div>
                )}

                {
                    registerMutation.isError && (
                    <div className="mb-4 rounded bg-red-50 p-3 text-sm text-red-600">
                        {
                            registerMutation.error instanceof Error
                                ? registerMutation.error.message
                                : "註冊失敗，請稍後再試"
                        }
                    </div>
                )}

                {registerMutation.data && !registerMutation.data.success && (
                    <div className="mb-4 rounded bg-red-50 p-3 text-sm text-red-600">
                        {registerMutation.data.message || "註冊失敗"}
                    </div>
                )}

                {registerMutation.isSuccess && registerMutation.data?.success && (
                    <div className="mb-4 rounded bg-green-50 p-3 text-sm text-green-600">
                        註冊成功！即將導向登入頁面...
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label
                            htmlFor="name"
                            className="mb-1 block text-sm font-medium text-gray-300"
                        >
                            姓名
                        </label>
                        <input
                            id="name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            placeholder="請輸入您的姓名"
                            className="w-full rounded-md border border-gray-300 px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                    </div>

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

                    <div>
                        <label
                            htmlFor="confirmPassword"
                            className="mb-1 block text-sm font-medium text-gray-300"
                        >
                            確認密碼
                        </label>
                        <input
                            id="confirmPassword"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            minLength={8}
                            placeholder="再次輸入密碼"
                            className="w-full rounded-md border border-gray-300 px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={registerMutation.isPending}
                        className="w-full cursor-pointer rounded-md bg-blue-500 px-4 py-2 text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400"
                    >
                        {registerMutation.isPending ? "註冊中..." : "註冊"}
                    </button>

                    <div className="text-center text-sm">
            <span className="text-gray-300">
              已有帳號？{" "}
                <a href={routes.LOGIN} className="text-muted hover:underline">
                登入
              </a>
            </span>
                    </div>
                </form>

                <p className="mt-6 text-center text-xs text-gray-500">
                    網頁全程SSL加密,確保安全性最佳實務。
                </p>
            </div>
        </div>
    )
}
