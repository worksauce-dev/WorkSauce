"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { IntroSection } from "./sections/IntroSection";
import { VerbTestSection } from "./sections/VerbTestSection";
import { SurveyData } from "@/types/surveyData";
import { verbQuestions } from "./data/testData";
import { MiniTestSection } from "./components/MiniTestSection";
import { useVerbTest } from "./hooks/useVerbTest";
import { useMiniTest } from "./hooks/useMiniTest";
import { getFinalType } from "./utils/calculations";
import { TestStep } from "./types";

interface MiniTestContainerProps {
  submitSurvey: (survey: SurveyData) => Promise<{ success: boolean }>;
}
export function MiniTestV2Container({ submitSurvey }: MiniTestContainerProps) {
  const router = useRouter();
  const [step, setStep] = useState<TestStep>("intro");

  const verbTest = useVerbTest();
  const miniTest = useMiniTest();

  const handleMiniTestFinish = async () => {
    const finalType = getFinalType(verbTest.answers, miniTest.miniTestAnswers);

    try {
      router.push(`/mini-testV2/${finalType}`);
    } catch (error) {
      console.error("Failed to send webhook:", error);
      router.push(`/mini-testV2/${finalType}`);
    }
  };

  const handleRestart = () => {
    setStep("intro");
    verbTest.reset();
    miniTest.reset();
  };

  return (
    <div className="min-h-screen mx-auto max-w-[600px] flex justify-center items-center flex-col">
      {step === "intro" && <IntroSection onStart={() => setStep("verb")} />}

      {step === "verb" && (
        <VerbTestSection
          currentQuestion={verbTest.currentQuestion}
          totalQuestions={verbTest.totalQuestions}
          question={
            verbQuestions[verbTest.questionKeys[verbTest.currentQuestion - 1]]
              .question
          }
          options={verbTest.getFilteredOptions(
            verbTest.questionKeys[verbTest.currentQuestion - 1]
          )}
          selectedOptions={verbTest.selectedOptions}
          onSelectOption={verbTest.handleSelectOption}
          onNext={() => verbTest.handleNext(() => setStep("mini"))}
        />
      )}

      {step === "mini" && (
        <MiniTestSection
          currentTypeIdx={miniTest.currentTypeIdx}
          miniTestAnswers={miniTest.miniTestAnswers}
          onAnswer={miniTest.handleAnswer}
          onNext={miniTest.handleNextType}
          onFinish={handleMiniTestFinish}
          isComplete={miniTest.isCurrentTypeComplete()}
          isLastType={miniTest.isLastType()}
        />
      )}

      <footer className="text-center mt-12 text-gray-500 text-sm">
        Copyright © 2025 worksauce All rights reserved
      </footer>
    </div>
  );
}
