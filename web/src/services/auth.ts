import apiClient from "./api"
import type {
  LoginRequest,
  RegisterRequest,
  User,
} from "@/types"

export const authService = {
  // 登入
  async login(credentials: LoginRequest) {
    return apiClient.post("/auth/login", credentials)
  },

  // 註冊
  async register(data: RegisterRequest) {
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
