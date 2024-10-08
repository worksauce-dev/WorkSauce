"use server";

import { firestore } from "@/api/firebase/initFirebase";
import { doc, updateDoc } from "firebase/firestore";
import { revalidatePath } from "next/cache";
import { User } from "@/types/user";

export async function saveUserData(userId: string, data: Partial<User>) {
  const userRef = doc(firestore, "users", userId);
  await updateDoc(userRef, data);

  revalidatePath("/dashboard");
}
