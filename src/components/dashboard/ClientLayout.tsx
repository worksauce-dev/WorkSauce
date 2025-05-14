"use client";

import DashboardSidebar from "./DashboardSidebar";
import DashboardHeader from "./header/DashboardHeader";
import { UserBase } from "@/types/user";
import { useState } from "react";
import { DashboardInterface } from "@/types/dashboard";

interface ClientLayoutProps {
  userBase: UserBase;
  dashboardData: DashboardInterface;
  acceptInviteRequest: (dashboardId: string) => Promise<{ success: boolean }>;
  children: React.ReactNode;
}

const ClientLayout = ({
  userBase,
  dashboardData,
  acceptInviteRequest,
  children,
}: ClientLayoutProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex flex-col h-screen overflow-y-auto">
      <DashboardHeader
        userBase={userBase}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        dashboardData={dashboardData}
        acceptInviteRequest={acceptInviteRequest}
      />
      <div className="flex flex-1 overflow-hidden">
        <DashboardSidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />
        <main className="flex-1 p-6 overflow-auto bg-gray-50 scrollbar-thin scrollbar-thumb-gray-200 hover:scrollbar-thumb-gray-300 scrollbar-track-transparent">
          {children}
        </main>
      </div>
    </div>
  );
};

export default ClientLayout;
