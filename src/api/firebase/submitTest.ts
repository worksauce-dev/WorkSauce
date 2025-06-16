"use server";

import { doc, getDoc, updateDoc } from "firebase/firestore";
import { firestore } from "./initFirebase";
import { SugarTestResult } from "@/types/sugartest/sugarTestResult";
import { SauceTestResult } from "@/types/saucetestV2Type";

export async function submitTest(
  dashboardId: string,
  testId: string,
  email: string,
  name: string,
  testResult: SugarTestResult | SauceTestResult
) {
  try {
    // testResults 컬렉션의 문서 참조
    const testResultRef = doc(
      firestore,
      "dashboards",
      dashboardId,
      "testResults",
      testId
    );

    // 기존 문서 가져오기
    const testDocSnap = await getDoc(testResultRef);
    if (!testDocSnap.exists()) {
      throw new Error("Test result document not found");
    }
    const testDocData = testDocSnap.data();
    const applicants = Array.isArray(testDocData.applicants)
      ? testDocData.applicants
      : [];

    // applicants 배열에서 해당 지원자만 testResult 업데이트
    const updatedApplicants = applicants.map((applicant: any) => {
      if (applicant.email === email && applicant.name === name) {
        return {
          ...applicant,
          testResult,
          testStatus: "completed",
          completedAt: new Date().toISOString(),
        };
      }
      return applicant;
    });

    // 문서 업데이트
    await updateDoc(testResultRef, {
      applicants: updatedApplicants,
    });

    console.log("Applicant test result updated successfully");
    return { success: true };
  } catch (error) {
    console.error("Error updating applicant test result:", error);
    throw error;
  }
}
