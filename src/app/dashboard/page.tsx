import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/authOptions";
import Sidebar from "@/components/dashboard/Sidebar";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { firestore } from "@/api/firebase/initFirebase";
import { User } from "@/types/user";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import FirstLoginGreeting from "@/components/dashboard/FirstLoginGreeting";
import DashboardContainer from "@/components/dashboard/DashboardContainer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "대시보드",
};

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
  };
}

async function saveUserData(userId: string, data: any) {
  "use server";
  const userRef = doc(firestore, "users", userId);
  await updateDoc(userRef, data);

  revalidatePath("/dashboard");
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/login");
  }

  const user = await getUserData(session.user.id);

  if (!user) {
    return <div>Error: User data not found</div>;
  }

  if (user.isFirstLogin) {
    return <FirstLoginGreeting user={user} saveUserData={saveUserData} />;
  }

  return (
    <div className="w-full h-screen flex flex-col lg:flex-row">
      <Sidebar user={user} />
      <DashboardContainer user={user} />;
    </div>
  );
}
