import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/authOptions";
import { SendingTest } from "@/components/sendingTest/SendingTest";
import { Metadata } from "next";
import { getUserData } from "@/api/firebase/getUserData";
import { createGroup } from "@/api/firebase/createGroup";
import { User } from "@/types/user";
import { ErrorPage } from "@/components/common/ErrorPage";

export const metadata: Metadata = {
  title: "소스 테스트 - 그룹 생성",
};

export default async function SendingTestPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return (
      <ErrorPage
        title="로그인이 필요합니다"
        message="테스트 그룹을 생성하려면 먼저 로그인해 주세요."
      />
    );
  }

  const user = (await getUserData(session.user.id)) as User | null;

  if (!user) {
    return (
      <ErrorPage
        title="사용자 정보를 찾을 수 없습니다"
        message="사용자 정보를 불러오는데 실패했습니다. 다시 로그인해 주세요."
      />
    );
  }

  return (
    <div className="w-full h-screen flex flex-col lg:flex-row">
      <SendingTest user={user} createGroup={createGroup} />
    </div>
  );
}
