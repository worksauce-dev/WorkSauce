"use client";

import { useEffect, useState, use } from "react";
import { MinitestResult, supabaseService } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { MdRefresh } from "react-icons/md";
import { SurveySection } from "@/components/test/minitestV2/sections/SurveySection";
import { SurveyData } from "@/types/surveyData";
import TestLoadingAnimation from "@/components/test/common/TestLoadingAnimation";

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
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-br from-slate-50 via-orange-50 to-amber-50">
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
                className="px-4 py-2 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-full text-sm font-medium text-slate-700 shadow-sm hover:shadow-md transition-all duration-200 animate-scale-in"
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

        {/* Restart Button */}
        <button
          onClick={onRestart}
          className="group flex items-center gap-3 px-8 py-4 bg-slate-900 text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl hover:bg-slate-800 transition-all duration-300 mb-8"
        >
          <MdRefresh className="text-lg group-hover:rotate-180 transition-transform duration-300" />
          <span>다시 테스트하기</span>
        </button>
      </div>

      {/* Scroll Indicator */}
      <div className="flex-shrink-0 mb-6">
        <div className="flex flex-col items-center gap-2 text-slate-500">
          <span className="text-sm font-medium">아래로 스크롤하세요</span>
          <div className="w-6 h-10 border-2 border-slate-300 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-slate-400 rounded-full mt-2 animate-bounce"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- 키워드 헤더 섹션 ---
function KeywordsHeaderSection({ result }: { result: MinitestResult }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-white">
      <div className="w-full max-w-2xl mx-auto text-center">
        {/* Keywords Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          {result.keywords.map((keyword: string, idx: number) => (
            <div
              key={idx}
              className="aspect-square bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 rounded-2xl flex items-center justify-center p-4 hover:shadow-lg transition-all duration-300 animate-scale-in"
              style={{ animationDelay: `${idx * 0.1}s` }}
            >
              <span className="text-lg font-bold text-slate-800 text-center leading-tight">
                {keyword}
              </span>
            </div>
          ))}
        </div>

        {/* One Liner */}
        <h2 className="text-3xl md:text-4xl font-bold text-slate-800 leading-tight mb-16 max-w-2xl mx-auto animate-slide-in-up">
          {result.one_liner}
        </h2>

        {/* Scroll Indicator */}
        <div className="flex flex-col items-center gap-2 text-slate-500">
          <span className="text-sm font-medium">계속 읽어보세요</span>
          <div className="w-6 h-10 border-2 border-slate-300 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-slate-400 rounded-full mt-2 animate-bounce"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- 스토리 섹션 ---
function StorySection({ result }: { result: MinitestResult }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-slate-50">
      <div className="w-full max-w-4xl mx-auto">
        <div className="text-center mb-12 animate-slide-in-up">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
            당신의 이야기
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            당신만의 특별한 워크소스가 만들어지는 과정을 들려드릴게요
          </p>
        </div>

        <div className="space-y-8">
          {Array.isArray(result.type_description) ? (
            result.type_description.map((paragraph: string, idx: number) => (
              <div
                key={idx}
                className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200 hover:shadow-md transition-shadow duration-300 animate-slide-in-up"
                style={{ animationDelay: `${idx * 0.2}s` }}
              >
                <p className="text-lg text-slate-700 leading-relaxed">
                  {paragraph}
                </p>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200 animate-slide-in-up">
              <p className="text-lg text-slate-700 leading-relaxed">
                {result.type_description}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// --- 강점 섹션 ---
function StrengthsSection({ result }: { result: MinitestResult }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-white">
      <div className="w-full max-w-4xl mx-auto">
        <div className="text-center mb-12 animate-slide-in-up">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
            핵심 강점
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            당신이 가진 특별한 능력들을 발견해보세요
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {result.strengths.map((strength: string, idx: number) => {
            const [title, description] = strength.split(" - ");
            return (
              <div
                key={idx}
                className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-3xl p-8 border border-slate-200 hover:shadow-lg transition-all duration-300 animate-scale-in"
                style={{ animationDelay: `${idx * 0.15}s` }}
              >
                <div className="flex items-start gap-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-slate-800 mb-2 leading-tight">
                      {title}
                    </h3>
                    <p className="text-base text-slate-600 leading-relaxed">
                      {description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// --- 성장 가이드 섹션 ---
function GrowthSection({ result }: { result: MinitestResult }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-slate-50">
      <div className="w-full max-w-4xl mx-auto">
        <div className="text-center mb-12 animate-slide-in-up">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
            성장 가이드
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            당신의 워크소스를 더욱 발전시킬 수 있는 조언을 드려요
          </p>
        </div>

        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200 animate-slide-in-up">
          {Array.isArray(result.advice) ? (
            <div className="space-y-6">
              {result.advice.map((advice: string, idx: number) => (
                <div
                  key={idx}
                  className="flex items-start gap-4 animate-slide-in-up"
                  style={{ animationDelay: `${idx * 0.2}s` }}
                >
                  <p className="text-lg text-slate-700 leading-relaxed">
                    · {advice}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-lg text-slate-700 leading-relaxed">
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
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-white">
      <div className="w-full max-w-4xl mx-auto">
        <div className="text-center mb-12 animate-slide-in-up">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
            닮은 인물
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            당신과 비슷한 워크소스를 가진 영감을 주는 인물들을 소개해요
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {result.example_characters.map((character, idx: number) => (
            <div
              key={idx}
              className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-3xl p-8 border border-slate-200 hover:shadow-lg transition-all duration-300 animate-scale-in"
              style={{ animationDelay: `${idx * 0.2}s` }}
            >
              <h3 className="text-2xl font-bold text-slate-800 mb-4">
                {character.name}
              </h3>
              <p className="text-lg text-slate-700 leading-relaxed">
                {character.context}
              </p>
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
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-slate-50">
      <div className="w-full max-w-2xl mx-auto">
        <div className="text-center mb-8 animate-slide-in-up">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
            마지막 한 걸음
          </h2>
          <p className="text-slate-600">당신의 소중한 의견을 들려주세요</p>
        </div>
        <SurveySection submitSurvey={submitSurvey} />
      </div>
    </div>
  );
}

export default function MiniTestV2ResultPage({
  params,
}: {
  params: Promise<{ finalType: string }>;
}) {
  const router = useRouter();
  const [result, setResult] = useState<MinitestResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Unwrap params using React.use()
  const { finalType } = use(params);

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const data = await supabaseService.getResultByFinalType(finalType);

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
    router.push("/mini-testV2");
  };

  const submitSurvey = async (survey: SurveyData) => {
    // 설문 제출 로직 구현
    return { success: true };
  };

  if (loading) {
    return <TestLoadingAnimation name="사용자" />;
  }

  if (error || !result) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50">
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
    <div
      className="overflow-y-auto h-screen snap-y snap-mandatory w-full mx-auto scroll-smooth hide-scrollbar bg-white"
      style={{ scrollSnapType: "y mandatory" }}
    >
      <section className="min-h-screen snap-start">
        <ResultSummarySection
          result={result}
          emoji={emoji}
          comment={comment}
          onRestart={handleRestart}
        />
      </section>

      <section className="min-h-screen snap-start">
        <KeywordsHeaderSection result={result} />
      </section>

      <section className="min-h-screen snap-start">
        <StorySection result={result} />
      </section>

      <section className="min-h-screen snap-start">
        <StrengthsSection result={result} />
      </section>

      <section className="min-h-screen snap-start">
        <GrowthSection result={result} />
      </section>

      {result.example_characters && result.example_characters.length > 0 && (
        <section className="min-h-screen snap-start">
          <CharactersSection result={result} />
        </section>
      )}

      <section className="min-h-screen snap-start">
        <ResultSurveySection submitSurvey={submitSurvey} />
      </section>
    </div>
  );
}
