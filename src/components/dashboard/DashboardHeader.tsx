import { getRemainingDays } from "@/utils/groupUtils";
import { MdBolt } from "react-icons/md";

interface DashboardHeaderProps {
  name: string;
  isDeadline: boolean;
  deadline?: string;
}
export default function DashboardHeader({
  name,
  isDeadline,
  deadline,
}: DashboardHeaderProps) {
  return (
    <div className="flex items-center justify-between p-6 ">
      <div className="flex flex-col">
        <h1 className="text-xl font-semibold md:text-2xl text-gray-800">
          {isDeadline ? `${name} 그룹 대시보드` : `${name}님의 대시보드`}
        </h1>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="bg-orange-50 rounded-full p-3">
            <MdBolt className="w-5 h-5 md:w-6 md:h-6 text-orange-500" />
          </div>
        </div>

        {isDeadline && deadline && (
          <div className="text-sm text-gray-500">
            {new Date(deadline) > new Date()
              ? `마감까지 ${getRemainingDays(deadline)}일 남음`
              : "마감 완료"}
          </div>
        )}
      </div>
    </div>
  );
}
