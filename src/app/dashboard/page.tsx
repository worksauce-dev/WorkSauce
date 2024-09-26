import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/authOptions";
import { Metadata } from "next";
import Sidebar from "@/components/dashboard/Sidebar";
import DashboardContainer from "@/components/dashboard/DashboardContainer";
import { firestore } from "@/api/firebase/initFirebase";
import { doc, getDoc } from "firebase/firestore";
import { User } from "@/types/user";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "대시보드",
};

async function getUserData(userId: string): Promise<User | null> {
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

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/login");
  }

  const user = await getUserData(session.user.id);

  if (!user) {
    return <div>Error: User data not found</div>;
  }

  return (
    <div className="w-full h-screen flex flex-col lg:flex-row">
      <Sidebar user={user} />
      <DashboardContainer />
    </div>
  );
}
