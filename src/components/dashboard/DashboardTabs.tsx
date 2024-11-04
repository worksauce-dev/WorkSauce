import { MdDashboard, MdSearch, MdSettings } from "react-icons/md";

interface DashboardTabsProps {
  activeTab: "대시보드" | "지원자 검색" | "설정";
  setActiveTab: (tab: "대시보드" | "지원자 검색" | "설정") => void;
}

const tabs = [
  {
    id: "대시보드",
    label: "대시보드",
    icon: <MdDashboard className="w-4 h-4" />,
  },
  {
    id: "지원자 검색",
    label: "지원자 검색",
    icon: <MdSearch className="w-4 h-4" />,
  },
  {
    id: "설정",
    label: "설정",
    icon: <MdSettings className="w-4 h-4" />,
  },
];

const DashboardTabs = ({ activeTab, setActiveTab }: DashboardTabsProps) => {
  return (
    <nav className="flex gap-2 p-2">
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() =>
            setActiveTab(tab.id as "대시보드" | "지원자 검색" | "설정")
          }
          className={`
            flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm
            transition-all duration-200 
            ${
              activeTab === tab.id
                ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md shadow-orange-100"
                : "text-gray-600 hover:bg-orange-50"
            }
          `}
        >
          <span
            className={`
            ${activeTab === tab.id ? "text-white" : "text-gray-400"}
          `}
          >
            {tab.icon}
          </span>
          {tab.label}
        </button>
      ))}
    </nav>
  );
};

export default DashboardTabs;
