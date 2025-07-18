interface Point {
  issue: string;
  solution: string;
}

interface Job {
  name: string;
  details: string[];
}

interface Stage {
  period: string;
  subtitle: string;
  tasks: string[];
}

interface TalentCharacteristics {
  points: string[];
}

interface RecommendedJobs {
  jobs: Job[];
}

interface BestPerformance {
  points: string[];
}

interface AttentionPoints {
  points: Point[];
}

interface FinalOpinion {
  content: string;
  additionalNote: string;
}

interface TypeDescription {
  title: string;
  subtype: string;
  keywords: string[];
  talentCharacteristics: TalentCharacteristics;
  recommendedJobs: RecommendedJobs;
  finalOpinion: FinalOpinion;
}

interface Characteristics {
  bestPerformance: BestPerformance;
  attentionPoints: AttentionPoints;
  finalOpinion: FinalOpinion;
}

interface Onboarding {
  stages: Stage[];
  finalOpinion: {
    points: string[];
  };
}

export interface QuestionType {
  text: string;
  score: number;
  isDeleted?: boolean;
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
export interface SauceTest {
  createdAt: string;
  updatedAt: string;
  [key: string]: CategoryData | string;
}

export type SauceType =
  | "예술융합형"
  | "예술느낌형"
  | "이해관리형"
  | "이해연구형"
  | "소통도움형"
  | "소통조화형"
  | "기준윤리형"
  | "기준심미형"
  | "도전확장형"
  | "도전목표형";

export interface SauceTestResultDescription {
  typeDescription: TypeDescription;
  characteristics: Characteristics;
  onboarding: Onboarding;
}
export interface SauceTestResultDescriptionType {
  updatedAt: string;
  createdAt: string;
  categories: {
    [topCategory: string]: {
      [secondCategory: string]: SauceTestResultDescription;
    };
  };
}
