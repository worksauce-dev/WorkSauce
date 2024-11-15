"use client";

import { FcGoogle } from "react-icons/fc";
import { RiKakaoTalkFill } from "react-icons/ri";
import { signIn } from "next-auth/react";
import { Logo } from "../common/Logo";

export const Login = () => {
  const handleLogin = async (provider: string) => {
    await signIn(provider, { callbackUrl: "/dashboard" });
  };

  return (
    <main className="min-h-screen bg-[#F7F7F9] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        {/* 로고나 타이틀 섹션 */}
        <div className="text-center flex flex-col items-center gap-2 mb-8">
          <Logo />
          <p className="text-gray-500">워크소스에 오신 것을 환영합니다</p>
        </div>

        {/* 로그인 카드 */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="space-y-4">
            {/* 카카오 로그인 */}
            <button
              onClick={() => handleLogin("kakao")}
              className="w-full flex items-center justify-center px-6 py-3 border border-gray-200 rounded-lg
                text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <RiKakaoTalkFill className="w-6 h-6 text-[#FFE300]" />
              <span className="ml-3 font-medium">카카오톡으로 계속하기</span>
            </button>

            {/* 구글 로그인 */}
            {/* <button
              onClick={() => handleLogin("google")}
              className="w-full flex items-center justify-center px-6 py-3 border border-gray-200 rounded-lg
                text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <FcGoogle className="w-5 h-5" />
              <span className="ml-3 font-medium">Google로 계속하기</span>
            </button> */}
          </div>

          {/* 부가 정보 */}
          <div className="mt-8 text-center text-sm text-gray-500">
            로그인함으로써
            <a
              href="/terms"
              className="text-primary-accent hover:text-primary-accent-hover ml-1"
            >
              이용약관
            </a>
            <span className="mx-1">및</span>
            <a
              href="/privacy"
              className="text-primary-accent hover:text-primary-accent-hover"
            >
              개인정보처리방침
            </a>
            에 동의하게 됩니다
          </div>
        </div>

        {/* 회원가입 링크 */}
        <div className="mt-6 text-center">
          <span className="text-gray-500">계정이 없으신가요?</span>
          <button
            onClick={() => handleLogin("kakao")}
            className="ml-2 text-primary-accent hover:text-primary-accent-hover font-medium"
          >
            카카오톡으로 회원가입
          </button>
        </div>
      </div>
    </main>
  );
};
