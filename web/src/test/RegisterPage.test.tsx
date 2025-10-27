import { beforeEach, describe, expect, it, vi } from "vitest"
import { screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { authService } from "@/services/auth.ts"
import { renderWithApp } from "@/test/TestUtils.tsx"

vi.mock("@/services/auth", () => ({
    authService: {
        register: vi.fn(),
    },
}))

describe("RegisterPage", () => {

    beforeEach(() => {
        vi.clearAllMocks()
    })

    it("should successfully register and navigate to login page", async () => {
        const user = userEvent.setup()

        vi.mocked(authService.register).mockResolvedValueOnce({
            success: true,
            message: "註冊成功",
        })

        renderWithApp({ initialRoute: "/register" })

        const nameInput = screen.getByLabelText(/姓名/i)
        const emailInput = screen.getByLabelText(/email/i)
        const passwordInput = screen.getByLabelText(/^密碼$/i)
        const confirmPasswordInput = screen.getByLabelText(/確認密碼/i)
        const submitButton = screen.getByRole("button", { name: /註冊/i })

        await user.type(nameInput, "Test User")
        await user.type(emailInput, "test@example.com")
        await user.type(passwordInput, "password123")
        await user.type(confirmPasswordInput, "password123")
        await user.click(submitButton)

        await waitFor(() => {
            expect(authService.register).toHaveBeenCalledWith(
                {
                    full_name: "Test User",
                    email: "test@example.com",
                    password: "password123",
                },
                expect.anything() // React Query 會傳遞額外的參數
            )
        })

        await waitFor(() => {
            expect(window.location.pathname).toBe("/login")
        })
    })

    it("should show validation error when passwords do not match", async () => {
        const user = userEvent.setup()

        renderWithApp({ initialRoute: "/register" })

        const nameInput = screen.getByLabelText(/姓名/i)
        const emailInput = screen.getByLabelText(/email/i)
        const passwordInput = screen.getByLabelText(/^密碼$/i)
        const confirmPasswordInput = screen.getByLabelText(/確認密碼/i)
        const submitButton = screen.getByRole("button", { name: /註冊/i })

        await user.type(nameInput, "Test User")
        await user.type(emailInput, "test@example.com")
        await user.type(passwordInput, "password123")
        await user.type(confirmPasswordInput, "differentpassword")
        await user.click(submitButton)

        await waitFor(() => {
            expect(screen.getByText("密碼與確認密碼不一致")).toBeInTheDocument()
        })

        expect(authService.register).not.toHaveBeenCalled()
    })

    it("should show error message when registration fails", async () => {
        const user = userEvent.setup()

        vi.mocked(authService.register).mockResolvedValueOnce({
            success: false,
            message: "Email 已被使用",
        })

        renderWithApp({ initialRoute: "/register" })

        const nameInput = screen.getByLabelText(/姓名/i)
        const emailInput = screen.getByLabelText(/email/i)
        const passwordInput = screen.getByLabelText(/^密碼$/i)
        const confirmPasswordInput = screen.getByLabelText(/確認密碼/i)
        const submitButton = screen.getByRole("button", { name: /註冊/i })

        await user.type(nameInput, "Test User")
        await user.type(emailInput, "existing@example.com")
        await user.type(passwordInput, "password123")
        await user.type(confirmPasswordInput, "password123")
        await user.click(submitButton)

        await waitFor(() => {
            expect(screen.getByText("Email 已被使用")).toBeInTheDocument()
        })
    })

    it("should show error message when API throws error", async () => {
        const user = userEvent.setup()

        vi.mocked(authService.register).mockRejectedValueOnce(
            new Error("網路錯誤")
        )

        renderWithApp({ initialRoute: "/register" })

        const nameInput = screen.getByLabelText(/姓名/i)
        const emailInput = screen.getByLabelText(/email/i)
        const passwordInput = screen.getByLabelText(/^密碼$/i)
        const confirmPasswordInput = screen.getByLabelText(/確認密碼/i)
        const submitButton = screen.getByRole("button", { name: /註冊/i })

        await user.type(nameInput, "Test User")
        await user.type(emailInput, "test@example.com")
        await user.type(passwordInput, "password123")
        await user.type(confirmPasswordInput, "password123")
        await user.click(submitButton)

        await waitFor(() => {
            expect(screen.getByText("網路錯誤")).toBeInTheDocument()
        })
    })

    it("should disable submit button while registration is pending", async () => {
        const user = userEvent.setup()

        // 讓 API 延遲回應
        vi.mocked(authService.register).mockImplementation(
            () => new Promise((resolve) => setTimeout(() => resolve({ success: true }), 1000))
        )

        renderWithApp({ initialRoute: "/register" })

        const nameInput = screen.getByLabelText(/姓名/i)
        const emailInput = screen.getByLabelText(/email/i)
        const passwordInput = screen.getByLabelText(/^密碼$/i)
        const confirmPasswordInput = screen.getByLabelText(/確認密碼/i)
        const submitButton = screen.getByRole("button", { name: /註冊/i })

        await user.type(nameInput, "Test User")
        await user.type(emailInput, "test@example.com")
        await user.type(passwordInput, "password123")
        await user.type(confirmPasswordInput, "password123")
        await user.click(submitButton)

        await waitFor(() => {
            expect(screen.getByRole("button", { name: /註冊中.../i })).toBeDisabled()
        })
    })
})
