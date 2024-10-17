import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/authOptions";
import { SendingTest } from "@/components/sendingTest/SendingTest";
import { Metadata } from "next";
import { getUserData } from "@/api/firebase/getUserData";
import { createGroup } from "@/api/firebase/createGroup";
import { User } from "@/types/user";
export const metadata: Metadata = {
  title: "소스 테스트 - 그룹 생성",
};

export default async function SendingTestPage() {
  const session = await getServerSession(authOptions);

  const user = (await getUserData(session.user.id)) as User | null;

  if (!user) {
    return <div>Error: User data not found</div>;
  }

  return (
    <div className="w-full h-screen flex flex-col lg:flex-row">
      <SendingTest user={user} createGroup={createGroup} />
    </div>
  );
}
