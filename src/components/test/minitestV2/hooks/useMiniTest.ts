import { useState } from "react";
import { miniTestQuestions } from "../data/testData";

export const useMiniTest = () => {
  const [miniTestAnswers, setMiniTestAnswers] = useState<number[][]>(
    miniTestQuestions.map(q => Array(q.questions.length).fill(0))
  );
  const [currentTypeIdx, setCurrentTypeIdx] = useState(0);

  const handleAnswer = (typeIdx: number, qIdx: number, score: number) => {
    setMiniTestAnswers(prev => {
      const updated = prev.map(arr => [...arr]);
      updated[typeIdx][qIdx] = score;
      return updated;
    });
  };

  const handleNextType = () => {
    setCurrentTypeIdx(idx => idx + 1);
  };

  const isCurrentTypeComplete = () => {
    return !miniTestAnswers[currentTypeIdx].some(ans => ans === 0);
  };

  const isLastType = () => {
    return currentTypeIdx >= miniTestQuestions.length - 1;
  };

  const reset = () => {
    setMiniTestAnswers(
      miniTestQuestions.map(q => Array(q.questions.length).fill(0))
    );
    setCurrentTypeIdx(0);
  };

  return {
    miniTestAnswers,
    currentTypeIdx,
    handleAnswer,
    handleNextType,
    isCurrentTypeComplete,
    isLastType,
    reset,
  };
};