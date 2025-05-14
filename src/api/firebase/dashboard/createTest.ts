"use server";

import { doc, setDoc } from "firebase/firestore";
import { firestore } from "../initFirebase";
import { TestInfo } from "@/types/user";

export async function createTest(
  dashboardId: string,
  teamId: string,
  testInfo: TestInfo
) {
  try {
    // 테스트 문서 참조 생성
    const testRef = doc(
      firestore,
      "dashboards",
      dashboardId,
      "testResults",
      testInfo.testId
    );

    // 초기 테스트 문서 생성
    const testDoc = {
      ...testInfo,
    };

    // 문서 저장
    await setDoc(testRef, testDoc);

    return {
      success: true,
      message: "테스트가 성공적으로 생성되었습니다.",
    };
  } catch (error) {
    console.error("Error creating test:", error);
    return {
      success: false,
      message: "테스트 생성 중 오류가 발생했습니다.",
    };
  }
}
