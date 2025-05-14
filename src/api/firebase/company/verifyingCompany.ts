"use server";

import { firestore } from "../initFirebase";
import { doc, setDoc } from "firebase/firestore";
import { Organization } from "@/types/dashboard";

export async function verifyingCompany(
  data: Organization,
  dashboardId: string
): Promise<{ success: boolean; message: string }> {
  try {
    const verificationRef = doc(firestore, "verifyingCompany", dashboardId);

    const verificationData = {
      ...data,
      status: "pending",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await setDoc(verificationRef, verificationData);

    return {
      success: true,
      message: "회사 인증 요청이 성공적으로 제출되었습니다.",
    };
  } catch (error) {
    console.error("회사 인증 요청 중 오류 발생:", error);
    return {
      success: false,
      message: "회사 인증 요청 중 오류가 발생했습니다. 다시 시도해주세요.",
    };
  }
}
