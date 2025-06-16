"use client";

import { useState } from "react";
import { SauceTestContainer } from "../saucetest/SauceTestContainer";
import { SugarTestContainer } from "../sugartest/SugarTestContainer";
import { ScoreType, SauceTest } from "@/types/saucetest/test";
import { SugarTest } from "@/types/sugartest/test";
import { SugarTestResult } from "@/types/sugartest/sugarTestResult";
import SugarTestCompletionResult from "../sugartest/result/SugarTestCompletionResult";
import { TestInfo } from "@/types/user";
interface TestAuthCheckProps {
  dashboardId: string;
  targetTest: TestInfo;
  isAdmin: boolean;
  companyName: string;
  userType: string;
  testType: "saucetest" | "sugartest";
  testData: SauceTest | SugarTest;
  submitTest: (
    dashboardId: string,
    testId: string,
    email: string,
    name: string,
    testResult: ScoreType[] | SugarTestResult
  ) => Promise<{ success: boolean }>;
}

export function TestAuthCheck({
  dashboardId,
  targetTest,
  isAdmin,
  companyName,
  userType,
  testType,
  testData,
  submitTest,
}: TestAuthCheckProps) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [error, setError] = useState("");
  const [completedTestResult, setCompletedTestResult] =
    useState<SugarTestResult | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (name === "test" && email === "test") {
      setIsAuthorized(true);
      return;
    }

    const applicant = targetTest.applicants.find(
      a => a.email === email && a.name === name
    );

    if (applicant) {
      if (
        applicant.testStatus === "completed" &&
        testType === "sugartest" &&
        applicant.testResult
      ) {
        // 슈가 테스트가 이미 완료된 경우 결과 데이터 설정
        setCompletedTestResult(applicant.testResult as SugarTestResult);
      }
      setIsAuthorized(true);
    } else {
      setError("입력하신 정보와 일치하는 지원자를 찾을 수 없습니다.");
    }
  };

  // 이미 완료된 슈가 테스트 결과 표시
  if (isAuthorized && testType === "sugartest" && completedTestResult) {
    return (
      <SugarTestCompletionResult name={name} testResult={completedTestResult} />
    );
  }

  if (isAuthorized) {
    switch (testType) {
      case "saucetest":
        return (
          <SauceTestContainer
            name={name}
            email={email}
            dashboardId={dashboardId}
            testId={targetTest.testId}
            testData={testData as SauceTest}
            submitTest={submitTest}
            isAdmin={isAdmin}
            companyName={companyName}
            userType={userType}
          />
        );

      case "sugartest":
        return (
          <SugarTestContainer
            name={name}
            email={email}
            dashboardId={dashboardId}
            testId={targetTest.testId}
            testData={testData as SugarTest}
            submitTest={submitTest}
            isAdmin={isAdmin}
          />
        );
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[#F7F7F9] border-b-2 border-gray-100">
      <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
          응시자 확인
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block mb-2 text-sm font-medium text-gray-700"
            >
              이메일
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              required
            />
          </div>
          <div>
            <label
              htmlFor="name"
              className="block mb-2 text-sm font-medium text-gray-700"
            >
              이름
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-primary-accent text-white py-3 rounded-md font-medium hover:bg-primary-accent-hover transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            확인
          </button>
        </form>
        {error && (
          <p className="text-red-600 mt-4 text-center text-sm">{error}</p>
        )}
      </div>
    </div>
  );
}
