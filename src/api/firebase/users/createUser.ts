// 신규 유저 회원가입 - 데이터 구조 개선 버전
"use server";

import { auth, firestore } from "../initFirebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { FirebaseError } from "firebase/app";
import { UserBase } from "@/types/user";

export async function createUser(userData: UserBase, password: string) {
  try {
    // 1. Authentication 계정 생성
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      userData.email,
      password
    );

    const userId = userCredential.user.uid;

    // 2. 디스플레이 이름 설정
    await updateProfile(userCredential.user, {
      displayName: userData.name,
    });

    // 3. 사용자 정보 저장 (users 컬렉션)

    await setDoc(doc(firestore, "users", userId), {
      ...userData,
      id: userId,
    });

    return { success: true, userId };
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("Error creating user:", error);
    }
    if (error instanceof FirebaseError) {
      throw new Error(getErrorMessage(error.code));
    }
    throw new Error("회원가입 중 오류가 발생했습니다. 다시 시도해 주세요.");
  }
}

function getErrorMessage(errorCode: string): string {
  switch (errorCode) {
    case "auth/email-already-in-use":
      return "이미 사용 중인 이메일입니다.";
    case "auth/invalid-email":
      return "유효하지 않은 이메일 형식입니다.";
    case "auth/weak-password":
      return "비밀번호는 최소 6자리 이상이어야 합니다.";
    case "auth/network-request-failed":
      return "네트워크 연결을 확인해주세요.";
    case "auth/operation-not-allowed":
      return "이메일/비밀번호 로그인이 비활성화되어 있습니다.";
    default:
      return "회원가입 중 오류가 발생했습니다. 다시 시도해 주세요.";
  }
}
