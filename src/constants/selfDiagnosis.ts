interface DiagnosisQuestion {
  id: number;
  text: string;
  category: string;
}

export const diagnosisQuestions: DiagnosisQuestion[] = [
  {
    id: 1,
    text: "채용 과정에서 지원자의 역량을 객관적으로 평가할 수 있는 도구를 활용하고 있습니까?",
    category: "채용 및 선발",
  },
  {
    id: 2,
    text: "직원들의 성과를 정기적으로 측정하고 피드백을 제공하는 시스템이 구축되어 있습니까?",
    category: "성과 관리",
  },
  {
    id: 3,
    text: "인사 데이터를 효율적으로 관리하고 분석하여 의사결정에 활용하고 있습니까?",
    category: "인사 데이터 관리",
  },
  {
    id: 4,
    text: "직원들의 교육 및 개발 요구사항을 체계적으로 파악하고 맞춤형 프로그램을 제공하고 있습니까?",
    category: "교육 및 개발",
  },
  {
    id: 5,
    text: "조직의 전략적 목표에 맞춰 인재 관리 계획을 수립하고 실행하고 있습니까?",
    category: "인사 전략 및 계획",
  },
  {
    id: 6,
    text: "직원들의 업무 만족도와 조직 몰입도를 정기적으로 측정하고 개선하고 있습니까?",
    category: "조직 문화 및 직원 관계",
  },
  {
    id: 7,
    text: "보상 및 복리후생 제도가 직원들의 성과와 기여도를 반영하여 공정하게 운영되고 있습니까?",
    category: "보상 및 복리후생",
  },
  {
    id: 8,
    text: "인사 업무 프로세스가 자동화되어 행정적 부담을 줄이고 있습니까?",
    category: "인사 데이터 관리",
  },
  {
    id: 9,
    text: "직원들의 역량과 잠재력을 체계적으로 평가하여 경력 개발 계획에 반영하고 있습니까?",
    category: "교육 및 개발",
  },
  {
    id: 10,
    text: "조직 내 인재 풀을 효과적으로 관리하여 핵심 포지션에 적합한 인재를 적시에 배치할 수 있습니까?",
    category: "인사 전략 및 계획",
  },
];
