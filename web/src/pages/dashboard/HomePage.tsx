export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-2 text-3xl font-bold">👋 嗨，使用者！</h1>
        <p className="mb-8 text-gray-600">
          這是你的後台控制台範例頁。之後可把各功能導到這裡。
        </p>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <h3 className="mb-2 text-lg font-semibold">錢包餘額</h3>
            <p className="text-sm text-gray-600">（之後接 DB）</p>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <h3 className="mb-2 text-lg font-semibold">卡片管理</h3>
            <p className="text-sm text-gray-600">（之後接 API）</p>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <h3 className="mb-2 text-lg font-semibold">刷卡明細</h3>
            <p className="text-sm text-gray-600">（之後做篩選）</p>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <h3 className="mb-2 text-lg font-semibold">推廣報表</h3>
            <p className="text-sm text-gray-600">（之後串漏斗）</p>
          </div>
        </div>

        <p className="mt-8 text-center">
          <a href="/logout" className="text-blue-600 hover:underline">
            登出
          </a>
        </p>
      </div>
    </div>
  )
}
