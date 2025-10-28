import * as React from "react"
import { useEffect, useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import routeConfigs from "@/pages/routes/Routes.ts"
import routes from "@/pages/routes/Routes.ts"

function ForgetPasswordError() {
    const navigate = useNavigate()

    return (
        <div className="bg-radial-auth flex min-h-screen items-center justify-center">
            <div className="bg-login-form-wrapper w-full max-w-md rounded-2xl p-8">
                <div className="mb-6 text-center">
                    <div
                        className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
                        <svg
                            className="h-8 w-8 text-red-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </div>
                    <h1 className="mb-2 text-2xl font-bold text-white">無效的連結</h1>
                    <p className="text-muted">
                        此密碼重設連結無效或已過期
                    </p>
                </div>

                <div className="mb-6 rounded-lg bg-yellow-50 p-4 text-sm text-yellow-800">
                    <p className="mb-2">可能的原因：</p>
                    <ul className="ml-4 list-disc space-y-1">
                        <li>連結已過期（超過 1 小時）</li>
                        <li>連結已被使用過</li>
                        <li>連結格式不正確</li>
                    </ul>
                </div>

                <button
                    onClick={() => navigate(routeConfigs.forget)}
                    className="w-full cursor-pointer rounded-md bg-blue-500 px-4 py-2 text-white transition hover:bg-blue-700"
                >
                    重新申請重設密碼
                </button>

                <button
                    onClick={() => navigate(routeConfigs.LOGIN)}
                    className="mt-3 w-full cursor-pointer rounded-md border border-gray-300 px-4 py-2 text-gray-300 transition hover:bg-gray-700"
                >
                    返回登入頁面
                </button>
            </div>
        </div>
    );
}

export default function ResetPasswordPage() {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const token = searchParams.get("token") || ""

    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")
    const [passwordError, setPasswordError] = useState("")

    useEffect(() => {
        // 檢查是否有 token
        if (!token) {
            setError("無效的重設連結")
        }
    }, [token])

    const validatePasswords = () => {
        setPasswordError("")

        if (password.length < 8) {
            setPasswordError("密碼至少需要 8 個字元")
            return false
        }

        if (password !== confirmPassword) {
            setPasswordError("兩次輸入的密碼不一致")
            return false
        }

        return true
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")

        if (!validatePasswords()) {
            return
        }

        setIsLoading(true)

        // 模擬 API 請求
        setTimeout(() => {
            setIsLoading(false)
            // 成功後重導向到登入頁面
            navigate(`${routeConfigs.LOGIN}?reset=success`)
        }, 1500)
    }

    // 如果沒有 token，顯示錯誤訊息
    if (!token) {
        return <ForgetPasswordError />
    }

    return (
        <div className="bg-radial-auth flex min-h-screen items-center justify-center">
            <div className="bg-login-form-wrapper w-full max-w-md rounded-2xl p-8">
                <h1 className="mb-2 text-2xl font-bold text-white">重設密碼</h1>
                <p className="text-muted mb-6">
                    請輸入您的新密碼
                </p>

                {error && (
                    <div className="mb-4 rounded bg-red-50 p-3 text-sm text-red-600">
                        {error}
                    </div>
                )}

                {passwordError && (
                    <div className="mb-4 rounded bg-red-50 p-3 text-sm text-red-600">
                        {passwordError}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label
                            htmlFor="password"
                            className="mb-1 block text-sm font-medium text-gray-300"
                        >
                            新密碼
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
                            確認新密碼
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

                    <div className="rounded-lg bg-blue-50 p-3 text-sm text-blue-800">
                        <p className="mb-1 font-medium">密碼要求：</p>
                        <ul className="ml-4 list-disc space-y-1">
                            <li>至少 8 個字元</li>
                            <li>兩次輸入必須一致</li>
                        </ul>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full cursor-pointer rounded-md bg-blue-500 px-4 py-2 text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400"
                    >
                        {isLoading ? "重設中..." : "重設密碼"}
                    </button>

                    <div className="text-center text-sm">
            <span className="text-gray-300">
              想起密碼了？{" "}
                <a href={routes.LOGIN} className="text-muted hover:underline">
                返回登入
              </a>
            </span>
                    </div>
                </form>

                <p className="mt-6 text-center text-xs text-gray-500">
                    網頁全程SSL加密，確保安全性最佳實務。
                </p>
            </div>
        </div>
    )
}
