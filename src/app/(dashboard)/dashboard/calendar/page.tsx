import DashboardCalendar from "@/components/dashboard/DashboardCalendar";
import { authOptions } from "@/utils/authOptions";
import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { User } from "@/types/user";
import { Group } from "@/types/group";
import { getUserData } from "@/api/firebase/getUserData";
import { getGroup } from "@/api/firebase/getGroup";

export const metadata: Metadata = {
  title: "대시보드 캘린더",
};

export default async function DashboardCalendarPage() {
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

  console.log(groupData);

  return (
    <div className="w-full h-screen flex flex-col lg:flex-row">
      <DashboardCalendar groups={groupData} />
    </div>
  );
}
