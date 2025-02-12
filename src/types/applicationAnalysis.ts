export interface ApplicantTypeDescription {
  talentCharacteristics: {
    points: string[];
  };
  recommendedJobs: {
    jobs: Array<{
      name: string;
      details: string[];
    }>;
  };
  finalOpinion: {
    content: string;
  };
  additionalNotes: {
    points: string[];
  };
}
