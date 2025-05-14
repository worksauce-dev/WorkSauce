"use server";

import { addDoc, collection, doc, updateDoc } from "firebase/firestore";
import { UserTeam } from "@/types/user";
import { firestore } from "../initFirebase";

export async function createTeam(
  dashboardId: string,
  team: UserTeam
): Promise<UserTeam> {
  try {
    const teamRef = collection(firestore, "dashboards", dashboardId, "teams");
    const docRef = await addDoc(teamRef, {
      ...team,
    });

    // 생성된 문서의 ID를 teamId로 설정하고 문서 업데이트
    const createdTeam: UserTeam = {
      ...team,
      teamId: docRef.id,
    };

    // 문서 업데이트
    const teamDocRef = doc(
      firestore,
      "dashboards",
      dashboardId,
      "teams",
      docRef.id
    );
    await updateDoc(teamDocRef, {
      teamId: docRef.id,
    });

    return createdTeam;
  } catch (error) {
    console.error("Error creating team:", error);
    throw new Error("팀 생성에 실패했습니다.");
  }
}
