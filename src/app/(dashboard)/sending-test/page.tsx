import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/authOptions";
import { SendingSauceTest } from "@/components/sendingTest/SendingSauceTest";
import { Metadata } from "next";
import { getUserData } from "@/api/firebase/getUserData";
import { createGroup } from "@/api/firebase/createGroup";
import { User } from "@/types/user";
import { handleAppError } from "@/utils/errorHandler";
import { ERROR_MESSAGES } from "@/types/error";

export const metadata: Metadata = {
  title: "소스 테스트 - 그룹 생성",
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
    <div className="w-full h-screen flex flex-col lg:flex-row">
      <SendingSauceTest user={user} createGroup={createGroup} />
    </div>
  );
}
