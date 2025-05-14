import { getUserData } from "@/api/firebase/users/getUserData";
import RegisterCompany from "@/components/dashboard/contents/RegisterCompany";
import { User } from "@/types/user";
import { authOptions } from "@/utils/authOptions";
import { getServerSession } from "next-auth";
import { verifyingCompany } from "@/api/firebase/company/verifyingCompany";

const RegisterCompanyPage = async () => {
  const session = await getServerSession(authOptions);
  const user = await getUserData(session.user.id);

  return (
    <RegisterCompany user={user as User} verifyingCompany={verifyingCompany} />
  );
};

export default RegisterCompanyPage;
