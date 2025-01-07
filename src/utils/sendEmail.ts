interface EmailOptions {
  to: string;
  groupId: string;
  userName: string;
  applicantName: string;
  companyName: string;
  deadline: string;
  userType: "individual" | "business";
}

const deployUrl = process.env.NEXT_PUBLIC_DEPLOY_URL || "https://worksauce.kr/";

function generateEmailSubject(
  userName: string,
  applicantName: string,
  companyName: string,
  userType: string
): string {
  if (userType === "business") {
    return `[${companyName}] ${applicantName}님 소스테스트를 시작해주세요!`;
  }
  return `[${userName}]님이 보내신 소스테스트를 시작해주세요!`;
}

export async function sendEmail({
  to,
  userName,
  applicantName,
  groupId,
  companyName,
  deadline,
  userType,
}: EmailOptions): Promise<boolean> {
  try {
    const res = await fetch("/api/send-email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        From: `"WorkSauce" <noreply@worksauce.kr>`,
        "Message-ID": `<${Date.now()}@worksauce.kr>`,
      },
      body: JSON.stringify({
        to,
        subject: generateEmailSubject(
          userName,
          applicantName,
          companyName,
          userType
        ),
        html:
          userType === "business"
            ? generateSauceTestEmailTemplateForBusiness(
                applicantName,
                groupId,
                companyName,
                deadline
              )
            : generateSauceTestEmailTemplate(
                userName,
                applicantName,
                groupId,
                deadline
              ),
      }),
    });
    return res.ok;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
}

function generateSauceTestEmailTemplate(
  userName: string = "",
  applicantName: string = "",
  groupId: string = "",
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
        <p style="font-size: 18px; color: #F97316; font-weight: bold; margin: 8px 0;"><strong>${deadline}</strong>까지입니다.</p>
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
        <a href="${deployUrl}/test?groupId=${groupId}" 
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

function generateSauceTestEmailTemplateForBusiness(
  applicantName: string = "",
  groupId: string = "",
  companyName: string = "",
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
        <p style="font-size: 18px; color: #F97316; font-weight: bold; margin: 8px 0;"><strong>${deadline}</strong>까지입니다.</p>
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
        <a href="${deployUrl}/test?groupId=${groupId}" 
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

function generateSubmissionCompleteTemplate(
  applicantName: string = "",
  companyName: string = "",
  to: string = "",
  submittedAt: string = new Date().toLocaleString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  })
): string {
  return `
    <!DOCTYPE html>
    <html lang="ko">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>워크소스 소스테스트 제출 완료</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif; background-color: #ffffff; color: #2d3748; line-height: 1.6;">
      <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
        <div style="margin-bottom: 30px; display: flex; justify-content: center; align-items: center;">
          <div style="display: flex; align-items: center; gap: 8px;">
            <a href="https://worksauce.kr" target="_blank" style="text-decoration: none;">
              <img src="https://firebasestorage.googleapis.com/v0/b/worksauce-eee8c.appspot.com/o/%E1%84%85%E1%85%A9%E1%84%80%E1%85%A9%E1%84%89%E1%85%B5%E1%84%8B%E1%85%A1%E1%86%AB1.png?alt=media&token=a3f88230-1d58-4827-8b0d-52dab4c8fd08" alt="Droplet Icon" style="width: 230px; height: 45px;" />
            </a>
          </div>
        </div>
        
        <div style="background-color: #ffffff; padding: 0 10px;">
          <p style="margin-bottom: 20px; line-height: 1.8;">
            ${applicantName}님이 응답하신 소스테스트가 정상적으로 제출 되었습니다.<br>
            응답하신 내용은 "${companyName}"의 채용 자료로 이용됩니다.<br>
            이후 안내는 '${companyName}'에서 절차에 따라 안내 드릴 예정입니다.<br>
            ${applicantName}님 행운을 빕니다.
          </p>

          <p style="margin-top: 40px;">
            감사합니다.<br>
            워크소스 드림.
          </p>

          <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
            <table style="width: 100%; border-collapse: collapse; font-size: 14px; color: #718096;">
              <tr>
                <td style="padding: 8px 0;">이름</td>
                <td>${applicantName}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0;">이메일</td>
                <td>${to}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0;">응답시간</td>
                <td>${submittedAt}</td>
              </tr>
            </table>
          </div>
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
  try {
    const res = await fetch("/api/send-email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        From: `"WorkSauce" <noreply@worksauce.kr>`,
        "Message-ID": `<${Date.now()}@worksauce.kr>`,
      },
      body: JSON.stringify({
        to,
        subject: `[${companyName}] ${applicantName}님이 응답하신 소스테스트가 정상적으로 제출 되었습니다.`,
        html: generateSubmissionCompleteTemplate(
          applicantName,
          companyName,
          to
        ),
      }),
    });
    return res.ok;
  } catch (error) {
    console.error("Error sending completion email:", error);
    return false;
  }
}
