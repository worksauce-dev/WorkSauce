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

export interface TestData {
  typeDescription: TypeDescription;
  characteristics: Characteristics;
  onboarding: Onboarding;
}
