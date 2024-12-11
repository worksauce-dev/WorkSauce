import { determineApplicantType } from "@/utils/applicantAnalysis";

export function getWorkflow(
  applicantType: ReturnType<typeof determineApplicantType>,
  applicantName: string
) {
  const workflowContent = {
    기준윤리형: {
      verbs: "인식하다 - 판정하다 - 조직하다 - 안내하다 - 개선하다",
      steps: [
        { action: "일을 시작 할 때는", content: "본질을 파악하고" },
        {
          action: "발전 시킬 때는",
          content: "객관적, 공정성, 논리적인 조직적 접근하며",
        },
        {
          action: "일을 할 때는",
          content: "명확한 절차와 완벽한 이해를 추구하며",
        },
        {
          action: "소통하고 전달할 때는",
          content: "책임감을 갖고, 다소 권위적 방안을 제시하며",
        },
        {
          action: "일을 마칠 때는",
          content: "공정한 방식으로 발전시키며 끝까지 수행합니다",
        },
      ],
    },
    기준심미형: {
      verbs: "기억하다 - 분류하다 - 제작하다 - 의사소통하다 - 감동시키다",
      steps: [
        { action: "일을 시작 할 때는", content: "깊이있는 성찰이 중요하고" },
        {
          action: "발전 시킬 때는",
          content: "내면적 통찰과 독창적인 관점을 사용하며",
        },
        {
          action: "일을 할 때는",
          content: "창의적으로 실행하고, 콘텐츠화 하며",
        },
        {
          action: "소통하고 전달할 때는",
          content: "감성적 소통과 협력을 도모하며",
        },
        {
          action: "일을 마칠 때는",
          content: "새로운 시각을 제공하고 꾸준히 발전합니다",
        },
      ],
    },
    예술느낌형: {
      verbs: "느끼다 - 발견하다 - 창조하다 - 공연하다 - 꿈꾸다",
      steps: [
        { action: "일을 시작 할 때는", content: "아름다움의 가치를 찾고" },
        {
          action: "발전 시킬 때는",
          content: "감각적 통찰과 체계적 작업을 선호하며",
        },
        {
          action: "일을 할 때는",
          content: "독창적인 표현과 새로운 방향과 가치를 사용합니다",
        },
        {
          action: "소통하고 전달할 때는",
          content: "외부 세계와의 접촉으로 감각적 가치를 제공하며",
        },
        { action: "일을 마칠 때는", content: "진정성 있는 에너지를 느낍니다" },
      ],
    },
    예술융합형: {
      verbs: "주목하다 - 상상하다 - 융합하다 - 전시하다 - 흥분시키다",
      steps: [
        { action: "일을 시작 할 때는", content: "가능성을 발견하고" },
        {
          action: "발전 시킬 때는",
          content: "다양한 가치와 혁신적 사고를 선호하며",
        },
        {
          action: "일을 할 때는",
          content: "다양성의 조화 그리고 입체적 실행을 추구하며",
        },
        {
          action: "소통하고 전달할 때는",
          content: "가치 전파와 인상적인 영감을 제공하며",
        },
        {
          action: "일을 마칠 때는",
          content: "감정적 반응을 유도하고 긍정적인 상호작용을 중시합니다",
        },
      ],
    },
    이해관리형: {
      verbs: "알다 - 확인하다 - 구축하다 - 알리다 - 해결하다",
      steps: [
        { action: "일을 시작 할 때는", content: "다방면의 정보를 수집하고" },
        {
          action: "발전 시킬 때는",
          content: "계획을 수립하고 철저한 검증이 중요합니다",
        },
        {
          action: "일을 할 때는",
          content:
            "안정적 체계를 구축하고, 효율적으로 대응하는 것이 중요합니다",
        },
        {
          action: "소통하고 전달할 때는",
          content: "최적의 정보를 제공하고 절적한 행동을 유발하며",
        },
        {
          action: "일을 마칠 때는",
          content: "문제의 종결 그리고 지속적 관리를 중시합니다",
        },
      ],
    },
    이해연구형: {
      verbs: "탐색하다 - 연구하다 - 기록하다 - 발표하다 - 향상시키다",
      steps: [
        { action: "일을 시작 할 때는", content: "지적 호기심이 중요하고" },
        {
          action: "발전 시킬 때는",
          content: "심층적인 분석으로 타당성을 평가하는 것이 중요합니다",
        },
        {
          action: "일을 할 때는",
          content: "체계적인 정리 그리고 혁신과 개선을 선호합니다",
        },
        {
          action: "소통하고 전달할 때는",
          content: "설득력있는 전달을 통해 활용 가능성을 도출하며",
        },
        {
          action: "일을 마칠 때는",
          content: "전문성을 강화하고 방향성 확립을 중시합니다",
        },
      ],
    },
    소통도움형: {
      verbs: "대화하다 - 이해하다 - 구성하다 - 돕다 - 영향을 미치다",
      steps: [
        { action: "일을 시작 할 때는", content: "상호작용의 시작이 중요하고" },
        {
          action: "발전 시킬 때는",
          content: "신뢰감을 구축하여 맥락을 인지하는 것이 중요합니다",
        },
        {
          action: "일을 할 때는",
          content: "문제 해결 환경 조성, 지원 방안 발견을 선호합니다",
        },
        {
          action: "소통하고 전달할 때는",
          content: "타인의 문제 해결과 적극적인 지원이 중요하며",
        },
        {
          action: "일을 마칠 때는",
          content: "긍정적 변화 촉진과 신뢰 복원을 중시합니다",
        },
      ],
    },
    소통조화형: {
      verbs: "참여하다 - 분석하다 - 중재하다 - 협력하다 - 웃게하다",
      steps: [
        {
          action: "일을 시작 할 때는",
          content: "다양한 관계를 고려하고 상황 파악을 하며",
        },
        {
          action: "발전 시킬 때는",
          content: "종합적 고려와 다양한 입장을 수용하는 것이 중요합니다",
        },
        {
          action: "일을 할 때는",
          content: "균형잡힌 해결책 제기, 협력과 화합 촉진을 선호합니다",
        },
        {
          action: "소통하고 전달할 때는",
          content: "공동의 목표 달성과 개인과 조직의 균형발전이 중요하며",
        },
        {
          action: "일을 마칠 때는",
          content: "따뜻한 분위기 조성 그리고 장기적인 성과 보장을 중시합니다",
        },
      ],
    },
    도전확장형: {
      verbs: "탐험하다 - 깨닫다 - 경영하다 - 가르치다 - 활발하게 하다",
      steps: [
        {
          action: "일을 시작 할 때는",
          content: "새로운 기회를 발견하는 것이 중요하고",
        },
        {
          action: "발전 시킬 때는",
          content: "의미를 파악하고 미래지향적 사고가 중요합니다",
        },
        {
          action: "일을 할 때는",
          content: "전략적인 운영과 변화 기반 마련을 선호합니다",
        },
        {
          action: "소통하고 전달할 때는",
          content: "팀의 역량 강화와 잠재력 발굴이 중요하며",
        },
        {
          action: "일을 마칠 때는",
          content: "장기적인 발전과 영절 및 동기 부여를 중시합니다",
        },
      ],
    },
    도전목표형: {
      verbs: "도전하다 - 생각하다 - 경쟁하다 - 홍보하다 - 성취하다",
      steps: [
        { action: "일을 시작 할 때는", content: "명확한 목표 설정이 중요하고" },
        {
          action: "발전 시킬 때는",
          content: "측정 가능 지표 설정과 효과적인 자원 배분이 중요합니다",
        },
        {
          action: "일을 할 때는",
          content: "역량의 극대화 그리고 모든 영역의 개선 추구를 선호합니다",
        },
        {
          action: "소통하고 전달할 때는",
          content: "결과 지향적인 접근과 설득력있는 메세지 전달이 중요하며",
        },
        {
          action: "일을 마칠 때는",
          content: "역량과 가치를 입증하고 긍정적인 피드백과 인정을 중시합니다",
        },
      ],
    },
  };

  const content =
    workflowContent[applicantType.primaryType as keyof typeof workflowContent];
  if (!content) return null;

  return (
    <div className="space-y-6">
      <div className="text-lg font-medium text-gray-900">
        {applicantType.primaryType}의 동사 흐름 :
        <span className="text-primary-accent ml-2">{content.verbs}</span>
      </div>

      <div className="bg-white/50 p-4 rounded-lg">
        <p className="text-gray-600 italic mb-4">
          소스테스트의 결과를 바탕으로 {applicantName}님이 일을 할 때 선호하는
          흐름(업무 추진 방향성)을 안내드립니다.
        </p>

        <ul className="space-y-2 text-gray-700">
          {content.steps.map((step, index) => (
            <li key={index} className="flex items-start">
              <span className="mr-2">•</span>
              {step.action}{" "}
              <span className="font-medium mx-1">
                &ldquo;{step.content}&rdquo;
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-orange-50 p-4 rounded-lg">
        <ol className="list-decimal list-inside space-y-2 text-gray-700">
          <li>
            업무 추진 방향성은 지원자와 우리 회사 업무 흐름의 유사성을 파악하고
            참고할 수 있는 데이터입니다.
          </li>
          <li>
            각 유형은 고유의 동사 흐름을 갖고 있으며, 이를 이해하고 온보딩
            하시면 보다 적응력을 높일 수 있습니다.
          </li>
        </ol>
      </div>
    </div>
  );
}
