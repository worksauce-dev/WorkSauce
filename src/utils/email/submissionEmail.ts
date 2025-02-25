import { sendTestEmail } from "./common";

function generateSubmissionCompleteTemplate(
  applicantName: string = "",
  companyName: string = ""
): string {
  return `
    <!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>워크소스 소스테스트 제출 완료</title>
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
      <!-- 완료 메시지 섹션 -->
      <div style="margin-bottom: 32px;">
        <p style="font-size: 18px; margin-bottom: 24px;">안녕하세요, <strong style="color: #F97316;">${applicantName}</strong>님.</p>
        <p style="margin-bottom: 16px;">
          <strong style="color: #F97316;">${applicantName}</strong>님이 응답하신 소스테스트가 정상적으로 제출되었습니다.<br>
          응답하신 내용은 <strong style="color: #1E293B;">${companyName}</strong>의 채용 자료로 이용됩니다.
        </p>
        <p style="margin-bottom: 16px;">
          이후 안내는 <strong style="color: #1E293B;">${companyName}</strong>에서 절차에 따라 안내 드릴 예정입니다.
        </p>
      </div>

      <!-- 안내사항 섹션 -->
      <div style="background-color: #FFF7ED; border-left: 4px solid #F97316; border-radius: 8px; padding: 24px; margin: 24px 0;">
        <div style="font-weight: bold; color: #9A3412; margin-bottom: 16px; font-size: 16px;">
          📋 안내사항
        </div>
        <p style="margin: 0; color: #666666;">
          채용 과정에 대해 궁금하신 점은 해당 기업의 인사채용담당자에게 문의해 주시기 바랍니다.
        </p>
      </div>

      <!-- 발신자 정보 -->
      <div style="background-color: #F8FAFC; border-radius: 8px; padding: 16px; margin-top: 24px;">
        <p style="margin: 0; color: #64748B; font-size: 14px;">
          본 메일은 소스테스트 제출 완료를 안내하는 자동 발신 메일입니다.
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

export async function sendSubmissionCompleteEmail({
  to,
  applicantName,
  companyName,
}: {
  to: string;
  applicantName: string;
  companyName: string;
}): Promise<boolean> {
  return sendTestEmail({
    to,
    subject: `[${companyName}] ${applicantName}님이 응답하신 소스테스트가 정상적으로 제출 되었습니다.`,
    html: generateSubmissionCompleteTemplate(applicantName, companyName),
  });
}
