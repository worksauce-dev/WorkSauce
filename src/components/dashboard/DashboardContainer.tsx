"use client";

import DashboardHeader from "./DashboardHeader";
import DashboardTabs from "./DashboardTabs";
import DashboardContent from "./DashboardContent";
import { useState } from "react";
import { User } from "@/types/user";

interface DashboardContainerProps {
  user: User;
}

export default function DashboardContainer({ user }: DashboardContainerProps) {
  const [activeTab, setActiveTab] = useState<"대시보드" | "전체 현황" | "설정">(
    "대시보드"
  );

  const { name } = user;

  return (
    <div className="flex flex-col h-screen w-full">
      <div className="mx-auto w-full px-4 sm:px-6 lg:px-9 py-4 sm:py-6 bg-slate-100 flex flex-col flex-grow overflow-hidden">
        {/* Header */}
        <div className="flex-shrink-0">
          <DashboardHeader name={name} />
        </div>

        {/* Tabs */}
        <div className="flex-shrink-0 mt-4 sm:mt-6">
          <DashboardTabs activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>

        {/* Content */}
        <div className="flex-grow overflow-auto mt-4 sm:mt-6">
          <DashboardContent activeTab={activeTab} />
        </div>
      </div>
    </div>
  );
}
