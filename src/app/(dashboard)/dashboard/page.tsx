import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/authOptions";
import DashboardContainer from "@/components/dashboard/DashboardContainer";
import { Metadata } from "next";
import { getUserData } from "@/api/firebase/getUserData";
import { User } from "@/types/user";
import { getGroup } from "@/api/firebase/getGroup";
import { Group } from "@/types/group";
import { optoutUser } from "@/api/firebase/optoutUser";

export const metadata: Metadata = {
  title: "대시보드",
};

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  const userData = (await getUserData(session.user.id)) as User;
  const groups = userData.groups;

  const groupData: Group[] = [];

  for (let i = 0; i < groups.length; i++) {
    const data = await getGroup(groups[i]);
    if (data) {
      data.groupId = groups[i];
      groupData.push(data as Group);
    }
  }

  return (
    <div className="w-full h-screen flex flex-col lg:flex-row">
      <DashboardContainer
        userData={userData}
        groupData={groupData}
        optoutUser={optoutUser}
        accessToken={session.user.accessToken}
        refreshToken={session.user.refreshToken}
      />
    </div>
  );
}
