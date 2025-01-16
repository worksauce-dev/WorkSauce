"use server";

import {
  getDocs,
  collection,
  writeBatch,
  getDoc,
  doc,
} from "firebase/firestore";
import { firestore, auth } from "../initFirebase";
import { Group } from "@/types/group";
import { deleteUser, signInWithEmailAndPassword } from "firebase/auth";

export async function optoutUser(
  userId: string,
  accessToken: string,
  refreshToken: string,
  password?: string
) {
  try {
    // 유저 정보 조회
    const userRef = doc(firestore, "users", userId);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      throw new Error("사용자를 찾을 수 없습니다.");
    }

    const userData = userDoc.data();
    const provider = userData.provider;

    // Email 회원의 경우
    if (provider === "credentials") {
      if (!password) {
        throw new Error("비밀번호가 필요합니다.");
      }

      // // 현재 유저 재인증
      const userCredential = await signInWithEmailAndPassword(
        auth,
        userData.email,
        password
      );

      if (userCredential.user) {
        // Firebase Auth에서 유저 삭제
        await deleteUser(userCredential.user);
      }
    }
    // 카카오 회원의 경우
    else if (provider === "kakao") {
      // 카카오 연결 끊기 API 호출
      let response = await fetch("https://kapi.kakao.com/v1/user/unlink", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // 토큰이 만료된 경우 (401 Unauthorized)
      if (response.status === 401) {
        // 토큰 갱신 시도
        const tokenResponse = await fetch(
          "https://kauth.kakao.com/oauth/token",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
              grant_type: "refresh_token",
              client_id: process.env.KAKAO_CLIENT_ID!,
              refresh_token: refreshToken,
            }),
          }
        );

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

      if (!response.ok) {
        throw new Error(
          `카카오 연결 끊기 실패 - Status: ${response.status}, ` +
            `Message: ${responseData?.msg || response.statusText}`
        );
      }
    }

    // Firestore 데이터 삭제 로직
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
    batch.delete(userRef);

    // 일괄 삭제 실행
    await batch.commit();

    return { success: true };
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("회원 탈퇴 중 상세 오류:", {
        error: error instanceof Error ? error.message : error,
        userId,
      });
    }
    throw error;
  }
}
