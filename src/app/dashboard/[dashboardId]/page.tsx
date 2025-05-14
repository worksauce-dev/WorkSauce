import { getUserData } from "@/api/firebase/users/getUserData";
import DashboardContent from "@/components/dashboard/contents/DashboardContent";
import { authOptions } from "@/utils/authOptions";
import { getServerSession } from "next-auth";
import { UserBase } from "@/types/user";

const DashboardPage = async () => {
  const session = await getServerSession(authOptions);
  const userBase = await getUserData(session.user.id);

  return <DashboardContent userBase={userBase as UserBase} />;
};

export default DashboardPage;
