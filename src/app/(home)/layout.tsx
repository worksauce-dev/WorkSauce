import { Header } from "@/components/landing/header/Header";
import { Footer } from "@/components/landing/footer/Footer";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/authOptions";
import { getUserData } from "@/api/firebase/getUserData";

export default async function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);

  const user = session ? await getUserData(session?.user?.id) : null;

  return (
    <>
      <Header user={user} />
      {children}
      <Footer />
    </>
  );
}
