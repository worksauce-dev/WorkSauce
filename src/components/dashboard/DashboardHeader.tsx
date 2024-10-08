interface DashboardHeaderProps {
  name: string;
}
export default function DashboardHeader({ name }: DashboardHeaderProps) {
  return (
    <div className="flex items-center justify-between bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-4 shadow-lg">
      <div className="flex flex-col">
        <h1 className="text-lg font-medium md:text-2xl md:font-semibold text-white">
          {name}님의 대시보드
        </h1>
      </div>

      <div className="flex items-center gap-4">
        <div className="bg-white bg-opacity-20 rounded-full p-3">
          <svg
            className="w-5 h-5 md:w-6 md:h-6 text-white"
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
        <div className="text-right">
          <p className="text-lg md:text-2xl font-bold text-white">95</p>
          <p className="text-sm md:text-lg text-blue-100">활성 워크소스</p>
        </div>
      </div>
    </div>
  );
}
