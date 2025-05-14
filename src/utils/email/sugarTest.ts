import { EmailOptions } from "@/types/email";
import { deployUrl, sendTestEmail } from "./common";
import { formatDate } from "@/utils/dateUtils";

export function generateSugarTestEmailTemplate(
  userName: string = "",
  applicantName: string = "",
  testId: string = "",
  deadline: string = ""
): string {
  return `
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>워크소스 슈가테스트 안내</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif; background-color: #f8fafc; color: #334155; line-height: 1.6;">
  <!-- 메인 컨테이너 -->
  <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
    <!-- 로고 섹션 -->
    <div style="background-color: white; padding: 24px; border-radius: 16px 16px 0 0; text-align: center; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
      <a href="https://worksauce.kr" target="_blank" style="text-decoration: none;">
        <img src="https://firebasestorage.googleapis.com/v0/b/worksauce-eee8c.appspot.com/o/%E1%84%85%E1%85%A9%E1%84%80%E1%85%A9%E1%84%89%E1%85%B5%E1%84%8B%E1%85%A1%E1%86%AB1.png?alt=media&token=a3f88230-1d58-4827-8b0d-52dab4c8fd08" 
             alt="WorkSauce Logo" 
             style="width: 200px; height: auto;" />
      </a>
    </div>
    
    <!-- 메인 콘텐츠 -->
    <div style="background-color: white; padding: 32px; border-radius: 0 0 16px 16px; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
      <!-- 인사말 섹션 -->
      <div style="margin-bottom: 32px;">
        <p style="font-size: 18px; margin-bottom: 24px;">안녕하세요, <strong style="color: #F97316;">${applicantName}</strong>님.</p>
        <p style="margin-bottom: 16px;"><strong style="color: #1E293B;">${userName}</strong>님이 발송한 슈가테스트 링크를 보내드립니다.</p>
        <p style="margin-bottom: 16px; color: #475569;">슈가테스트는 일상적인 업무 환경에서 경험할 수 있는 스트레스 수준을 확인하고 관리하는데 도움을 주는 진단도구입니다.</p>
        <p style="margin-bottom: 8px;">진단 참여 가능 기한은</p>
        <p style="font-size: 18px; color: #F97316; font-weight: bold; margin: 8px 0;"><strong>${formatDate(
          deadline
        )}</strong>까지입니다.</p>
      </div>

      <!-- 주의사항 섹션 -->
      <div style="background-color: #FFF7ED; border-left: 4px solid #F97316; border-radius: 8px; padding: 24px; margin: 24px 0;">
        <div style="font-weight: bold; color: #9A3412; margin-bottom: 16px; font-size: 16px;">
          📋 슈가테스트 참여 안내
        </div>
        <ol style="padding-left: 20px; margin: 0; color: #666666;">
          <li style="margin-bottom: 12px;">모든 응답 내용은 철저히 비밀이 보장됩니다.</li>
          <li style="margin-bottom: 12px;">정답이 있는 검사가 아니므로, 편안한 마음으로 솔직하게 응답해 주세요.</li>
          <li style="margin-bottom: 12px;">현재 자신의 상태를 가장 잘 반영하는 답변을 선택해 주세요.</li>
          <li style="margin-bottom: 12px;">소요시간은 약 20분 내외입니다.</li>
          <li style="margin-bottom: 0;">진단 결과는 스트레스 관리를 위한 참고 자료로 활용됩니다.</li>
        </ol>
      </div>

      <!-- 면책조항 -->
      <div style="background-color: #F1F5F9; border-radius: 8px; padding: 16px; margin: 24px 0;">
        <p style="margin: 0; color: #64748B; font-size: 13px; text-align: center;">
          ※ 본 진단도구는 스크리닝 용도로는 적합하나, 보다 정확한 결과를 얻고자 하시는 경우 의학 및 상담 전문가와의 상담을 권장드립니다.
        </p>
      </div>

      <!-- CTA 버튼 -->
      <div style="text-align: center; margin: 32px 0;">
        <a href="${deployUrl}/test/sugartest?testId=${testId}" 
           style="display: inline-block; background-color: #F97316; color: white; text-decoration: none; padding: 16px 40px; border-radius: 12px; font-weight: bold; font-size: 16px; box-shadow: 0 4px 6px rgba(249, 115, 22, 0.2); transition: all 0.2s ease;">
          슈가테스트 진행하기
        </a>
      </div>

      <!-- 발신자 정보 -->
      <div style="background-color: #F8FAFC; border-radius: 8px; padding: 16px; margin-top: 24px;">
        <p style="margin: 0; color: #64748B; font-size: 14px;">
          본 진단은 ${userName}님의 요청으로 발송되었습니다.<br>
          문의사항이 있으시면 ${userName}님께 연락 주시기 바랍니다.
        </p>
      </div>
    </div>

    <!-- 푸터 -->
    <div style="text-align: center; margin-top: 24px; color: #94A3B8; font-size: 12px;">
      <p style="margin-bottom: 8px;">본 이메일은 발신 전용입니다.</p>
      <p style="margin-bottom: 16px;">
        워크소스에 궁금하신 점은 
        <a href="mailto:worksauce.info@gmail.com" style="color: #F97316; text-decoration: none;">worksauce.info@gmail.com</a>로 
        문의바랍니다.
      </p>
      <p style="margin: 0;">
        감사합니다.<br>
        워크소스 팀 드림.
      </p>
    </div>
  </div>
</body>
</html>
  `;
}

export function generateSugarTestEmailTemplateForBusiness(
  applicantName: string = "",
  testId: string = "",
  companyName: string = "",
  deadline: string = ""
): string {
  return `
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>워크소스 슈가테스트 안내</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif; background-color: #f8fafc; color: #334155; line-height: 1.6;">
  <!-- 메인 컨테이너 -->
  <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
    <!-- 로고 섹션 -->
    <div style="background-color: white; padding: 24px; border-radius: 16px 16px 0 0; text-align: center; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
      <a href="https://worksauce.kr" target="_blank" style="text-decoration: none;">
        <img src="https://firebasestorage.googleapis.com/v0/b/worksauce-eee8c.appspot.com/o/%E1%84%85%E1%85%A9%E1%84%80%E1%85%A9%E1%84%89%E1%85%B5%E1%84%8B%E1%85%A1%E1%86%AB1.png?alt=media&token=a3f88230-1d58-4827-8b0d-52dab4c8fd08" 
             alt="WorkSauce Logo" 
             style="width: 200px; height: auto;" />
      </a>
    </div>
    
    <!-- 메인 콘텐츠 -->
    <div style="background-color: white; padding: 32px; border-radius: 0 0 16px 16px; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
      <!-- 인사말 섹션 -->
      <div style="margin-bottom: 32px;">
        <p style="font-size: 18px; margin-bottom: 24px;">안녕하세요, <strong style="color: #F97316;">${applicantName}</strong>님.</p>
        <p style="margin-bottom: 16px;"><strong style="color: #1E293B;">${companyName}</strong>에서 진행하는 슈가테스트 링크를 보내드립니다.</p>
        <p style="margin-bottom: 16px; color: #475569;">슈가테스트는 구성원들의 업무 스트레스 수준을 파악하고, 더 나은 근무 환경을 만들기 위한 진단도구입니다. 수집된 정보는 직원 복지 향상을 위한 기초 자료로 활용됩니다.</p>
        <p style="margin-bottom: 8px;">진단 참여 가능 기한은</p>
        <p style="font-size: 18px; color: #F97316; font-weight: bold; margin: 8px 0;"><strong>${formatDate(
          deadline
        )}</strong>까지입니다.</p>
      </div>

      <!-- 주의사항 섹션 -->
      <div style="background-color: #FFF7ED; border-left: 4px solid #F97316; border-radius: 8px; padding: 24px; margin: 24px 0;">
        <div style="font-weight: bold; color: #9A3412; margin-bottom: 16px; font-size: 16px;">
          📋 슈가테스트 참여 안내
        </div>
        <ol style="padding-left: 20px; margin: 0; color: #666666;">
          <li style="margin-bottom: 12px;">모든 응답은 익명으로 처리되며, 개인정보는 철저히 보호됩니다.</li>
          <li style="margin-bottom: 12px;">응답 내용은 통계적 목적으로만 활용되며, 개인별 결과는 별도로 공개되지 않습니다.</li>
          <li style="margin-bottom: 12px;">현재의 업무 환경과 감정 상태를 있는 그대로 표현해 주세요.</li>
          <li style="margin-bottom: 12px;">소요시간은 약 10분 내외입니다.</li>
          <li style="margin-bottom: 12px;">진단 결과는 더 나은 근무 환경 조성을 위한 자료로 활용됩니다.</li>
          <li style="margin-bottom: 0;">여러분의 솔직한 의견이 긍정적인 변화를 만듭니다.</li>
        </ol>
      </div>

      <!-- 면책조항 -->
      <div style="background-color: #F1F5F9; border-radius: 8px; padding: 16px; margin: 24px 0;">
        <p style="margin: 0; color: #64748B; font-size: 13px; text-align: center;">
          ※ 본 진단도구는 스크리닝 용도로는 적합하나, 보다 정확한 결과를 얻고자 하시는 경우 의학 및 상담 전문가와의 상담을 권장드립니다.
        </p>
      </div>

      <!-- CTA 버튼 -->
      <div style="text-align: center; margin: 32px 0;">
        <a href="${deployUrl}/test/sugartest?testId=${testId}" 
           style="display: inline-block; background-color: #F97316; color: white; text-decoration: none; padding: 16px 40px; border-radius: 12px; font-weight: bold; font-size: 16px; box-shadow: 0 4px 6px rgba(249, 115, 22, 0.2); transition: all 0.2s ease;">
          슈가테스트 진행하기
        </a>
      </div>

      <!-- 발신자 정보 -->
      <div style="background-color: #F8FAFC; border-radius: 8px; padding: 16px; margin-top: 24px;">
        <p style="margin: 0; color: #64748B; font-size: 14px;">
          본 진단은 ${companyName}의 직원 복지 향상 프로그램의 일환으로 진행됩니다.<br>
          문의사항이 있으시면 담당자에게 연락 주시기 바랍니다.
        </p>
      </div>
    </div>

    <!-- 푸터 -->
    <div style="text-align: center; margin-top: 24px; color: #94A3B8; font-size: 12px;">
      <p style="margin-bottom: 8px;">본 이메일은 발신 전용입니다.</p>
      <p style="margin-bottom: 16px;">
        워크소스에 궁금하신 점은 
        <a href="mailto:worksauce.info@gmail.com" style="color: #F97316; text-decoration: none;">worksauce.info@gmail.com</a>로 
        문의바랍니다.
      </p>
      <p style="margin-bottom: 8px;">워크소스는 ${applicantName}님의 건강한 직장 생활을 응원합니다.</p>
      <p style="margin: 0;">
        감사합니다.<br>
        워크소스 팀 드림.
      </p>
    </div>
  </div>
</body>
</html>
  `;
}

function generateEmailSubject(
  userName: string,
  applicantName: string,
  companyName: string,
  isVerified: "verified" | "pending" | "rejected" | "notRequested"
): string {
  if (isVerified === "verified") {
    return `[${companyName}] ${applicantName}님 슈가테스트를 시작해주세요!`;
  }
  return `[${userName}]님이 보내신 슈가테스트를 시작해주세요!`;
}

export async function sendSugarTestEmail(
  options: EmailOptions
): Promise<boolean> {
  const {
    to,
    userName,
    applicantName,
    testId,
    companyName,
    deadline,
    isVerified,
  } = options;

  return sendTestEmail({
    to,
    subject: generateEmailSubject(
      userName,
      applicantName,
      companyName,
      isVerified
    ),
    html:
      isVerified === "verified"
        ? generateSugarTestEmailTemplateForBusiness(
            applicantName,
            testId,
            companyName,
            deadline
          )
        : generateSugarTestEmailTemplate(
            userName,
            applicantName,
            testId,
            deadline
          ),
  });
}
