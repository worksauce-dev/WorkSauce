"use client";

import Link from "next/link";
import errorAnimation from "../../../public/404.json";
import Lottie from "react-lottie-player";

interface ErrorPageProps {
  title: string;
  message: string;
  showHomeButton?: boolean;
}

export const ErrorPage = ({
  title,
  message,
  showHomeButton = true,
}: ErrorPageProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50 w-full">
      <div className="w-full max-w-lg text-center">
        {/* 에러 아이콘 */}
        <div className="mb-10">
          <Lottie
            animationData={errorAnimation}
            loop
            play
            style={{
              width: "100%",
              maxWidth: "400px",
              height: "300px",
              margin: "0 auto",
            }}
          />
        </div>

        {/* 에러 내용 */}
        <div className="space-y-4">
          <h1 className="text-3xl font-bold text-gray-800">{title}</h1>
          <p className="text-lg text-gray-600 max-w-md mx-auto">{message}</p>

          {/* 홈으로 돌아가기 버튼 */}
          {showHomeButton && (
            <Link
              href="/"
              className="mt-8 inline-flex items-center px-8 py-3 rounded-lg font-semibold text-white bg-blue-600 hover:bg-blue-700 transform transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              홈으로 돌아가기
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};
