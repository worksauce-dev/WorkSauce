import { firestore } from "@/api/firebase/initFirebase";
import { doc, getDoc } from "firebase/firestore";
import { UserBase } from "@/types/user";

export async function getUserData(userId: string): Promise<UserBase> {
  const userRef = doc(firestore, "users", userId);
  const userDoc = await getDoc(userRef);
  return userDoc.data() as UserBase;
}
