"use server";

import { doc, updateDoc } from "firebase/firestore";
import { firestore } from "./initFirebase";

export async function updateUserProfile(
  userId: string,
  profileForm: {
    name: string;
    email: string;
    companyName: string;
  }
): Promise<{ success: boolean }> {
  const userRef = doc(firestore, "users", userId);
  await updateDoc(userRef, profileForm);
  return { success: true };
}
