import { TestSelector } from "@/components/dashboard/contents/TestSelector";
import { authOptions } from "@/utils/authOptions";
import { getServerSession } from "next-auth";
import { getUserData } from "@/api/firebase/users/getUserData";

const DashboardPage = async () => {
  const session = await getServerSession(authOptions);
  const userBase = await getUserData(session.user.id);

  return <TestSelector userBase={userBase} />;
};

export default DashboardPage;
