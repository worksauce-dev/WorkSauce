"use server";

import { firestore } from "../initFirebase";
import { doc, updateDoc } from "firebase/firestore";
import { Organization } from "@/types/dashboard";

export async function updateDashboardOrganization(
  data: Organization,
  dashboardId: string
) {
  try {
    const dashboardRef = doc(firestore, "dashboards", dashboardId);
    await updateDoc(dashboardRef, {
      organization: data,
      isVerified: "pending",
    });
  } catch (error) {
    console.error("회사 정보 업데이트 중 오류 발생:", error);
    throw new Error("회사 정보 업데이트에 실패했습니다.");
  }
}
