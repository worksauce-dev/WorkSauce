"use client";

import { useState } from "react";
import { IntroSection } from "./sections/IntroSection";
import { ResultSection } from "./sections/ResultSection";
import { QuestionSection } from "./sections/QuestionSection";
import { SurveyData } from "@/types/surveyData";

// 미니테스트 유형별 문항 데이터 (함수 바깥으로 이동)
const miniTestQuestions = [
  {
    type: "기준윤리형",
    questions: [
      {
        text: "일상에서 부조리하거나 불공정한 상황을 보면, 감정적으로 크게 반응하는 편인가요?",
        baseScore: 3,
      },
      {
        text: "주변에서 '원칙을 중시하고 융통성이 부족하다'는 말을 들은 적이 있나요?",
        baseScore: 2,
      },
      {
        text: "맡은 일에 책임감을 갖고, 약속을 반드시 지키려 노력하는 편인가요?",
        baseScore: 0,
      },
    ],
  },
  {
    type: "기준심미형",
    questions: [
      {
        text: "특별한 의미가 담긴 물건이나 추억(예: 기념품, 사진, 편지, 디지털 파일 등)을 소중하게 모아두는 편인가요?",
        baseScore: 3,
      },
      {
        text: "당신은 겉으로 드러나는 모습뿐 아니라, 그 이면에 담긴 의미나 가치를 깊이 생각하고 탐구하는 편인가요?",
        baseScore: 2,
      },
      {
        text: "어떤 상황이든 한 가지 시각이 아니라, 다양한 관점에서 이해하려고 노력하는 편인가요?",
        baseScore: 0,
      },
    ],
  },
  {
    type: "예술느낌형",
    questions: [
      {
        text: "스스로의 생각이나 행동에 제한을 두지 않고, 자유롭게 새로운 가능성을 탐색하는 것을 중요하게 여기나요?",
        baseScore: 3,
      },
      {
        text: "'나는 어떤 사람인가?'와 같은 자기 성찰 질문이 자신을 이해하는 데 도움이 되었나요?",
        baseScore: 2,
      },
      {
        text: "자신의 감정을 솔직하게 표현하고, 그 감정을 바탕으로 다른 사람과 소통하는 편인가요?",
        baseScore: 0,
      },
    ],
  },
  {
    type: "예술융합형",
    questions: [
      {
        text: "기존의 방식이나 관습을 벗어나 새로운 시도를 할 때, 특별한 흥미나 열정을 느끼는 편인가요?",
        baseScore: 3,
      },
      {
        text: "새로운 것을 시도하고 창의적인 방법을 찾는 것을 얼마나 좋아하시나요?",
        baseScore: 2,
      },
      {
        text: "다양한 분야의 사람들과 네트워크를 쌓는 것이 얼마나 중요하다고 느끼시나요?",
        baseScore: 0,
      },
    ],
  },
  {
    type: "이해관리형",
    questions: [
      {
        text: "업무나 프로젝트에서 위험(리스크)과 불확실성을 얼마나 신경 쓰고 관리하시나요?",
        baseScore: 3,
      },
      {
        text: "업무나 과제에서 신뢰할 수 있는 사람이나 시스템에 의지하는 편이신가요?",
        baseScore: 2,
      },
      {
        text: "자신의 강점이 성실함과 안정감에 있다고 생각하시나요?",
        baseScore: 0,
      },
    ],
  },
  {
    type: "이해연구형",
    questions: [
      {
        text: "복잡한 아이디어나 개념을 깊이 있게 탐구하는 것을 즐기시나요?",
        baseScore: 3,
      },
      {
        text: "일이나 의사결정에서 항상 객관성을 유지하려고 노력하시나요?",
        baseScore: 2,
      },
      {
        text: "필요한 정보를 효과적으로 수집하고 정리하는 데 자신이 있으신가요?",
        baseScore: 0,
      },
    ],
  },
  {
    type: "소통도움형",
    questions: [
      {
        text: "사람들과 깊고 의미 있는 관계를 형성하는 데 자신이 있으신가요?",
        baseScore: 3,
      },
      {
        text: "다른 사람이 말로 표현하지 않는 감정이나 생각을 잘 알아차린다고 느끼시나요?",
        baseScore: 2,
      },
      {
        text: "다른 사람의 문제나 상황에 대해 다양한 해결 방안을 제시하는 데 자신이 있으신가요?",
        baseScore: 0,
      },
    ],
  },
  {
    type: "소통조화형",
    questions: [
      {
        text: "여러 사람의 다양한 의견이나 입장 사이에서 조화를 이루는 것이 쉽다고 느끼시나요?",
        baseScore: 3,
      },
      {
        text: "팀에서 긍정적인 에너지로 동기를 부여하고, 모두가 성장할 수 있는 환경을 만드는 데 기여한다고 느끼시나요?",
        baseScore: 2,
      },
      {
        text: "결정은 신중하게 내리지만, 한 번 결심하면 끝까지 해내는 편이신가요?",
        baseScore: 0,
      },
    ],
  },
  {
    type: "도전확장형",
    questions: [
      {
        text: "편안한 상황을 벗어나 새로운 경험에 도전하는 것을 즐기는 편이신가요?",
        baseScore: 3,
      },
      {
        text: "세부적인 부분보다 전체적인 흐름이나 큰 그림을 보는 것을 더 선호하시나요?",
        baseScore: 2,
      },
      {
        text: "계획을 세우고 일을 키워나가는 것에 얼마나 자신 있으신가요?",
        baseScore: 0,
      },
    ],
  },
  {
    type: "도전목표형",
    questions: [
      {
        text: "목표를 설정하고 계획적으로 달성해 나가는 편인가요?",
        baseScore: 3,
      },
      { text: "당신에게 결과와 성과는 얼마나 중요한가요?", baseScore: 2 },
      {
        text: "업무를 효율적으로 처리하고 생산성을 높이는 데 자신이 있으신가요?",
        baseScore: 0,
      },
    ],
  },
];

const verbQuestions = {
  first: {
    question: "일을 시작할 때 가장 자주 사용하는 행동은?",
    options: [
      { type: "기준윤리형", verb: "인식하다", score: 1, sort: "기준형" },
      { type: "기준심미형", verb: "기억하다", score: 1, sort: "기준형" },
      { type: "예술느낌형", verb: "느끼다", score: 1, sort: "예술형" },
      { type: "예술융합형", verb: "주목하다", score: 1, sort: "예술형" },
      { type: "이해관리형", verb: "알다", score: 1, sort: "이해형" },
      { type: "이해연구형", verb: "탐색하다", score: 1, sort: "이해형" },
      { type: "소통도움형", verb: "대화하다", score: 1, sort: "소통형" },
      { type: "소통조화형", verb: "참여하다", score: 1, sort: "소통형" },
      { type: "도전확장형", verb: "탐험하다", score: 1, sort: "도전형" },
      { type: "도전목표형", verb: "도전하다", score: 1, sort: "도전형" },
    ],
  },
  second: {
    question: "아이디어를 발전시킬 때 가장 즐겨 사용하는 방식은?",
    options: [
      { type: "기준윤리형", verb: "판정하다", score: 1, sort: "기준형" },
      { type: "기준윤리형", verb: "검토하다", score: 1, sort: "기준형" },
      { type: "기준심미형", verb: "분류하다", score: 1, sort: "기준형" },
      { type: "기준심미형", verb: "준비하다", score: 1, sort: "기준형" },
      { type: "예술느낌형", verb: "발견하다", score: 1, sort: "예술형" },
      { type: "예술느낌형", verb: "사색하다", score: 1, sort: "예술형" },
      { type: "예술융합형", verb: "상상하다", score: 1, sort: "예술형" },
      { type: "예술융합형", verb: "구상하다", score: 1, sort: "예술형" },
      { type: "이해관리형", verb: "확인하다", score: 1, sort: "이해형" },
      { type: "이해관리형", verb: "설계하다", score: 1, sort: "이해형" },
      { type: "이해연구형", verb: "연구하다", score: 1, sort: "이해형" },
      { type: "이해연구형", verb: "검사하다", score: 1, sort: "이해형" },
      { type: "소통도움형", verb: "이해하다", score: 1, sort: "소통형" },
      { type: "소통도움형", verb: "공감하다", score: 1, sort: "소통형" },
      { type: "소통조화형", verb: "분석하다", score: 1, sort: "소통형" },
      { type: "소통조화형", verb: "이해하다", score: 1, sort: "소통형" },
      { type: "도전확장형", verb: "깨닫다", score: 1, sort: "도전형" },
      { type: "도전확장형", verb: "기획하다", score: 1, sort: "도전형" },
      { type: "도전목표형", verb: "생각하다", score: 1, sort: "도전형" },
      { type: "도전목표형", verb: "계획하다", score: 1, sort: "도전형" },
    ],
  },
  third: {
    question: "아이디어를 실현할 때 가장 자신 있는 방식은?",
    options: [
      { type: "기준윤리형", verb: "조직하다", score: 1, sort: "기준형" },
      { type: "기준윤리형", verb: "숙달하다", score: 1, sort: "기준형" },
      { type: "기준심미형", verb: "제작하다", score: 1, sort: "기준형" },
      { type: "기준심미형", verb: "구현하다", score: 1, sort: "기준형" },
      { type: "예술느낌형", verb: "창조하다", score: 1, sort: "예술형" },
      { type: "예술느낌형", verb: "만들다", score: 1, sort: "예술형" },
      { type: "예술융합형", verb: "융합하다", score: 1, sort: "예술형" },
      { type: "예술융합형", verb: "연출하다", score: 1, sort: "예술형" },
      { type: "이해관리형", verb: "구축하다", score: 1, sort: "이해형" },
      { type: "이해관리형", verb: "수정하다", score: 1, sort: "이해형" },
      { type: "이해연구형", verb: "기록하다", score: 1, sort: "이해형" },
      { type: "이해연구형", verb: "개발하다", score: 1, sort: "이해형" },
      { type: "소통도움형", verb: "구성하다", score: 1, sort: "소통형" },
      { type: "소통도움형", verb: "찾다", score: 1, sort: "소통형" },
      { type: "소통조화형", verb: "중재하다", score: 1, sort: "소통형" },
      { type: "소통조화형", verb: "통합하다", score: 1, sort: "소통형" },
      { type: "도전확장형", verb: "경영하다", score: 1, sort: "도전형" },
      { type: "도전확장형", verb: "확장하다", score: 1, sort: "도전형" },
      { type: "도전목표형", verb: "경쟁하다", score: 1, sort: "도전형" },
      { type: "도전목표형", verb: "향상하다", score: 1, sort: "도전형" },
    ],
  },
  fourth: {
    question: "완성된 아이디어를 세상과 나눌 때 가장 편안한 방식은?",
    options: [
      { type: "기준윤리형", verb: "안내하다", score: 1, sort: "기준형" },
      { type: "기준윤리형", verb: "지도하다", score: 1, sort: "기준형" },
      { type: "기준심미형", verb: "의사소통하다", score: 1, sort: "기준형" },
      { type: "기준심미형", verb: "공유하다", score: 1, sort: "기준형" },
      { type: "예술느낌형", verb: "공연하다", score: 1, sort: "예술형" },
      { type: "예술느낌형", verb: "표현하다", score: 1, sort: "예술형" },
      { type: "예술융합형", verb: "전시하다", score: 1, sort: "예술형" },
      { type: "예술융합형", verb: "보여주다", score: 1, sort: "예술형" },
      { type: "이해관리형", verb: "알리다", score: 1, sort: "이해형" },
      { type: "이해관리형", verb: "전달하다", score: 1, sort: "이해형" },
      { type: "이해연구형", verb: "발표하다", score: 1, sort: "이해형" },
      { type: "이해연구형", verb: "설명하다", score: 1, sort: "이해형" },
      { type: "소통도움형", verb: "돕다", score: 1, sort: "소통형" },
      { type: "소통도움형", verb: "보호하다", score: 1, sort: "소통형" },
      { type: "소통조화형", verb: "협력하다", score: 1, sort: "소통형" },
      { type: "소통조화형", verb: "상담하다", score: 1, sort: "소통형" },
      { type: "도전확장형", verb: "가르치다", score: 1, sort: "도전형" },
      { type: "도전확장형", verb: "멘토링하다", score: 1, sort: "도전형" },
      { type: "도전목표형", verb: "홍보하다", score: 1, sort: "도전형" },
      { type: "도전목표형", verb: "컨설팅하다", score: 1, sort: "도전형" },
    ],
  },
  fifth: {
    question: "어떤 결과가 당신에게 가장 큰 보람을 주나요?",
    options: [
      { type: "기준윤리형", verb: "개선하다", score: 1, sort: "기준형" },
      { type: "기준윤리형", verb: "완수하다", score: 1, sort: "기준형" },
      { type: "기준심미형", verb: "감동시키다", score: 1, sort: "기준형" },
      { type: "기준심미형", verb: "유지하다", score: 1, sort: "기준형" },
      { type: "예술느낌형", verb: "꿈꾸다", score: 1, sort: "예술형" },
      { type: "예술느낌형", verb: "살다", score: 1, sort: "예술형" },
      { type: "예술융합형", verb: "흥분시키다", score: 1, sort: "예술형" },
      { type: "예술융합형", verb: "즐겁게하다", score: 1, sort: "예술형" },
      { type: "이해관리형", verb: "해결하다", score: 1, sort: "이해형" },
      { type: "이해관리형", verb: "안정화시키다", score: 1, sort: "이해형" },
      { type: "이해연구형", verb: "향상시키다", score: 1, sort: "이해형" },
      { type: "이해연구형", verb: "정립하다", score: 1, sort: "이해형" },
      { type: "소통도움형", verb: "영향을 미치다", score: 1, sort: "소통형" },
      { type: "소통도움형", verb: "회복시키다", score: 1, sort: "소통형" },
      { type: "소통조화형", verb: "웃게하다", score: 1, sort: "소통형" },
      { type: "소통조화형", verb: "조화롭게하다", score: 1, sort: "소통형" },
      { type: "도전확장형", verb: "활발하게하다", score: 1, sort: "도전형" },
      { type: "도전확장형", verb: "성장시키다", score: 1, sort: "도전형" },
      { type: "도전목표형", verb: "성취하다", score: 1, sort: "도전형" },
      { type: "도전목표형", verb: "빛내다", score: 1, sort: "도전형" },
    ],
  },
};

interface MiniTestContainerProps {
  submitSurvey: (survey: SurveyData) => Promise<{ success: boolean }>;
}
export function MiniTestContainer({ submitSurvey }: MiniTestContainerProps) {
  // step 상태를 하나로 통합
  const [step, setStep] = useState<"intro" | "verb" | "mini" | "result">(
    "intro"
  );

  // 동사테스트 상태
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [answers, setAnswers] = useState<number[]>([]);
  const [selectedOptions, setSelectedOptions] = useState<number[]>([]);
  const [selectedSorts, setSelectedSorts] = useState<string[]>([]);

  // 미니테스트 상태
  const [miniTestAnswers, setMiniTestAnswers] = useState<number[][]>(
    miniTestQuestions.map(q => Array(q.questions.length).fill(0))
  );

  // 미니테스트 유형별 진행 인덱스 상태 추가
  const [currentTypeIdx, setCurrentTypeIdx] = useState(0);

  const totalQuestions = 5;

  const questionKeys: (keyof typeof verbQuestions)[] = [
    "first",
    "second",
    "third",
    "fourth",
    "fifth",
  ];

  // 미니테스트 점수 집계 (유형별)
  const calculateMiniTypeScores = () => {
    return miniTestQuestions.map((typeBlock, typeIdx) => {
      const total = typeBlock.questions.reduce(
        (sum, q, qIdx) => sum + (miniTestAnswers[typeIdx][qIdx] || 0),
        0
      );
      return { type: typeBlock.type, total };
    });
  };

  // 동사테스트 점수 집계 (유형별)
  const calculateVerbTypeScores = () => {
    const typeScores: { [key: string]: number } = {};
    for (let i = 0; i < answers.length; i += 2) {
      const questionIndex = Math.floor(i / 2);
      const questionKey = questionKeys[questionIndex];
      const answer1 = answers[i];
      const answer2 = answers[i + 1];
      const option1 = verbQuestions[questionKey].options[answer1];
      const option2 = verbQuestions[questionKey].options[answer2];
      typeScores[option1.type] =
        (typeScores[option1.type] || 0) + option1.score;
      typeScores[option2.type] =
        (typeScores[option2.type] || 0) + option2.score;
    }
    // { type, total }[] 형태로 변환
    return Object.entries(typeScores).map(([type, total]) => ({ type, total }));
  };

  // 두 테스트 점수 합산 및 최종 유형 산출
  const getFinalType = () => {
    const verbScores = calculateVerbTypeScores();
    const miniScores = calculateMiniTypeScores();
    const allTypes = Array.from(
      new Set([...verbScores.map(v => v.type), ...miniScores.map(m => m.type)])
    );
    let maxType = "";
    let maxScore = -Infinity;
    allTypes.forEach(type => {
      const verb = verbScores.find(v => v.type === type)?.total || 0;
      const mini = miniScores.find(m => m.type === type)?.total || 0;
      const total = verb + mini;
      if (total > maxScore) {
        maxScore = total;
        maxType = type;
      }
    });
    return maxType;
  };

  // 동사테스트 문항 진행 핸들러
  const handleVerbSelectOption = (optionIndex: number) => {
    if (selectedOptions.includes(optionIndex)) {
      setSelectedOptions(selectedOptions.filter(opt => opt !== optionIndex));
    } else if (selectedOptions.length < 2) {
      setSelectedOptions([...selectedOptions, optionIndex]);
    }
  };
  const handleVerbNext = () => {
    if (selectedOptions.length !== 2) return;
    if (currentQuestion === 1) {
      const sorts = selectedOptions.map(
        opt => verbQuestions.first.options[opt].sort
      );
      setSelectedSorts(sorts);
    }
    const newAnswers = [...answers, ...selectedOptions];
    setAnswers(newAnswers);
    setSelectedOptions([]);
    if (currentQuestion < totalQuestions) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setStep("mini");
      setCurrentQuestion(1);
      setAnswers(newAnswers); // 최종 저장
    }
  };
  const getFilteredVerbOptions = (questionKey: keyof typeof verbQuestions) => {
    if (currentQuestion === 1) {
      return verbQuestions[questionKey].options;
    }
    return verbQuestions[questionKey].options.filter(option =>
      selectedSorts.includes(option.sort)
    );
  };

  // 미니테스트 문항별 답변 핸들러
  const handleMiniTestAnswer = (
    typeIdx: number,
    qIdx: number,
    score: number
  ) => {
    setMiniTestAnswers(prev => {
      const updated = prev.map(arr => [...arr]);
      updated[typeIdx][qIdx] = score;
      return updated;
    });
  };

  // 미니테스트 다음 유형으로 이동
  const handleMiniTestNextType = () => {
    setCurrentTypeIdx(idx => idx + 1);
  };

  const handleMiniTestFinish = () => {
    setStep("result");
  };

  // 리셋 핸들러
  const handleRestart = () => {
    setStep("intro");
    setCurrentQuestion(1);
    setAnswers([]);
    setSelectedOptions([]);
    setSelectedSorts([]);
    setMiniTestAnswers(
      miniTestQuestions.map(q => Array(q.questions.length).fill(0))
    );
    setCurrentTypeIdx(0);
  };

  // 미니테스트 UI (유형별로 한 번에 3문제씩만 보여주기)
  const renderMiniTest = () => {
    const typeBlock = miniTestQuestions[currentTypeIdx];
    return (
      <div className="max-w-xl bg-white rounded-2xl shadow-lg p-8 w-full">
        {/* 진행률 & 제목 */}
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-extrabold mb-2 text-orange-600 tracking-tight flex items-center justify-center gap-2">
            문항에 답해주세요
          </h2>
          <p className="text-sm text-gray-500 mt-2 flex items-center justify-center gap-1">
            <span className="text-base">👉</span>각 문항마다{" "}
            <span className="text-orange-500 font-bold">1~5점</span> 중
            선택해주세요
          </p>
          <div className="mt-2 text-xs text-gray-400">
            <span className="font-bold text-orange-500">1</span>=매우 그렇지
            않다, <span className="font-bold text-orange-500">5</span>=매우
            그렇다
          </div>
          <div className="mt-2 text-xs text-gray-400">
            유형 진행: {currentTypeIdx + 1} / {miniTestQuestions.length}
          </div>
        </div>
        <section className="bg-gray-50 rounded-xl shadow p-6 border border-gray-100 h-[400px] sm:h-[400px] flex flex-col justify-evenly">
          {typeBlock.questions.map((q, qIdx) => (
            <div
              key={qIdx}
              className="gap-2 sm:gap-3 flex flex-col mb-4 sm:mb-6 last:mb-0"
            >
              <div className="flex items-center">
                <span className="text-orange-500 font-bold mr-2">
                  {qIdx + 1}.
                </span>
                <span className="text-gray-900 font-medium text-sm sm:text-base">
                  {q.text}
                </span>
              </div>
              <div className="flex gap-8 justify-center">
                {[1, 2, 3, 4, 5].map(score => (
                  <button
                    key={score}
                    type="button"
                    onClick={() =>
                      handleMiniTestAnswer(currentTypeIdx, qIdx, score)
                    }
                    className={`w-6 h-6 text-xs sm:text-base sm:w-9 sm:h-9 rounded-full flex items-center justify-center font-bold border-2
                      ${
                        miniTestAnswers[currentTypeIdx][qIdx] === score
                          ? "bg-orange-500 text-white border-orange-500 scale-110"
                          : "bg-white text-gray-400 border-gray-300 hover:border-orange-300"
                      }
                      transition`}
                    aria-label={`${score}점`}
                  >
                    {score}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </section>
        {currentTypeIdx < miniTestQuestions.length - 1 ? (
          <button
            className="w-full py-3 bg-gradient-to-r from-orange-500 via-pink-500 to-yellow-400 text-white rounded-xl font-bold mt-10 shadow-md hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleMiniTestNextType}
            disabled={miniTestAnswers[currentTypeIdx].some(ans => ans === 0)}
          >
            다음
          </button>
        ) : (
          <button
            className="w-full py-3 bg-gradient-to-r from-orange-500 via-pink-500 to-yellow-400 text-white rounded-xl font-bold mt-10 shadow-md hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleMiniTestFinish}
            disabled={miniTestAnswers[currentTypeIdx].some(ans => ans === 0)}
          >
            결과 보기
          </button>
        )}
      </div>
    );
  };

  // 렌더링 분기
  return (
    <div className="min-h-screen mx-auto max-w-[600px] flex justify-center items-center flex-col">
      {step === "intro" && (
        <>
          <IntroSection onStart={() => setStep("verb")} />
        </>
      )}
      {step === "verb" && (
        <QuestionSection
          currentQuestion={currentQuestion}
          totalQuestions={totalQuestions}
          question={verbQuestions[questionKeys[currentQuestion - 1]].question}
          options={getFilteredVerbOptions(questionKeys[currentQuestion - 1])}
          selectedOptions={selectedOptions}
          onSelectOption={handleVerbSelectOption}
          onNext={handleVerbNext}
        />
      )}
      {step === "mini" && renderMiniTest()}
      {step === "result" && (
        <ResultSection
          finalType={getFinalType()}
          onRestart={handleRestart}
          submitSurvey={submitSurvey}
        />
      )}
      <footer className="text-center mt-12 text-gray-500 text-sm">
        Copyright © 2025 worksauce All rights reserved
      </footer>
    </div>
  );
}
