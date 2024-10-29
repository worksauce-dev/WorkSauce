export function getRemainingDays(deadline: string | number | Date): number {
  const today = new Date();
  const deadlineDate = new Date(deadline);
  const diffTime = deadlineDate.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

export function getStatusText(status: string) {
  switch (status) {
    case "pending":
      return "진행중";
    case "completed":
      return "완료";
    case "expired":
      return "만료";
    default:
      return status;
  }
}

export function getStatusColor(status: string) {
  switch (status) {
    case "pending":
      return "bg-yellow-100 text-yellow-800";
    case "completed":
      return "bg-green-100 text-green-800";
    case "expired":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}
