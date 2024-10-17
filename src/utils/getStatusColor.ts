export function getStatusColor(status: string): string {
  switch (status.toLowerCase()) {
    case "completed":
      return "bg-green-100 text-green-800";
    case "in progress":
      return "bg-yellow-100 text-yellow-800";
    case "not started":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}
