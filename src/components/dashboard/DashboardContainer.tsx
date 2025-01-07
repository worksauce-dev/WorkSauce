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
  optoutUser: (
    userId: string,
    accessToken: string,
    refreshToken: string
  ) => Promise<{ success: boolean }>;
  accessToken: string;
  refreshToken: string;
  updateUserProfile: (
    userId: string,
    profileForm: any
  ) => Promise<{ success: boolean }>;
}

export default function DashboardContainer({
  userData,
  groupData,
  optoutUser,
  accessToken,
  refreshToken,
  updateUserProfile,
}: DashboardContainerProps) {
  const [activeTab, setActiveTab] = useState<
    "대시보드" | "지원자 검색" | "설정"
  >("대시보드");

  const { name } = userData;

  return (
    <div className="flex flex-col min-h-screen w-full bg-[#F7F7F9]">
      <div className="mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 flex flex-col h-screen gap-4">
        {/* Header */}
        <div className="flex-shrink-0 bg-white rounded-xl shadow-sm border border-gray-100">
          <DashboardHeader name={name} isDeadline={false} />
        </div>

        {/* Tabs */}
        <div className="flex-shrink-0 bg-white rounded-xl shadow-sm border border-gray-100">
          <DashboardTabs activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto ">
          <DashboardContent
            activeTab={activeTab}
            groupData={groupData}
            userData={userData}
            optoutUser={optoutUser}
            accessToken={accessToken}
            refreshToken={refreshToken}
            updateUserProfile={updateUserProfile}
          />
        </div>
      </div>
    </div>
  );
}
