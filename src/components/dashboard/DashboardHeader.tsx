interface DashboardHeaderProps {
  name: string;
}
export default function DashboardHeader({ name }: DashboardHeaderProps) {
  return (
    <div className="flex items-center justify-between rounded-xl p-6 shadow-sm border border-gray-100 bg-white">
      <div className="flex flex-col">
        <h1 className="text-xl font-semibold md:text-2xl text-gray-800">
          {name}님의 대시보드
        </h1>
      </div>

      <div className="flex items-center gap-4">
        <div className="bg-orange-50 rounded-full p-3">
          <svg
            className="w-5 h-5 md:w-6 md:h-6 text-orange-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M13 10V3L4 14h7v7l9-11h-7z"
            ></path>
          </svg>
        </div>
      </div>
    </div>
  );
}
