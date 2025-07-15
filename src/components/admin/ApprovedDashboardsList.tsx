"use client";

import { Organization } from "@/types/dashboard";
import { MdExpandMore, MdExpandLess } from "react-icons/md";
import React from "react";

const DetailRow = ({ org }: { org: Organization }) => (
  <tr className="bg-orange-50 border-t border-orange-200">
    <td colSpan={7} className="py-4 px-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
        <div>
          <div>
            <span className="font-semibold">회사 주소:</span>{" "}
            {org.companyInfo.companyAddress || "-"}
          </div>
          <div>
            <span className="font-semibold">업종/업태:</span>{" "}
            {org.companyInfo.businessType || "-"}
          </div>
          <div>
            <span className="font-semibold">회사 규모:</span>{" "}
            {org.additionalInfo?.companySize || "-"}
          </div>
          <div>
            <span className="font-semibold">설립연도:</span>{" "}
            {org.additionalInfo?.establishedYear || "-"}
          </div>
        </div>
        <div>
          <div>
            <span className="font-semibold">담당자 이메일:</span>{" "}
            {org.managerInfo.workEmail || "-"}
          </div>
          <div>
            <span className="font-semibold">담당자 부서:</span>{" "}
            {org.managerInfo.department || "-"}
          </div>
          <div>
            <span className="font-semibold">담당자 전화:</span>{" "}
            {org.managerInfo.workPhone || "-"}
          </div>
          <div>
            <span className="font-semibold">회사 홈페이지:</span>{" "}
            {org.additionalInfo?.companyWebsite ? (
              <a
                href={org.additionalInfo.companyWebsite}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                {org.additionalInfo.companyWebsite}
              </a>
            ) : (
              "-"
            )}
          </div>
        </div>
      </div>
    </td>
  </tr>
);

export const AdminApprovedDashboardsList = ({
  companies,
}: {
  companies: Organization[];
}) => {
  const [openRow, setOpenRow] = React.useState<string | null>(null);
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200 rounded-lg">
        <thead>
          <tr className="bg-orange-50 text-gray-700">
            <th className="py-3 px-4 text-left">회사명</th>
            <th className="py-3 px-4 text-left">대표자명</th>
            <th className="py-3 px-4 text-left">사업자번호</th>
            <th className="py-3 px-4 text-left">인증일</th>
            <th className="py-3 px-4 text-left">담당자명</th>
            <th className="py-3 px-4 text-left">상세정보</th>
          </tr>
        </thead>
        <tbody>
          {companies.map(org => (
            <React.Fragment key={org.dashboardId}>
              <tr className="border-t border-gray-100 hover:bg-orange-50 transition-colors">
                <td className="py-2 px-4 font-medium">
                  {org.companyInfo.companyName}
                </td>
                <td className="py-2 px-4">
                  {org.companyInfo.representativeName}
                </td>
                <td className="py-2 px-4">{org.companyInfo.businessNumber}</td>
                <td className="py-2 px-4">
                  {org.updatedAt
                    ? new Date(org.updatedAt).toLocaleDateString()
                    : "-"}
                </td>
                <td className="py-2 px-4">
                  {org.managerInfo.position} ({org.managerInfo.department})
                </td>
                <td className="py-2 px-4">
                  <button
                    className="flex items-center gap-1 text-orange-600 hover:underline"
                    onClick={() =>
                      setOpenRow(
                        openRow === org.dashboardId ? null : org.dashboardId
                      )
                    }
                  >
                    {openRow === org.dashboardId ? (
                      <MdExpandLess />
                    ) : (
                      <MdExpandMore />
                    )}{" "}
                    상세보기
                  </button>
                </td>
              </tr>
              {openRow === org.dashboardId && <DetailRow org={org} />}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};
