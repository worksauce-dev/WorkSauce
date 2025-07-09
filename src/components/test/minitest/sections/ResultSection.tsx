"use client";

import { MdShare, MdContentCopy, MdRefresh } from "react-icons/md";
import { SurveySection } from "./SurveySection";
import { useState, useRef, useEffect, useCallback } from "react";
import { SurveyData } from "@/types/surveyData";
import { workflowContent } from "@/constants/saucetest";

declare global {
  interface Window {
    Kakao: {
      Link: {
        sendDefault: (options: {
          objectType: string;
          content: {
            title: string;
            description: string;
            imageUrl: string;
            link: {
              mobileWebUrl: string;
              webUrl: string;
            };
          };
          buttons: Array<{
            title: string;
            link: {
              mobileWebUrl: string;
              webUrl: string;
            };
          }>;
        }) => void;
      };
    };
  }
}

interface ResultSectionProps {
  finalType: string;
  onRestart: () => void;
  submitSurvey: (survey: SurveyData) => Promise<{ success: boolean }>;
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

// --- 섹션 이동 커스텀 훅 ---
function useSectionNavigation(sectionCount: number) {
  const [activeSection, setActiveSection] = useState(0);
  const sectionContainerRef = useRef<HTMLDivElement>(null);
  const sectionCooldown = 600; // ms
  const lastScrollTimeRef = useRef<number>(0);

  const goToSection = useCallback(
    (idx: number) => {
      if (idx < 0 || idx >= sectionCount) return;
      setActiveSection(idx);
    },
    [sectionCount]
  );
  const nextSection = () => goToSection(activeSection + 1);
  const prevSection = () => goToSection(activeSection - 1);

  // 키보드 좌우 이동 지원
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") nextSection();
      else if (e.key === "ArrowLeft") prevSection();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeSection]);

  // 터치(스와이프) 이동 지원 (Y축)
  useEffect(() => {
    let touchStartY = 0;
    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };
    const handleTouchEnd = (e: TouchEvent) => {
      const now = Date.now();
      if (now - lastScrollTimeRef.current < sectionCooldown) return;
      lastScrollTimeRef.current = now;
      const touchEndY = e.changedTouches[0].clientY;
      const diff = touchStartY - touchEndY;
      if (diff > 50) nextSection();
      else if (diff < -50) prevSection();
    };
    const container = sectionContainerRef.current;
    if (container) {
      container.addEventListener("touchstart", handleTouchStart);
      container.addEventListener("touchend", handleTouchEnd);
    }
    return () => {
      if (container) {
        container.removeEventListener("touchstart", handleTouchStart);
        container.removeEventListener("touchend", handleTouchEnd);
      }
    };
  }, [activeSection]);

  // 휠(마우스 스크롤) 이동 지원 (Y축)
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const now = Date.now();
      if (now - lastScrollTimeRef.current < sectionCooldown) return;
      lastScrollTimeRef.current = now;
      if (e.deltaY > 0) {
        nextSection();
      } else if (e.deltaY < 0) {
        prevSection();
      }
    };
    const container = sectionContainerRef.current;
    if (container) {
      container.addEventListener("wheel", handleWheel, { passive: false });
    }
    return () => {
      if (container) {
        container.removeEventListener("wheel", handleWheel);
      }
    };
  }, [activeSection]);

  return {
    activeSection,
    goToSection,
    nextSection,
    prevSection,
    sectionContainerRef,
  };
}

// --- 결과 섹션 ---
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
    <div className="px-4 py-8 sm:p-0 min-h-screen flex flex-col items-center justify-center space-y-8 animate-fadein-pop">
      <div className="relative w-full max-w-lg mx-auto">
        <div
          className={`absolute left-1/2 -translate-x-1/2 -top-16 w-32 h-32 rounded-full blur-xl opacity-60 z-0 bg-gradient-to-br ${finalResult.color}`}
        ></div>
        <div className="relative z-10 flex flex-col items-center">
          <div className="text-7xl mb-2 drop-shadow-lg animate-pop">
            {emoji}
          </div>
          <div className="flex flex-col items-center mb-1">
            <span className="text-base font-medium text-gray-400 mb-1">
              당신의 워크소스는
            </span>
            <span className="text-4xl sm:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-br from-orange-500 to-pink-500 animate-gradient drop-shadow-lg">
              {finalResult.name}
            </span>
          </div>
          <div className="text-lg font-bold text-orange-600 animate-fadein-slow">
            {finalResult.tagline}
          </div>
        </div>
      </div>
      <div className="flex flex-wrap justify-center gap-2 mb-2">
        {finalResult.traits.map((trait, index) => (
          <span
            key={index}
            className="px-4 py-2 rounded-full text-sm font-semibold shadow-sm bg-gradient-to-br from-orange-100 to-orange-200 text-orange-700 border border-orange-200"
          >
            {trait}
          </span>
        ))}
      </div>
      <div className="text-base font-semibold text-pink-600 mb-2 animate-bounce">
        {comment}
      </div>
      <div className="flex gap-4 mt-4">
        {/* <button className="flex items-center gap-2 px-7 py-3 rounded-2xl bg-gradient-to-r from-orange-400 to-pink-400 text-white font-bold shadow-lg hover:from-orange-500 hover:to-pink-500 hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-300">
          <MdShare className="text-base sm:text-xl" />
          <span className="text-base sm:text-xl">공유하기</span>
        </button> */}
        <button
          onClick={onRestart}
          className="flex items-center gap-2 px-7 py-3 rounded-2xl bg-gradient-to-r from-pink-400 to-orange-400 text-white font-bold shadow-lg hover:from-pink-500 hover:to-orange-500 hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-pink-200"
        >
          <MdRefresh className="text-base sm:text-xl" />
          <span className="text-base sm:text-xl">다시 테스트하기</span>
        </button>
      </div>
    </div>
  );
}

// --- 설명 섹션 ---
function ResultDescriptionSection({
  finalResult,
  finalType,
}: {
  finalResult: (typeof SAUCE_TYPES)[keyof typeof SAUCE_TYPES];
  finalType: string;
}) {
  return (
    <div className="px-2 py-4 sm:p-0 min-h-screen flex flex-col items-center justify-center">
      <div className="w-full max-w-xl flex flex-col gap-4 bg-gradient-to-br from-orange-50 via-white to-blue-50 rounded-2xl shadow-md p-6 border border-orange-100">
        <div className="flex flex-col gap-3">
          {[
            {
              icon: "💡",
              color: "bg-orange-100",
              title: "설명",
              text: finalResult.description,
              titleColor: "text-orange-600",
              bg: "bg-orange-50",
            },
            {
              icon: "🚀",
              color: "bg-blue-100",
              title: "업무 추진 방향성",
              text: finalResult.workStyle,
              titleColor: "text-blue-600",
              bg: "bg-blue-50",
            },
            {
              icon: "🌱",
              color: "bg-green-100",
              title: "이 유형을 보완하는 방법",
              text: finalResult.improvement,
              titleColor: "text-green-600",
              bg: "bg-green-50",
            },
          ].map(({ icon, color, title, text, titleColor, bg }) => (
            <div
              key={title}
              className={`flex items-start gap-3 rounded-xl ${bg} p-3 shadow-sm`}
            >
              <div
                className={`flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-full ${color} shadow text-xl animate-bounce`}
              >
                {icon}
              </div>
              <div>
                <div className={`font-bold ${titleColor} text-sm mb-0.5`}>
                  {title}
                </div>
                <div className="text-gray-800 leading-relaxed text-xs">
                  {text}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="border-t border-gray-200 my-1" />
        {workflowContent[finalType as keyof typeof workflowContent] && (
          <div className="flex flex-col gap-2">
            <div>
              <div className="font-bold text-orange-600 text-sm mb-1">
                이 유형의 핵심 동사
              </div>
              <div className="flex flex-wrap gap-1">
                {workflowContent[
                  finalType as keyof typeof workflowContent
                ].verbs
                  .split(" - ")
                  .map((verb: string, idx: number) => (
                    <span
                      key={verb}
                      className={`px-2 py-0.5 rounded-full text-white text-xs font-medium shadow-sm border border-white bg-gradient-to-r from-orange-400 to-pink-400 hover:scale-105 transition-transform duration-150`}
                    >
                      {verb}
                    </span>
                  ))}
              </div>
            </div>
            <div>
              <div className="font-bold text-blue-600 text-sm mb-1">
                업무 추진 단계
              </div>
              <ol className="relative border-l-2 border-blue-200 pl-4">
                {workflowContent[
                  finalType as keyof typeof workflowContent
                ].steps.map(
                  (step: { action: string; content: string }, idx: number) => (
                    <li key={idx} className="mb-3 ml-2 flex items-start gap-2">
                      <div className="relative">
                        <div className="w-3 h-3 bg-gradient-to-br from-blue-400 to-pink-400 rounded-full border-2 border-white animate-pulse"></div>
                        {idx <
                          workflowContent[
                            finalType as keyof typeof workflowContent
                          ].steps.length -
                            1 && (
                          <div className="absolute left-1/2 top-full w-0.5 h-6 bg-gradient-to-b from-blue-200 to-pink-200 -translate-x-1/2"></div>
                        )}
                      </div>
                      <div>
                        <div className="font-bold text-blue-700 text-xs">
                          {step.action}
                        </div>
                        <div className="text-gray-700 text-xs">
                          {step.content}
                        </div>
                      </div>
                    </li>
                  )
                )}
              </ol>
            </div>
          </div>
        )}
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
    <div className="px-4 py-8 sm:p-0 min-h-screen flex flex-col items-center justify-center ">
      <SurveySection submitSurvey={submitSurvey} />
    </div>
  );
}

export function ResultSection({
  finalType,
  onRestart,
  submitSurvey,
}: ResultSectionProps) {
  const finalResult = SAUCE_TYPES[finalType as keyof typeof SAUCE_TYPES];
  const emoji = SAUCE_EMOJIS[finalType] || "🍽️";
  const comment = SAUCE_COMMENTS[finalType] || "나만의 소스를 발견했어요!";
  const sectionCount = 3;
  const { activeSection, goToSection, sectionContainerRef } =
    useSectionNavigation(sectionCount);

  return (
    <div className="relative overflow-hidden w-full max-w-2xl mx-auto">
      {/* 인디케이터: 화면 우측 중앙에 고정 */}
      <div className="fixed right-8 top-1/2 -translate-y-1/2 z-50 md:flex-col gap-4 hidden md:flex">
        {[...Array(sectionCount)].map((_, idx) => (
          <button
            key={idx}
            onClick={() => goToSection(idx)}
            className={`w-4 h-4 rounded-full transition-all duration-300 border-2 ${
              activeSection === idx
                ? "bg-orange-500 border-orange-500 scale-125"
                : "bg-gray-300 border-gray-300 hover:bg-gray-400"
            }`}
            aria-label={`섹션 ${idx + 1}`}
          />
        ))}
      </div>
      {/* 섹션 컨테이너 */}
      <div
        ref={sectionContainerRef}
        className="flex flex-col transition-transform duration-700 ease-in-out"
        style={{ transform: `translateY(-${activeSection * 100}vh)` }}
      >
        <ResultSummarySection
          finalResult={finalResult}
          emoji={emoji}
          comment={comment}
          onRestart={onRestart}
        />
        <ResultDescriptionSection
          finalResult={finalResult}
          finalType={finalType}
        />
        <ResultSurveySection submitSurvey={submitSurvey} />
      </div>
    </div>
  );
}
