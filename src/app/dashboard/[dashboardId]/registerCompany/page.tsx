import { getUserData } from "@/api/firebase/users/getUserData";
import RegisterCompany from "@/components/dashboard/contents/Settings/RegisterCompany";
import { authOptions } from "@/utils/authOptions";
import { getServerSession } from "next-auth";
import { verifyingCompany } from "@/api/firebase/company/verifyingCompany";

const RegisterCompanyPage = async () => {
  const session = await getServerSession(authOptions);
  const userBase = await getUserData(session.user.id);

  return (
    <RegisterCompany userBase={userBase} verifyingCompany={verifyingCompany} />
  );
};

export default RegisterCompanyPage;
