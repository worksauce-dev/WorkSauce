import { Login } from "@/components/login/Login";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/authOptions";
import { redirect } from "next/navigation";
export default async function LoginPage() {
  const session = await getServerSession(authOptions);

  if (session !== null) {
    redirect("/");
  }

  return (
    <>
      <Login />
    </>
  );
}
