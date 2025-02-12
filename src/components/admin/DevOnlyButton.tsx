"use client";

import { TestData } from "@/types/sauceTestResult";

type SauceType =
  | "예술융합형"
  | "예술느낌형"
  | "이해관리형"
  | "이해연구형"
  | "소통도움형"
  | "소통조화형"
  | "기준윤리형"
  | "기준심미형"
  | "도전확장형"
  | "도전목표형";

interface DevOnlyButtonProps {
  saveResult: (
    mainType: SauceType,
    subType: SauceType,
    testData: TestData
  ) => Promise<{
    success: boolean;
    error?: unknown;
  }>;
}

interface RawData {
  typeDescription: any;
  characteristics: any;
  onboarding: any;
}

// function convertToTestData(rawData: RawData): TestData {
//   // subtype 찾기 (없으면 에러)
//   const findSubtype = (data: RawData): string => {
//     if (data.typeDescription?.subtype) {
//       return data.typeDescription.subtype;
//     }

//     throw new Error("Subtype not found in the data");
//   };

//   // typeDescription 변환
//   const typeDescription = {
//     ...rawData.typeDescription,
//     finalOpinion: {
//       content:
//         rawData.characteristics?.finalOpinion?.content ||
//         `${rawData.typeDescription.title}로서 조직에 기여할 수 있는 인재입니다.`,
//       additionalNote:
//         rawData.characteristics?.finalOpinion?.additionalNote ||
//         "조직의 성장에 기여할 수 있는 잠재력을 보유하고 있습니다.",
//     },
//   };

//   // characteristics 변환
//   const characteristics = {
//     ...rawData.characteristics,
//     finalOpinion: {
//       content:
//         rawData.characteristics?.finalOpinion?.content ||
//         `${rawData.typeDescription.title}로서의 역량을 발휘할 수 있습니다.`,
//       additionalNote:
//         rawData.characteristics?.finalOpinion?.additionalNote ||
//         "적절한 지원과 가이드를 통해 더욱 성장할 수 있습니다.",
//     },
//   };

//   // onboarding 변환
//   const onboarding = {
//     ...rawData.onboarding,
//     finalOpinion: {
//       points: rawData.onboarding?.finalOpinion?.points || [
//         `이 유형의 인재는 초기에 ${rawData.typeDescription.keywords[0]}와(과) ${rawData.typeDescription.keywords[1]}을(를) 중심으로 역량을 발휘할 수 있습니다.`,
//         `${rawData.typeDescription.keywords[2]}을(를) 바탕으로 조직의 성장에 기여할 수 있도록 지원이 필요합니다.`,
//       ],
//     },
//   };

//   // subtype 존재 확인
//   try {
//     findSubtype(rawData);
//   } catch (error) {
//     console.error("Error:", error.message);
//     throw error;
//   }

//   return {
//     typeDescription,
//     characteristics,
//     onboarding,
//   };
// }

const DevOnlyButton = ({ saveResult }: DevOnlyButtonProps) => {
  //   const testData = convertToTestData({
  //     typeDescription,
  //     characteristics,
  //     onboarding,
  //   });

  //   const [mainType, subType] = testData.typeDescription.subtype.split("-") as [
  //     SauceType,
  //     SauceType
  //   ];

  return (
    <button
      className="bg-orange-500 text-white px-4 py-2 rounded-md"
      //   onClick={() => saveResult(mainType, subType, testData)}
    >
      개발자 전용 버튼
    </button>
  );
};

export default DevOnlyButton;
