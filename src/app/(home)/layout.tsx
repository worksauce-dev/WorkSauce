import { Header } from "@/components/landing/header/Header";
import { Footer } from "@/components/landing/footer/Footer";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/authOptions";
import { getUserData } from "@/api/firebase/getUserData";
import { Session } from "@/types/auth";
import { GhostSessionHandler } from "@/components/auth/GhostSessionHandler";

async function validateSessionAndUser(session: Session | null) {
  if (!session?.user?.id) {
    return null;
  }

  try {
    const userData = await getUserData(session.user.id);

    if (!userData) {
      console.warn(
        "Session exists but user not found in database:",
        session.user.id
      );
      return null;
    }

    return userData;
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
  const user = await validateSessionAndUser(session);

  if (session && !user) {
    return <GhostSessionHandler />;
  }

  return (
    <>
      <Header user={user} />
      {children}
      <Footer />
    </>
  );
}
