import { getUserData } from "@/api/firebase/users/getUserData";
import TeamManagement from "@/components/dashboard/contents/TeamManagement/TeamManagement";
import { ERROR_MESSAGES } from "@/types/error";
import { authOptions } from "@/utils/authOptions";
import { handleAppError } from "@/utils/errorHandler";
import { getServerSession } from "next-auth";
import { createTeam } from "@/api/firebase/dashboard/createTeam";
import { getTeams } from "@/api/firebase/dashboard/getTeams";
import { addTeamMember } from "@/api/firebase/dashboard/addTeamMember";
import { createTestInfo } from "@/api/firebase/dashboard/createTestInfo";
import { updateTestRef } from "@/api/firebase/dashboard/updateTestRef";
import { createTest } from "@/api/firebase/dashboard/createTest";
import { getTestResults } from "@/api/firebase/dashboard/getTestResults";
import { getDashboardData } from "@/api/firebase/dashboard/getDashboardData";

const TeamManagementPage = async () => {
  const session = await getServerSession(authOptions);
  const userBase = await getUserData(session.user.id);

  if (!userBase) {
    return handleAppError(ERROR_MESSAGES.AUTH.USER_NOT_FOUND);
  }

  const fetchTeams = await getTeams(userBase.dashboardId);
  const fetchTests = await getTestResults(userBase.dashboardId);
  const dashboardData = await getDashboardData(userBase.dashboardId);

  return (
    <TeamManagement
      userBase={userBase}
      createTeam={createTeam}
      fetchTeams={fetchTeams}
      addTeamMember={addTeamMember}
      createTestInfo={createTestInfo}
      updateTestRef={updateTestRef}
      createTest={createTest}
      fetchTests={fetchTests}
      dashboardData={dashboardData}
    />
  );
};

export default TeamManagementPage;
