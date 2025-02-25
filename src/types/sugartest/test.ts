// 개별 질문 타입
interface SugarQuestion {
  id: "strain" | "uncertainty" | "grievance" | "autonomy" | "recognition";
  question: string;
}

// 카테고리별 질문 모음 타입
export interface SugarTest {
  strain: SugarQuestion[]; // 업무 부담
  uncertainty: SugarQuestion[]; // 불확실성
  grievance: SugarQuestion[]; // 대인관계 갈등
  autonomy: SugarQuestion[]; // 업무 자율성 부족
  recognition: SugarQuestion[]; // 보상과 인정 부족
  createdAt: string;
  updatedAt: string;
}
