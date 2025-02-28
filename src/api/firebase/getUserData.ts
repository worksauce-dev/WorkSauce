import { firestore } from "@/api/firebase/initFirebase";
import { doc, getDoc } from "firebase/firestore";
import { BusinessUser, User } from "@/types/user";

export async function getUserData(
  userId: string
): Promise<User | BusinessUser | null> {
  const userRef = doc(firestore, "users", userId);
  const userDoc = await getDoc(userRef);

  if (!userDoc.exists()) {
    return null;
  }

  const userData = userDoc.data();

  return {
    plan: userData.plan,
    id: userData.id,
    name: userData.name,
    email: userData.email,
    isFirstLogin: userData.isFirstLogin,
    createdAt: userData.createdAt,
    status: userData.status,
    updatedAt: userData.updatedAt,
    isAdmin: userData.isAdmin,
    provider: userData.provider,
    lastLoginAt: userData.lastLoginAt,
    groups: userData.groups,
    userType: userData.userType,
    agreeTerms: userData.agreeTerms,
    sugarMetaData: userData.sugarMetaData,
  };
}
