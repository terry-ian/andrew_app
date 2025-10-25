import { beforeEach, describe, expect, it, vi } from "vitest"
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { BrowserRouter } from "react-router-dom"
import { authService } from "@/services/auth.ts"
import LoginPage from "@/pages/auth/LoginPage.tsx";
import { dummyUser } from "@/test/DummyUser.ts";

// Mock authService
vi.mock("@/services/auth", () => ({
    authService: {
        login: vi.fn(),
    },
}))

// Mock useNavigate
const mockNavigate = vi.fn()
vi.mock("react-router-dom", async () => {
    const actual = await vi.importActual("react-router-dom")
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    }
})

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

        render(
            <BrowserRouter>
                <LoginPage />
            </BrowserRouter>,
        )

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

        // Verify navigation to dashboard
        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith("/dashboard")
        })
    })
})
