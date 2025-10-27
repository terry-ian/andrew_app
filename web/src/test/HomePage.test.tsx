import { beforeEach, describe, expect, it, vi } from "vitest"
import { screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { authService } from "@/services/auth.ts"
import { renderWithApp } from "@/test/TestUtils.tsx"

vi.mock("@/services/auth", () => ({
    authService: {
        logout: vi.fn(),
    },
}))

describe("HomePage", () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it("should display homepage content", async () => {
        renderWithApp({ initialRoute: "/dashboard" })

        expect(screen.getByText(/嗨,使用者!/i)).toBeInTheDocument()
        expect(screen.getByText(/錢包餘額/i)).toBeInTheDocument()
        expect(screen.getByText(/卡片管理/i)).toBeInTheDocument()
        expect(screen.getByText(/刷卡明細/i)).toBeInTheDocument()
        expect(screen.getByText(/推廣報表/i)).toBeInTheDocument()
    })

    it("should successfully logout and navigate to login page", async () => {
        const user = userEvent.setup()

        vi.mocked(authService.logout).mockResolvedValueOnce({
            success: true,
            message: "登出成功",
        })

        renderWithApp({ initialRoute: "/dashboard" })

        const logoutButton = screen.getByRole("button", { name: /登出/i })
        expect(logoutButton).toBeInTheDocument()

        await user.click(logoutButton)

        // 驗證 authService.logout 被呼叫
        await waitFor(() => {
            expect(authService.logout).toHaveBeenCalledTimes(1)
        })

        // 驗證導向到登入頁
        await waitFor(() => {
            expect(window.location.pathname).toBe("/login")
        })
    })

    it("should handle logout error and show alert", async () => {
        const user = userEvent.setup()
        const alertSpy = vi.spyOn(window, "alert").mockImplementation(() => {})
        const consoleErrorSpy = vi
            .spyOn(console, "error")
            .mockImplementation(() => {})

        vi.mocked(authService.logout).mockRejectedValueOnce(
            new Error("Network error")
        )

        renderWithApp({ initialRoute: "/dashboard" })

        const logoutButton = screen.getByRole("button", { name: /登出/i })
        await user.click(logoutButton)

        // 驗證 authService.logout 被呼叫
        await waitFor(() => {
            expect(authService.logout).toHaveBeenCalledTimes(1)
        })

        // 驗證錯誤處理
        await waitFor(() => {
            expect(consoleErrorSpy).toHaveBeenCalledWith(
                "登出失敗:",
                expect.any(Error)
            )
            expect(alertSpy).toHaveBeenCalledWith("登出失敗,請稍後再試")
        })

        // 驗證按鈕恢復正常狀態
        await waitFor(() => {
            expect(screen.getByText(/登出/i)).toBeInTheDocument()
            expect(logoutButton).not.toBeDisabled()
        })

        alertSpy.mockRestore()
        consoleErrorSpy.mockRestore()
    })

    it("should disable logout button while logging out", async () => {
        const user = userEvent.setup()

        // 模擬一個需要時間的登出操作
        vi.mocked(authService.logout).mockImplementation(
            () =>
                new Promise((resolve) =>
                    setTimeout(
                        () => resolve({ success: true, message: "登出成功" }),
                        100
                    )
                )
        )

        renderWithApp({ initialRoute: "/dashboard" })

        const logoutButton = screen.getByRole("button", { name: /登出/i })
        expect(logoutButton).not.toBeDisabled()

        await user.click(logoutButton)

        // 驗證按鈕在登出過程中被禁用
        await waitFor(() => {
            expect(logoutButton).toBeDisabled()
            expect(screen.getByText(/登出中.../i)).toBeInTheDocument()
        })
    })
})
