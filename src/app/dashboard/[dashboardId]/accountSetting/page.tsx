import AccountSetting from "@/components/dashboard/contents/Settings/AccountSetting";
import { getUserData } from "@/api/firebase/users/getUserData";
import { authOptions } from "@/utils/authOptions";
import { getServerSession } from "next-auth";
import { optoutUser } from "@/api/firebase/users/optoutUser";

const AccountSettingPage = async () => {
  const session = await getServerSession(authOptions);
  const userBase = await getUserData(session.user.id);

  return <AccountSetting userBase={userBase} optoutUser={optoutUser} />;
};

export default AccountSettingPage;
