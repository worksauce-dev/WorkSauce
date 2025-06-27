"use server";
import { deleteDoc, doc, getDoc } from "firebase/firestore";
import { firestore } from "../initFirebase";
import { UserTeam } from "@/types/user";

export async function deleteTeam(dashboardId: string, teamId: string) {
  try {
    const teamRef = doc(firestore, "dashboards", dashboardId, "teams", teamId);

    // 1. 삭제 전에 데이터 먼저 가져오기
    const teamDoc = await getDoc(teamRef);
    const data = teamDoc.data();

    if (!data) {
      throw new Error("팀 문서를 찾을 수 없습니다.");
    }

    const { testIds } = data as UserTeam;

    // 2. 팀 문서 삭제
    await deleteDoc(teamRef);

    // 3. 관련 테스트 결과 삭제
    for (const testId of testIds) {
      const testRef = doc(
        firestore,
        "dashboards",
        dashboardId,
        "testResults",
        testId
      );
      await deleteDoc(testRef);
    }

    return { success: true };
  } catch (error) {
    console.error("Error deleting team:", error);
    throw new Error("팀 삭제에 실패했습니다.");
  }
}
