import { beforeEach, describe, expect, it, vi } from "vitest"
import { screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { authService } from "@/services/auth.ts"
import { dummyUser } from "@/test/DummyUser.ts"
import { renderWithApp } from "@/test/TestUtils.tsx"
import routeConfigs from "@/pages/routes/Routes.ts";

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

        vi.mocked(authService.login).mockResolvedValueOnce({
            success: true,
            data: dummyUser({
                id: 1,
                email: "test@example.com",
                full_name: "Test User",
            }),
        })

        renderWithApp({ initialRoute: "/login" })

        const emailInput = screen.getByLabelText(/email/i)
        const passwordInput = screen.getByLabelText(/密碼/i)
        const submitButton = screen.getByRole("button", { name: /登入/i })

        await user.type(emailInput, "test@example.com")
        await user.type(passwordInput, "password123")
        await user.click(submitButton)

        await waitFor(() => {
            expect(authService.login).toHaveBeenCalledWith(
                {
                    email: "test@example.com",
                    password: "password123",
                },
                expect.anything() // React Query 會傳遞額外的參數
            )
        })

        await waitFor(() => {
            expect(window.location.pathname).toBe(routeConfigs.DASHBOARD)
        })
    })
})
