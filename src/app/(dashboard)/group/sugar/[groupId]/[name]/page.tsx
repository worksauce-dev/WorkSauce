import { getGroup } from "@/api/firebase/getGroup";
import { Group } from "@/types/group";
import { User } from "@/types/user";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/authOptions";
import { Metadata } from "next";
import { handleAppError } from "@/utils/errorHandler";
import { ERROR_MESSAGES } from "@/types/error";
import { SugarTestResult as SugarTestResultType } from "@/types/sugartest/sugarTestResult";
import SugarTestResult from "@/components/result/sugar/SugarTestResult";

export const metadata: Metadata = {
  title: "슈가테스트 결과",
};

export default async function SugarTestResultPage({
  params,
}: {
  params: { groupId: string; name: string };
}) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return handleAppError(ERROR_MESSAGES.AUTH.LOGIN_REQUIRED);
  }

  const user = session.user as User;
  const group = (await getGroup(params.groupId)) as Group;

  if (!group) {
    return handleAppError(ERROR_MESSAGES.GROUP.NOT_FOUND);
  }

  if (user.id !== group.createdBy.id) {
    return handleAppError(ERROR_MESSAGES.GROUP.ACCESS_DENIED);
  }

  const applicant = group.applicants.find(
    a => a.name === decodeURIComponent(params.name)
  );
  if (!applicant) {
    return handleAppError(ERROR_MESSAGES.APPLICANT.NOT_FOUND);
  }

  const { testResult, groupName, name, completedAt, groupId } = applicant;

  return (
    <div className="w-full bg-[#F7F7F9] px-4 sm:px-6 sm:py-6 mx-auto lg:px-8 py-6 flex flex-col h-screen gap-4">
      <SugarTestResult
        testResult={testResult as SugarTestResultType}
        groupName={groupName}
        name={name}
        completedAt={completedAt as string}
        groupId={groupId}
      />
    </div>
  );
}
