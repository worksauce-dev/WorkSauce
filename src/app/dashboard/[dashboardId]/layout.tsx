import { acceptInviteRequest } from "@/api/firebase/dashboard/acceptInviteRequest";
import { getDashboardData } from "@/api/firebase/dashboard/getDashboardData";
import { getUserData } from "@/api/firebase/users/getUserData";
import ClientLayout from "@/components/dashboard/ClientLayout";
import { UserBase } from "@/types/user";
import { authOptions } from "@/utils/authOptions";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/login");
  }

  const userBase = (await getUserData(session.user.id)) as UserBase;

  if (!userBase.dashboardId) {
    redirect("/");
  }

  const dashboardData = await getDashboardData(userBase.dashboardId);

  return (
    <ClientLayout
      userBase={userBase as UserBase}
      dashboardData={dashboardData}
      acceptInviteRequest={acceptInviteRequest}
    >
      {children}
    </ClientLayout>
  );
};

export default DashboardLayout;
