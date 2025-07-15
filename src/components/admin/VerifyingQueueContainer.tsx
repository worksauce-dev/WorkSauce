"use client";

import { Organization } from "@/types/dashboard";
import Image from "next/image";

interface VerifyingQueueContainerProps {
  pendingQueue: Organization[];
  updateVerifyingQueue: (
    dashboardId: string,
    status: "pending" | "approved" | "rejected"
  ) => Promise<{ success: boolean; message: string }>;
}

export const VerifyingQueueContainer = ({
  pendingQueue,
  updateVerifyingQueue,
}: VerifyingQueueContainerProps) => {
  const handleApprove = async (dashboardId: string) => {
    const result = await updateVerifyingQueue(dashboardId, "approved");
    alert(result.message);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow mt-6 h-full overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-200 hover:scrollbar-thumb-gray-300 scrollbar-track-transparent">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-[#F97316]">
          회사 인증 대기 목록
        </h2>
        <span className="px-2 py-0.5 bg-orange-50 text-orange-600 rounded-full text-xs font-medium">
          {pendingQueue.length}건 대기중
        </span>
      </div>
      {pendingQueue.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-gray-400 mb-1 text-sm">
            대기 중인 요청이 없습니다
          </div>
          <div className="text-xs text-gray-500">
            새로운 인증 요청이 들어오면 여기에 표시됩니다
          </div>
        </div>
      ) : (
        <ul className="space-y-2">
          {pendingQueue.map((item: Organization) => (
            <li
              key={item.companyInfo.businessNumber}
              className="bg-white border border-gray-100 rounded-xl p-4 hover:shadow-lg transition-all duration-200"
            >
              <div className="flex flex-col md:flex-row gap-4">
                {/* 왼쪽: 회사 정보 */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="font-bold text-gray-800 text-base">
                      {item.companyInfo.companyName}
                    </div>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-700">
                      대기중
                    </span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center text-xs text-gray-600">
                      <span className="w-16 text-gray-500">사업자번호</span>
                      <span className="font-mono bg-gray-50 px-1.5 py-0.5 rounded">
                        {item.companyInfo.businessNumber}
                      </span>
                    </div>
                    {item.managerInfo.workEmail && (
                      <div className="flex items-center text-xs text-gray-600">
                        <span className="w-16 text-gray-500">담당자</span>
                        <span className="font-medium">
                          {item.managerInfo.workEmail}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* 오른쪽: 첨부 이미지 썸네일 */}
                <div className="flex gap-2">
                  {/* 사업자등록증 */}
                  {item.files?.businessLicenseUrl && (
                    <div className="flex flex-col items-center">
                      <div className="relative group">
                        <div className="w-16 h-16 rounded-lg overflow-hidden border-2 border-gray-100 group-hover:border-orange-200 transition-colors">
                          <Image
                            src={item.files.businessLicenseUrl}
                            alt="사업자등록증"
                            width={64}
                            height={64}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-200 rounded-lg" />
                      </div>
                      <span className="text-[10px] text-gray-500 mt-1">
                        사업자등록증
                      </span>
                      <a
                        href={item.files.businessLicenseUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[10px] text-blue-600 hover:text-blue-700 hover:underline mt-0.5"
                      >
                        새창에서 보기
                      </a>
                    </div>
                  )}
                  {/* 재직증명서 */}
                  {item.files?.employmentCertificateUrl && (
                    <div className="flex flex-col items-center">
                      <div className="relative group">
                        <div className="w-16 h-16 rounded-lg overflow-hidden border-2 border-gray-100 group-hover:border-orange-200 transition-colors">
                          <Image
                            src={item.files.employmentCertificateUrl}
                            alt="재직증명서"
                            width={64}
                            height={64}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-200 rounded-lg" />
                      </div>
                      <span className="text-[10px] text-gray-500 mt-1">
                        재직증명서
                      </span>
                      <a
                        href={item.files.employmentCertificateUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[10px] text-blue-600 hover:text-blue-700 hover:underline mt-0.5"
                      >
                        새창에서 보기
                      </a>
                    </div>
                  )}
                </div>

                {/* 인증 수락 버튼 */}
                <div className="flex items-center">
                  <button
                    onClick={() => handleApprove(item.dashboardId)}
                    className="px-3 py-1.5 bg-[#F97316] text-white rounded-lg hover:bg-orange-600 transition-colors font-medium text-sm"
                  >
                    인증 수락
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
