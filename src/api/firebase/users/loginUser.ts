"use server";

import { signInWithEmailAndPassword, UserCredential } from "firebase/auth";
import { auth } from "../initFirebase";
import { FirebaseError } from "firebase/app";

interface LoginResult {
  success: boolean;
  message?: string;
  email?: string;
  name?: string;
  id?: string;
  accessToken?: string;
  refreshToken?: string;
}

export async function loginUser(
  email: string,
  password: string
): Promise<LoginResult> {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    const { user } = userCredential;
    const accessToken = await user.getIdToken();

    return {
      success: true,
      email: user.email ?? "",
      name: user.displayName ?? "",
      id: user.uid ?? "",
      accessToken: accessToken ?? "",
      refreshToken: user.refreshToken ?? "",
    };
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("Login failed:", error);
    }

    if (error instanceof FirebaseError) {
      const message = getErrorMessage(error.code);
      return { success: false, message };
    }

    return {
      success: false,
      message: "로그인 중 오류가 발생했습니다. 다시 시도해 주세요.",
    };
  }
}

function getErrorMessage(errorCode: string): string {
  switch (errorCode) {
    case "auth/invalid-email":
      return "유효하지 않은 이메일 형식입니다.";
    case "auth/user-disabled":
      return "비활성화된 계정입니다.";
    case "auth/invalid-credential":
      return "이메일 또는 비밀번호가 올바르지 않습니다.";
    default:
      return "로그인 중 오류가 발생했습니다. 다시 시도해 주세요.";
  }
}
