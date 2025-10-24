export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">👋 嗨，使用者！</h1>
        <p className="text-gray-600 mb-8">這是你的後台控制台範例頁。之後可把各功能導到這裡。</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="font-semibold text-lg mb-2">錢包餘額</h3>
            <p className="text-gray-600 text-sm">（之後接 DB）</p>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="font-semibold text-lg mb-2">卡片管理</h3>
            <p className="text-gray-600 text-sm">（之後接 API）</p>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="font-semibold text-lg mb-2">刷卡明細</h3>
            <p className="text-gray-600 text-sm">（之後做篩選）</p>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="font-semibold text-lg mb-2">推廣報表</h3>
            <p className="text-gray-600 text-sm">（之後串漏斗）</p>
          </div>
        </div>

        <p className="text-center mt-8">
          <a href="/logout" className="text-blue-600 hover:underline">
            登出
          </a>
        </p>
      </div>
    </div>
  )
}
