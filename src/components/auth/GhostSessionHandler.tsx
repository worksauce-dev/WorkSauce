"use client";

import { useEffect, useState } from "react";
import { signOut } from "next-auth/react";
import { MdWarning } from "react-icons/md";

export function GhostSessionHandler() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // 3초 후에 로그아웃 실행
    const timer = setTimeout(() => {
      setIsVisible(false);
      signOut({ callbackUrl: "/" });
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full space-y-6 text-center">
        <div className="flex flex-col items-center gap-4">
          <div className="bg-orange-100 p-3 rounded-full">
            <MdWarning className="w-8 h-8 text-orange-500" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900">
            세션이 만료되었습니다
          </h2>
          <p className="text-gray-500">
            자동으로 로그아웃 처리 중입니다. 잠시만 기다려주세요.
          </p>
          <div className="mt-4">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-orange-500" />
          </div>
        </div>
      </div>
    </div>
  );
}
