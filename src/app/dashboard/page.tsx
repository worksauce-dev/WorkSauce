import { PersonalLayout } from "@/components/layouts/PersonalLayout";
import { BusinessLayout } from "@/components/layouts/BusinessLayout";
import { notFound } from "next/navigation";

interface DashboardProps {
  params: { memberType: "personal" | "business"; userId: string };
}

export default function DashboardPage({ params }: DashboardProps) {
  return <div className="w-full h-screen">hi</div>;
}
