import { getUserData } from "@/api/firebase/users/getUserData";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/authOptions";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/admin");
  }

  const userBase = await getUserData(session.user.id);

  const isAdmin = userBase.isAdmin;

  if (!isAdmin) {
    redirect("/");
  }

  return (
    <div className="w-full h-screen flex flex-col lg:flex-row bg-[#F7F7F9]">
      <AdminSidebar userBase={userBase} />
      {children}
    </div>
  );
}
