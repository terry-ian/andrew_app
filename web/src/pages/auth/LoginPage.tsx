import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { authService } from "@/services/auth"

export default function LoginPage() {
    const navigate = useNavigate()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")
        setLoading(true)

        try {
            const response = await authService.login({ email, password })

            if (response.success) {
                navigate("/dashboard")
            } else {
                setError(response.message || "登入失敗")
            }
        } catch (err) {
            setError("發生錯誤，請稍後再試")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div
            className="min-h-screen flex items-center justify-center"
            style={{
                background: "radial-gradient(1000px 600px at 10% -10%, #1a2247, transparent), radial-gradient(800px 500px at 90% 110%, #202a59, transparent), #0b1020"
            }}
        >
            <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
                <h1 className="text-2xl font-bold text-center mb-2">歡迎回來</h1>
                <p className="text-gray-600 text-center mb-6">請登入以進入後台系統</p>

                {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="you@example.com"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
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
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
                    >
                        {loading ? "登入中..." : "登入"}
                    </button>

                    <div className="flex justify-between text-sm">
            <span className="text-gray-600">
              沒有帳號？{" "}
                <a href="/register" className="text-blue-600 hover:underline">
                建立帳號
              </a>
            </span>
                        <a href="/forgot" className="text-blue-600 hover:underline">
                            忘記密碼
                        </a>
                    </div>
                </form>

                <p className="text-xs text-gray-500 text-center mt-6">
                    網頁全程SSL加密，確保安全性最佳實務。
                </p>
            </div>
        </div>
    )
}
