"use server";

import { firestore } from "../initFirebase";
import { doc, updateDoc } from "firebase/firestore";

export async function updateVerifyingQueue(
  dashboardId: string,
  status: "pending" | "approved" | "rejected"
) {
  try {
    const verifyingQueueRef = doc(firestore, "verifyingCompany", dashboardId);
    const dashboardRef = doc(firestore, "dashboards", dashboardId);
    await updateDoc(verifyingQueueRef, { status });
    await updateDoc(dashboardRef, { isVerified: status });

    return {
      success: true,
      message: "회사 인증 대기 목록에서 제거되었습니다.",
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "회사 인증 대기 목록에서 제거에 실패했습니다.",
    };
  }
}
