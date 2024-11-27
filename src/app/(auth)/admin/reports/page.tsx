import { getAdminResults } from "@/api/firebase/getAdminResults";
import { Metadata } from "next";
import AdminReports from "@/components/admin/AdminReports";

export const metadata: Metadata = {
  title: "관리자 리포트",
  description: "워크소스 관리자 리포트",
};

export default async function AdminReportsPage() {
  const results = await getAdminResults();

  return <AdminReports results={results} />;
}
