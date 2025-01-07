"use client";

import { getRemainingDays } from "@/utils/groupUtils";
import { useRouter } from "next/navigation";
import { MdDelete } from "react-icons/md";

interface GroupHeaderProps {
  name: string;
  deleteGroup: (groupId: string) => Promise<void>;
  isDeadline: boolean;
  deadline: string;
  groupId: string;
  isAdmin: boolean;
}

export default function GroupHeader({
  name,
  deleteGroup,
  isDeadline,
  deadline,
  groupId,
  isAdmin,
}: GroupHeaderProps) {
  const router = useRouter();

  const handleDeleteClick = async () => {
    if (window.confirm("정말로 이 그룹을 삭제하시겠습니까?")) {
      await deleteGroup(groupId);
      router.push("/dashboard");
    }
  };

  return (
    <div className="flex items-center justify-between p-6 ">
      <div className="flex flex-col">
        <h1 className="text-xl font-semibold md:text-2xl text-gray-800">
          {name} 그룹 대시보드
        </h1>
      </div>

      <div className="flex items-center gap-4">
        {isDeadline && deadline && (
          <div className="text-sm text-gray-500">
            {new Date(deadline) > new Date()
              ? `마감까지 ${getRemainingDays(deadline)}일 남음`
              : "마감 완료"}
          </div>
        )}

        {isAdmin && (
          <button
            onClick={handleDeleteClick}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-red-600 bg-red-50 rounded-lg
          transition-all duration-200 hover:bg-red-100 hover:scale-105 
          focus:outline-none focus:ring-2 focus:ring-red-200 active:scale-95"
          >
            <MdDelete className="w-4 h-4" />
            그룹 삭제
          </button>
        )}
      </div>
    </div>
  );
}
