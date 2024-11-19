"use server";

import {
  deleteDoc,
  query,
  where,
  getDocs,
  collection,
} from "firebase/firestore";
import { doc } from "firebase/firestore";
import { firestore } from "./initFirebase";

export async function optoutUser(userId: string, accessToken: string) {
  try {
    // 1. 카카오 연결 끊기 API 호출
    const response = await fetch("https://kapi.kakao.com/v1/user/unlink", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error("카카오 연결 끊기 실패");
    }

    // 2. Firestore 사용자 문서 삭제
    const userRef = doc(firestore, "users", userId);
    await deleteDoc(userRef);

    // 3. 사용자가 생성한 그룹 문서들 삭제
    const groupsQuery = query(
      collection(firestore, "groups"),
      where("createdBy.id", "==", userId)
    );

    const querySnapshot = await getDocs(groupsQuery);
    const deletePromises = querySnapshot.docs.map(doc => deleteDoc(doc.ref));
    await Promise.all(deletePromises);

    return { success: true };
  } catch (error) {
    console.error("회원 탈퇴 중 오류 발생:", error);
    throw error;
  }
}
