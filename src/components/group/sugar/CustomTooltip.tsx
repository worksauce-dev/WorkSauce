interface TooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
    name: string;
    dataKey: string;
  }>;
  label?: string;
}

interface PayloadData {
  payload: {
    category: string;
    groupValue: number;
    overallValue: number;
    description: string;
  };
}

export const CustomTooltip = ({ active, payload }: TooltipProps) => {
  if (!active || !payload || !payload.length) return null;

  const data = payload[0] as unknown as PayloadData;
  const { category, description } = data.payload;
  const groupValue = payload.find(p => p.dataKey === "groupValue")?.value;
  const overallValue = payload.find(p => p.dataKey === "overallValue")?.value;

  return (
    <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-100 max-w-xs">
      <div className="space-y-2">
        {/* 카테고리 제목 */}
        <div className="font-medium text-gray-900">{category}</div>

        {/* 수치 비교 */}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-orange-500"></div>
            <span className="text-sm text-gray-600">그룹 평균:</span>
            <span className="text-sm font-medium text-gray-900">
              {Number.isNaN(groupValue ?? 0)
                ? "-"
                : (groupValue ?? 0).toFixed(1)}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <span className="text-sm text-gray-600">전체 평균:</span>
            <span className="text-sm font-medium text-gray-900">
              {Number.isNaN(overallValue ?? 0)
                ? "-"
                : (overallValue ?? 0).toFixed(1)}
            </span>
          </div>
        </div>

        {/* 설명 */}
        <div className="text-xs text-gray-500 border-t border-gray-100 pt-2 mt-2">
          {description}
        </div>
      </div>
    </div>
  );
};
