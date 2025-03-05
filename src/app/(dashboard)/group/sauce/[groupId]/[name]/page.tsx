import { getGroup } from "@/api/firebase/getGroup";
import { Group } from "@/types/group";
import ApplicantScoreCard from "@/components/result/ApplicantScoreCard";
import { User } from "@/types/user";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/authOptions";
import { getSauceResult } from "@/api/firebase/getSauceResult";
import { SauceResultType, ScoreType } from "@/types/saucetest/test";
import { Metadata } from "next";
import { handleAppError } from "@/utils/errorHandler";
import { ERROR_MESSAGES } from "@/types/error";

export const metadata: Metadata = {
  title: "지원자 결과",
};

export default async function ApplicantPage({
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

  const sauceResult = (await getSauceResult()) as SauceResultType;
  const {
    name,
    email,
    groupId,
    testStatus,
    completedAt,
    testResult,
    groupName,
  } = applicant;

  return (
    <div className="w-full bg-[#F7F7F9] px-4 sm:px-6 sm:py-6 mx-auto lg:px-8 py-6 flex flex-col h-screen gap-4">
      <ApplicantScoreCard
        applicant={applicant}
        sauceResult={sauceResult}
        testResult={testResult as ScoreType[]}
      />
    </div>
  );
}
