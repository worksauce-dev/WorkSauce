"use client";

import { MdRefresh } from "react-icons/md";
import { SurveySection } from "./SurveySection";
import { SurveyData } from "@/types/surveyData";
import { workflowContent } from "@/constants/saucetest";

interface ResultSectionProps {
  finalType: string;
  onRestart: () => void;
  submitSurvey: (survey: SurveyData) => Promise<{ success: boolean }>;
  requestId: string | null;
  isProcessingResult: boolean;
  aiResult: any;
  webhookError: string | null;
}

const SAUCE_TYPES = {
  기준윤리형: {
    name: "기준윤리형",
    tagline: "깊고 순수한 맛의 원칙주의자",
    description:
      "이 유형의 조직원은 명확한 기준과 원칙에 따라 일하는 것을 선호합니다. 업무를 체계적으로 정리하고, 약속과 규칙을 잘 지키며, 팀 내에서 신뢰받는 역할을 맡는 경우가 많아요. 본인도 인식하지 못할 수 있지만, 주변 동료들은 당신의 일관성과 책임감에서 큰 안정감을 느낍니다.",
    workStyle:
      "업무를 시작하기 전 명확한 기준과 절차를 세우고, 계획에 따라 차근차근 진행하는 것을 선호합니다. 규칙과 약속을 중시하며, 실수나 예외 상황에도 원칙을 지키려 노력합니다.",
    improvement:
      "가끔은 융통성을 발휘해 다양한 관점이나 새로운 방식을 시도해보면 더 큰 시너지를 낼 수 있습니다. 변화가 필요한 순간에는 주변의 의견을 열린 마음으로 들어보세요.",
    traits: ["원칙주의", "정직함", "신뢰성", "일관성", "도덕성"],
    color: "from-[#8B4513] to-[#A0522D]",
  },
  기준심미형: {
    name: "기준심미형",
    tagline: "세련된 미적 감각의 소유자",
    description:
      "일의 완성도와 세련된 결과물을 중요하게 생각합니다. 세부적인 부분까지 꼼꼼하게 신경 쓰며, 조직 내에서 품격과 미적 감각을 높이는 역할을 합니다. 본인도 모르게 주변 환경의 분위기나 디자인에 민감하게 반응하는 경향이 있습니다.",
    workStyle:
      "작은 디테일까지 신경 쓰며, 결과물의 완성도와 아름다움을 중시합니다. 일의 품질을 높이기 위해 꾸준히 개선점을 찾고, 주변 환경을 세련되게 가꾸는 데 관심이 많습니다.",
    improvement:
      "실용성과 효율성도 함께 고려하면 더 큰 성과를 낼 수 있습니다. 때로는 완벽함보다 속도와 실행력을 우선해보는 것도 도움이 됩니다.",
    traits: ["세련됨", "미적 감각", "품격", "섬세함", "완성도"],
    color: "from-[#4B0082] to-[#800080]",
  },
  예술느낌형: {
    name: "예술느낌형",
    tagline: "다채로운 창의성의 화신",
    description:
      "창의적이고 감각적인 방식으로 문제를 해결하는 것을 즐깁니다. 새로운 아이디어를 내고, 다양한 시도를 두려워하지 않아요. 본인도 모르게 팀에 활력을 불어넣고, 남들이 생각하지 못한 관점에서 해답을 제시하는 경우가 많습니다.",
    workStyle:
      "틀에 얽매이지 않고 자유롭게 아이디어를 내며, 다양한 시도와 변화를 즐깁니다. 감각적이고 유연한 접근으로 문제를 해결하려고 합니다.",
    improvement:
      "아이디어를 구체적인 실행 계획으로 옮기는 연습을 해보세요. 때로는 체계적인 관리와 협업이 창의성을 더 빛나게 해줍니다.",
    traits: ["창의성", "감성", "다채로움", "영감", "혁신"],
    color: "from-[#FF69B4] to-[#FF1493]",
  },
  예술융합형: {
    name: "예술융합형",
    tagline: "융합의 예술가",
    description:
      "여러 분야의 지식과 경험을 융합해 새로운 방식을 만들어내는 데 능숙합니다. 다양한 의견을 조율하고, 혁신적인 프로젝트를 이끌 때 빛을 발합니다. 본인도 모르게 서로 다른 팀원들의 장점을 연결해주는 '허브' 역할을 하곤 합니다.",
    workStyle:
      "다양한 분야의 정보를 빠르게 습득하고, 서로 다른 아이디어를 융합해 새로운 결과를 만들어냅니다. 협업과 네트워킹에 강점이 있습니다.",
    improvement:
      "가끔은 한 가지에 집중해 깊이 파고드는 경험도 필요합니다. 융합의 과정에서 본인의 의견을 명확히 전달하는 연습을 해보세요.",
    traits: ["융합", "혁신", "다양성", "창의성", "통합"],
    color: "from-[#FF4500] to-[#FF8C00]",
  },
  이해관리형: {
    name: "이해관리형",
    tagline: "안정적인 관리의 달인",
    description:
      "체계적이고 효율적인 관리로 팀의 안정감을 추구합니다. 일의 우선순위를 잘 정하고, 계획적으로 업무를 진행하는 것을 선호해요. 본인도 모르게 위기 상황에서 침착하게 중심을 잡아주는 역할을 맡는 경우가 많습니다.",
    workStyle:
      "업무를 꼼꼼히 관리하고, 체계적인 프로세스를 만들어 효율적으로 일합니다. 팀원들의 역할을 명확히 분배하고, 일정과 목표를 잘 관리합니다.",
    improvement:
      "새로운 변화나 예기치 못한 상황에도 유연하게 대처하는 연습이 필요합니다. 때로는 완벽한 계획보다 빠른 실행이 더 효과적일 수 있습니다.",
    traits: ["체계성", "안정성", "효율성", "조화", "관리력"],
    color: "from-[#FFD700] to-[#FFA500]",
  },
  이해연구형: {
    name: "이해연구형",
    tagline: "깊이 있는 연구의 대가",
    description:
      "깊이 있는 분석과 탐구를 통해 문제의 본질을 파악하는 데 강점이 있습니다. 데이터를 꼼꼼히 살피고, 근거 있는 결정을 내리는 것을 선호합니다. 본인도 모르게 팀 내에서 '지식 창고'로 불리며, 어려운 문제에 대한 해답을 제시하는 경우가 많아요.",
    workStyle:
      "문제의 원인을 깊이 파악하고, 충분한 자료와 근거를 바탕으로 의사결정을 내립니다. 분석과 탐구에 많은 시간을 투자합니다.",
    improvement:
      "실행과 행동의 속도를 높이는 연습이 필요할 수 있습니다. 때로는 완벽한 분석보다 빠른 피드백과 실험이 더 큰 성과로 이어집니다.",
    traits: ["연구력", "통찰력", "분석력", "깊이", "탐구심"],
    color: "from-[#8B0000] to-[#A52A2A]",
  },
  소통도움형: {
    name: "소통도움형",
    tagline: "부드러운 소통의 달인",
    description:
      "따뜻하고 부드러운 소통으로 팀 분위기를 좋게 만듭니다. 갈등 상황에서도 중재자 역할을 하며, 동료들의 고민을 잘 들어줍니다. 본인도 모르게 주변 사람들이 편하게 다가오는 '팀의 버팀목'이 되는 경우가 많아요.",
    workStyle:
      "동료들과의 신뢰를 바탕으로 원활하게 소통하며, 갈등이 생기면 중재자 역할을 자처합니다. 팀원들의 감정과 분위기를 세심하게 살핍니다.",
    improvement:
      "때로는 자신의 의견을 더 분명하게 표현하는 연습이 필요합니다. 모두를 배려하다 보면 본인의 생각이 묻힐 수 있으니, 자기주장도 중요합니다.",
    traits: ["소통력", "공감능력", "부드러움", "명확성", "관계형성"],
    color: "from-[#DAA520] to-[#B8860B]",
  },
  소통조화형: {
    name: "소통조화형",
    tagline: "조화로운 균형의 예술가",
    description:
      "다양한 의견을 조율하고, 팀 내 균형을 맞추는 데 능숙합니다. 모두가 만족할 수 있는 합의점을 찾으려 노력하며, 협력적인 분위기를 만듭니다. 본인도 모르게 갈등을 미리 감지하고, 조용히 문제를 해결하는 역할을 하곤 합니다.",
    workStyle:
      "팀 내 다양한 의견을 경청하고, 모두가 동의할 수 있는 결론을 도출하려 노력합니다. 협력과 조화를 중시합니다.",
    improvement:
      "때로는 결단력 있게 의견을 제시하고, 필요할 땐 갈등을 두려워하지 않는 태도도 중요합니다. 모두의 만족이 불가능할 때는 우선순위를 정해보세요.",
    traits: ["조화", "균형감", "조율력", "통합", "협력"],
    color: "from-[#32CD32] to-[#228B22]",
  },
  도전확장형: {
    name: "도전확장형",
    tagline: "도전적인 개척자",
    description:
      "새로운 시도와 도전을 즐기며, 변화를 두려워하지 않습니다. 목표를 향해 적극적으로 나아가고, 팀에 활력을 불어넣는 역할을 합니다. 본인도 모르게 주변 동료들에게 '도전정신'을 전파하는 경우가 많아요.",
    workStyle:
      "새로운 프로젝트나 변화에 앞장서며, 적극적으로 아이디어를 제안하고 실행합니다. 실패를 두려워하지 않고, 도전에서 배우는 것을 즐깁니다.",
    improvement:
      "가끔은 주변의 속도와 상황을 고려해 조율하는 연습이 필요합니다. 도전과 변화도 팀과의 조화 속에서 더 큰 성과로 이어집니다.",
    traits: ["도전정신", "개척자", "열정", "성장", "혁신"],
    color: "from-[#FF0000] to-[#DC143C]",
  },
  도전목표형: {
    name: "도전목표형",
    tagline: "목표 지향적 성취자",
    description:
      "명확한 목표를 세우고, 이를 달성하기 위해 집중적으로 노력합니다. 추진력과 결단력이 뛰어나며, 팀의 성과를 이끄는 데 큰 역할을 합니다. 본인도 모르게 동료들에게 '성취의 롤모델'로 인식되는 경우가 많아요.",
    workStyle:
      "구체적인 목표를 세우고, 이를 달성하기 위해 계획적으로 실행합니다. 추진력과 집중력이 강점이며, 결과에 대한 책임감을 갖고 일합니다.",
    improvement:
      "과정의 즐거움도 함께 느껴보세요. 목표 달성에만 집중하다 보면 팀원들과의 소통이나 협업이 소홀해질 수 있습니다.",
    traits: ["목표지향", "추진력", "집중력", "성취욕", "결단력"],
    color: "from-[#800000] to-[#8B0000]",
  },
};

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

// 소스별 한 줄 코멘트
const SAUCE_COMMENTS: Record<string, string> = {
  기준윤리형: "원칙을 지키는 당신, 모두의 신뢰를 한 몸에!",
  기준심미형: "감각적인 당신, 일상도 예술로 만듭니다!",
  예술느낌형: "창의력 만렙! 어디서든 영감을 뿜뿜!",
  예술융합형: "융합의 마법사, 새로운 가치를 창조해요!",
  이해관리형: "든든한 안정감, 모두가 의지하는 존재!",
  이해연구형: "탐구와 분석의 달인, 깊이가 남다릅니다!",
  소통도움형: "따뜻한 소통, 모두가 편안해지는 분위기!",
  소통조화형: "조화와 균형의 마스터, 모두를 하나로!",
  도전확장형: "도전정신 가득, 한계를 뛰어넘는 개척자!",
  도전목표형: "목표를 향해 직진! 성취의 아이콘!",
};

// --- 결과 요약 섹션 (100vh 최적화) ---
function ResultSummarySection({
  finalResult,
  emoji,
  comment,
  onRestart,
}: {
  finalResult: (typeof SAUCE_TYPES)[keyof typeof SAUCE_TYPES];
  emoji: string;
  comment: string;
  onRestart: () => void;
}) {
  return (
    <div className="h-screen flex flex-col items-center justify-center px-4 py-8 animate-fadein-pop">
      <div className="flex-1 flex flex-col items-center justify-center max-w-lg mx-auto">
        <div className="relative mb-6">
          <div
            className={`absolute left-1/2 -translate-x-1/2 -top-8 w-24 h-24 rounded-full blur-xl opacity-50 z-0 bg-gradient-to-br ${finalResult.color}`}
          ></div>
          <div className="relative z-10 flex flex-col items-center">
            <div className="text-5xl sm:text-6xl mb-3 drop-shadow-lg animate-pop">
              {emoji}
            </div>
            <div className="flex flex-col items-center text-center">
              <span className="text-sm font-medium text-gray-400 mb-2">
                당신의 워크소스는
              </span>
              <span className="text-3xl sm:text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-br from-orange-500 to-pink-500 animate-gradient drop-shadow-lg mb-2">
                {finalResult.name}
              </span>
              <div className="text-base sm:text-lg font-bold text-orange-600 mb-4">
                {finalResult.tagline}
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-1.5 mb-4 max-w-sm">
          {finalResult.traits.slice(0, 4).map((trait, index) => (
            <span
              key={index}
              className="px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm bg-gradient-to-br from-orange-100 to-orange-200 text-orange-700 border border-orange-200"
            >
              {trait}
            </span>
          ))}
        </div>

        <div className="text-sm sm:text-base font-semibold text-pink-600 mb-6 text-center px-4 animate-bounce">
          {comment}
        </div>

        <button
          onClick={onRestart}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-pink-400 to-orange-400 text-white font-bold shadow-lg hover:from-pink-500 hover:to-orange-500 hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-pink-200 mb-6"
        >
          <MdRefresh className="text-lg" />
          <span className="text-sm sm:text-base">다시 테스트하기</span>
        </button>
      </div>

      <div className="flex-shrink-0 mb-4">
        <span className="flex items-center gap-1 text-orange-600 font-semibold text-sm animate-bounce">
          <span className="text-base">⬇️</span> 아래로 스크롤하세요
        </span>
      </div>
    </div>
  );
}

// --- 키워드 헤더 섹션 ---
function KeywordsHeaderSection({
  finalResult,
  aiResult,
}: {
  finalResult: (typeof SAUCE_TYPES)[keyof typeof SAUCE_TYPES];
  aiResult: any;
}) {
  const hasEnhancedData = aiResult && aiResult.ai_explanation;
  const data = hasEnhancedData ? aiResult.ai_explanation : null;

  return (
    <div className="h-screen flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-lg mx-auto text-center">
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {hasEnhancedData
            ? data.keywords.map((keyword: string, idx: number) => (
                <span
                  key={idx}
                  className="px-4 py-2 bg-gradient-to-r from-orange-100 to-pink-100 text-orange-700 rounded-full text-sm font-medium shadow-sm"
                >
                  {keyword}
                </span>
              ))
            : finalResult.traits.map((trait: string, idx: number) => (
                <span
                  key={idx}
                  className="px-4 py-2 bg-gradient-to-r from-orange-100 to-pink-100 text-orange-700 rounded-full text-sm font-medium shadow-sm"
                >
                  {trait}
                </span>
              ))}
        </div>

        {hasEnhancedData && (
          <p className="text-2xl sm:text-3xl text-gray-800 font-bold leading-relaxed mb-8">
            {data.one_liner}
          </p>
        )}

        <div className="flex justify-center">
          <span className="flex items-center gap-1 text-orange-600 font-semibold text-sm animate-bounce">
            <span className="text-base">⬇️</span> 아래로 스크롤하세요
          </span>
        </div>
      </div>
    </div>
  );
}

// --- 스토리 섹션 ---
function StorySection({
  finalResult,
  aiResult,
}: {
  finalResult: (typeof SAUCE_TYPES)[keyof typeof SAUCE_TYPES];
  aiResult: any;
}) {
  const hasEnhancedData = aiResult && aiResult.ai_explanation;
  const data = hasEnhancedData ? aiResult.ai_explanation : null;

  return (
    <div className="h-screen flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-2xl mx-auto bg-white rounded-2xl p-8 shadow-lg border border-orange-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-pink-400 rounded-full flex items-center justify-center text-2xl">
            📖
          </div>
          <h3 className="text-2xl font-bold text-gray-800">당신의 이야기</h3>
        </div>

        <div className="space-y-4 text-gray-700 leading-relaxed">
          {hasEnhancedData ? (
            data.type_description.map((paragraph: string, idx: number) => (
              <p key={idx} className="text-base leading-relaxed">
                {paragraph}
              </p>
            ))
          ) : (
            <>
              <p className="text-base leading-relaxed">
                {finalResult.description}
              </p>
              <div className="pt-4 border-t border-gray-100">
                <h4 className="font-semibold text-gray-800 mb-2">
                  업무 스타일
                </h4>
                <p className="text-base leading-relaxed">
                  {finalResult.workStyle}
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// --- 강점 섹션 ---
function StrengthsSection({
  finalResult,
  aiResult,
}: {
  finalResult: (typeof SAUCE_TYPES)[keyof typeof SAUCE_TYPES];
  aiResult: any;
}) {
  const hasEnhancedData = aiResult && aiResult.ai_explanation;
  const data = hasEnhancedData ? aiResult.ai_explanation : null;

  return (
    <div className="h-screen flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-lg mx-auto bg-white rounded-2xl p-8 shadow-lg border border-green-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-400 rounded-full flex items-center justify-center text-2xl">
            💪
          </div>
          <h3 className="text-2xl font-bold text-gray-800">핵심 강점</h3>
        </div>

        <div className="space-y-4">
          {hasEnhancedData
            ? data.strengths.map((strength: string, idx: number) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 p-4 bg-green-50 rounded-xl"
                >
                  <div className="w-3 h-3 bg-green-400 rounded-full flex-shrink-0"></div>
                  <span className="text-lg text-gray-700 font-medium">
                    {strength}
                  </span>
                </div>
              ))
            : finalResult.traits.map((trait: string, idx: number) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 p-4 bg-green-50 rounded-xl"
                >
                  <div className="w-3 h-3 bg-green-400 rounded-full flex-shrink-0"></div>
                  <span className="text-lg text-gray-700 font-medium">
                    {trait}
                  </span>
                </div>
              ))}
        </div>
      </div>
    </div>
  );
}

// --- 성장 가이드 섹션 ---
function GrowthSection({
  finalResult,
  aiResult,
}: {
  finalResult: (typeof SAUCE_TYPES)[keyof typeof SAUCE_TYPES];
  aiResult: any;
}) {
  const hasEnhancedData = aiResult && aiResult.ai_explanation;
  const data = hasEnhancedData ? aiResult.ai_explanation : null;

  return (
    <div className="h-screen flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-2xl mx-auto bg-white rounded-2xl p-8 shadow-lg border border-purple-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-2xl">
            {hasEnhancedData ? "💡" : "🌱"}
          </div>
          <h3 className="text-2xl font-bold text-gray-800">
            {hasEnhancedData ? "성장 가이드" : "발전 방향"}
          </h3>
        </div>

        <div className="space-y-4">
          {hasEnhancedData && data.advice ? (
            data.advice.map((adviceText: string, idx: number) => (
              <div
                key={idx}
                className="p-4 bg-purple-50 rounded-xl border-l-4 border-purple-400"
              >
                <p className="text-base text-gray-700 leading-relaxed">
                  {adviceText}
                </p>
              </div>
            ))
          ) : (
            <div className="p-4 bg-purple-50 rounded-xl border-l-4 border-purple-400">
              <p className="text-base text-gray-700 leading-relaxed">
                {finalResult.improvement}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// --- 닮은 인물 섹션 ---
function CharactersSection({ aiResult }: { aiResult: any }) {
  const hasEnhancedData = aiResult && aiResult.ai_explanation;
  const data = hasEnhancedData ? aiResult.ai_explanation : null;

  if (
    !hasEnhancedData ||
    !data.example_characters ||
    data.example_characters.length === 0
  ) {
    return null;
  }

  return (
    <div className="h-screen flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-2xl mx-auto bg-white rounded-2xl p-8 shadow-lg border border-yellow-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full flex items-center justify-center text-2xl">
            🌟
          </div>
          <h3 className="text-2xl font-bold text-gray-800">닮은 인물</h3>
        </div>

        <div className="space-y-6">
          {data.example_characters.map((character: any, idx: number) => (
            <div
              key={idx}
              className="p-6 bg-yellow-50 rounded-xl border border-yellow-200"
            >
              <h4 className="font-bold text-xl text-gray-800 mb-3">
                {character.name}
              </h4>
              <p className="text-base text-gray-600 leading-relaxed">
                {character.context}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// --- 처리 상태 섹션 (100vh 최적화) ---
function ProcessingStatusSection({
  isProcessingResult,
  webhookError,
}: {
  isProcessingResult: boolean;
  webhookError: string | null;
}) {
  if (isProcessingResult) {
    return (
      <div className="h-screen flex flex-col items-center justify-center px-4">
        <div className="w-full max-w-sm mx-auto text-center">
          <div className="animate-spin w-12 h-12 border-4 border-orange-200 border-t-orange-500 rounded-full mx-auto mb-6"></div>
          <h3 className="text-xl font-bold text-orange-600 mb-3">
            더 자세한 분석을 준비하고 있어요
          </h3>
          <p className="text-gray-600 text-sm mb-6 leading-relaxed">
            잠시만 기다려주세요...
            <br />
            맞춤형 인사이트를 생성 중입니다
          </p>
          <div className="flex justify-center space-x-1">
            {[1, 2, 3].map(i => (
              <div
                key={i}
                className="w-2 h-2 bg-orange-400 rounded-full animate-bounce"
                style={{ animationDelay: `${i * 0.2}s` }}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (webhookError) {
    return (
      <div className="h-screen flex flex-col items-center justify-center px-4">
        <div className="w-full max-w-sm mx-auto text-center">
          <div className="text-4xl mb-4">🔄</div>
          <h3 className="text-lg font-bold text-orange-600 mb-3">
            추가 분석 중 문제가 발생했습니다
          </h3>
          <p className="text-gray-600 text-sm mb-4 leading-relaxed">
            기본 분석 결과는 위에서 확인하실 수 있습니다
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <p className="text-xs text-blue-700 leading-relaxed">
              💡 더 자세한 맞춤 분석은 잠시 후 다시 시도해 주세요
            </p>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

// --- 설문 섹션 (100vh 최적화) ---
function ResultSurveySection({
  submitSurvey,
}: {
  submitSurvey: (survey: SurveyData) => Promise<{ success: boolean }>;
}) {
  return (
    <div className="h-screen flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-lg mx-auto">
        <SurveySection submitSurvey={submitSurvey} />
      </div>
    </div>
  );
}

export function ResultSection({
  finalType,
  onRestart,
  submitSurvey,
  requestId,
  isProcessingResult,
  aiResult,
  webhookError,
}: ResultSectionProps) {
  const finalResult = SAUCE_TYPES[finalType as keyof typeof SAUCE_TYPES];
  const emoji = SAUCE_EMOJIS[finalType] || "🍽️";
  const comment = SAUCE_COMMENTS[finalType] || "나만의 소스를 발견했어요!";

  return (
    <div
      className="overflow-y-auto h-screen snap-y snap-mandatory w-full max-w-4xl mx-auto scroll-smooth hide-scrollbar"
      style={{ scrollSnapType: "y mandatory" }}
    >
      <section className="h-screen snap-start">
        <ResultSummarySection
          finalResult={finalResult}
          emoji={emoji}
          comment={comment}
          onRestart={onRestart}
        />
      </section>

      <section className="h-screen snap-start">
        <KeywordsHeaderSection finalResult={finalResult} aiResult={aiResult} />
      </section>

      <section className="h-screen snap-start">
        <StorySection finalResult={finalResult} aiResult={aiResult} />
      </section>

      <section className="h-screen snap-start">
        <StrengthsSection finalResult={finalResult} aiResult={aiResult} />
      </section>

      <section className="h-screen snap-start">
        <GrowthSection finalResult={finalResult} aiResult={aiResult} />
      </section>

      {aiResult &&
        aiResult.ai_explanation &&
        aiResult.ai_explanation.example_characters &&
        aiResult.ai_explanation.example_characters.length > 0 && (
          <section className="h-screen snap-start">
            <CharactersSection aiResult={aiResult} />
          </section>
        )}

      {(isProcessingResult || webhookError) && (
        <section className="h-screen snap-start">
          <ProcessingStatusSection
            isProcessingResult={isProcessingResult}
            webhookError={webhookError}
          />
        </section>
      )}

      <section className="h-screen snap-start">
        <ResultSurveySection submitSurvey={submitSurvey} />
      </section>
    </div>
  );
}
