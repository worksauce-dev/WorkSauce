type StatusType = "completed" | "pending" | "expired";

interface StatusConfig {
  label: string;
  bgColor: string;
  textColor: string;
}

const STATUS_CONFIGS: Record<StatusType, StatusConfig> = {
  completed: {
    label: "완료",
    bgColor: "bg-green-100",
    textColor: "text-green-800",
  },
  pending: {
    label: "진행 중",
    bgColor: "bg-yellow-100",
    textColor: "text-yellow-800",
  },
  expired: {
    label: "만료",
    bgColor: "bg-red-100",
    textColor: "text-red-800",
  },
};

interface CustomStatusConfig {
  label: string;
  bgColor: string;
  textColor: string;
}

interface StatusBadgeProps {
  status?: StatusType;
  custom?: CustomStatusConfig;
  className?: string;
}

export function StatusBadge({
  status,
  custom,
  className = "",
}: StatusBadgeProps) {
  const config = custom || (status && STATUS_CONFIGS[status]);

  if (!config) return null;

  return (
    <span
      className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
        ${config.bgColor} ${config.textColor} ${className}`}
    >
      {config.label}
    </span>
  );
}
