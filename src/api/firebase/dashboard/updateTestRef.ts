"use server";

import { doc, getDoc, updateDoc } from "firebase/firestore";
import { firestore } from "../initFirebase";

export async function updateTestRef(
  dashboardId: string,
  teamId: string,
  testId: string,
  memberIds: string[]
) {
  try {
    // 1. 팀 문서 불러오기
    const teamRef = doc(firestore, "dashboards", dashboardId, "teams", teamId);
    const teamSnap = await getDoc(teamRef);

    if (!teamSnap.exists()) {
      throw new Error("Team not found");
    }

    // 2. members 배열 가져오기
    const teamData = teamSnap.data();
    const members = Array.isArray(teamData.members) ? teamData.members : [];

    // 3. memberIds 배열을 순회하며 해당 멤버의 testIds에 testId 추가
    const updatedMembers = members.map((member: any) => {
      if (memberIds.includes(member.id)) {
        const newTestIds = Array.isArray(member.testIds)
          ? [...member.testIds]
          : [];
        if (!newTestIds.includes(testId)) {
          newTestIds.push(testId);
        }
        return { ...member, testIds: newTestIds };
      }
      return member;
    });

    // 4. 업데이트된 members 배열로 팀 문서 갱신
    await updateDoc(teamRef, { members: updatedMembers });

    return {
      success: true,
      message: "팀원들의 테스트 참조가 성공적으로 업데이트되었습니다.",
    };
  } catch (error) {
    console.error("Error updating test reference:", error);
    return {
      success: false,
      message: "테스트 참조 업데이트 중 오류가 발생했습니다.",
    };
  }
}
