import { SauceType } from "@/types/saucetest/test";
import { workflowContent } from "@/constants/saucetest";
import { MdBolt, MdInfoOutline } from "react-icons/md";

export const SauceTestWorkFlow = ({
  applicantType,
}: {
  applicantType: SauceType;
}) => {
  const content =
    workflowContent[applicantType as keyof typeof workflowContent];

  return (
    <section>
      <div className="flex items-center gap-2 mb-6">
        <MdBolt className="text-orange-500 text-xl" />
        <h3 className="text-lg font-semibold text-gray-900">주요 워크플로우</h3>
      </div>
      <div className="bg-white rounded-2xl border border-gray-100 p-8 space-y-8">
        {/* 동사 흐름 */}
        <div>
          <div className="text-sm font-normal text-gray-500 mb-2">
            동사 흐름
          </div>
          <div className="flex flex-wrap gap-2 items-center">
            {content.verbs.split(" - ").map((verb, index) => (
              <div key={index} className="flex items-center">
                <span className="px-4 py-1 rounded-full bg-gradient-to-r from-orange-100 to-amber-100 text-sm font-medium text-orange-700 border border-orange-200">
                  {verb}
                </span>
                {index < content.verbs.split(" - ").length - 1 && (
                  <span className="mx-2 text-orange-300 text-lg font-normal">
                    →
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
        {/* 단계별 설명 (타임라인) */}
        <div className="relative pl-4">
          <div className="absolute left-2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-orange-200 to-amber-100 rounded-full" />
          <div className="space-y-6">
            {content.steps.map((step, index) => (
              <div key={index} className="relative flex items-start group">
                {/* 단계 번호 */}
                <div className="absolute -left-6 top-1.5 z-10">
                  <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gradient-to-br from-orange-400 to-amber-300 text-white font-semibold shadow-md border-2 border-white group-hover:scale-110 transition-transform">
                    {index + 1}
                  </div>
                </div>
                {/* 단계 카드 */}
                <div className="flex-1 ml-4 bg-orange-50/80 rounded-xl p-5 border border-orange-100/60 shadow-sm group-hover:shadow-lg transition-shadow">
                  <div className="text-sm text-gray-500 font-normal mb-1">
                    {step.action}
                  </div>
                  <div className="text-base text-gray-900 font-normal leading-relaxed">
                    {step.content}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* 안내 문구 */}
        <div className="flex items-start gap-3 bg-orange-50/80 p-4 rounded-xl mt-2">
          <MdInfoOutline className="text-orange-400 text-xl mt-0.5" />
          <div>
            <div className="text-sm font-semibold text-orange-900 mb-1">
              참고사항
            </div>
            <ol className="list-decimal list-inside space-y-1 text-sm text-gray-700 font-normal">
              <li>
                업무 추진 방향성은 지원자와 우리 회사 업무 흐름의 유사성을
                파악하고 참고할 수 있는 데이터입니다.
              </li>
              <li>
                각 유형은 고유의 동사 흐름을 갖고 있으며, 이를 이해하고 온보딩
                하시면 보다 적응력을 높일 수 있습니다.
              </li>
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
};
