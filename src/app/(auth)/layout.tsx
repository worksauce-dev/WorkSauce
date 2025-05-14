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

  const user = await getUserData(session.user.id);

  const isAdmin = user?.isAdmin;

  if (!isAdmin) {
    redirect("/");
  }

  return (
    <div className="w-full h-screen flex flex-col lg:flex-row bg-[#F7F7F9]">
      <AdminSidebar user={user} />
      {children}
    </div>
  );
}
