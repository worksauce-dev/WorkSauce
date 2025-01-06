"use server";

import { getDocs, collection, writeBatch } from "firebase/firestore";
import { doc } from "firebase/firestore";
import { firestore } from "./initFirebase";
import { Group } from "@/types/group";

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
          client_id: process.env.KAKAO_CLIENT_ID!,
          refresh_token: refreshToken,
        }),
      });

      if (!tokenResponse.ok) {
        const errorData = await tokenResponse.json();
        throw new Error(
          `토큰 갱신 실패: ${JSON.stringify({
            status: tokenResponse.status,
            statusText: tokenResponse.statusText,
            error: errorData,
          })}`
        );
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

    // 2. Firestore 데이터 삭제 로직
    const batch = writeBatch(firestore);

    // 사용자의 연락처 삭제
    const contactsRef = collection(firestore, `users/${userId}/contacts`);
    const contactsSnapshot = await getDocs(contactsRef);
    contactsSnapshot.forEach(doc => {
      batch.delete(doc.ref);
    });

    // groups 컬렉션에서 해당 유저가 생성한 그룹들 삭제
    const groupsRef = collection(firestore, "groups");
    const groupsSnapshot = await getDocs(groupsRef);
    groupsSnapshot.forEach(doc => {
      const groupData = doc.data() as Group;
      if (groupData.createdBy.id === userId) {
        batch.delete(doc.ref);
      }
    });

    // 사용자 문서 삭제
    const userRef = doc(firestore, "users", userId);
    batch.delete(userRef);

    // 일괄 삭제 실행
    await batch.commit();

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
