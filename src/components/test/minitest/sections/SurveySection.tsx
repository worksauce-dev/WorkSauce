"use client";

import { SurveyData } from "@/types/surveyData";
import { useState } from "react";
import { isValidEmail } from "@/utils/validation";

interface SurveySectionProps {
  onSubmit?: (data: SurveyData) => void;
  submitSurvey: (data: SurveyData) => Promise<{ success: boolean }>;
}

export function SurveySection({ onSubmit, submitSurvey }: SurveySectionProps) {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [ageRange, setAgeRange] = useState<string>("");
  const [q1, setQ1] = useState<number>(0);
  const [q2, setQ2] = useState<number>(0);
  const [q3, setQ3] = useState<number>(0);
  const [feedback, setFeedback] = useState<string>("");
  const [submitted, setSubmitted] = useState(false);
  const [emailError, setEmailError] = useState<string>("");
  const [agreed, setAgreed] = useState(false);

  const ageOptions = ["10대", "20대", "30대", "40대", "50대 이상"];

  const handleSubmit = async (e: React.FormEvent) => {
    try {
      e.preventDefault();
      if (!isValidEmail(email)) {
        setEmailError("올바른 이메일 형식을 입력해주세요.");
        return;
      }
      setEmailError("");
      setSubmitted(true);
      const data: SurveyData = {
        name,
        email,
        ageRange,
        q1,
        q2,
        q3,
        feedback,
        createdAt: new Date().toISOString(),
      };
      if (onSubmit) onSubmit(data);
      await submitSurvey(data);
    } catch (error) {
      console.error("Error submitting survey:", error);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto mt-10 bg-white/90 rounded-3xl shadow-2xl p-6 sm:p-8 flex flex-col items-center border border-orange-100">
      {submitted ? (
        <div className="flex flex-col items-center gap-2 text-center py-8">
          <span className="text-4xl mb-2">🎉</span>
          <div className="text-orange-600 font-bold text-lg">
            소중한 의견 감사합니다!
          </div>
          <div className="text-gray-500 text-sm">
            더 좋은 워크소스 테스트로 보답할게요 :)
          </div>
        </div>
      ) : (
        <div className="w-full flex flex-col items-center mb-4">
          <span className="text-3xl mb-1">📋✨</span>
          <h3 className="text-2xl font-extrabold mb-1 text-orange-600 tracking-tight">
            간단 설문조사
          </h3>
          <p className="text-sm text-gray-500 text-center mb-2">
            <span className="font-semibold text-orange-500">여러분의 의견</span>
            을 듣고 있어요! <span className="text-lg">🥰</span>
          </p>

          <form
            onSubmit={handleSubmit}
            className="w-full flex flex-col items-center gap-7"
          >
            {/* 이름 */}
            <div className="w-full">
              <label className="mb-1 font-semibold text-gray-800 flex items-center gap-1">
                <span className="text-xl">👤</span>이름
              </label>
              <input
                type="text"
                className="w-full border border-orange-200 rounded-xl p-3 mb-2 focus:outline-none focus:ring-2 focus:ring-orange-300 bg-orange-50/30 text-gray-700 placeholder:text-gray-400"
                placeholder="이름을 입력하세요"
                value={name}
                onChange={e => setName(e.target.value)}
                required
              />
            </div>
            {/* 이메일 */}
            <div className="w-full">
              <label className="mb-1 font-semibold text-gray-800 flex items-center gap-1">
                <span className="text-xl">📧</span>이메일
              </label>
              <input
                type="email"
                className="w-full border border-orange-200 rounded-xl p-3 mb-1 focus:outline-none focus:ring-2 focus:ring-orange-300 bg-orange-50/30 text-gray-700 placeholder:text-gray-400"
                placeholder="이메일을 입력하세요"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
              {emailError && (
                <div className="text-red-500 text-xs mb-1">{emailError}</div>
              )}
            </div>
            {/* 연령대 */}
            <div className="w-full">
              <label className="mb-1 font-semibold text-gray-800 flex items-center gap-1">
                <span className="text-xl">🎂</span>연령대
              </label>
              <select
                className="w-full border border-orange-200 rounded-xl p-3 mb-2 focus:outline-none focus:ring-2 focus:ring-orange-300 bg-orange-50/30 text-gray-700"
                value={ageRange}
                onChange={e => setAgeRange(e.target.value)}
                required
              >
                <option value="">연령대를 선택하세요</option>
                {ageOptions.map(opt => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
            {/* 개인정보 동의 체크박스 */}
            <div className="w-full mb-2 flex items-center">
              <input
                type="checkbox"
                id="privacy-agree"
                className="mr-2 accent-orange-500"
                checked={agreed}
                onChange={e => setAgreed(e.target.checked)}
                required
              />
              <label
                htmlFor="privacy-agree"
                className="text-xs text-gray-600 select-none cursor-pointer"
              >
                <span>
                  <a
                    href="https://worksauce.gitbook.io/infomation/service/privacy-policy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline text-orange-500 hover:text-orange-700"
                  >
                    개인정보 수집 및 이용
                  </a>
                  에 동의합니다.
                </span>
              </label>
            </div>
            {/* Q1 */}
            <div className="w-full">
              <label className="mb-2 font-semibold text-gray-800 flex items-center gap-1">
                <span className="text-sm sm:text-xl">🧑‍💼</span>위 결과가 나의
                일하는 모습이나 성향을 잘 반영한다고 느끼시나요?{" "}
              </label>
              <div className="flex justify-between items-end gap-2 sm:gap-3 flex-wrap">
                {[1, 2, 3, 4, 5].map(num => (
                  <div
                    key={num}
                    className="flex flex-col items-center flex-1 min-w-[48px] sm:min-w-[56px]"
                  >
                    <button
                      type="button"
                      onClick={() => setQ1(num)}
                      className={`w-9 h-9 rounded-full flex items-center justify-center font-bold border-2
                      ${
                        q1 === num
                          ? "bg-orange-500 text-white border-orange-500 shadow-md"
                          : "bg-white text-gray-400 border-gray-300 hover:border-orange-300"
                      }
                      transition`}
                      aria-label={`${num}점`}
                    >
                      {num}
                    </button>
                  </div>
                ))}
              </div>
            </div>
            {/* Q2 */}
            <div className="w-full">
              <label className="mb-2 font-semibold text-gray-800 flex items-center gap-1">
                <span className="text-sm sm:text-xl">🏢</span>
                만약 당신이 인사 담당자 또는 조직 관리자라면, 위 결과를
                조직관리나 신규 채용 시 참고 자료로 활용할 의향이 있으신가요?
              </label>
              <div className="flex justify-between items-end gap-2 sm:gap-3 flex-wrap">
                {[1, 2, 3, 4, 5].map(num => (
                  <div
                    key={num}
                    className="flex flex-col items-center flex-1 min-w-[48px] sm:min-w-[56px]"
                  >
                    <button
                      type="button"
                      onClick={() => setQ2(num)}
                      className={`w-9 h-9 rounded-full flex items-center justify-center font-bold border-2
                      ${
                        q2 === num
                          ? "bg-orange-500 text-white border-orange-500 shadow-md"
                          : "bg-white text-gray-400 border-gray-300 hover:border-orange-300"
                      }
                      transition`}
                      aria-label={`${num}점`}
                    >
                      {num}
                    </button>
                  </div>
                ))}
              </div>
            </div>
            {/* Q3 (조직구성원 관점 창작질문) */}
            <div className="w-full">
              <label className="mb-2 font-semibold text-gray-800 flex items-center gap-1">
                <span className="text-sm sm:text-xl">🤝</span>
                우리 조직 동료들이 이런 결과를 서로 공유한다면, 팀워크나 소통에
                도움이 될 것 같나요?
              </label>
              <div className="flex justify-between items-end gap-2 sm:gap-3 flex-wrap">
                {[1, 2, 3, 4, 5].map(num => (
                  <div
                    key={num}
                    className="flex flex-col items-center flex-1 min-w-[48px] sm:min-w-[56px]"
                  >
                    <button
                      type="button"
                      onClick={() => setQ3(num)}
                      className={`w-9 h-9 rounded-full flex items-center justify-center font-bold border-2
                      ${
                        q3 === num
                          ? "bg-orange-500 text-white border-orange-500 shadow-md"
                          : "bg-white text-gray-400 border-gray-300 hover:border-orange-300"
                      }
                      transition`}
                      aria-label={`${num}점`}
                    >
                      {num}
                    </button>
                  </div>
                ))}
              </div>
            </div>
            {/* 의견 */}
            <div className="w-full">
              <label className="mb-1 font-semibold text-gray-800 flex items-center gap-1">
                <span className="text-xl">💬</span>더 하고 싶은 말이 있다면
                자유롭게 남겨주세요!
              </label>
              <textarea
                className="w-full border border-orange-200 rounded-xl p-3 mb-2 resize-none focus:outline-none focus:ring-2 focus:ring-orange-300 bg-orange-50/30 text-gray-700 placeholder:text-gray-400"
                rows={3}
                placeholder="ex) 이런 점이 좋았어요! 이런 부분이 아쉬워요!"
                value={feedback}
                onChange={e => setFeedback(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-orange-400 to-orange-600 text-white rounded-2xl font-extrabold shadow-lg hover:scale-[1.03] hover:from-orange-500 hover:to-orange-700 active:scale-95 transition disabled:opacity-50 text-lg tracking-wide flex items-center justify-center gap-2"
              disabled={
                !name ||
                !email ||
                !ageRange ||
                q1 === 0 ||
                q2 === 0 ||
                q3 === 0 ||
                !agreed
              }
            >
              <span>제출하기</span> <span className="text-xl">🚀</span>
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default SurveySection;
