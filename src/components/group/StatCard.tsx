interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  color: string;
}

export default function StatCard({ title, value, icon, color }: StatCardProps) {
  const colorClasses = {
    orange: "bg-orange-100 text-orange-500",
    green: "bg-green-100 text-green-600",
    yellow: "bg-yellow-100 text-yellow-600",
    blue: "bg-blue-100 text-blue-600",
  };

  return (
    <div className="bg-white rounded-lg sm:rounded-xl shadow-sm px-4 py-3 sm:p-4 md:p-6">
      <div className="flex items-start sm:items-center gap-3 sm:justify-between">
        <div className="min-w-0 flex-1">
          <p className="text-xs md:text-sm text-gray-500 mb-0.5 truncate">
            {title}
          </p>
          <p className="text-xs sm:text-lg md:text-xl font-bold truncate">
            {value}
          </p>
        </div>
        <div
          className={`hidden sm:block shrink-0 p-2 sm:p-2 rounded-full ${
            colorClasses[color as keyof typeof colorClasses]
          }`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}
