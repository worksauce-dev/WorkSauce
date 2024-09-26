export default function DashboardContent() {
  return (
    <>
      <div className="flex flex-col gap-4 md:gap-8 bg-white p-4 md:p-8 rounded-lg w-full lg:w-3/5 shadow-md overflow-y-scroll max-h-[425px]">
        <h1 className="text-lg md:text-2xl font-bold text-gray-800">
          최근 워크소스 현황
        </h1>
        <ul className="flex flex-col gap-4">
          <li className="border-b border-gray-200 pb-4 hover:bg-gray-50 transition rounded-lg p-4">
            <div className="flex justify-between items-center">
              <div className="flex flex-col gap-2">
                <h1 className="text-sm md:text-lg font-semibold text-gray-800 hover:text-blue-600 transition-colors duration-300">
                  2024년 8월 기획부서 채용
                </h1>
                <div className="flex items-center gap-2">
                  <span className="bg-blue-100 text-blue-800 text-xs md:text-sm font-medium p-1 md:px-2.5 md:py-0.5 rounded-full">
                    지원자 10명
                  </span>
                  <span className="text-xs md:text-sm text-gray-500">
                    마감일: 2024-09-01
                  </span>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <div className="flex items-center">
                  <svg
                    className="w-4 h-4 text-green-500 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                  <span className="text-xs md:text-sm font-medium text-green-600">
                    완료한 지원자: 8명
                  </span>
                </div>
                <div className="w-16 md:w-32 bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-blue-600 h-2.5 rounded-full"
                    style={{ width: "80%" }}
                  ></div>
                </div>
              </div>
            </div>
          </li>
          <li className="border-b border-gray-200 pb-4 hover:bg-gray-50 transition rounded-lg p-4">
            <div className="flex justify-between items-center">
              <div className="flex flex-col gap-2">
                <h1 className="text-sm md:text-lg font-semibold text-gray-800 hover:text-blue-600 transition-colors duration-300">
                  2024년 8월 기획부서 채용
                </h1>
                <div className="flex items-center gap-2">
                  <span className="bg-blue-100 text-blue-800 text-xs md:text-sm font-medium p-1 md:px-2.5 md:py-0.5 rounded-full">
                    지원자 10명
                  </span>
                  <span className="text-xs md:text-sm text-gray-500">
                    마감일: 2024-09-01
                  </span>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <div className="flex items-center">
                  <svg
                    className="w-4 h-4 text-green-500 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                  <span className="text-xs md:text-sm font-medium text-green-600">
                    완료한 지원자: 8명
                  </span>
                </div>
                <div className="w-16 md:w-32 bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-blue-600 h-2.5 rounded-full"
                    style={{ width: "80%" }}
                  ></div>
                </div>
              </div>
            </div>
          </li>
          <li className="border-b border-gray-200 pb-4 hover:bg-gray-50 transition rounded-lg p-4">
            <div className="flex justify-between items-center">
              <div className="flex flex-col gap-2">
                <h1 className="text-sm md:text-lg font-semibold text-gray-800 hover:text-blue-600 transition-colors duration-300">
                  2024년 8월 기획부서 채용
                </h1>
                <div className="flex items-center gap-2">
                  <span className="bg-blue-100 text-blue-800 text-xs md:text-sm font-medium p-1 md:px-2.5 md:py-0.5 rounded-full">
                    지원자 10명
                  </span>
                  <span className="text-xs md:text-sm text-gray-500">
                    마감일: 2024-09-01
                  </span>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <div className="flex items-center">
                  <svg
                    className="w-4 h-4 text-green-500 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                  <span className="text-xs md:text-sm font-medium text-green-600">
                    완료한 지원자: 8명
                  </span>
                </div>
                <div className="w-16 md:w-32 bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-blue-600 h-2.5 rounded-full"
                    style={{ width: "80%" }}
                  ></div>
                </div>
              </div>
            </div>
          </li>
        </ul>
      </div>
      <div className="flex flex-col gap-4 md:gap-8 bg-white p-4 md:p-8 rounded-lg w-full lg:w-2/5 shadow-md overflow-y-scroll max-h-[425px]">
        <h1 className="text-lg md:text-2xl font-bold text-gray-800">
          공지사항
        </h1>
        <div className="space-y-4">
          <div className="bg-blue-50 rounded-lg p-4 transition-all duration-300 hover:shadow-md">
            <div className="flex items-center gap-3 mb-2">
              <svg
                className="w-5 h-5 text-blue-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
              <h6 className="text-sm md:text-lg font-semibold text-blue-700">
                시스템 업데이트 일정
              </h6>
            </div>
            <p className="text-xs md:text-sm text-blue-600">
              2024년 10월 01일 오전 2시부터 6시까지 시스템 점검이 있을
              예정입니다
            </p>
          </div>
          <div className="bg-green-50 rounded-lg p-4 transition-all duration-300 hover:shadow-md">
            <div className="flex items-center gap-3 mb-2">
              <svg
                className="w-5 h-5 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
              <h6 className="text-sm md:text-lg font-semibold text-green-700">
                신규 기능 출시
              </h6>
            </div>
            <p className="text-xs md:text-sm text-green-600">
              새로운 분석 도구가 추가되었습니다. 지금 바로 확인해보세요!
            </p>
          </div>
          <div className="bg-yellow-50 rounded-lg p-4 transition-all duration-300 hover:shadow-md">
            <div className="flex items-center gap-3 mb-2">
              <svg
                className="w-5 h-5 text-yellow-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                ></path>
              </svg>
              <h6 className="text-sm md:text-lg font-semibold text-yellow-700">
                중요 공지
              </h6>
            </div>
            <p className="text-xs md:text-sm text-yellow-600">
              다음 주 화요일에 전체 회의가 예정되어 있습니다. 참석 바랍니다.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
