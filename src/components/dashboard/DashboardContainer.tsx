"use client";

import DashboardHeader from "./DashboardHeader";
import DashboardTabs from "./DashboardTabs";
import DashboardContent from "./DashboardContent";
import { useState } from "react";
import { User } from "@/types/user";
import { Group } from "@/types/group";

interface DashboardContainerProps {
  userData: User;
  groupData: Group[];
}

export default function DashboardContainer({
  userData,
  groupData,
}: DashboardContainerProps) {
  const [activeTab, setActiveTab] = useState<
    "대시보드" | "지원자 검색" | "설정"
  >("대시보드");

  const { name } = userData;

  return (
    <div className="flex flex-col min-h-screen w-full bg-[#F7F7F9]">
      <div className="mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 flex flex-col h-screen gap-4">
        {/* Header */}
        <div className="flex-shrink-0">
          <DashboardHeader name={name} />
        </div>

        {/* Tabs */}
        <div className="flex-shrink-0 bg-white rounded-xl shadow-sm border border-gray-100">
          <DashboardTabs activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <DashboardContent activeTab={activeTab} groupData={groupData} />
        </div>
      </div>
    </div>
  );
}
