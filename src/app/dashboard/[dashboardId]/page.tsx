import { getUserData } from "@/api/firebase/users/getUserData";
import DashboardContent from "@/components/dashboard/contents/DashboardContent";
import { authOptions } from "@/utils/authOptions";
import { getServerSession } from "next-auth";
import { UserBase } from "@/types/user";
import { getTeams } from "@/api/firebase/dashboard/getTeams";
import { getTestResults } from "@/api/firebase/dashboard/getTestResults";

const DashboardPage = async () => {
  const session = await getServerSession(authOptions);
  const userBase = await getUserData(session.user.id);
  const fetchTeams = await getTeams(userBase.dashboardId);
  const fetchTests = await getTestResults(userBase.dashboardId);

  return (
    <DashboardContent
      userBase={userBase as UserBase}
      fetchTeams={fetchTeams}
      fetchTests={fetchTests}
    />
  );
};

export default DashboardPage;
