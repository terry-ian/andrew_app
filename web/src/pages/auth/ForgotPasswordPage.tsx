import * as React from "react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import routeConfigs from "@/pages/routes/Routes.ts"

export default function ForgotPasswordPage() {
    const navigate = useNavigate()
    const [email, setEmail] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)
    const [error, setError] = useState("")

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")
        setIsLoading(true)


    }

    if (isSuccess) {
        return (
            <div className="bg-radial-auth flex min-h-screen items-center justify-center">
                <div className="bg-login-form-wrapper w-full max-w-md rounded-2xl p-8">
                    <div className="mb-6 text-center">
                        <div
                            className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                            <svg
                                className="h-8 w-8 text-green-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M5 13l4 4L19 7"
                                />
                            </svg>
                        </div>
                        <h1 className="mb-2 text-2xl font-bold text-white">檢查您的信箱</h1>
                        <p className="text-muted">
                            我們已經將密碼重設連結發送到
                        </p>
                        <p className="mt-2 font-medium text-white">{email}</p>
                    </div>

                    <div className="mb-6 rounded-lg bg-blue-50 p-4 text-sm text-blue-800">
                        <p className="mb-2">請注意：</p>
                        <ul className="ml-4 list-disc space-y-1">
                            <li>重設連結將在 1 小時內有效</li>
                            <li>如果沒有收到郵件，請檢查垃圾郵件資料夾</li>
                            <li>如果仍未收到，您可以重新發送</li>
                        </ul>
                    </div>

                    <button
                        onClick={() => navigate(routeConfigs.LOGIN)}
                        className="w-full cursor-pointer rounded-md bg-blue-500 px-4 py-2 text-white transition hover:bg-blue-700"
                    >
                        返回登入頁面
                    </button>

                    <button
                        onClick={() => setIsSuccess(false)}
                        className="mt-3 w-full cursor-pointer rounded-md border border-gray-300 px-4 py-2 text-gray-300 transition hover:bg-gray-700"
                    >
                        重新發送
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="bg-radial-auth flex min-h-screen items-center justify-center">
            <div className="bg-login-form-wrapper w-full max-w-md rounded-2xl p-8">
                <h1 className="mb-2 text-2xl font-bold text-white">忘記密碼</h1>
                <p className="text-muted mb-6">
                    輸入您的 Email，我們會寄送密碼重設連結。
                </p>

                {error && (
                    <div className="mb-4 rounded bg-red-50 p-3 text-sm text-red-600">
                        {error}
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

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full cursor-pointer rounded-md bg-blue-500 px-4 py-2 text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400"
                    >
                        {isLoading ? "發送中..." : "發送重設連結"}
                    </button>

                    <div className="text-center text-sm">
            <span className="text-gray-300">
              想起密碼了？{" "}
                <a href="/login" className="text-muted hover:underline">
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
