"use client";

export function InfoSection() {
  return (
    <div className="bg-white rounded-[20px] p-8 mb-6 shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-[#FF5858]">
        당신의 일하는 방식을 소스로 표현한다면?
      </h2>

      <p className="mb-6">
        음식에 맛과 개성을 더하는 소스처럼, 사람마다 일하는 방식에도 특별한
        &apos;소스&apos;가 있습니다. 당신만의 워크 소스는 어떤 맛과 특성을
        가지고 있을까요?
      </p>

      <div className="flex flex-wrap justify-center gap-4 my-6">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#FF5858] to-[#FF3131] shadow-lg hover:scale-110 transition-transform duration-300" />
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#FFB347] to-[#FFCC33] shadow-lg hover:scale-110 transition-transform duration-300" />
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#AAFF00] to-[#7CFC00] shadow-lg hover:scale-110 transition-transform duration-300" />
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#8A2BE2] to-[#9370DB] shadow-lg hover:scale-110 transition-transform duration-300" />
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#00BFFF] to-[#1E90FF] shadow-lg hover:scale-110 transition-transform duration-300" />
      </div>

      <p>
        5분 안에 완료되는 간단한 질문에 답하고, 당신만의 워크 소스를 발견하세요.
        친구들과 공유하고 서로의 일하는 방식을 비교해보세요!
      </p>
    </div>
  );
}
