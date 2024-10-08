import FirstLoginGreeting from "@/components/dashboard/FirstLoginGreeting";
import Sidebar from "@/components/dashboard/Sidebar";
import { authOptions } from "@/utils/authOptions";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { getUserData } from "@/api/firebase/getUserData";
import { saveUserData } from "@/api/firebase/saveUserData";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
      {children}
    </div>
  );
}
