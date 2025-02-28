export const CATEGORIES = [
  "strain",
  "uncertainty",
  "grievance",
  "autonomy",
  "recognition",
] as const;

export const STRESS_LEVELS = [
  { label: "스트레스가 거의 없음", min: 1.0, max: 2.0 },
  { label: "스트레스가 중간 정도", min: 2.1, max: 3.0 },
  { label: "스트레스가 다소 높음", min: 3.1, max: 4.0 },
  { label: "심각한 스트레스", min: 4.1, max: 5.0 },
] as const;

export const CATEGORY_TRANSLATIONS = {
  strain: "업무 부담",
  uncertainty: "불확실성",
  grievance: "대인관계 갈등",
  autonomy: "업무 자율성 부족",
  recognition: "보상과 인정 부족",
} as const;

export type CategoryKey = keyof typeof CATEGORY_TRANSLATIONS;
