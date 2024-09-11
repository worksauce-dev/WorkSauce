import { auth } from "@/api/firebase/initFirebase";
import { getErrorMessage } from "@/utils/getErrorMessage";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

// 회원가입 로직
export const signUp = async (email: string, password: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    return userCredential.user; // 성공 시 유저 정보 반환
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

// 로그인 로직
export const logIn = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    return userCredential.user; // 성공 시 유저 정보 반환
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

// 로그아웃 로직
export const logOut = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};
