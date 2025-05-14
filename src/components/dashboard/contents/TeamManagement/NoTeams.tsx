import React from "react";
import { MdGroup } from "react-icons/md";

const NoTeams = () => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center max-w-2xl">
        <div className="mx-auto h-24 w-24 text-gray-400 mb-6">
          <MdGroup className="h-full w-full" />
        </div>

        <h3 className="text-2xl font-semibold text-gray-900 mb-3">
          아직 생성된 팀이 없습니다
        </h3>

        <p className="text-gray-600 mb-8">
          팀을 생성하여 멤버들을 관리하고 테스트를 진행하세요. 팀 관리를 통해
          조직의 건강 상태를 모니터링하고 개선할 수 있습니다.
        </p>
      </div>
    </div>
  );
};

export default NoTeams;
