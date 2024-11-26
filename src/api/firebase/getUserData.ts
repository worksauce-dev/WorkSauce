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
    dashboardName: userData.dashboardName,
    address: userData.address,
    plan: userData.plan,
    id: userData.id,
    name: userData.name,
    email: userData.email,
    isFirstLogin: userData.isFirstLogin,
    createdAt: userData.createdAt,
    status: userData.status,
    type: userData.type,
    updatedAt: userData.updatedAt,
    isAdmin: userData.isAdmin,
    provider: userData.provider,
    lastLoginAt: userData.lastLoginAt,
    groups: userData.groups,
    userType: userData.userType,
    agreeTerms: userData.agreeTerms,
    phoneNumber: userData.phoneNumber,
  };
}
