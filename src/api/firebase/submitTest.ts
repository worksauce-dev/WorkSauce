"use server";

import { doc, getDoc, updateDoc, setDoc } from "firebase/firestore";
import { firestore } from "./initFirebase";
import { ScoreType } from "@/types/saucetest/test";
import { SugarTestResult } from "@/types/sugartest/sugarTestResult";

// 테스트 결과 타입 가드
function isSugarTestResult(result: any): result is SugarTestResult {
  return (
    result.hasOwnProperty("categories") && result.hasOwnProperty("metadata")
  );
}

export async function submitTest(
  groupId: string,
  email: string,
  name: string,
  testResult: ScoreType[] | SugarTestResult
) {
  const groupRef = doc(firestore, "groups", groupId);

  try {
    const groupDoc = await getDoc(groupRef);

    if (!groupDoc.exists()) {
      throw new Error("Group not found");
    }

    const groupData = groupDoc.data();
    const userId = groupData.createdBy.id; // 그룹 생성자의 ID 추출
    const userRef = doc(firestore, "users", userId); // userRef 생성
    const applicants = groupData.applicants || [];

    const applicantIndex = applicants.findIndex(
      (applicant: any) => applicant.email === email && applicant.name === name
    );

    if (applicantIndex === -1) {
      throw new Error("Applicant not found");
    }

    const updatedApplicants = applicants.map(
      (applicant: any, index: number) => {
        if (index === applicantIndex) {
          return {
            ...applicant,
            testResult,
            testStatus: "completed",
            completedAt: new Date().toISOString(),
          };
        }
        return applicant;
      }
    );

    // Update the entire applicants array
    await updateDoc(groupRef, {
      applicants: updatedApplicants,
    });

    // Sugar 테스트인 경우에만 유저 메타데이터 저장
    if (isSugarTestResult(testResult)) {
      // 기존 유저 데이터 가져오기
      const userDoc = await getDoc(userRef);
      const userData = userDoc.exists() ? userDoc.data() : {};
      const existingMetaData = userData.sugarMetaData || {
        categoryScores: {},
        testCount: 0,
        totalAverageScore: 0,
      };

      // 각 카테고리별 누적 점수 계산
      const updatedCategoryScores: {
        [key: string]: { total: number; average: number };
      } = {};

      Object.entries(testResult.metadata.categoryScores).forEach(
        ([category, newScores]) => {
          const existing = existingMetaData.categoryScores[category] || {
            total: 0,
            average: 0,
          };

          // 안전한 숫자 변환을 위한 헬퍼 함수
          const safeNumber = (value: any) => {
            const num = Number(value);
            return isNaN(num) ? 0 : num;
          };

          // 새로운 총점 계산 (기존 평균 * 테스트 수 + 새로운 점수)
          const existingTotal =
            safeNumber(existing.average) *
            safeNumber(existingMetaData.testCount);
          const newScore = safeNumber(newScores.average);
          const totalScore = existingTotal + newScore;
          const newCount = safeNumber(existingMetaData.testCount) + 1;

          updatedCategoryScores[category] = {
            total: totalScore,
            average: Number((totalScore / newCount).toFixed(2)),
          };
        }
      );

      // 전체 평균 점수 계산
      const existingTotal =
        safeNumber(existingMetaData.totalAverageScore) *
        safeNumber(existingMetaData.testCount);
      const newScore = safeNumber(testResult.metadata.averageScore);
      const totalAverageScore =
        (existingTotal + newScore) /
        (safeNumber(existingMetaData.testCount) + 1);

      // sugarMetaData 업데이트
      const sugarMetaData = {
        categoryScores: updatedCategoryScores,
        averageScore: Number(totalAverageScore.toFixed(2)),
        testCount: safeNumber(existingMetaData.testCount) + 1,
        lastTestAt: new Date().toISOString(),
        lastGroupId: groupId,
      };

      // 유저 문서 업데이트
      await setDoc(
        userRef,
        {
          ...userData,
          sugarMetaData,
        },
        { merge: true }
      );
    }

    // Create unique document ID using name and email
    const documentId = `${name}-${email.replace("@", "-at-")}`;

    // Determine collection path based on test type
    const collectionPath = isSugarTestResult(testResult)
      ? "sugarTestResults"
      : "sauceTestResults";

    // Save to appropriate collection
    const testResultRef = doc(firestore, collectionPath, documentId);
    await setDoc(testResultRef, {
      email,
      name,
      testResult,
      groupId,
      completedAt: new Date().toISOString(),
    });

    console.log("Test result submitted successfully");

    return updatedApplicants[applicantIndex];
  } catch (error) {
    console.error("Error submitting test result:", error);
    throw error;
  }
}

// 안전한 숫자 변환을 위한 헬퍼 함수
function safeNumber(value: any): number {
  const num = Number(value);
  return isNaN(num) ? 0 : num;
}
