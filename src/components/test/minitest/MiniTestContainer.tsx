"use client";

import { useState } from "react";
import { IntroSection } from "./sections/IntroSection";
import { ResultSection } from "./sections/ResultSection";
import { InfoSection } from "./sections/InfoSection";
import { QuestionSection } from "./sections/QuestionSection";

export function MiniTestContainer() {
  const [currentStep, setCurrentStep] = useState<
    "intro" | "question" | "result"
  >("intro");
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [answers, setAnswers] = useState<number[]>([]);
  const [selectedOptions, setSelectedOptions] = useState<number[]>([]);
  const [selectedSorts, setSelectedSorts] = useState<string[]>([]);

  const totalQuestions = 5;

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
      question:
        "모든 과정이 끝났을 때, 어떤 결과가 당신에게 가장 큰 보람을 주나요?",
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

  const questionKeys: (keyof typeof verbQuestions)[] = [
    "first",
    "second",
    "third",
    "fourth",
    "fifth",
  ];

  const handleStartTest = () => {
    setCurrentStep("question");
  };

  const handleSelectOption = (optionIndex: number) => {
    if (selectedOptions.includes(optionIndex)) {
      setSelectedOptions(selectedOptions.filter(opt => opt !== optionIndex));
    } else if (selectedOptions.length < 2) {
      setSelectedOptions([...selectedOptions, optionIndex]);
    }
  };

  const handleNextQuestion = () => {
    if (selectedOptions.length !== 2) return;

    if (currentQuestion === 1) {
      // Get the sorts from the first question selections
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
      setCurrentStep("result");
    }
  };

  const getFilteredOptions = (questionKey: keyof typeof verbQuestions) => {
    if (currentQuestion === 1) {
      return verbQuestions[questionKey].options;
    }

    return verbQuestions[questionKey].options.filter(option =>
      selectedSorts.includes(option.sort)
    );
  };

  const handleRestart = () => {
    setCurrentStep("intro");
    setCurrentQuestion(1);
    setAnswers([]);
    setSelectedOptions([]);
    setSelectedSorts([]);
  };

  const calculateResult = () => {
    const typeScores: { [key: string]: number } = {};

    // Process all answers
    for (let i = 0; i < answers.length; i += 2) {
      const questionIndex = Math.floor(i / 2);
      const questionKey = questionKeys[questionIndex];

      // Get both answers for this question
      const answer1 = answers[i];
      const answer2 = answers[i + 1];

      // Add scores for both answers
      const option1 = verbQuestions[questionKey].options[answer1];
      const option2 = verbQuestions[questionKey].options[answer2];

      typeScores[option1.type] =
        (typeScores[option1.type] || 0) + option1.score;
      typeScores[option2.type] =
        (typeScores[option2.type] || 0) + option2.score;
    }

    // Find the type with highest score
    let maxScore = 0;
    let resultType = "";

    Object.entries(typeScores).forEach(([type, score]) => {
      if (score > maxScore) {
        maxScore = score;
        resultType = type;
      }
    });

    return resultType;
  };

  return (
    <div className="mx-auto max-w-[600px] px-4 py-8">
      {currentStep === "intro" && (
        <>
          <IntroSection onStart={handleStartTest} />
          <InfoSection />
        </>
      )}

      {currentStep === "question" && (
        <QuestionSection
          currentQuestion={currentQuestion}
          totalQuestions={totalQuestions}
          question={verbQuestions[questionKeys[currentQuestion - 1]].question}
          options={getFilteredOptions(questionKeys[currentQuestion - 1])}
          selectedOptions={selectedOptions}
          onSelectOption={handleSelectOption}
          onNext={handleNextQuestion}
        />
      )}

      {currentStep === "result" && (
        <ResultSection
          resultType={calculateResult()}
          onRestart={handleRestart}
        />
      )}

      <footer className="text-center mt-12 text-gray-500 text-sm">
        Copyright © 2025 worksauce All rights reserved
      </footer>
    </div>
  );
}
