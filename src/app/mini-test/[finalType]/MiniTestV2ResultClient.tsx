"use client";

import { useEffect, useState } from "react";
import { MinitestResult, supabaseService } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { MdRefresh } from "react-icons/md";
import { SurveySection } from "@/components/test/minitestV2/sections/SurveySection";
import { SurveyData } from "@/types/surveyData";
import TestLoadingAnimation from "@/components/test/common/TestLoadingAnimation";
import { ShareButton } from "@/components/common/ShareButtons";
import { createShareData, convertEnglishToFinalType } from "@/utils/shareUtils";

// 소스별 대표 이모지 매핑
const SAUCE_EMOJIS: Record<string, string> = {
  기준윤리형: "🥢",
  기준심미형: "🍇",
  예술느낌형: "🍹",
  예술융합형: "🥘",
  이해관리형: "🥚",
  이해연구형: "🧀",
  소통도움형: "🍯",
  소통조화형: "🥗",
  도전확장형: "🌶️",
  도전목표형: "🍖",
};

// --- 결과 요약 섹션 ---
function ResultSummarySection({
  result,
  emoji,
  comment,
  onRestart,
}: {
  result: MinitestResult;
  emoji: string;
  comment: string;
  onRestart: () => void;
}) {
  return (
    <div className="min-h-screen-mobile flex flex-col items-center justify-center p-6 bg-gradient-to-br from-white via-slate-50 to-orange-50">
      <div className="flex-1 flex flex-col items-center justify-center w-full max-w-lg mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-12 animate-slide-in-up">
          <div className="relative mb-8">
            {/* Background Glow */}
            <div className="absolute inset-0 w-40 h-40 mx-auto rounded-full bg-gradient-to-br from-orange-200/40 to-amber-200/40 blur-3xl animate-pulse"></div>

            {/* Emoji */}
            <div className="relative z-10 text-8xl mb-6 animate-float">
              {emoji}
            </div>
          </div>

          {/* Type Label */}
          <div className="mb-6">
            <span className="text-sm font-medium text-slate-500 tracking-wide uppercase">
              당신의 워크소스
            </span>
          </div>

          {/* Type Name */}
          <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4 leading-tight">
            {result.type_name}
          </h1>

          {/* Direction */}
          <p className="text-lg text-slate-600 mb-8 max-w-md mx-auto leading-relaxed">
            {result.summary_card?.direction || "나만의 특별한 소스"}
          </p>
        </div>

        {/* Keywords */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {result.summary_card?.keywords
            ?.slice(0, 4)
            .map((keyword: string, index: number) => (
              <span
                key={index}
                className="px-4 py-2 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-full text-sm font-medium text-slate-700 shadow-lg hover:shadow-xl hover:border-slate-300 hover:-translate-y-1 transition-all duration-300 animate-scale-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                #{keyword}
              </span>
            ))}
        </div>

        {/* Quote */}
        <blockquote className="text-xl text-slate-700 font-medium mb-10 text-center max-w-lg leading-relaxed animate-slide-in-up">
          &ldquo;{comment}&rdquo;
        </blockquote>

        {/* Action Buttons */}
        <div className="flex flex-row gap-3 justify-center items-center mb-8">
          {/* Share Button */}
          <div className="flex-shrink-0">
            <ShareButton
              shareData={createShareData(
                result.type_name,
                result.one_liner,
                result.keywords
              )}
            />
          </div>

          {/* Restart Button */}
          <button
            onClick={onRestart}
            className="group flex items-center gap-2 px-4 py-3 sm:px-6 sm:py-3 bg-slate-900 text-white rounded-xl sm:rounded-2xl font-semibold shadow-lg hover:shadow-xl hover:bg-slate-800 transition-all duration-300 text-sm sm:text-base"
          >
            <MdRefresh className="text-base sm:text-lg group-hover:rotate-180 transition-transform duration-300" />
            <span>다시 테스트하기</span>
          </button>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="flex-shrink-0 mb-6">
        <div className="flex flex-col items-center gap-2 text-slate-500">
          <span className="text-sm font-medium">아래로 스크롤하세요</span>
          <div className="w-6 h-10 border-2 border-slate-300/80 rounded-full flex justify-center bg-white/40 backdrop-blur-sm">
            <div className="w-1 h-3 bg-slate-400 rounded-full mt-2 animate-bounce"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- 키워드 & 강점 통합 섹션 ---
function KeywordsAndStrengthsSection({ result }: { result: MinitestResult }) {
  return (
    <div className="min-h-screen-mobile flex flex-col p-4 sm:p-6 bg-gradient-to-br from-white via-slate-50 to-orange-50">
      <div className="w-full max-w-5xl mx-auto flex-1 flex flex-col justify-center">
        {/* 키워드와 메시지 */}
        <div className="text-center mb-4 sm:mb-10">
          <div className="mb-8 sm:mb-10">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-800 mb-6 sm:mb-8 animate-slide-in-up">
              당신을 표현하는 키워드
            </h2>
            <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mb-8 sm:mb-10">
              {result.keywords.map((keyword: string, idx: number) => (
                <span
                  key={idx}
                  className="px-5 py-3 sm:px-6 sm:py-3 text-sm sm:text-base font-bold text-slate-700 bg-white/90 backdrop-blur-sm border-2 border-slate-200/80 rounded-full shadow-lg hover:shadow-xl hover:border-slate-300 hover:-translate-y-1 transition-all duration-300 animate-scale-in"
                  style={{ animationDelay: `${idx * 0.1}s` }}
                >
                  {keyword}
                </span>
              ))}
            </div>
          </div>

          <div className="max-w-4xl mx-auto mb-8 sm:mb-12">
            <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-slate-600 leading-tight animate-slide-in-up px-2">
              {result.one_liner}
            </h3>
          </div>
        </div>

        {/* 강점 카드 */}
        <div className="mb-6 sm:mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 max-w-5xl mx-auto">
            {result.strengths.map((strength: string, idx: number) => {
              const [title, description] = strength.split(" - ");
              return (
                <div
                  key={idx}
                  className="bg-white rounded-2xl p-4 sm:p-5 shadow-md border border-slate-200 hover:shadow-lg hover:border-slate-300 hover:-translate-y-1 transition-all duration-300 animate-scale-in group"
                  style={{ animationDelay: `${(idx + 3) * 0.15}s` }}
                >
                  <div className="text-center">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl flex items-center justify-center mx-auto mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300 shadow-sm">
                      <span className="text-lg sm:text-xl">
                        {idx === 0 ? "💡" : idx === 1 ? "🎯" : "⚡"}
                      </span>
                    </div>
                    <h4 className="text-base sm:text-lg font-bold text-slate-800 mb-2 sm:mb-3 leading-tight">
                      {title}
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 스크롤 인디케이터 */}
        <div className="flex flex-col items-center gap-3 text-slate-500">
          <span className="text-xs sm:text-sm font-medium text-center">
            더 자세한 이야기가 기다리고 있어요
          </span>
          <div className="w-6 h-10 border-2 border-slate-300/80 rounded-full flex justify-center bg-white/40 backdrop-blur-sm">
            <div className="w-1 h-3 bg-slate-400 rounded-full mt-2 animate-bounce"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- 스토리 섹션 (첫 번째 부분) ---
function StorySection1({ result }: { result: MinitestResult }) {
  const descriptions = Array.isArray(result.type_description)
    ? result.type_description
    : [result.type_description];

  return (
    <div className="min-h-screen-mobile flex flex-col p-4 sm:p-6 bg-gradient-to-br from-slate-50 via-orange-50 to-white">
      <div className="w-full max-w-4xl mx-auto flex-1 flex flex-col justify-center">
        <div className="text-center mb-8 sm:mb-12 animate-slide-in-up">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-800 mb-3 sm:mb-4">
            당신의 이야기
          </h2>
          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto px-2">
            당신만의 특별한 워크소스가 만들어지는 과정을 들려드릴게요
          </p>
        </div>

        <div className="space-y-4 sm:space-y-6 mb-8">
          {descriptions.slice(0, 2).map((paragraph: string, idx: number) => (
            <div
              key={idx}
              className="bg-white/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-lg border border-slate-200/80 hover:shadow-xl hover:border-slate-300 hover:-translate-y-1 transition-all duration-300 animate-slide-in-up"
              style={{ animationDelay: `${idx * 0.2}s` }}
            >
              <p className="text-sm sm:text-base lg:text-lg text-slate-700 leading-relaxed">
                {paragraph}
              </p>
            </div>
          ))}
        </div>

        {/* 스크롤 인디케이터 */}
        <div className="flex flex-col items-center gap-3 text-slate-500">
          <span className="text-xs sm:text-sm font-medium text-center">
            이야기가 계속됩니다
          </span>
          <div className="w-6 h-10 border-2 border-slate-300/80 rounded-full flex justify-center bg-white/40 backdrop-blur-sm">
            <div className="w-1 h-3 bg-slate-400 rounded-full mt-2 animate-bounce"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- 스토리 섹션 (두 번째 부분) ---
function StorySection2({ result }: { result: MinitestResult }) {
  const descriptions = Array.isArray(result.type_description)
    ? result.type_description
    : [result.type_description];

  // 2개 이하면 이 섹션을 표시하지 않음
  if (descriptions.length <= 2) {
    return null;
  }

  return (
    <div className="min-h-screen-mobile flex flex-col p-4 sm:p-6 bg-gradient-to-br from-white via-slate-50 to-orange-50">
      <div className="w-full max-w-4xl mx-auto flex-1 flex flex-col justify-center">
        <div className="text-center mb-8 sm:mb-12 animate-slide-in-up">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-800 mb-3 sm:mb-4">
            더 깊은 이야기
          </h2>
        </div>

        <div className="space-y-4 sm:space-y-6">
          {descriptions.slice(2, 4).map((paragraph: string, idx: number) => (
            <div
              key={idx + 2}
              className="bg-white/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-lg border border-slate-200/80 hover:shadow-xl hover:border-slate-300 hover:-translate-y-1 transition-all duration-300 animate-slide-in-up"
              style={{ animationDelay: `${idx * 0.2}s` }}
            >
              <p className="text-sm sm:text-base lg:text-lg text-slate-700 leading-relaxed">
                {paragraph}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// --- 성장 가이드 섹션 ---
function GrowthSection({ result }: { result: MinitestResult }) {
  return (
    <div className="min-h-screen-mobile flex flex-col p-4 sm:p-6 bg-gradient-to-br from-slate-50 via-orange-50 to-white">
      <div className="w-full max-w-4xl mx-auto flex-1 flex flex-col justify-center">
        <div className="text-center mb-8 sm:mb-12 animate-slide-in-up">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-800 mb-3 sm:mb-4">
            성장 가이드
          </h2>
          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto px-2">
            당신의 워크소스를 더욱 발전시킬 수 있는 조언을 드려요
          </p>
        </div>

        <div className="bg-white/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-lg border border-slate-200/80 hover:shadow-xl hover:border-slate-300 hover:-translate-y-1 transition-all duration-300 animate-slide-in-up">
          {Array.isArray(result.advice) ? (
            <div className="space-y-4 sm:space-y-6">
              {result.advice.map((advice: string, idx: number) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 sm:gap-4 animate-slide-in-up"
                  style={{ animationDelay: `${idx * 0.2}s` }}
                >
                  <div className="w-2 h-2 bg-slate-400 rounded-full mt-2 sm:mt-3 flex-shrink-0"></div>
                  <p className="text-sm sm:text-base lg:text-lg text-slate-700 leading-relaxed">
                    {advice}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm sm:text-base lg:text-lg text-slate-700 leading-relaxed">
              {result.advice}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// --- 닮은 인물 섹션 ---
function CharactersSection({ result }: { result: MinitestResult }) {
  if (!result.example_characters || result.example_characters.length === 0) {
    return null;
  }

  return (
    <div className="min-h-screen-mobile flex flex-col p-4 sm:p-6 bg-gradient-to-br from-white via-slate-50 to-orange-50">
      <div className="w-full max-w-4xl mx-auto flex-1 flex flex-col justify-center">
        <div className="text-center mb-8 sm:mb-12 animate-slide-in-up">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-800 mb-3 sm:mb-4">
            닮은 인물
          </h2>
          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto px-2">
            당신과 비슷한 워크소스를 가진 영감을 주는 인물을 소개해요
          </p>
        </div>

        <div className="w-full max-w-2xl mx-auto relative">
          {result.example_characters
            .slice(0, 1)
            .map((character, idx: number) => (
              <div
                key={idx}
                className="relative animate-scale-in"
                style={{ animationDelay: `${idx * 0.2}s` }}
              >
                {/* 배경 장식 */}
                <div className="absolute -top-3 -left-3 w-full h-full bg-gradient-to-br from-yellow-200/20 to-orange-200/20 rounded-3xl sm:rounded-[2rem] transform rotate-1"></div>
                <div className="absolute -top-1 -right-1 w-full h-full bg-gradient-to-br from-pink-200/20 to-purple-200/20 rounded-3xl sm:rounded-[2rem] transform -rotate-1"></div>

                {/* 메인 카드 */}
                <div className="relative bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 border-2 border-slate-200 shadow-xl hover:shadow-2xl hover:border-slate-300 hover:-translate-y-2 transition-all duration-300 text-center">
                  {/* 상단 아이콘 */}
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-white text-sm">✨</span>
                    </div>
                  </div>

                  {/* 인물 이름 */}
                  <div className="mt-4">
                    <h3 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-800 mb-4 sm:mb-6 bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-600">
                      {character.name}
                    </h3>
                  </div>

                  {/* 인물 설명 */}
                  <div className="relative">
                    <div className="absolute -left-2 top-0 text-4xl text-slate-300 leading-none">
                      &quot;
                    </div>
                    <div className="absolute -right-2 bottom-0 text-4xl text-slate-300 leading-none">
                      &quot;
                    </div>
                    <p className="text-sm sm:text-base lg:text-xl text-slate-700 leading-relaxed font-medium px-4">
                      {character.context}
                    </p>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

// --- 설문 섹션 ---
function ResultSurveySection({
  submitSurvey,
}: {
  submitSurvey: (survey: SurveyData) => Promise<{ success: boolean }>;
}) {
  return (
    <div className="min-h-screen-mobile flex flex-col p-4 sm:p-6 bg-gradient-to-br from-slate-50 via-orange-50 to-white">
      <div className="w-full max-w-2xl mx-auto flex-1 flex flex-col justify-center">
        <div className="text-center mb-6 sm:mb-8 animate-slide-in-up">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-800 mb-3 sm:mb-4">
            마지막 한 걸음
          </h2>
        </div>
        <div>
          <SurveySection submitSurvey={submitSurvey} />
        </div>
      </div>
    </div>
  );
}

function MiniTestV2ResultClient({
  finalType,
  submitSurvey,
}: {
  finalType: string;
  submitSurvey: (survey: SurveyData) => Promise<{ success: boolean }>;
}) {
  const router = useRouter();
  const [result, setResult] = useState<MinitestResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const KoreanFinalType = convertEnglishToFinalType(finalType);

        const data = await supabaseService.getResultByFinalType(
          KoreanFinalType
        );

        if (data) {
          setResult(data);
        } else {
          setError("결과를 찾을 수 없습니다.");
        }
      } catch (err) {
        setError("결과를 불러오는데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchResult();
  }, [finalType]);

  const handleRestart = () => {
    router.push("/mini-test");
  };

  if (loading) {
    return <TestLoadingAnimation name="사용자" />;
  }

  if (error || !result) {
    return (
      <div className="min-h-screen-mobile flex items-center justify-center p-6 bg-slate-50">
        <div className="text-center max-w-md mx-auto bg-white rounded-3xl p-8 shadow-lg border border-slate-200">
          <div className="text-6xl mb-6">😔</div>
          <h1 className="text-2xl font-bold text-slate-800 mb-4">
            오류가 발생했습니다
          </h1>
          <p className="text-slate-600 mb-8 leading-relaxed">
            {error || "결과를 찾을 수 없습니다."}
          </p>
          <button
            onClick={handleRestart}
            className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-semibold shadow-lg hover:bg-slate-800 transition-all duration-300"
          >
            다시 테스트하기
          </button>
        </div>
      </div>
    );
  }

  const resultType = result.type_name || "기준윤리형";
  const emoji = SAUCE_EMOJIS[resultType] || "🍽️";
  const comment =
    result.summary_card?.catchphrase || "나만의 소스를 발견했어요!";

  return (
    <div className="h-screen-mobile w-full mx-auto bg-white">
      <section className="min-h-screen-mobile snap-section">
        <ResultSummarySection
          result={result}
          emoji={emoji}
          comment={comment}
          onRestart={handleRestart}
        />
      </section>

      <section className="min-h-screen-mobile snap-section">
        <KeywordsAndStrengthsSection result={result} />
      </section>

      <section className="min-h-screen-mobile snap-section">
        <StorySection1 result={result} />
      </section>

      {Array.isArray(result.type_description) &&
        result.type_description.length > 2 && (
          <section className="min-h-screen-mobile snap-section">
            <StorySection2 result={result} />
          </section>
        )}

      <section className="min-h-screen-mobile snap-section">
        <GrowthSection result={result} />
      </section>

      {result.example_characters && result.example_characters.length > 0 && (
        <section className="min-h-screen-mobile snap-section">
          <CharactersSection result={result} />
        </section>
      )}

      <section className="min-h-screen-mobile snap-section">
        <ResultSurveySection submitSurvey={submitSurvey} />
      </section>
    </div>
  );
}

export default MiniTestV2ResultClient;
