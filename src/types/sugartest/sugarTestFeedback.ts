type ScoreRange = "LOW" | "MODERATE" | "HIGH" | "CRITICAL";

type CurrentStatus = {
  score: string;
  level: ScoreRange;
  description: string;
  workManagement: {
    title: string;
    items: string[];
  };
};

type OrganizationalLife = {
  current: {
    title: string;
    items: string[];
  };
  potential: {
    description: string;
  };
};

type Suggestion = {
  shortTerm: {
    title: string;
    period: string;
    items: string[];
  };
  longTerm: {
    title: string;
    period: string;
    items: string[];
  };
};

type OverallOpinion = {
  summary: string;
};

type AnalysisData = {
  currentStatus: CurrentStatus;
  organizationalLife: OrganizationalLife;
  suggestion: Suggestion;
  overallOpinion: OverallOpinion;
};

export type StressAnalysis = Record<
  ScoreRange,
  (name: string, score: string) => AnalysisData
>;
