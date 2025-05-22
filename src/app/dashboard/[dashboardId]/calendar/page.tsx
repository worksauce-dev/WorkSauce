import { getTeams } from "@/api/firebase/dashboard/getTeams";
import { getUserData } from "@/api/firebase/users/getUserData";
import Calendar from "@/components/dashboard/contents/Calendar";
import { getTestResults } from "@/api/firebase/dashboard/getTestResults";
import { authOptions } from "@/utils/authOptions";
import { getServerSession } from "next-auth";

const CalendarPage = async () => {
  const session = await getServerSession(authOptions);
  const userBase = await getUserData(session.user.id);
  const fetchTests = await getTestResults(userBase.dashboardId);
  const fetchTeams = await getTeams(userBase.dashboardId);

  return (
    <Calendar
      userBase={userBase}
      fetchTests={fetchTests}
      fetchTeams={fetchTeams}
    />
  );
};

export default CalendarPage;
