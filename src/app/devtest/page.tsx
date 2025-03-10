import { SugarTestContainer } from "@/components/test/sugartest/SugarTestContainer";
import { SugarTest } from "@/types/sugartest/test";
import HomeLayout from "../(home)/layout";

const mockSugarTestData = {
  strain: [
    { id: "s1", question: "나는 업무량이 너무 많아 감당하기 어렵다." },
    { id: "s2", question: "업무 마감일이 너무 촉박하여 스트레스를 받는다." },
    { id: "s3", question: "나는 종종 업무 시간 외에도 일을 해야 한다." },
    {
      id: "s4",
      question: "나는 여러 업무를 동시에 처리해야 하는 상황이 자주 발생한다.",
    },
    {
      id: "s5",
      question: "업무 요구사항이 내 능력이나 자원을 초과한다고 느낀다.",
    },
  ],
  uncertainty: [
    { id: "u1", question: "우리 조직의 미래 방향성이 불분명하다고 느낀다." },
    { id: "u2", question: "내 직무의 안정성에 대해 불안감을 느낀다." },
    { id: "u3", question: "조직 내 의사결정 과정이 예측하기 어렵다." },
    { id: "u4", question: "업무 지시나 기대치가 자주 변경된다." },
    { id: "u5", question: "내 역할과 책임이 명확하게 정의되어 있지 않다." },
  ],
  grievance: [
    { id: "g1", question: "동료나 상사와의 관계에서 갈등을 경험한다." },
    { id: "g2", question: "팀 내 의사소통이 원활하지 않다고 느낀다." },
    { id: "g3", question: "내 의견이나 제안이 무시된다고 느낀다." },
    { id: "g4", question: "업무 협조가 필요할 때 도움을 받기 어렵다." },
    { id: "g5", question: "직장 내 인간관계로 인한 스트레스가 크다." },
  ],
  autonomy: [
    { id: "a1", question: "내 업무 방식을 스스로 결정할 자율성이 부족하다." },
    { id: "a2", question: "업무 계획이나 일정을 내가 조절하기 어렵다." },
    {
      id: "a3",
      question: "내 판단보다 상사의 지시에 따라야 하는 경우가 많다.",
    },
    {
      id: "a4",
      question: "창의적인 아이디어를 실행에 옮길 기회가 제한적이다.",
    },
    { id: "a5", question: "내 업무에 대한 의사결정 권한이 충분하지 않다." },
  ],
  recognition: [
    { id: "r1", question: "내 노력과 성과가 적절히 인정받지 못한다고 느낀다." },
    { id: "r2", question: "내 업무 기여도에 비해 보상이 충분하지 않다." },
    { id: "r3", question: "성과에 대한 피드백이 부족하다." },
    { id: "r4", question: "승진이나 경력 발전 기회가 제한적이다." },
    {
      id: "r5",
      question: "내 전문성이나 기술이 조직 내에서 가치 있게 여겨지지 않는다.",
    },
  ],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

// Fake submitTest 함수 구현
const fakeSubmitTest = async (
  groupId: string,
  email: string,
  name: string,
  testResult: any
) => {
  "use server";

  console.log("===== FAKE SUBMIT TEST =====");
  console.log("Test submitted with the following data:");
  console.log("Group ID:", groupId);
  console.log("Email:", email);
  console.log("Name:", name);
  console.log("Test Result:", testResult);
  console.log("============================");

  // 실제 API 호출 시뮬레이션을 위한 지연
  await new Promise(resolve => setTimeout(resolve, 1000));

  // 성공적인 제출 시뮬레이션
  return {
    success: true,
    message: "Test submitted successfully",
    timestamp: new Date().toISOString(),
    // 필요한 경우 추가 데이터 반환
  };
};

const DevTestPage = () => {
  return (
    <HomeLayout>
      <SugarTestContainer
        name="홍길동"
        email="test@test.com"
        testData={mockSugarTestData as SugarTest}
        isAdmin={true}
        groupId="testGroupId"
        submitTest={fakeSubmitTest as any}
      />
    </HomeLayout>
  );
};

export default DevTestPage;
