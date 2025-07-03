"use client";

interface IntroSectionProps {
  onStart: () => void;
}

export function IntroSection({ onStart }: IntroSectionProps) {
  return (
    <div className="relative max-w-xl mx-auto bg-white rounded-2xl shadow-lg p-10 mt-8 text-center flex flex-col items-center overflow-hidden">
      {/* 컬러풀한 그라데이션 원/도형 배경 */}
      <div className="absolute -top-16 -left-16 w-40 h-40 bg-gradient-to-br from-pink-300 via-yellow-200 to-orange-300 rounded-full opacity-40 blur-2xl z-0" />
      <div className="absolute -bottom-20 -right-20 w-56 h-56 bg-gradient-to-br from-blue-200 via-green-200 to-yellow-200 rounded-full opacity-30 blur-2xl z-0" />
      <div className="relative z-10 w-full flex flex-col items-center">
        <div className="mb-6 flex flex-col items-center">
          <div className="w-16 h-16 flex items-center justify-center rounded-full bg-orange-100 text-orange-500 text-4xl mb-4 shadow-sm animate-bounce-slow">
            <span>🧭</span>
          </div>
          <h1 className="text-3xl font-extrabold mb-2 text-orange-600 tracking-tight flex items-center gap-2">
            <span>나만의</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-pink-500 to-yellow-400 animate-gradient-move">
              유형
            </span>
            <span>찾기</span>
            <span className="text-xl">🔮</span>
          </h1>
          <p className="text-lg text-gray-700 leading-relaxed">
            <span className="inline-block mr-1">🎲</span>조직에서의 나만의
            강점과 일 스타일,
            <br />
            <span className="font-bold text-orange-500">유형</span>으로
            알아보세요!
          </p>
        </div>
        <button
          onClick={onStart}
          className="w-full py-4 bg-gradient-to-r from-orange-500 via-pink-500 to-yellow-400 text-white rounded-xl font-bold text-lg shadow-md hover:scale-105 transition-transform mt-4 animate-pulse hover:animate-none"
        >
          <span className="mr-2">🚀</span> 지금 바로 시작하기
        </button>
        {/* InfoSection 스타일의 아이콘+설명 섹션 */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-6 sm:flex sm:flex-row sm:justify-center sm:items-center my-10 w-full max-w-xs sm:max-w-none mx-auto">
          <div className="flex flex-col items-center group">
            <div className="w-14 h-14 flex items-center justify-center rounded-full bg-orange-100 text-orange-500 text-2xl mb-2 shadow-sm group-hover:scale-110 group-hover:bg-orange-200 transition-transform duration-200">
              <span>💼</span>
            </div>
            <span className="text-xs text-gray-500 text-center leading-tight">
              업무 스타일
            </span>
          </div>
          <div className="flex flex-col items-center group">
            <div className="w-14 h-14 flex items-center justify-center rounded-full bg-blue-100 text-blue-500 text-2xl mb-2 shadow-sm group-hover:scale-110 group-hover:bg-blue-200 transition-transform duration-200">
              <span>🧩</span>
            </div>
            <span className="text-xs text-gray-500 text-center leading-tight">
              특징 발견
            </span>
          </div>
          <div className="flex flex-col items-center group">
            <div className="w-14 h-14 flex items-center justify-center rounded-full bg-green-100 text-green-500 text-2xl mb-2 shadow-sm group-hover:scale-110 group-hover:bg-green-200 transition-transform duration-200">
              <span>🤝</span>
            </div>
            <span className="text-xs text-gray-500 text-center leading-tight">
              팀워크
            </span>
          </div>
          <div className="flex flex-col items-center group">
            <div className="w-14 h-14 flex items-center justify-center rounded-full bg-yellow-100 text-yellow-500 text-2xl mb-2 shadow-sm group-hover:scale-110 group-hover:bg-yellow-200 transition-transform duration-200">
              <span>✨</span>
            </div>
            <span className="text-xs text-gray-500 text-center leading-tight">
              성장
            </span>
          </div>
        </div>
        <p className="text-base text-gray-600 text-center">
          <span className="inline-block mr-1">🧠</span>5분이면 충분해요! 간단한
          질문에 답하고 <b className="text-orange-500">나만의 유형</b>을
          확인하세요.
          <br />
          <span className="inline-block mr-1">👀</span>결과를 친구와 공유하고,
          서로의 <b>일 스타일</b>을 비교해보는 재미도 놓치지 마세요!
        </p>
      </div>
      <style jsx>{`
        .animate-bounce-slow {
          animation: bounce 2s infinite;
        }
        @keyframes bounce {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-12px);
          }
        }
        .animate-gradient-move {
          background-size: 200% 200%;
          animation: gradientMove 2.5s linear infinite;
        }
        @keyframes gradientMove {
          0% {
            background-position: 0% 50%;
          }
          100% {
            background-position: 100% 50%;
          }
        }
      `}</style>
    </div>
  );
}
