import { createDashboard } from "@/api/firebase/dashboard/createDashboard";
import { getUserData } from "@/api/firebase/users/getUserData";
import NoDashboardContent from "@/components/dashboard/contents/NoDashboard";
import { authOptions } from "@/utils/authOptions";
import { getServerSession } from "next-auth";
import { requestDashboardInvite } from "@/api/firebase/dashboard/requestDashboardInvite";
import { redirect } from "next/navigation";
import { handleAppError } from "@/utils/errorHandler";
import { ERROR_MESSAGES } from "@/types/error";
import { checkRecipientName } from "@/api/firebase/dashboard/checkRecipientName";

const NoDashboardPage = async () => {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect("/login");
  }

  const { user } = session;

  if (!user) {
    return handleAppError(ERROR_MESSAGES.AUTH.USER_NOT_FOUND);
  }

  const userBase = await getUserData(user.id);

  if (!userBase) {
    return handleAppError(ERROR_MESSAGES.AUTH.USER_NOT_FOUND);
  }

  if (userBase.dashboardId) {
    redirect("/dashboard/" + userBase.dashboardId);
  }

  return (
    <NoDashboardContent
      createDashboard={createDashboard}
      requestDashboardInvite={requestDashboardInvite}
      checkRecipientName={checkRecipientName}
      userBase={userBase}
    />
  );
};

export default NoDashboardPage;
