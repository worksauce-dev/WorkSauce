"use client";

import { useState } from "react";
import { User } from "@/types/user";
import { sendEmail } from "@/utils/sendEmail";

type UserType = "individual" | "corporate";

interface FirstLoginGreetingProps {
  user: User;
  saveUserData: (userId: string, data: any) => Promise<void>;
}

export default function FirstLoginGreeting({
  user,
  saveUserData,
}: FirstLoginGreetingProps) {
  const [step, setStep] = useState(1);
  const [userType, setUserType] = useState<UserType>("individual");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [plan, setPlan] = useState("free");
  const [companyInfo, setCompanyInfo] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [agreeEmail, setAgreeEmail] = useState(false);
  const [email, setEmail] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (agreeEmail) {
      const success = await sendEmail({
        to: email,
        subject: "워크소스 테스트를 시작해주세요!",
      });

      if (success) {
        alert("이메일이 성공적으로 전송되었습니다!");
      } else {
        alert("이메일 전송에 실패했습니다. 다시 시도해주세요.");
      }
    }

    try {
      await saveUserData(user.id, {
        userType,
        phoneNumber,
        plan,
        companyInfo,
        agreeTerms,
        email,
        isFirstLogin: false,
        groups: [],
      });
    } catch (error) {
      console.error("Error saving user data:", error);
    }
  };

  const handleNextStep = () => {
    if (step === 3 && userType === "individual") {
      setStep(5); // 개인 회원인 경우 기업 정보 입력 단계를 건너뜁니다.
    } else {
      setStep(step + 1);
    }
  };

  const handlePreviousStep = () => {
    if (step === 5 && userType === "individual") {
      setStep(3); // 개인 회원이 step 5에서 이전을 누르면 step 3으로 이동합니다.
    } else {
      setStep(step - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
        <h1 className="text-3xl font-bold text-center mb-6 text-indigo-700">
          환영합니다, {user.name}님!
        </h1>
        <p className="text-center text-gray-600 mb-8">
          서비스를 시작하기 전에 몇 가지 정보가 필요합니다.
        </p>

        <div className="space-y-6">
          {step === 1 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-indigo-600">
                이용약관 동의
              </h2>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={e => setAgreeTerms(e.target.checked)}
                  className=" h-5 w-5 text-indigo-600 "
                />
                <a
                  href="policies/terms-and-conditions"
                  className="text-gray-700 hover:text-indigo-600"
                >
                  이용약관 및 개인정보처리방침에 동의합니다
                </a>
              </label>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-indigo-600 text-center">
                회원 유형을 선택해주세요
              </h2>
              <div className="flex justify-center space-x-4">
                <button
                  type="button"
                  onClick={() => setUserType("individual")}
                  className={`px-4 py-2 rounded-full ${
                    userType === "individual"
                      ? "bg-indigo-600 text-white"
                      : "bg-gray-200 text-gray-700"
                  }`}
                >
                  개인 회원
                </button>
                <button
                  type="button"
                  onClick={() => setUserType("corporate")}
                  className={`px-4 py-2 rounded-full ${
                    userType === "corporate"
                      ? "bg-indigo-600 text-white"
                      : "bg-gray-200 text-gray-700"
                  }`}
                >
                  기업 회원
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-indigo-600">
                연락처를 입력해주세요
              </h2>
              <input
                type="tel"
                value={phoneNumber}
                onChange={e => setPhoneNumber(e.target.value)}
                placeholder="전화번호"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="이메일"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <div className="space-y-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={agreeEmail}
                    onChange={e => setAgreeEmail(e.target.checked)}
                    className="form-checkbox h-5 w-5 text-indigo-600"
                  />
                  <span className="text-gray-700">
                    위 이메일로 소스테스트를 받아보시겠어요?
                  </span>
                </label>
              </div>
            </div>
          )}

          {step === 4 && userType === "corporate" && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-indigo-600">
                기업 정보를 입력해주세요
              </h2>
              <textarea
                value={companyInfo}
                onChange={e => setCompanyInfo(e.target.value)}
                placeholder="기업명, 사업자등록번호 등"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                rows={4}
              />
            </div>
          )}

          {step === 5 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-indigo-600">
                플랜을 선택해주세요
              </h2>
              <select
                value={plan}
                onChange={e => setPlan(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="free">무료 플랜</option>
                <option value="basic">기본 플랜</option>
                <option value="premium">프리미엄 플랜</option>
              </select>
            </div>
          )}

          <div
            className={`flex ${step === 1 ? "justify-end" : "justify-between"}`}
          >
            {step > 1 && (
              <button
                type="button"
                onClick={handlePreviousStep} // 여기를 수정했습니다
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
              >
                이전
              </button>
            )}
            {step < 5 ? (
              <button
                type="button"
                onClick={handleNextStep}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              >
                다음
              </button>
            ) : (
              <button
                type="submit"
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                onClick={handleSubmit}
              >
                완료
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
