import { Header } from "@/components/landing/header/Header";
import { Footer } from "@/components/landing/footer/Footer";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/authOptions";

export default async function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);

  return (
    <>
      <Header session={session} />
      {children}
      <Footer />
    </>
  );
}
