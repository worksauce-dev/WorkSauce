import { miniTestQuestions, verbQuestions } from "../data/testData";
import { TypeScore, VerbQuestionKey } from "../types";

export const calculateMiniTypeScores = (miniTestAnswers: number[][]): TypeScore[] => {
  return miniTestQuestions.map((typeBlock, typeIdx) => {
    const total = typeBlock.questions.reduce(
      (sum, q, qIdx) => sum + (miniTestAnswers[typeIdx][qIdx] || 0),
      0
    );
    return { type: typeBlock.type, total };
  });
};

export const calculateVerbTypeScores = (answers: number[]): TypeScore[] => {
  const questionKeys: VerbQuestionKey[] = [
    "first",
    "second", 
    "third",
    "fourth",
    "fifth",
  ];

  const typeScores: { [key: string]: number } = {};
  
  for (let i = 0; i < answers.length; i += 2) {
    const questionIndex = Math.floor(i / 2);
    const questionKey = questionKeys[questionIndex];
    const answer1 = answers[i];
    const answer2 = answers[i + 1];
    const option1 = verbQuestions[questionKey].options[answer1];
    const option2 = verbQuestions[questionKey].options[answer2];
    
    typeScores[option1.type] = (typeScores[option1.type] || 0) + option1.score;
    typeScores[option2.type] = (typeScores[option2.type] || 0) + option2.score;
  }
  
  return Object.entries(typeScores).map(([type, total]) => ({ type, total }));
};

export const getFinalType = (verbAnswers: number[], miniTestAnswers: number[][]): string => {
  const verbScores = calculateVerbTypeScores(verbAnswers);
  const miniScores = calculateMiniTypeScores(miniTestAnswers);
  
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