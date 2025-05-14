"use server";

import { collection, getDocs, query, where } from "firebase/firestore";
import { firestore } from "../initFirebase";

export async function getTestsForMember(
  dashboardId: string,
  teamId: string,
  memberId: string
) {
  try {
    // 팀의 tests 컬렉션에서 해당 멤버의 결과가 있는 테스트들을 조회
    const testsRef = collection(
      firestore,
      "dashboards",
      dashboardId,
      "teams",
      teamId,
      "tests"
    );
    const q = query(testsRef, where(`results.${memberId}`, "!=", null));

    const tests = await getDocs(q);

    return {
      success: true,
      data: tests.docs.map(doc => ({
        testId: doc.id,
        ...doc.data(),
        result: doc.data().results[memberId],
      })),
    };
  } catch (error) {
    console.error("Error fetching member tests:", error);
    return {
      success: false,
      message: "테스트 결과 조회 중 오류가 발생했습니다.",
    };
  }
}
