import { SendingSauceTest } from "@/components/dashboard/contents/SendingSauceTest";
import { SendingSugarTest } from "@/components/dashboard/contents/SendingSugarTest";
import { authOptions } from "@/utils/authOptions";
import { getServerSession } from "next-auth";
import { getUserData } from "@/api/firebase/users/getUserData";
import { getTeams } from "@/api/firebase/dashboard/getTeams";

const SendingTestPage = async ({
  params,
}: {
  params: Promise<{ testId: string }>;
}) => {
  const { testId } = await params;

  const session = await getServerSession(authOptions);
  const userBase = await getUserData(session.user.id);
  const fetchTeams = await getTeams(userBase.dashboardId);

  switch (testId) {
    case "sauce":
      return <SendingSauceTest userBase={userBase} />;
    case "sugar":
      return <SendingSugarTest fetchTeams={fetchTeams} />;
    default:
      return <div>해당하는 테스트가 없습니다.</div>;
  }
};

export default SendingTestPage;
