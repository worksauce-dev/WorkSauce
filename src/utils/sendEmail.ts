interface EmailOptions {
  to: string;
  subject: string;
  userName: string;
  groupId: string;
  companyName: string;
  deadline: string;
}

export async function sendEmail({
  to,
  subject,
  userName,
  groupId,
  companyName,
  deadline,
}: EmailOptions): Promise<boolean> {
  try {
    const res = await fetch("/api/send-email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        to,
        subject,
        html: generateDefaultHTMLTemplate(
          userName,
          groupId,
          companyName,
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

function generateDefaultHTMLTemplate(
  userName: string = "",
  groupId: string = "",
  companyName: string = "",
  deadline: string = ""
): string {
  const deployUrl =
    process.env.NEXT_PUBLIC_DEPLOY_URL || "https://worksauce.kr/";

  return `
    <!DOCTYPE html>
    <html lang="ko">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>워크소스 소스테스트 안내</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif; background-color: #ffffff; color: #2d3748; line-height: 1.6;">
      <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
        <div style="margin-bottom: 30px; display: flex; justify-content: center; align-items: center;">
          <div style="display: flex; align-items: center; gap: 8px;">
            <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiNmOTczMTYiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cGF0aCBkPSJNMTIgMi42OWw1LjY2IDUuNjZhOCA4IDAgMSAxLTExLjMxIDB6Ij48L3BhdGg+PC9zdmc+" alt="Droplet Icon" style="width: 40px; height: 40px;" />
            <span style="font-size: 36px; font-weight: bold; color: #111827;">
              Work<span style="font-style: italic; color: #f97316; font-family: serif;">Sauce</span>
            </span>
          </div>
        </div>
        
        <div style="background-color: #ffffff; padding: 0 10px;">
          <p>안녕하세요, <strong>${userName}</strong>님.</p>
          <p><strong>${companyName}</strong>에서 발송한 소스테스트를 보내드립니다.</p>
          <p>소스테스트 응시 가능 기한은 <strong>${deadline}</strong>까지 입니다. 기한 이후에는 응시하실 수 없습니다.</p>
          <p>꼭 기한 내에 응시해 주세요. 불응시로 인한 책임은 응시자인 ${userName}님께 있습니다.</p>

          <div style="background-color: #f7fafc; border-radius: 8px; padding: 20px; margin: 20px 0;">
            <div style="font-weight: bold; margin-bottom: 12px;">소스테스트 응시를 위한 주의사항입니다.</div>
            <ol style="padding-left: 20px; margin: 0;">
              <li style="margin-bottom: 8px;">암호화 로그인을 위해 발송 받으신 이메일과 성함을 정확히 기재해 주세요.</li>
              <li style="margin-bottom: 8px;">소스테스트는 정해진 정답이 있는 검사가 아닙니다. 편하고 솔직하게 응해주세요.</li>
              <li style="margin-bottom: 8px;">응시 결과 유형으로 분류되어 인사채용담당자에게 전달됩니다.</li>
              <li style="margin-bottom: 8px;">응시하실 경우 개인정보처리방침에 동의하신 것으로 간주됩니다.</li>
              <li style="margin-bottom: 8px;">소스테스트는 1단계 180개 문항, 2단계 동사 선택으로 이루어져 있습니다.</li>
              <li style="margin-bottom: 8px;">소요시간은 평균 15~30분 이내입니다.</li>
              <li style="margin-bottom: 8px;">행운을 빕니다.</li>
            </ol>
          </div>

          <div style="text-align: center; margin: 30px 0;">
            <a href="${deployUrl}/test?groupId=${groupId}" 
               style="display: inline-block; background-color: #4299e1; color: white; text-decoration: none; padding: 14px 32px; border-radius: 6px; font-weight: bold;">
              소스테스트 응시하기
            </a>
          </div>

          <p>본 메일은 지원하신 채용 절차에 따라 인사채용담당자의 요청으로 발송되었습니다.<br>
          채용 과정의 궁금하신 점은 해당 인사채용담당자에게 연락주세요.</p>
        </div>

        <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e2e8f0; font-size: 14px; color: #718096;">
          <p>본 이메일은 발신 전용입니다. 워크소스에 궁금하신 점은 <a href="mailto:info@worksauce.kr">info@worksauce.kr</a>로 문의바랍니다.</p>
          <p>워크소스는 ${userName}님의 성공적인 채용을 진심으로 응원합니다.</p>
          <p>감사합니다.<br>워크소스 팀 드림.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}
