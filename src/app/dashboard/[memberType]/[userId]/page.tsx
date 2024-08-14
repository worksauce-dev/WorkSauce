import { PersonalLayout } from "@/components/layouts/PersonalLayout";
import { BusinessLayout } from "@/components/layouts/BusinessLayout";
import { notFound } from "next/navigation";

interface DashboardProps {
  params: { memberType: "personal" | "business"; userId: string };
}

export default function Dashboard({ params }: DashboardProps) {
  const { memberType } = params;

  if (memberType !== "personal" && memberType !== "business") {
    notFound();
  }

  const Layout = memberType === "business" ? BusinessLayout : PersonalLayout;

  return (
    <Layout>
      <h1>{memberType} 준일님의 대시보드</h1>
    </Layout>
  );
}
