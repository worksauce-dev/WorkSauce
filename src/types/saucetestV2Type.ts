interface Question {
  text: string;
  score: number;
}

type Name =
  | "기준윤리형"
  | "기준심미형"
  | "예술융합형"
  | "예술느낌형"
  | "이해관리형"
  | "이해연구형"
  | "소통도움형"
  | "소통조화형"
  | "도전확장형"
  | "도전목표형";

type Sort = "기준형" | "도전형" | "예술형" | "이해형" | "소통형";

export interface SauceTestV2 {
  createdAt: string;
  updatedAt: string;
  categories: {
    [key in Name]: {
      verbs: {
        start: string;
        advance: string[];
        expert: string[];
        utility: string[];
        communicate: string[];
      };
      questions: Question[];
      name: Name;
      sort: Sort;
    };
  };
}

export interface SauceTestResult {
  categories: Record<string, number>;
  createdAt: string;
  testId: string;
}
