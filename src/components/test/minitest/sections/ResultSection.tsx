"use client";

import { MdShare, MdContentCopy } from "react-icons/md";
import { FaFacebookF, FaTwitter } from "react-icons/fa";
import { SiKakaotalk } from "react-icons/si";

declare global {
  interface Window {
    Kakao: {
      Link: {
        sendDefault: (options: {
          objectType: string;
          content: {
            title: string;
            description: string;
            imageUrl: string;
            link: {
              mobileWebUrl: string;
              webUrl: string;
            };
          };
          buttons: Array<{
            title: string;
            link: {
              mobileWebUrl: string;
              webUrl: string;
            };
          }>;
        }) => void;
      };
    };
  }
}

interface ResultSectionProps {
  resultType: string;
  onRestart: () => void;
}

const SAUCE_TYPES = {
  기준윤리형: {
    name: "간장",
    tagline: "깊고 순수한 맛의 원칙주의자",
    description:
      "깊고 순수한 맛의 간장처럼, 기본에 충실하며 원칙을 중요시합니다. 쌉싸래한 녹차의 맛처럼 깨끗하고 정제된 태도로, 원칙과 도덕성을 중요시하며 그 깊이 있는 풍미로 주변에 긍정적인 영향을 미칩니다. 플레인 뻥튀기처럼 첨가물 없는 순수한 태도로 일관성을 유지합니다.",
    traits: ["원칙주의", "정직함", "신뢰성", "일관성", "도덕성"],
    color: "from-[#8B4513] to-[#A0522D]",
  },
  기준심미형: {
    name: "발사믹 식초",
    tagline: "세련된 미적 감각의 소유자",
    description:
      "세련되고 복합적인 맛의 발사믹 식초처럼, 섬세한 미적 감각으로 환경을 개선합니다. 섬세한 와인의 풍미처럼 복합적이고 세련된 감각으로 주변을 아름답게 만들고 삶에 품격을 더합니다. 마카롱처럼 아름다운 색감과 섬세한 맛으로 주변을 아름답게 만듭니다.",
    traits: ["세련됨", "미적 감각", "품격", "섬세함", "완성도"],
    color: "from-[#4B0082] to-[#800080]",
  },
  예술느낌형: {
    name: "칵테일 소스",
    tagline: "다채로운 창의성의 화신",
    description:
      "다양한 맛이 어우러진 칵테일 소스처럼, 창의적이고 다채로운 아이디어를 제공합니다. 다채로운 과일 샐러드의 맛처럼 풍부한 감성과 창의성으로 삶을 다채롭게 만들고 새로운 경험을 창출합니다. 젤리빈처럼 다양한 맛과 색깔로 풍부한 감성과 창의성을 발휘합니다.",
    traits: ["창의성", "감성", "다채로움", "영감", "혁신"],
    color: "from-[#FF69B4] to-[#FF1493]",
  },
  예술융합형: {
    name: "퓨전 디핑 소스",
    tagline: "융합의 예술가",
    description:
      "여러 문화의 맛을 융합한 퓨전 디핑 소스처럼, 다양한 요소를 창의적으로 결합합니다. 독특한 퓨전 요리의 맛처럼 여러 문화의 맛이 조화롭게 어우러져 혁신적인 아이디어와 솔루션을 제시합니다. 트레일 믹스처럼 다양한 요소를 융합하여 새로운 가치를 창출합니다.",
    traits: ["융합", "혁신", "다양성", "창의성", "통합"],
    color: "from-[#FF4500] to-[#FF8C00]",
  },
  이해관리형: {
    name: "마요네즈",
    tagline: "안정적인 관리의 달인",
    description:
      "부드럽고 안정적인 마요네즈처럼, 체계적이고 조화로운 관리로 조직을 이끕니다. 깔끔한 민트의 청량감처럼 체계적이고 효율적인 관리로 조직에 신선한 활력을 불어넣습니다. 정갈하게 정렬된 누네띠네처럼 체계적이고 효율적인 관리로 조직을 이끕니다.",
    traits: ["체계성", "안정성", "효율성", "조화", "관리력"],
    color: "from-[#FFD700] to-[#FFA500]",
  },
  이해연구형: {
    name: "데미글라스 소스",
    tagline: "깊이 있는 연구의 대가",
    description:
      "오랜 시간 정성껏 만든 데미글라스 소스처럼, 깊이 있는 연구와 통찰력을 제공합니다. 깊고 풍부한 다크 초콜릿의 맛처럼 복잡하고 깊이 있는 분석력으로 문제의 본질을 파악합니다. 숙성된 치즈 크래커처럼 깊이 있는 연구와 통찰력으로 본질을 탐구합니다.",
    traits: ["연구력", "통찰력", "분석력", "깊이", "탐구심"],
    color: "from-[#8B0000] to-[#A52A2A]",
  },
  소통도움형: {
    name: "허니 머스타드",
    tagline: "부드러운 소통의 달인",
    description:
      "달콤하면서도 톡 쏘는 허니 머스타드처럼, 부드럽지만 명확한 소통으로 관계를 개선합니다. 부드러운 바닐라의 달콤함처럼 따뜻한 마음과 뛰어난 소통 능력으로 주변을 편안하게 만듭니다. 나눠 먹는 팝콘처럼 따뜻한 마음으로 소통하며 관계를 이어갑니다.",
    traits: ["소통력", "공감능력", "부드러움", "명확성", "관계형성"],
    color: "from-[#DAA520] to-[#B8860B]",
  },
  소통조화형: {
    name: "샐러드 드레싱",
    tagline: "조화로운 균형의 예술가",
    description:
      "다양한 재료가 조화롭게 섞인 샐러드 드레싱처럼, 여러 의견을 조율하여 균형을 맞춥니다. 조화로운 허브티의 맛처럼 여러 허브가 조화롭게 어우러져 다양한 의견을 조율하고 균형 잡힌 해결책을 제시합니다. 믹스 센베이처럼 여러 맛이 조화롭게 어우러져 균형 잡힌 해결책을 제시합니다.",
    traits: ["조화", "균형감", "조율력", "통합", "협력"],
    color: "from-[#32CD32] to-[#228B22]",
  },
  도전확장형: {
    name: "핫 소스",
    tagline: "도전적인 개척자",
    description:
      "자극적이고 강렬한 핫 소스처럼, 도전적인 정신으로 새로운 영역을 개척합니다. 자극적인 매운 맛처럼 강렬하고 도전적인 정신으로 새로운 영역을 개척하고 조직의 성장을 이끕니다. 매운 맛 감자칩처럼 도전적인 정신으로 새로운 영역을 개척하고 조직을 성장시킵니다.",
    traits: ["도전정신", "개척자", "열정", "성장", "혁신"],
    color: "from-[#FF0000] to-[#DC143C]",
  },
  도전목표형: {
    name: "바베큐 소스",
    tagline: "목표 지향적 성취자",
    description:
      "진하고 풍부한 바베큐 소스처럼, 강한 추진력과 집중력으로 목표를 달성합니다. 진한 에스프레소의 강렬함처럼 농축된 목표의식과 강력한 추진력으로 성과를 달성합니다. 에너지바처럼 강한 추진력과 집중력으로 목표를 향해 끊임없이 전진합니다.",
    traits: ["목표지향", "추진력", "집중력", "성취욕", "결단력"],
    color: "from-[#800000] to-[#8B0000]",
  },
};

export function ResultSection({ resultType, onRestart }: ResultSectionProps) {
  const result = SAUCE_TYPES[resultType as keyof typeof SAUCE_TYPES];

  const handleShare = (platform: string) => {
    const shareText = `나의 워크 소스는 ${result.name}입니다! ${result.tagline}`;
    const shareUrl = window.location.href;

    switch (platform) {
      case "kakao":
        // 카카오톡 공유 구현
        if (window.Kakao) {
          window.Kakao.Link.sendDefault({
            objectType: "feed",
            content: {
              title: "나의 워크 소스 테스트 결과",
              description: shareText,
              imageUrl: "", // 이미지 URL 추가 필요
              link: {
                mobileWebUrl: shareUrl,
                webUrl: shareUrl,
              },
            },
            buttons: [
              {
                title: "테스트 하러가기",
                link: {
                  mobileWebUrl: shareUrl,
                  webUrl: shareUrl,
                },
              },
            ],
          });
        }
        break;
      case "facebook":
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
            shareUrl
          )}`,
          "facebook-share",
          "width=580,height=296"
        );
        break;
      case "twitter":
        window.open(
          `https://twitter.com/intent/tweet?text=${encodeURIComponent(
            shareText
          )}&url=${encodeURIComponent(shareUrl)}`,
          "twitter-share",
          "width=580,height=296"
        );
        break;
      case "link":
        navigator.clipboard.writeText(shareUrl);
        alert("링크가 복사되었습니다!");
        break;
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-[20px] p-8 shadow-lg text-center">
        <h2 className="text-3xl font-bold mb-4">당신의 워크 소스는</h2>

        <div className="relative w-[180px] h-[240px] mx-auto my-8">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[60px] h-[25px] bg-gray-800 rounded-t-lg" />
          <div className="w-full h-full bg-white/80 rounded-[10px_10px_30px_30px] relative overflow-hidden shadow-lg border-3 border-gray-200">
            <div
              className={`absolute top-0 left-0 w-full h-[60%] bg-gradient-to-br ${result.color} rounded-[7px_7px_0_0]`}
            />
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-white/20 via-transparent to-white/20" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] h-[120px] bg-white rounded shadow-sm p-4 flex flex-col justify-center items-center">
              <div className="absolute top-2 right-2 bg-white/90 px-2 py-1 rounded text-xs font-bold text-[#FF5858]">
                PREMIUM
              </div>
              <div className="text-xl font-bold mb-1">{result.name}</div>
              <div className="text-sm italic text-gray-600">
                {result.tagline}
              </div>
            </div>
          </div>
        </div>

        <p className="text-lg leading-relaxed mb-6">{result.description}</p>

        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {result.traits.map((trait, index) => (
            <span
              key={index}
              className="bg-gray-100 px-4 py-2 rounded-full text-sm font-semibold"
            >
              {trait}
            </span>
          ))}
        </div>

        <div className="mb-8">
          <h3 className="text-xl font-bold mb-4 text-[#FF5858]">
            내 워크 소스 공유하기
          </h3>
          <div className="flex justify-center gap-4">
            <button
              onClick={() => handleShare("kakao")}
              className="w-14 h-14 rounded-full bg-[#FEE500] flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
            >
              <SiKakaotalk className="w-8 h-8 text-black" />
            </button>
            <button
              onClick={() => handleShare("facebook")}
              className="w-14 h-14 rounded-full bg-[#3b5998] flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
            >
              <FaFacebookF className="w-8 h-8 text-white" />
            </button>
            <button
              onClick={() => handleShare("twitter")}
              className="w-14 h-14 rounded-full bg-[#1DA1F2] flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
            >
              <FaTwitter className="w-8 h-8 text-white" />
            </button>
            <button
              onClick={() => handleShare("link")}
              className="w-14 h-14 rounded-full bg-[#25D366] flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
            >
              <MdContentCopy className="w-8 h-8 text-white" />
            </button>
          </div>
        </div>

        <button
          onClick={onRestart}
          className="border-2 border-[#FF5858] text-[#FF5858] px-8 py-3 rounded-full font-semibold hover:bg-[#FF5858]/5 transition-colors"
        >
          다시 테스트하기
        </button>
      </div>
    </div>
  );
}
