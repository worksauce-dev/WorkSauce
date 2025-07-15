import { AdminApprovedDashboardsList } from "@/components/admin/ApprovedDashboardsList";
import { getVerifyingQueue } from "@/api/firebase/admin/getVerifyingQueue";
import { MdBusiness } from "react-icons/md";

const AdminApprovedDashboardsPage = async () => {
  const allCompanies = await getVerifyingQueue();
  const approvedCompanies = allCompanies.filter(
    org => org.status === "approved"
  );

  return (
    <div className="max-w-5xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <MdBusiness className="text-orange-500" /> 인증된 대시보드 목록
      </h1>
      {approvedCompanies.length === 0 ? (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center text-gray-500">
          인증된 대시보드가 없습니다.
        </div>
      ) : (
        <AdminApprovedDashboardsList companies={approvedCompanies} />
      )}
    </div>
  );
};

export default AdminApprovedDashboardsPage;
