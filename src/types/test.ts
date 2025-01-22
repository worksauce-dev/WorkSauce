export interface QuestionType {
  text: string;
  score: number;
}

export interface VerbType {
  sort: string;
  name: string;
  start: string;
  advance: string[];
  expert: string[];
  utility: string[];
  communicate: string[];
}

export interface CategoryType extends CategoryData {
  index: number;
  total: number;
}

export interface CategoryData {
  sort: string;
  name: string;
  questions: QuestionType[];
  start: string;
  advance: string[];
  expert: string[];
  utility: string[];
  communicate: string[];
}

export interface ScoreType {
  sort: string;
  score: number;
}

export interface Progress {
  sectionProgress: number;
  totalProgress: number;
  categoryInfo: {
    current: number;
    total: number;
    sectionName: string;
    isFirstHalf: boolean;
  };
}
// 하나의 통합된 인터페이스만 유지
export interface useTestLogicReturnInterface {
  verbTestData: VerbType[];
  currentCategoryData: CategoryType;
  selectedAnswers: { [key: number]: number };
  handleAnswer: (questionIndex: number, score: number) => void;
  isFirstHalfCompleted: boolean;
  handleNextHalf: () => void;
  canProceedToNext: boolean;
  progress: Progress;
  handleSkip: () => void;
  isTestCompleted: boolean;
  getFinalScores: () => ScoreType[];
}

// FireStore 데이터 타입
export interface TestDBType {
  createdAt: string;
  updatedAt: string;
  [key: string]: CategoryType | string;
}

export type ResultFields = {
  title: string;
  keywords: string[];
  description: string;
  weaknesses: string;
  interviewQuestions: string[];
  onboardingSteps: string;
};

export interface SauceResultType {
  updatedAt: string;
  createdAt: string;
  [mainType: string]: { [subType: string]: ResultFields } | string;
}
