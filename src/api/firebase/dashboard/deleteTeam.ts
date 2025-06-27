"use server";
import { deleteDoc, doc } from "firebase/firestore";
import { firestore } from "../initFirebase";

export async function deleteTeam(dashboardId: string, teamId: string) {
  try {
    const teamRef = doc(firestore, "dashboards", dashboardId, "teams", teamId);
    await deleteDoc(teamRef);
    return { success: true };
  } catch (error) {
    console.error("Error deleting team:", error);
    throw new Error("팀 삭제에 실패했습니다.");
  }
}
