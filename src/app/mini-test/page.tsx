import { Metadata } from "next";
import { MiniTestContainer } from "@/components/test/minitest/MiniTestContainer";
import { submitSurvey } from "@/api/firebase/minitest/submitSurvey";

export const metadata: Metadata = {
  title: "당신의 워크 소스(Work Sauce) | 일하는 방식 미니 진단",
  description:
    "당신만의 특별한 일하는 방식은 어떤 소스일까? 5분만에 알아보고 친구들과 공유해보세요!",
  openGraph: {
    title: "당신의 워크 소스(Work Sauce) | 일하는 방식 미니 진단",
    description:
      "당신만의 특별한 일하는 방식은 어떤 소스일까? 5분만에 알아보고 친구들과 공유해보세요!",
    images: [
      {
        url: "/images/OG_orangebg.png",
      },
    ],
  },
  keywords: ["워크소스", "worksauce", "심리테스트", "일하는 방식", "워크 소스"],
};

export default function MiniTestPage() {
  return <MiniTestContainer submitSurvey={submitSurvey} />;
}
