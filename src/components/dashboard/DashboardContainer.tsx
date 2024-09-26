import DashboardHeader from "./DashboardHeader";
import DashboardTabs from "./DashboardTabs";
import DashboardContent from "./DashboardContent";

export default function DashboardContainer() {
  return (
    <div className="flex flex-col h-screen w-full">
      <div className="mx-auto w-full px-4 sm:px-6 lg:px-9 py-4 sm:py-6 bg-slate-100 flex flex-col flex-grow overflow-hidden">
        {/* Header */}
        <div className="flex-shrink-0">
          <DashboardHeader />
        </div>

        {/* Tabs */}
        <div className="flex-shrink-0 mt-4 sm:mt-6">
          <DashboardTabs />
        </div>

        {/* Content */}
        <div className="flex-grow overflow-auto mt-4 sm:mt-6">
          <div className="flex gap-4 sm:gap-8 h-full flex-col lg:flex-row">
            <DashboardContent />
          </div>
        </div>
      </div>
    </div>
  );
}
