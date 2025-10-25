import { render } from "@testing-library/react"
import App from "@/App"

/**
 * 自定義的 render 函數，包含完整的應用程式架構
 */
export function renderWithApp(options: { initialRoute: string }) {
    const { initialRoute } = options;

    // 設定初始路由
    window.history.pushState({}, "Test page", initialRoute)

    return render(<App />)
}

// 重新導出所有 testing-library 的工具
export * from "@testing-library/react"
