import { getUserData } from "@/api/firebase/users/getUserData";
import RegisterCompany from "@/components/dashboard/contents/Settings/RegisterCompany";
import { authOptions } from "@/utils/authOptions";
import { getServerSession } from "next-auth";
import { verifyingCompany } from "@/api/firebase/company/verifyingCompany";
import { uploadImageToStorage } from "@/api/firebase/dashboard/uploadImageToStorage";
import { updateDashboardOrganization } from "@/api/firebase/dashboard/updateOrganization";
import { getDashboardData } from "@/api/firebase/dashboard/getDashboardData";

const RegisterCompanyPage = async () => {
  const session = await getServerSession(authOptions);
  const userBase = await getUserData(session.user.id);
  const { isVerified } = await getDashboardData(userBase.dashboardId);

  return (
    <RegisterCompany
      userBase={userBase}
      verifyingCompany={verifyingCompany}
      uploadImageToStorage={uploadImageToStorage}
      updateDashboardOrganization={updateDashboardOrganization}
      isVerified={isVerified}
    />
  );
};

export default RegisterCompanyPage;
