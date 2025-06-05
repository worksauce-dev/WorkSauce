import { sendEmail } from "./common";

export function generateEmailVerificationEmailTemplate(
  verificationCode: string = ""
): string {
  return `
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>워크소스 이메일 인증</title>
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
        <p style="margin-bottom: 16px;">안녕하세요! 워크소스 회원가입을 위한 이메일 인증 코드를 보내드립니다.</p>
        <p style="margin-bottom: 8px;">아래의 인증 코드를 입력해주세요.</p>
        <p style="font-size: 24px; color: #F97316; font-weight: bold; margin: 16px 0; letter-spacing: 4px; text-align: center;">
          <strong>${verificationCode}</strong>
        </p>
        <p style="color: #64748B; font-size: 14px;">인증 코드는 3분간 유효합니다.</p>
      </div>

      <!-- 주의사항 섹션 -->
      <div style="background-color: #FFF7ED; border-left: 4px solid #F97316; border-radius: 8px; padding: 24px; margin: 24px 0;">
        <div style="font-weight: bold; color: #9A3412; margin-bottom: 16px; font-size: 16px;">
          📋 주의사항
        </div>
        <ol style="padding-left: 20px; margin: 0; color: #666666;">
          <li style="margin-bottom: 12px;">본 인증 코드는 3분간만 유효합니다.</li>
          <li style="margin-bottom: 12px;">인증 코드는 회원가입을 요청한 본인만 사용할 수 있습니다.</li>
          <li style="margin-bottom: 0;">본인이 요청하지 않은 인증 메일이라면 무시하셔도 됩니다.</li>
        </ol>
      </div>

      <!-- 발신자 정보 -->
      <div style="background-color: #F8FAFC; border-radius: 8px; padding: 16px; margin-top: 24px;">
        <p style="margin: 0; color: #64748B; font-size: 14px;">
          본 메일은 워크소스 회원가입 인증을 위해 발송되었습니다.<br>
          궁금하신 점은 아래 연락처로 문의해 주세요.
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

export function sendEmailVerificationEmail(
  verificationCode: string,
  to: string
): Promise<boolean> {
  return sendEmail({
    to,
    subject: `워크소스 회원가입 인증 코드`,
    html: generateEmailVerificationEmailTemplate(verificationCode),
  });
}
