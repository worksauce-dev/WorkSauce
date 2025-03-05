import { StressAnalysis } from "@/types/sugartest/sugarTestFeedback";

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

export const ANALYSIS_DATA: StressAnalysis = {
  LOW: (name: string, score: string) => ({
    currentStatus: {
      score,
      level: "LOW",
      description: `${name}님의 스트레스 지수는 ${score}로 'Low' 구간에 해당합니다. 이는 현재 업무 환경과 역할에서 스트레스를 거의 느끼지 않는 매우 안정적인 상태임을 보여줍니다.`,
      workManagement: {
        title: "업무 관리",
        items: [
          "업무 처리와 시간 관리가 효율적으로 이루어짐",
          "과제 수행에서 높은 자기 통제력 발휘",
          "예상치 못한 상황에서도 안정적 대처 가능",
        ],
      },
    },
    organizationalLife: {
      current: {
        title: "현재 조직 생활",
        items: [
          "원활한 의사소통과 협업 능력 보유",
          "긍정적인 태도로 팀 분위기에 기여",
          "조직 문화에 대한 이해도가 높음",
        ],
      },
      potential: {
        description: `조직의 관점에서 ${name}님의 낮은 스트레스 지수는 향후 성장 가능성을 보여주는 긍정적 지표입니다. 현재 업무에 대한 높은 통제력은 추가적인 책임과 새로운 도전 과제를 수용할 수 있는 준비가 되어 있음을 의미합니다.`,
      },
    },
    suggestion: {
      shortTerm: {
        title: "단기 목표",
        period: "1-3개월",
        items: [
          "현재의 업무 관리 방식을 체계화",
          "팀 내 지식 공유 활동 참여",
          "주니어 멘토링 기회 모색",
        ],
      },
      longTerm: {
        title: "중장기 목표",
        period: "3-6개월",
        items: [
          "리더십 역량 개발을 위한 학습",
          "프로젝트 리더 역할 검토",
          "전문성 강화를 위한 교육 참여",
        ],
      },
    },
    overallOpinion: {
      summary: `${name}님의 현재 상태는 지속 가능한 성장을 위한 최적의 조건입니다. 낮은 스트레스 수준을 유지하면서도 업무 효율성이 높다는 점은 매우 긍정적입니다. 이러한 안정적인 기반을 토대로, 점진적인 도전을 통해 더 큰 성장을 이루실 수 있을 것으로 기대됩니다.`,
    },
  }),
  MODERATE: (name: string, score: string) => ({
    currentStatus: {
      score,
      level: "MODERATE",
      description: `${name}님의 스트레스 지수는 ${score}로 'Moderate' 구간에 해당합니다. 이는 업무 환경에서 적정 수준의 스트레스를 경험하고 있는 상태로, 대체로 관리 가능한 범위 내에서 업무를 수행하고 있음을 나타냅니다.`,
      workManagement: {
        title: "업무 관리",
        items: [
          "전반적으로 업무 수행은 원활하나 간헐적인 부담감 존재",
          "업무 우선순위 조정이 때때로 필요한 상황",
          "일정 관리에서 가끔 어려움을 경험",
        ],
      },
    },
    organizationalLife: {
      current: {
        title: "현재 조직 생활",
        items: [
          "대인관계는 안정적으로 유지",
          "팀 내 역할 수행에 무리는 없으나 추가적인 요구 시 부담",
          "업무 환경 변화에 적응하는 과정에서 약간의 긴장감 발생",
        ],
      },
      potential: {
        description: `현재의 중간 수준 스트레스는 성장을 위한 적절한 긴장감으로 활용될 수 있습니다. 이는 업무 수행 능력 향상과 문제 해결 역량 개발의 기회가 될 수 있으며, 적절한 관리를 통해 더 높은 성과로 이어질 수 있습니다.`,
      },
    },
    suggestion: {
      shortTerm: {
        title: "단기 목표",
        period: "1-3개월",
        items: [
          "업무 우선순위 설정 방식 개선",
          "스트레스 해소를 위한 규칙적인 휴식 시간 확보",
          "업무 일정 관리 도구 활용 강화",
        ],
      },
      longTerm: {
        title: "중장기 목표",
        period: "3-6개월",
        items: [
          "업무 효율성 향상을 위한 시간 관리 기술 습득",
          "스트레스 관리 기법 학습",
          "업무 분담 및 위임 능력 개발",
        ],
      },
    },
    overallOpinion: {
      summary: `${name}님의 현재 스트레스 수준은 관리 가능한 범위 내에 있습니다. 적절한 긴장감은 업무 집중도를 높이고 성과 창출에 도움이 될 수 있습니다. 다만, 스트레스가 누적되지 않도록 주기적인 모니터링과 관리가 필요하며, 제안된 개선 방안들을 실천하여 더욱 효율적인 업무 수행이 가능할 것으로 기대됩니다.`,
    },
  }),
  HIGH: (name: string, score: string) => ({
    currentStatus: {
      score,
      level: "HIGH",
      description: `${name}님의 스트레스 지수는 ${score}로 'High' 구간에 해당합니다. 이는 업무 환경에서 상당한 수준의 스트레스를 경험하고 있는 상태로, 적극적인 스트레스 관리와 업무 부담 조절이 필요한 시점입니다.`,
      workManagement: {
        title: "업무 관리",
        items: [
          "업무량이나 난이도로 인한 높은 부담감 발생",
          "마감 기한 준수에 대한 지속적인 압박감 존재",
          "업무 집중도와 효율성 저하 징후 관찰",
        ],
      },
    },
    organizationalLife: {
      current: {
        title: "현재 조직 생활",
        items: [
          "대인관계에서 간혹 긴장감 발생",
          "의사소통 과정에서 피로감 증가",
          "업무 환경 변화에 대한 적응에 어려움 경험",
        ],
      },
      potential: {
        description: `현재의 높은 스트레스 수준은 장기적으로 업무 성과와 건강에 부정적 영향을 미칠 수 있습니다. 스트레스 관리를 위한 즉각적인 조치와 함께, 업무 환경 개선을 위한 체계적인 접근이 필요합니다.`,
      },
    },
    suggestion: {
      shortTerm: {
        title: "단기 조치",
        period: "즉시~1개월",
        items: [
          "업무 우선순위 전면 재검토",
          "불필요한 업무 축소 및 위임",
          "규칙적인 휴식 시간 확보",
          "스트레스 해소를 위한 활동 계획",
        ],
      },
      longTerm: {
        title: "중장기 계획",
        period: "1-3개월",
        items: [
          "업무 프로세스 개선 제안",
          "역량 강화를 위한 교육 참여",
          "멘토링 또는 코칭 프로그램 활용",
          "건강관리 계획 수립",
        ],
      },
    },
    overallOpinion: {
      summary: `${name}님의 현재 스트레스 수준은 즉각적인 관리가 필요한 상태입니다. 업무 효율성과 개인의 웰빙을 위해 적극적인 개선 조치가 요구됩니다. 위 제안된 방안들을 단계적으로 실행하면서, 정기적인 상태 점검을 통해 스트레스 수준을 낮추는 것이 중요합니다. 필요한 경우 관리자와의 면담을 통해 업무 조정을 논의하는 것도 고려해 보시기 바랍니다.`,
    },
  }),
  CRITICAL: (name: string, score: string) => ({
    currentStatus: {
      score,
      level: "CRITICAL",
      description: `${name}님의 스트레스 지수는 ${score}로 'Critical' 구간에 해당합니다. 이는 매우 심각한 수준의 스트레스 상태로, 즉각적인 개입과 관리가 필수적인 상황입니다. 업무 수행과 건강 모두에 위험 신호가 감지되고 있습니다.`,
      workManagement: {
        title: "업무 관리",
        items: [
          "과도한 업무량으로 인한 심각한 부담 상태",
          "업무 수행 능력 저하 및 실수 증가 위험",
          "업무 집중도 현저히 감소",
        ],
      },
    },
    organizationalLife: {
      current: {
        title: "조직 생활",
        items: [
          "심리적 소진으로 인한 대인관계 어려움",
          "의사소통 의지 및 능력 저하",
          "조직 적응에 심각한 어려움 경험",
        ],
      },
      potential: {
        description: `현재 상태가 지속될 경우 심각한 건강 문제로 이어질 수 있으며, 업무 수행에 중대한 차질이 발생할 위험이 있습니다. 즉각적인 개입과 체계적인 스트레스 관리가 필수적입니다.`,
      },
    },
    suggestion: {
      shortTerm: {
        title: "즉시 실행",
        period: "1주일 이내",
        items: [
          "관리자와 긴급 면담 진행",
          "핵심 업무 외 부가 업무 중단",
          "스트레스 해소를 위한 즉각적 활동 시작",
          "건강 검진 고려",
        ],
      },
      longTerm: {
        title: "단기 계획",
        period: "2-4주",
        items: [
          "업무 재분배 및 조정",
          "스트레스 관리 프로그램 참여",
          "근무 환경 개선 요청",
          "정기적 상담 일정 수립",
        ],
      },
    },
    overallOpinion: {
      summary: `${name}님의 현재 상태는 즉각적인 개입이 필요한 위험 수준입니다. 개인의 건강과 업무 지속성을 위해 적극적인 조치가 반드시 필요합니다. 관리자 및 인사 담당자와의 면담을 통해 현재 상황을 공유하고, 업무 조정을 위한 구체적인 계획을 수립해야 합니다. 필요한 경우 전문가의 도움을 받아 체계적인 스트레스 관리 방안을 수립하시기를 강력히 권고드립니다.`,
    },
  }),
  // ... other levels
};
