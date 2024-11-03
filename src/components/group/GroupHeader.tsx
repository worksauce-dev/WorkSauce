"use client";

import { Group } from "@/types/group";
import { getRemainingDays } from "@/utils/groupUtils";
import { RiDeleteBinLine } from "react-icons/ri";
import { useRouter } from "next/navigation";

interface GroupHeaderProps {
  group: Group;
  deleteGroup: (groupId: string) => Promise<void>;
}

export default function GroupHeader({ group, deleteGroup }: GroupHeaderProps) {
  const router = useRouter();
  return (
    <div className="flex justify-between items-center mb-6">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-bold text-indigo-700">
          {group.name} 대시보드
        </h1>
      </div>
      <div className="flex items-center gap-4">
        <div className="text-sm text-gray-500">
          {new Date(group.deadline) > new Date()
            ? `마감까지 ${getRemainingDays(group.deadline)}일 남음`
            : "마감 완료"}
        </div>
        <button
          className="p-2 text-red-600 border border-red-600 rounded hover:bg-red-50"
          onClick={() => {
            if (confirm("정말로 이 그룹을 삭제하시겠습니까?")) {
              deleteGroup(group.groupId);
              router.push("/dashboard");
            }
          }}
        >
          <RiDeleteBinLine size={16} />
        </button>
      </div>
    </div>
  );
}
