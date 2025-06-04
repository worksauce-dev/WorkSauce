import { EmailOptions } from "@/types/email";
import { deployUrl, sendTestEmail } from "./common";
import { formatDate } from "../dateUtils";

export function generateSauceTestEmailTemplate(
  userName: string = "",
  applicantName: string = "",
  testId: string = "",
  dashboardId: string = "",
  deadline: string = ""
): string {
  return `
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>워크소스 소스테스트 안내</title>
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
        <p style="margin-bottom: 16px;"><strong style="color: #1E293B;">${userName}</strong>님이 발송한 소스테스트를 보내드립니다.</p>
        <p style="margin-bottom: 8px;">소스테스트 진행 가능 기한은</p>
        <p style="font-size: 18px; color: #F97316; font-weight: bold; margin: 8px 0;"><strong>${formatDate(
          deadline
        )}</strong>까지입니다.</p>
        <p style="color: #64748B; font-size: 14px;">꼭 기한 내에 진행해 주세요. 미진행으로 인한 책임은 ${applicantName}님께 있습니다.</p>
      </div>

      <!-- 주의사항 섹션 -->
      <div style="background-color: #FFF7ED; border-left: 4px solid #F97316; border-radius: 8px; padding: 24px; margin: 24px 0;">
        <div style="font-weight: bold; color: #9A3412; margin-bottom: 16px; font-size: 16px;">
          📋 소스테스트 진행을 위한 주의사항
        </div>
        <ol style="padding-left: 20px; margin: 0; color: #666666;">
          <li style="margin-bottom: 12px;">암호화 로그인을 위해 발송받으신 이메일과 성함을 정확히 기재해 주세요.</li>
          <li style="margin-bottom: 12px;">소스테스트는 정해진 정답이 있는 검사가 아닙니다. 편하고 솔직하게 진행해주세요.</li>
          <li style="margin-bottom: 12px;">진행하실 경우 개인정보처리방침에 동의하신 것으로 간주됩니다.</li>
          <li style="margin-bottom: 12px;">소스테스트는 1단계 180개 문항, 2단계 동사 선택으로 이루어져 있습니다.</li>
          <li style="margin-bottom: 0;">소요시간은 평균 15~30분 이내입니다.</li>
        </ol>
      </div>

      <!-- CTA 버튼 -->
      <div style="text-align: center; margin: 32px 0;">
        <a href="${deployUrl}/${dashboardId}/test/saucetest?testId=${testId}" 
           style="display: inline-block; background-color: #F97316; color: white; text-decoration: none; padding: 16px 40px; border-radius: 12px; font-weight: bold; font-size: 16px; box-shadow: 0 4px 6px rgba(249, 115, 22, 0.2); transition: all 0.2s ease;">
          소스테스트 진행하기
        </a>
      </div>

      <!-- 발신자 정보 -->
      <div style="background-color: #F8FAFC; border-radius: 8px; padding: 16px; margin-top: 24px;">
        <p style="margin: 0; color: #64748B; font-size: 14px;">
          본 메일은 ${userName}님의 요청으로 발송되었습니다.<br>
          궁금하신 점은 ${userName}님에게 연락주세요.
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

export function generateSauceTestEmailTemplateForBusiness(
  applicantName: string = "",
  testId: string = "",
  companyName: string = "",
  dashboardId: string = "",
  deadline: string = ""
): string {
  return `
   <!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>워크소스 소스테스트 안내</title>
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
        <p style="margin-bottom: 16px;"><strong style="color: #1E293B;">${companyName}</strong>에서 발송한 소스테스트를 보내드립니다.</p>
        <p style="margin-bottom: 8px;">소스테스트 진행 가능 기한은</p>
        <p style="font-size: 18px; color: #F97316; font-weight: bold; margin: 8px 0;"><strong>${formatDate(
          deadline
        )}</strong>까지입니다.</p>
        <p style="color: #64748B; font-size: 14px;">기한 이후에는 진행하실 수 없으니, 꼭 기한 내에 진행해 주세요.</p>
      </div>

      <!-- 주의사항 섹션 -->
      <div style="background-color: #FFF7ED; border-left: 4px solid #F97316; border-radius: 8px; padding: 24px; margin: 24px 0;">
        <div style="font-weight: bold; color: #9A3412; margin-bottom: 16px; font-size: 16px;">
          📋 소스테스트 진행을 위한 주의사항
        </div>
        <ol style="padding-left: 20px; margin: 0; color: #666666;">
          <li style="margin-bottom: 12px;">암호화 로그인을 위해 발송받으신 이메일과 성함을 정확히 기재해 주세요.</li>
          <li style="margin-bottom: 12px;">소스테스트는 정해진 정답이 있는 검사가 아닙니다. 편하고 솔직하게 응해주세요.</li>
          <li style="margin-bottom: 12px;">진행 결과는 유형으로 분류되어 인사채용담당자에게 전달됩니다.</li>
          <li style="margin-bottom: 12px;">진행하실 경우 개인정보처리방침에 동의하신 것으로 간주됩니다.</li>
          <li style="margin-bottom: 12px;">소스테스트는 1단계 180개 문항, 2단계 동사 선택으로 이루어져 있습니다.</li>
          <li style="margin-bottom: 12px;">소요시간은 평균 15~30분 이내입니다.</li>
          <li style="margin-bottom: 0;">행운을 빕니다.</li>
        </ol>
      </div>

      <!-- CTA 버튼 -->
      <div style="text-align: center; margin: 32px 0;">
        <a href="${deployUrl}/${dashboardId}/test/saucetest?testId=${testId}" 
           style="display: inline-block; background-color: #F97316; color: white; text-decoration: none; padding: 16px 40px; border-radius: 12px; font-weight: bold; font-size: 16px; box-shadow: 0 4px 6px rgba(249, 115, 22, 0.2); transition: all 0.2s ease;">
          소스테스트 진행하기
        </a>
      </div>

      <!-- 발신자 정보 -->
      <div style="background-color: #F8FAFC; border-radius: 8px; padding: 16px; margin-top: 24px;">
        <p style="margin: 0; color: #64748B; font-size: 14px;">
          본 메일은 지원하신 채용 절차에 따라 인사채용담당자의 요청으로 발송되었습니다.<br>
          채용 과정의 궁금하신 점은 해당 인사채용담당자에게 연락주세요.
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
      <p style="margin-bottom: 8px;">워크소스는 ${applicantName}님의 성공적인 채용을 진심으로 응원합니다.</p>
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
    return `[${companyName}] ${applicantName}님 소스테스트를 시작해주세요!`;
  }
  return `[${userName}]님이 보내신 소스테스트를 시작해주세요!`;
}

export const sendSauceTestEmail = async (
  options: EmailOptions
): Promise<boolean> => {
  const {
    to,
    userName,
    applicantName,
    testId,
    companyName,
    deadline,
    isVerified,
    dashboardId,
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
        ? generateSauceTestEmailTemplateForBusiness(
            userName,
            applicantName,
            testId,
            dashboardId,
            deadline
          )
        : generateSauceTestEmailTemplate(
            userName,
            applicantName,
            testId,
            dashboardId,
            deadline
          ),
  });
};
