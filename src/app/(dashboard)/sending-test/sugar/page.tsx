import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/authOptions";
import { Metadata } from "next";
import { getUserData } from "@/api/firebase/getUserData";
import { User } from "@/types/user";
import { handleAppError } from "@/utils/errorHandler";
import { ERROR_MESSAGES } from "@/types/error";
import { SendingSugarTest } from "@/components/sendingTest/SendingSugarTest";
import { createGroup } from "@/api/firebase/createGroup";
import { getContactGroups } from "@/api/firebase/contacts/getContactGroups";
import { getContacts } from "@/api/firebase/contacts/getContacts";

export const metadata: Metadata = {
  title: "슈가 테스트 - 그룹 생성",
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

  const { groups } = await getContactGroups(user.id);

  return (
    <div className="w-full h-screen flex flex-col lg:flex-row">
      <SendingSugarTest
        user={user}
        groups={groups}
        createGroup={createGroup}
        getContacts={getContacts}
      />
    </div>
  );
}
