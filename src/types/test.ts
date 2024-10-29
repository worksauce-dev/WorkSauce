export interface QuestionType {
  text: string;
}

export interface CategoryType {
  sort: string;
  questions: QuestionType[];
  index: number;
  total: number;
}

export interface ScoreType {
  sort: string;
  score: number;
}

export interface useTestLogicReturnInterface {
  currentCategory: CategoryType;
  answers: { [key: string]: number };
  isCompleted: boolean;
  handleAnswer: (questionIndex: number, score: number) => void;
  handleNextCategory: () => void;
  handleSkip: () => void;
  getCurrentProgress: () => number;
  canProceed: boolean;
  calculateScores: () => ScoreType[];
  totalQuestionsBefore: number;
  isFirstHalfCompleted: boolean;
  handleNextHalf: () => void;
}
