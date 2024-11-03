"use client";

import { useState } from "react";
import { User } from "@/types/user";
import { sendEmail } from "@/utils/sendEmail";
import { createGroup } from "@/api/firebase/createGroup";

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
  const [phoneError, setPhoneError] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [agreeEmail, setAgreeEmail] = useState(false);
  const [email, setEmail] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [businessNumber, setBusinessNumber] = useState("");
  const [representativeName, setRepresentativeName] = useState("");
  const [address, setAddress] = useState("");

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

  const handleNextStep = () => {
    if (step === 3 && userType === "individual") {
      handleSubmit();
    } else {
      setStep(step + 1);
    }
  };

  const handlePreviousStep = () => {
    setStep(step - 1);
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }

    let newGroupId = "";

    if (agreeEmail) {
      try {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const formattedDeadline = tomorrow.toISOString().split("T")[0];

        newGroupId = await createGroup(
          {
            name: `${user.name}님의 가입을 환영합니다`,
            deadline: formattedDeadline,
            keywords: ["기준윤리형", "이해관리형", "소통도움형"],
            applicants: [
              {
                name: user.name,
                email: user.email,
                groupId: "", // 서버에서 생성될 예정
                testStatus: "pending",
                completedAt: null, // 빈 문자열 대신 null 사용
                testResult: [],
                groupName: `${user.name}님의 가입을 환영합니다`,
              },
            ],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            createdBy: { id: user.id, name: user.name },
            updatedBy: { id: user.id, name: user.name },
            groupId: "",
          },
          user.id
        );

        const success = await sendEmail({
          to: email,
          subject: "워크소스 테스트를 시작해주세요!",
          userName: user.name,
          companyName: companyName,
          deadline: formattedDeadline,
          groupId: newGroupId,
        });

        if (success) {
          alert("이메일이 성공적으로 전송되었습니다!");
        } else {
          alert("이메일 전송에 실패했습니다. 다시 시도해주세요.");
        }
      } catch (error) {
        console.error("Error sending email:", error);
      }
    }

    try {
      await saveUserData(user.id, {
        userType,
        phoneNumber,
        plan: "free",
        companyName,
        agreeTerms,
        email,
        isFirstLogin: false,
        groups: newGroupId ? [newGroupId] : [],
        businessNumber,
        representativeName,
        address,
      });
    } catch (error) {
      console.error("Error saving user data:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
        <h1 className="text-3xl font-bold text-center mb-6 text-indigo-700">
          환영합니다, {user.name}님!
        </h1>
        <p className="text-center text-gray-600 mb-4">
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
                type="text"
                value={companyName}
                onChange={e => setCompanyName(e.target.value)}
                placeholder="회사명 또는 그룹명"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <div className="space-y-2">
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={handlePhoneChange}
                  placeholder="전화번호"
                  className={`w-full px-3 py-2 border ${
                    phoneError ? "border-red-500" : "border-gray-300"
                  } rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500`}
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
              <h2 className="text-lg font-semibold text-indigo-600 flex items-center justify-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                기업 정보를 입력해주세요. <br /> 해당 정보로 세금 계산서가
                발행됩니다.
              </h2>
              <input
                type="text"
                value={companyName}
                onChange={e => setCompanyName(e.target.value)}
                placeholder="상호명"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <input
                type="text"
                value={businessNumber}
                onChange={e => setBusinessNumber(e.target.value)}
                placeholder="사업자 등록 번호"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <input
                type="text"
                value={representativeName}
                onChange={e => setRepresentativeName(e.target.value)}
                placeholder="대표자 성명"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <input
                type="text"
                value={address}
                onChange={e => setAddress(e.target.value)}
                placeholder="주소"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          )}

          <div
            className={`flex ${step === 1 ? "justify-end" : "justify-between"}`}
          >
            {step > 1 && (
              <button
                type="button"
                onClick={handlePreviousStep}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
              >
                이전
              </button>
            )}
            {step < 4 ? (
              <button
                type="button"
                onClick={handleNextStep}
                disabled={step === 1 && !agreeTerms}
                className={`px-4 py-2 ${
                  step === 1 && !agreeTerms
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-indigo-600 hover:bg-indigo-700"
                } text-white rounded-md`}
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
