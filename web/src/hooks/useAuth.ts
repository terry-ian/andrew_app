import { useAuthStore } from "@/stores/authStore"

export function useAuth() {
    const user = useAuthStore((state) => state.user)
    const isLoading = useAuthStore((state) => state.isLoading)
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
    const setUser = useAuthStore((state) => state.setUser)
    const logout = useAuthStore((state) => state.logout)
    const checkAuth = useAuthStore((state) => state.checkAuth)

    return {
        user,
        isLoading,
        isAuthenticated,
        setUser,
        logout,
        checkAuth,
    }
}
