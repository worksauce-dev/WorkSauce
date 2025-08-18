export interface Question {
  text: string;
  baseScore: number;
}

export interface MiniTestType {
  type: string;
  questions: Question[];
}

export interface VerbOption {
  type: string;
  verb: string;
  score: number;
  sort: string;
}

export interface VerbQuestion {
  question: string;
  options: VerbOption[];
}

export interface TypeScore {
  type: string;
  total: number;
}

export type TestStep = "intro" | "verb" | "mini";

export type VerbQuestionKey = "first" | "second" | "third" | "fourth" | "fifth";