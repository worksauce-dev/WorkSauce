export default function DashboardTabs() {
  return (
    <div className="mb-8">
      <nav className="flex gap-1 border-b border-gray-200 justify-between md:justify-start">
        <button className="text-blue-600 border-b-2 border-blue-600 p-2 md:py-4 md:px-6 block hover:text-blue-600 focus:outline-none font-medium">
          대시보드
        </button>
        <button className="text-gray-600 p-2 md:py-4 md:px-6 block hover:text-blue-600 focus:outline-none font-medium transition">
          리포트 현황
        </button>
        <button className="text-gray-600 p-2 md:py-4 md:px-6 block hover:text-blue-600 focus:outline-none font-medium transition">
          유형보기
        </button>
        <button className="text-gray-600 p-2 md:py-4 md:px-6 block hover:text-blue-600 focus:outline-none font-medium transition">
          설정
        </button>
      </nav>
    </div>
  );
}
