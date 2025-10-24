// 用戶相關類型
export interface User {
  id: number
  email: string
  full_name: string
  created_at: string
  email_verified: boolean
}

// 登入請求
export interface LoginRequest {
  email: string
  password: string
  csrf: string
}

// 登入回應
export interface LoginResponse {
  success: boolean
  message?: string
  user?: User
}

// 註冊請求
export interface RegisterRequest {
  full_name: string
  email: string
  password: string
  csrf: string
}

// API 回應通用格式
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  errors?: Record<string, string[]>
}
