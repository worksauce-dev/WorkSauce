"use server";

import { doc, getDoc, updateDoc } from "firebase/firestore";
import { firestore } from "../initFirebase";
import { Members, UserTeam } from "@/types/user";

interface AddTeamMemberResponse {
  success: boolean;
  message: string;
  member?: Members;
}

export async function addTeamMember(
  dashboardId: string,
  teamId: string,
  newMember: Members
): Promise<AddTeamMemberResponse> {
  try {
    // 올바른 경로로 팀 문서 참조
    const teamRef = doc(firestore, "dashboards", dashboardId, "teams", teamId);
    const teamDoc = await getDoc(teamRef);

    // 팀이 존재하지 않는 경우
    if (!teamDoc.exists()) {
      return {
        success: false,
        message: "팀을 찾을 수 없습니다.",
      };
    }

    const teamData = teamDoc.data() as UserTeam;

    // 이미 존재하는 멤버인지 확인
    const memberExists = teamData.members.some(
      member => member.email === newMember.email
    );

    if (memberExists) {
      return {
        success: false,
        message: "이미 팀에 존재하는 멤버입니다.",
      };
    }

    // 새 멤버 정보 준비
    const memberToAdd: Members = {
      ...newMember,
    };

    // 팀 멤버 목록 업데이트
    await updateDoc(teamRef, {
      members: [...teamData.members, memberToAdd],
      updatedAt: new Date().toISOString(),
    });

    return {
      success: true,
      message: "멤버가 성공적으로 추가되었습니다.",
      member: memberToAdd,
    };
  } catch (error) {
    console.error("Error adding team member:", error);
    return {
      success: false,
      message: "멤버 추가 중 오류가 발생했습니다.",
    };
  }
}
