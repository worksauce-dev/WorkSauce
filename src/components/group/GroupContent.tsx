"use client";

import { useState } from "react";
import KeywordAnalysis from "./KeywordAnalysis";
import ApplicantTable from "./ApplicantTable";
import { Group } from "@/types/group";

interface GroupContentProps {
  group: Group;
  groupId: string;
  stats: {
    totalApplicants: number;
    completedTests: number;
    pendingTests: number;
    completionRate: number;
  };
}

export default function GroupContent({
  group,
  groupId,
  stats,
}: GroupContentProps) {
  const [selectedKeyword, setSelectedKeyword] = useState<string | "전체">(
    "전체"
  );

  return (
    <div className="flex flex-row gap-4 h-full">
      <div className="w-1/3 h-full">
        <KeywordAnalysis
          group={group}
          stats={stats}
          onKeywordSelect={setSelectedKeyword}
          selectedKeyword={selectedKeyword}
        />
      </div>
      <div className="w-2/3 h-full">
        <ApplicantTable
          group={group}
          groupId={groupId}
          selectedKeyword={selectedKeyword}
          onKeywordSelect={setSelectedKeyword}
        />
      </div>
    </div>
  );
}
