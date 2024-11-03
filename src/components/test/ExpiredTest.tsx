"use client";

export const ExpiredTest = ({ deadline }: { deadline: string }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[100vh] px-4 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg text-center">
        <div className="mb-6">
          <svg
            className="mx-auto h-16 w-16 text-red-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          마감된 소스테스트입니다
        </h2>
        <p className="text-gray-600 mb-6">
          이 테스트의 제출 기한이 종료되었습니다.
          {deadline && (
            <span className="block mt-2 text-sm">
              마감일: {new Date(deadline).toLocaleDateString("ko-KR")}
            </span>
          )}
        </p>
      </div>
    </div>
  );
};
