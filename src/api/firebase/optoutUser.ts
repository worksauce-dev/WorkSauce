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

export async function optoutUser(
  userId: string,
  accessToken: string,
  refreshToken: string
) {
  try {
    // 1. 카카오 연결 끊기 API 호출
    let response = await fetch("https://kapi.kakao.com/v1/user/unlink", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    // 토큰이 만료된 경우 (401 Unauthorized)
    if (response.status === 401) {
      // 토큰 갱신 시도
      const tokenResponse = await fetch("https://kauth.kakao.com/oauth/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          grant_type: "refresh_token",
          client_id: process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID!,
          refresh_token: refreshToken,
        }),
      });

      if (!tokenResponse.ok) {
        throw new Error("토큰 갱신 실패");
      }

      const { access_token: newAccessToken } = await tokenResponse.json();

      // 새 토큰으로 다시 연결 끊기 시도
      response = await fetch("https://kapi.kakao.com/v1/user/unlink", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${newAccessToken}`,
        },
      });
    }

    const responseData = await response.json().catch(() => null);
    console.log("Response Data:", responseData);

    if (!response.ok) {
      throw new Error(
        `카카오 연결 끊기 실패 - Status: ${response.status}, ` +
          `Message: ${responseData?.msg || response.statusText}`
      );
    }

    // 파이어베이스 데이터 삭제 로직
    const userRef = doc(firestore, "users", userId);
    await deleteDoc(userRef);

    const groupsQuery = query(
      collection(firestore, "groups"),
      where("createdBy.id", "==", userId)
    );

    const querySnapshot = await getDocs(groupsQuery);
    const deletePromises = querySnapshot.docs.map(doc => deleteDoc(doc.ref));
    await Promise.all(deletePromises);

    return { success: true };
  } catch (error) {
    console.error("회원 탈퇴 중 상세 오류:", {
      error: error instanceof Error ? error.message : error,
      userId,
      tokenLength: accessToken?.length || 0,
      refreshTokenLength: refreshToken?.length || 0,
    });
    throw error;
  }
}
