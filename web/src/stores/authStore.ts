import { create } from "zustand"
import type { User } from "@/types"
import { authService } from "@/services/auth"

interface AuthState {
    user: User | null
    isLoading: boolean
    isAuthenticated: boolean

    setUser: (user: User | null) => void
    setLoading: (isLoading: boolean) => void
    logout: () => Promise<void>
    checkAuth: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set, get) => ({
    user: null,
    isLoading: true,
    isAuthenticated: false,

    setUser: (user) =>
        set({
            user,
            isAuthenticated: !!user,
        }),

    setLoading: (isLoading) => set({ isLoading }),

    logout: async () => {
        try {
            await authService.logout()
            set({
                user: null,
                isAuthenticated: false,
            })
        } catch (error) {
            console.error("登出失敗:", error)
        }
    },

    checkAuth: async () => {
        set({ isLoading: true })

        try {
            const response = await authService.getCurrentUser()

            if (response.success && response.data) {
                get().setUser(response.data)
            } else {
                get().setUser(null)
            }
        } catch (error) {
            console.error("檢查認證失敗:", error)
            get().setUser(null)
        } finally {
            set({ isLoading: false })
        }
    },
}))
