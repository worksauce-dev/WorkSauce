import { Group } from "@/types/group";
import { getRemainingDays } from "@/utils/groupUtils";

interface GroupHeaderProps {
  group: Group;
}

export default function GroupHeader({ group }: GroupHeaderProps) {
  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-xl font-bold text-indigo-700">
        {group.name} 대시보드
      </h1>
      <div className="text-sm text-gray-500">
        {new Date(group.deadline) > new Date()
          ? `마감까지 ${getRemainingDays(group.deadline)}일 남음`
          : "마감 완료"}
      </div>
    </div>
  );
}
