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

  // --- 유효성 검사 함수 추가 ---
  const isFormValid =
    email.trim() !== "" &&
    ageRange.trim() !== "" &&
    // 아래에 추가 필수 항목이 있다면 모두 &&로 연결
    // 예: gender.trim() !== "" && ...
    true;

  return (
    <div className="w-full bg-white/90 rounded-3xl shadow-md p-4 sm:p-6 flex flex-col items-center border border-orange-100">
      {submitted ? (
        <div className="flex flex-col items-center gap-2 text-center py-4">
          <span className="text-4xl mb-2">🎉</span>
          <div className="text-orange-600 font-bold text-lg">
            소중한 의견 감사합니다!
          </div>
          <div className="text-gray-500 text-sm">
            더 좋은 워크소스 테스트로 보답할게요 :)
          </div>
        </div>
      ) : (
        <>
          <h3 className="text-base font-bold text-orange-600 tracking-tight text-center mb-4">
            설문조사를 도와주시면 <br /> 추첨을 통해 커피 기프티콘을 드려요 🎁
          </h3>

          <form
            onSubmit={handleSubmit}
            className="w-full flex flex-col items-center gap-4"
          >
            {/* 이름 + 이메일 가로 정렬 */}
            <div className="w-full flex flex-row gap-2 mb-1">
              {/* 이름 */}
              {/* <div className="flex-1 min-w-0">
                <span className="text-base mb-1 font-semibold text-gray-800 flex items-center gap-1">
                  👤 이름
                </span>

                <input
                  type="text"
                  className="w-full border border-orange-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-orange-300 bg-orange-50/30 text-gray-700 placeholder:text-gray-400 placeholder:text-sm sm:text-base text-sm"
                  placeholder="이름을 입력하세요"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                />
              </div> */}
              {/* 이메일 */}
              <div className="flex-1 min-w-0">
                <span className="text-base mb-1 font-semibold text-gray-800 flex items-center gap-1">
                  📧 이메일
                </span>
                <input
                  type="email"
                  className="h-12 w-full border border-orange-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-orange-300 bg-orange-50/30 text-gray-700 placeholder:text-gray-400 placeholder:text-sm sm:text-base text-sm"
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
              <div className="flex-1 min-w-0">
                <span className="text-base mb-1 font-semibold text-gray-800 flex items-center gap-1">
                  🎂 연령대
                </span>
                <select
                  className="h-12 w-full border border-orange-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-orange-300 bg-orange-50/30 text-gray-700 placeholder:text-gray-400 placeholder:text-sm sm:text-base text-sm"
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
            </div>

            {/* 개인정보 동의 체크박스 */}
            <div className="w-full mb-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="privacy-agree"
                  className="accent-orange-500"
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

              <span className="text-xs text-gray-400">
                해당 정보는 기프티콘 추첨 및 발송 용도로만 사용됩니다.
              </span>
            </div>
            {/* Q1 */}
            <div className="w-full mb-2 font-semibold text-gray-800 flex flex-col gap-3">
              <span className="text-sm sm:text-base">
                🧑‍💼 위 결과가 나의 일하는 모습이나 성향을 잘 반영한다고
                느끼시나요?
              </span>
              <div className="flex justify-between items-end gap-2 sm:gap-3 flex-wrap">
                {[1, 2, 3, 4, 5].map(num => (
                  <div key={num} className="flex flex-col items-center flex-1 ">
                    <button
                      type="button"
                      onClick={() => setQ1(num)}
                      className={`w-6 h-6 text-xs sm:text-base sm:w-9 sm:h-9 rounded-full flex items-center justify-center font-bold border-2
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
            <div className="w-full mb-2 font-semibold text-gray-800 flex flex-col gap-3">
              <span className="text-sm sm:text-base">
                🏢 위 결과를 조직관리나 신규 채용 시 참고 자료로 활용할 의향이
                있으신가요?
              </span>
              <div className="flex justify-between items-end gap-2 sm:gap-3 flex-wrap">
                {[1, 2, 3, 4, 5].map(num => (
                  <div
                    key={num}
                    className="flex flex-col items-center flex-1 min-w-[48px] sm:min-w-[56px]"
                  >
                    <button
                      type="button"
                      onClick={() => setQ2(num)}
                      className={`w-6 h-6 text-xs sm:text-base sm:w-9 sm:h-9 rounded-full flex items-center justify-center font-bold border-2
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
            <div className="w-full mb-2 font-semibold text-gray-800 flex flex-col gap-3">
              <span className="text-sm sm:text-base">
                🤝 팀원들이 이런 결과를 서로 공유한다면, 팀워크나 소통에 도움이
                될 것 같나요?
              </span>

              <div className="flex justify-between items-end gap-2 sm:gap-3 flex-wrap">
                {[1, 2, 3, 4, 5].map(num => (
                  <div
                    key={num}
                    className="flex flex-col items-center flex-1 min-w-[48px] sm:min-w-[56px]"
                  >
                    <button
                      type="button"
                      onClick={() => setQ3(num)}
                      className={`w-6 h-6 text-xs sm:text-base sm:w-9 sm:h-9 rounded-full flex items-center justify-center font-bold border-2
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
            <div className="w-full mb-2 font-semibold text-gray-800 flex flex-col gap-3">
              <span className="text-sm sm:text-base">💬 의견 (선택)</span>
              <textarea
                className="w-full border border-orange-200 rounded-xl py-2 px-3 md:py-3 md:px-4 mb-1 focus:outline-none focus:ring-2 focus:ring-orange-300 bg-orange-50/30 text-gray-700 placeholder:text-gray-400 min-h-[32px] md:min-h-[40px] placeholder:text-sm text-sm resize-none"
                placeholder="서비스에 대한 의견이나 개선점을 자유롭게 남겨주세요."
                value={feedback}
                onChange={e => setFeedback(e.target.value)}
                rows={2}
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 mt-6 rounded-xl font-bold bg-gradient-to-r from-orange-500 via-pink-500 to-yellow-400 text-white shadow-md hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!isFormValid}
            >
              제출하기
            </button>
          </form>
        </>
      )}
    </div>
  );
}

export default SurveySection;
