import FirstLoginGreeting from "@/components/dashboard/FirstLoginGreeting";
import Sidebar from "@/components/dashboard/Sidebar";
import { authOptions } from "@/utils/authOptions";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { getUserData } from "@/api/firebase/getUserData";
import { saveUserData } from "@/api/firebase/saveUserData";
import { ErrorPage } from "@/components/common/ErrorPage";

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
    return (
      <ErrorPage
        title="사용자 정보를 찾을 수 없습니다"
        message="사용자 데이터를 불러오는 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요."
        showHomeButton={true}
      />
    );
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
