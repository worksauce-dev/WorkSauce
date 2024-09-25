import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/authOptions";

interface DashboardProps {
  params: { memberType: "personal" | "business"; userId: string };
}

export default function DashboardPage({ params }: DashboardProps) {
  const session = getServerSession(authOptions);

  return <div className="w-full h-screen">hi</div>;
}
