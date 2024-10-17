import { firestore } from "@/api/firebase/initFirebase";
import { doc, getDoc } from "firebase/firestore";
import { User } from "@/types/user";

export async function getUserData(userId: string): Promise<User | null> {
  const userRef = doc(firestore, "users", userId);
  const userDoc = await getDoc(userRef);

  if (!userDoc.exists()) {
    return null;
  }

  const userData = userDoc.data();

  return {
    id: userData.id,
    name: userData.name,
    email: userData.email,
    isFirstLogin: userData.isFirstLogin,
    image: userData.image,
    createdAt: userData.createdAt?.toDate().toISOString() ?? null,
    status: userData.status,
    type: userData.type,
    updatedAt: userData.updatedAt?.toDate().toISOString() ?? null,
    isAdmin: userData.isAdmin,
    provider: userData.provider,
    lastLoginAt: userData.lastLoginAt?.toDate().toISOString() ?? null,
    groups: userData.groups,
  };
}
