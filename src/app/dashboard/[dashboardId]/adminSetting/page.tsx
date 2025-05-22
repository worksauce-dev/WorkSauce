import { getTeams } from "@/api/firebase/dashboard/getTeams";
import { getTestResults } from "@/api/firebase/dashboard/getTestResults";
import { getUserData } from "@/api/firebase/users/getUserData";
import AdminSetting from "@/components/dashboard/contents/Settings/AdminSetting";

import { authOptions } from "@/utils/authOptions";
import { getServerSession } from "next-auth";

const AdminSettingPage = async () => {
  return <AdminSetting />;
};

export default AdminSettingPage;
