import { Login } from "@/components/login/Login";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/authOptions";
import { redirect } from "next/navigation";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "로그인",
};

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
