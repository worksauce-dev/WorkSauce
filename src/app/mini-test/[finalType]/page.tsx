import { Metadata } from "next";
import { supabaseService } from "@/lib/supabase";
import MiniTestV2ResultClient from "./MiniTestV2ResultClient";
import { submitSurvey } from "@/api/firebase/minitest/submitSurvey";
import { convertEnglishToFinalType } from "@/utils/shareUtils";

// 소스별 대표 이모지 매핑
const SAUCE_EMOJIS: Record<string, string> = {
  기준윤리형: "🥢",
  기준심미형: "🍇",
  예술느낌형: "🍹",
  예술융합형: "🥘",
  이해관리형: "🥚",
  이해연구형: "🧀",
  소통도움형: "🍯",
  소통조화형: "🥗",
  도전확장형: "🌶️",
  도전목표형: "🍖",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ finalType: string }>;
}): Promise<Metadata> {
  const { finalType } = await params;

  const KoreanFinalType = convertEnglishToFinalType(finalType);

  try {
    const result = await supabaseService.getResultByFinalType(KoreanFinalType);

    if (!result) {
      return {
        title: "워크소스 결과 | 워크소스",
        description: "당신의 워크소스 결과를 확인해보세요.",
      };
    }

    const emoji = SAUCE_EMOJIS[result.type_name] || "🍽️";
    const title = `${emoji} ${result.type_name} | 워크소스`;
    const description =
      result.one_liner || "당신만의 특별한 워크소스를 발견했어요!";
    const keywords = result.keywords?.join(", ") || result.type_name;

    return {
      title,
      description,
      keywords: [
        result.type_name,
        "워크소스",
        "worksauce",
        ...(result.keywords || []),
      ],
      openGraph: {
        title,
        description,
        url: `https://worksauce.kr/mini-test/${KoreanFinalType}`,
        images: [
          {
            url: `/images/OG_${result.type_name}.png`,
            width: 1200,
            height: 630,
            alt: `${result.type_name} 워크소스 결과`,
          },
        ],
        type: "website",
        siteName: "워크소스",
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: [`/images/OG_${result.type_name}.png`],
      },
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "워크소스 결과 | 워크소스",
      description: "당신의 워크소스 결과를 확인해보세요.",
    };
  }
}

export default async function MiniTestV2ResultPage({
  params,
}: {
  params: Promise<{ finalType: string }>;
}) {
  const { finalType } = await params;

  return (
    <MiniTestV2ResultClient finalType={finalType} submitSurvey={submitSurvey} />
  );
}
