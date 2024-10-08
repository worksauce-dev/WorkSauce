import { Metadata } from "next";

export const metadata: Metadata = {
  title: "그룹 진행 현황",
};

export default async function ResultPage({
  searchParams,
}: {
  searchParams: { groupId: string };
}) {
  const groupId = searchParams.groupId;

  return (
    <div className="w-full h-screen flex flex-col lg:flex-row">
      <div>{groupId}</div>
    </div>
  );
}
