import apiClient from "./api"
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  User,
} from "@/types"

export const authService = {
  // 登入
  async login(credentials: Omit<LoginRequest, "csrf">): Promise<LoginResponse> {
    // 先獲取 CSRF token（如果需要的話）
    const response = await apiClient.post<User>("/auth/login", credentials)

    if (response.success && response.data) {
      return {
        success: true,
        user: response.data,
      }
    }

    return {
      success: false,
      message: response.message || "登入失敗",
    }
  },

  // 註冊
  async register(data: Omit<RegisterRequest, "csrf">) {
    return apiClient.post("/auth/register", data)
  },

  // 登出
  async logout() {
    return apiClient.post("/auth/logout")
  },

  // 獲取當前用戶
  async getCurrentUser() {
    return apiClient.get<User>("/auth/user")
  },

  // 忘記密碼
  async forgotPassword(email: string) {
    return apiClient.post("/auth/request-reset", { email })
  },

  // 重設密碼
  async resetPassword(token: string, password: string) {
    return apiClient.post("/auth/perform-reset", { token, password })
  },
}
