import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/authOptions";
import DashboardContainer from "@/components/dashboard/DashboardContainer";
import { Metadata } from "next";
import { getUserData } from "@/api/firebase/getUserData";

export const metadata: Metadata = {
  title: "대시보드",
};

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  const user = await getUserData(session.user.id);

  if (!user) {
    return <div>Error: User data not found</div>;
  }

  return (
    <div className="w-full h-screen flex flex-col lg:flex-row">
      <DashboardContainer user={user} />;
    </div>
  );
}
