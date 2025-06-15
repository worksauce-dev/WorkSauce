"use client";

interface IntroSectionProps {
  onStart: () => void;
}

export function IntroSection({ onStart }: IntroSectionProps) {
  return (
    <div className="text-center py-10 px-6 bg-gradient-to-br from-[#FF9A3C] to-[#FF5858] rounded-[20px] text-white mb-8 shadow-lg relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(255,255,255,0.2)_10%,transparent_10.5%)] bg-[length:20px_20px] opacity-30 rotate-[30deg] -translate-x-1/2 -translate-y-1/2" />

      <h1 className="text-4xl font-extrabold mb-4 text-shadow">
        당신의 워크 소스(Work Sauce)
      </h1>
      <p className="text-xl mb-6">
        당신만의 특별한 일하는 방식은 어떤 소스일까요?
      </p>

      <button
        onClick={onStart}
        className="bg-white text-[#FF5858] px-10 py-4 rounded-full text-xl font-bold shadow-lg hover:scale-105 transition-transform duration-300 animate-pulse"
      >
        나의 워크 소스 찾기
      </button>
    </div>
  );
}
