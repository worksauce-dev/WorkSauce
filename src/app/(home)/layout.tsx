import { Header } from "@/components/landing/header/Header";
import { Footer } from "@/components/landing/hero/sections/Footer";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/authOptions";
import { getUserData } from "@/api/firebase/users/getUserData";
import { Session } from "@/types/auth";
import { GhostSessionHandler } from "@/components/auth/GhostSessionHandler";
import { UserBase } from "@/types/user";

async function validateSessionAndUser(session: Session | null) {
  if (!session?.user?.id) {
    return null;
  }

  try {
    const userBase = (await getUserData(session.user.id)) as UserBase;

    if (!userBase) {
      console.warn(
        "Session exists but user not found in database:",
        session.user.id
      );
      return null;
    }

    return userBase;
  } catch (error) {
    console.error("Error fetching user data:", error);
    return null;
  }
}

export default async function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);
  const userBase = await validateSessionAndUser(session);

  if (session && !userBase) {
    return <GhostSessionHandler />;
  }

  return (
    <>
      <Header userBase={userBase} />
      {children}
      {/* <Footer /> */}
    </>
  );
}
