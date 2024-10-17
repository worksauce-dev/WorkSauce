interface DashboardTabsProps {
  activeTab: "대시보드" | "지원자 검색" | "설정";
  setActiveTab: (tab: "대시보드" | "지원자 검색" | "설정") => void;
}

const tabs = [
  { id: "대시보드", label: "대시보드" },
  { id: "지원자 검색", label: "지원자 검색" },
  // { id: "분석 및 통계", label: "분석 및 통계" },
  { id: "설정", label: "설정" },
];

const DashboardTabs = ({ activeTab, setActiveTab }: DashboardTabsProps) => {
  return (
    <div className="mb-8">
      <nav className="flex gap-1 border-b border-gray-200 justify-between md:justify-start">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() =>
              setActiveTab(tab.id as "대시보드" | "지원자 검색" | "설정")
            }
            className={`${
              activeTab === tab.id
                ? "text-blue-600 border-blue-600"
                : "text-gray-600"
            } border-b-2 p-2 md:py-4 md:px-6 block hover:text-blue-600 focus:outline-none font-medium`}
          >
            {tab.label}
          </button>
        ))}
      </nav>
    </div>
  );
};

export default DashboardTabs;
