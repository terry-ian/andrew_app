import { beforeEach, describe, expect, it, vi } from "vitest"
import { screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { authService } from "@/services/auth.ts"
import { dummyUser } from "@/test/DummyUser.ts"
import { renderWithApp } from "@/test/TestUtils.tsx"

// Mock authService
vi.mock("@/services/auth", () => ({
    authService: {
        login: vi.fn(),
    },
}))

describe("LoginPage", () => {

    beforeEach(() => {
        vi.clearAllMocks()
    })

    it("should successfully login and navigate to dashboard", async () => {
        const user = userEvent.setup()

        // Mock successful login response
        vi.mocked(authService.login).mockResolvedValueOnce({
            success: true,
            user: dummyUser({
                id: 1,
                email: "test@example.com",
                full_name: "Test User",
            }),
        })

        // 使用完整的應用程式架構進行渲染，初始路由為 /login
        renderWithApp({ initialRoute: "/login" })

        // Fill in the form
        const emailInput = screen.getByLabelText(/email/i)
        const passwordInput = screen.getByLabelText(/密碼/i)
        const submitButton = screen.getByRole("button", { name: /登入/i })

        await user.type(emailInput, "test@example.com")
        await user.type(passwordInput, "password123")
        await user.click(submitButton)

        // Wait for login to complete
        await waitFor(() => {
            expect(authService.login).toHaveBeenCalledWith({
                email: "test@example.com",
                password: "password123",
            })
        })

        // Verify navigation to dashboard - 檢查是否導航到 dashboard 頁面
        await waitFor(() => {
            // 當導航成功時，URL 應該變更為 /dashboard
            expect(window.location.pathname).toBe("/dashboard")
        })
    })
})
