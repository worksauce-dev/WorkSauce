import React from "react";
import { Applicant } from "@/types/group";
import { getStatusColor } from "@/utils/getStatusColor";

interface ApplicantScoreCardProps {
  applicant: Applicant;
}

const ApplicantScoreCard: React.FC<ApplicantScoreCardProps> = ({
  applicant,
}) => {
  return (
    <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-8 mt-8">
      <h2 className="text-3xl font-bold mb-6 text-center text-indigo-700">
        {applicant.name}님의 소스테스트 결과
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Existing and new info cards */}
        <InfoCard label="이메일" value={applicant.email} />
        <InfoCard label="그룹" value={applicant.groupName} />
        <InfoCard
          label="상태"
          value={
            <span
              className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                applicant.testStatus
              )}`}
            >
              {applicant.testStatus}
            </span>
          }
        />
        <InfoCard
          label="완료일"
          value={
            applicant.completedAt
              ? new Date(applicant.completedAt).toLocaleString()
              : "-"
          }
        />
      </div>

      <h3 className="text-2xl font-semibold mt-8 mb-4 text-indigo-600">
        테스트 결과
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-indigo-100">
              <th className="p-3 font-semibold">테스트 이름</th>
              <th className="p-3 font-semibold">점수</th>
            </tr>
          </thead>
          <tbody>
            {applicant.testResult.map((result, index) => (
              <tr
                key={index}
                className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
              >
                <td className="p-3">{result.sort}</td>
                <td className="p-3">{result.score}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 text-right">
        <span className="text-xl font-bold text-indigo-700">총점: </span>
        <span className="text-2xl font-bold">
          {applicant.testResult.reduce((sum, result) => sum + result.score, 0)}
        </span>
      </div>
    </div>
  );
};

const InfoCard: React.FC<{ label: string; value: React.ReactNode }> = ({
  label,
  value,
}) => (
  <div className="bg-indigo-50 p-4 rounded-lg">
    <span className="font-semibold text-indigo-700">{label}:</span>
    <span className="ml-2">{value}</span>
  </div>
);

export default ApplicantScoreCard;
