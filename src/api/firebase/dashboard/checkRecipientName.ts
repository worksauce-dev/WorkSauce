"use server";

import { firestore } from "../initFirebase";
import { collection, query, where, getDocs } from "firebase/firestore";

interface UserNameResponse {
  success: boolean;
  name?: string;
  message?: string;
}

export async function checkRecipientName(
  email: string
): Promise<UserNameResponse> {
  try {
    const usersRef = collection(firestore, "users");
    const q = query(usersRef, where("email", "==", email));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return {
        success: false,
        message: "해당 이메일의 유저를 찾을 수 없습니다.",
      };
    }

    const userDoc = querySnapshot.docs[0];
    const userData = userDoc.data();

    if (!userData.name) {
      return {
        success: false,
        message: "유저 이름 정보가 없습니다.",
      };
    }

    return {
      success: true,
      name: userData.name,
    };
  } catch (error) {
    console.error("Error checking recipient name:", error);
    return {
      success: false,
      message: "유저 정보 조회 중 오류가 발생했습니다.",
    };
  }
}
