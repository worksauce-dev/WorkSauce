"use client";

import { useState } from "react";
import { User } from "@/types/user";
import {
  MdInfoOutline,
  MdChevronRight,
  MdCheckCircle,
  MdOutlineRefresh,
} from "react-icons/md";

interface FirstLoginGreetingProps {
  user: User;
  saveUserData: (userId: string, data: any) => Promise<void>;
}

export default function FirstLoginGreeting({
  user,
  saveUserData,
}: FirstLoginGreetingProps) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [email, setEmail] = useState("");
  const [dashboardName, setDashboardName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const validatePhoneNumber = (phone: string) => {
    const phoneRegex = /^01[0|1|6|7|8|9][0-9]{7,8}$/;
    return phoneRegex.test(phone);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    setPhoneNumber(value);

    if (value && !validatePhoneNumber(value)) {
      setPhoneError("올바른 전화번호 형식이 아닙니다 (예: 010 1234 5678)");
    } else {
      setPhoneError("");
    }
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }

    setIsLoading(true);

    try {
      await saveUserData(user.id, {
        userType: "individual",
        phoneNumber,
        dashboardName: dashboardName,
        agreeTerms,
        email,
        isFirstLogin: false,
        groups: [],
        businessNumber: "",
        representativeName: "",
        address: "",
        status: "active",
        isAdmin: false,
        provider: user.provider,
        lastLoginAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      setIsComplete(true);
      setTimeout(() => {
        setIsComplete(false);
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error("Error:", error);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F7F9] flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            환영합니다, {user.name}님!
          </h1>
          <p className="text-gray-500">
            서비스를 시작하기 전에 몇 가지 정보가 필요합니다.
          </p>
        </div>

        <div className="space-y-6">
          <div className="space-y-4">
            <div className="bg-secondary-blue border border-primary-blue/20 rounded-lg p-4 mb-6">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <MdInfoOutline className="h-5 w-5 text-primary-blue mt-0.5" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-primary-blue">
                    기업 회원 안내
                  </h3>
                  <div className="mt-1 text-sm text-gray-700">
                    회원가입 후 필요시 기업 회원으로 전환이 가능합니다.
                    <a
                      href={
                        process.env.NEXT_PUBLIC_DOCUMENTATION_URL ||
                        "https://worksauce.gitbook.io/infomation/service/terms-and-conditions"
                      }
                      className="inline-flex items-center ml-1 text-primary-blue hover:text-primary-blue/80 font-medium"
                      target="_blank"
                    >
                      자세히 보기
                      <MdChevronRight className="w-4 h-4 ml-1" />
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <h2 className="text-lg font-semibold text-gray-900">
              필수 정보를 입력해주세요
            </h2>
            <div className="space-y-4">
              <input
                type="text"
                value={dashboardName}
                onChange={e => setDashboardName(e.target.value)}
                placeholder="소속명"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
              <div className="space-y-2">
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={handlePhoneChange}
                  placeholder="전화번호"
                  className={`w-full px-4 py-3 rounded-lg border ${
                    phoneError ? "border-red-500" : "border-gray-300"
                  } focus:ring-2 focus:ring-orange-500 focus:border-transparent`}
                />
                {phoneError && (
                  <p className="text-red-500 text-sm">{phoneError}</p>
                )}
              </div>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="이메일"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />

              <label className="flex items-center space-x-3 p-4 rounded-lg bg-orange-50 hover:bg-orange-100 transition-colors cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={e => setAgreeTerms(e.target.checked)}
                  className="w-5 h-5 text-orange-500 rounded border-gray-300 focus:ring-orange-500"
                />
                <a
                  href={
                    process.env.NEXT_PUBLIC_TERMS_AND_CONDITIONS_URL ||
                    "https://worksauce.gitbook.io/infomation/service/terms-and-conditions"
                  }
                  className="text-gray-700 hover:text-orange-500"
                  target="_blank"
                >
                  이용약관 및 개인정보처리방침에 동의합니다
                </a>
              </label>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              onClick={handleSubmit}
              disabled={!agreeTerms || isLoading || isComplete}
              className={`px-6 py-3 rounded-lg transition-colors flex items-center justify-center space-x-2
                ${
                  isComplete
                    ? "bg-green-500"
                    : isLoading
                    ? "bg-orange-400 cursor-not-allowed"
                    : !agreeTerms
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-[#F97316] hover:bg-orange-600"
                } text-white`}
            >
              {isComplete ? (
                <>
                  <MdCheckCircle className="h-5 w-5" />
                  <span>완료</span>
                </>
              ) : isLoading ? (
                <>
                  <MdOutlineRefresh className="h-5 w-5 animate-spin" />
                  <span>처리중...</span>
                </>
              ) : (
                <span>시작하기</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
