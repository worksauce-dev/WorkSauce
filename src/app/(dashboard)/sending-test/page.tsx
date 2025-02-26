import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/authOptions";
import { Metadata } from "next";
import { getUserData } from "@/api/firebase/getUserData";
import { User } from "@/types/user";
import { handleAppError } from "@/utils/errorHandler";
import { ERROR_MESSAGES } from "@/types/error";
import { TestSelector } from "@/components/sendingTest/testSelector/TestSelector";

export const metadata: Metadata = {
  title: "소스 테스트 - 진단도구 선택",
};

export default async function SendingTestPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return handleAppError(ERROR_MESSAGES.AUTH.LOGIN_REQUIRED);
  }

  const user = (await getUserData(session.user.id)) as User | null;

  if (!user) {
    return handleAppError(ERROR_MESSAGES.AUTH.USER_NOT_FOUND);
  }

  return (
    <div className="w-full h-screen flex flex-col lg:flex-row ">
      <TestSelector user={user} />
    </div>
  );
}
