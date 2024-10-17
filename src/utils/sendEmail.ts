interface EmailOptions {
  to: string;
  subject: string;
  html?: string;
  text?: string;
  userName?: string;
  groupId?: string;
}

export async function sendEmail({
  to,
  subject,
  html,
  text,
  userName,
  groupId,
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
        html: html || generateDefaultHTMLTemplate(userName, groupId),
        text,
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
  groupId: string = ""
): string {
  return `
    <!DOCTYPE html>
    <html lang="ko">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>워크소스 테스트를 시작해주세요!</title>
      <style>
        body, html {
          margin: 0;
          padding: 0;
          font-family: 'Helvetica', 'Arial', sans-serif;
          background-color: #f8f9fa;
          color: #333333;
        }
        .container {
          max-width: 630px;
          margin: 20px auto;
          background-color: #ffffff;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        .header {
          background-color: #4a5568;
          color: #ffffff;
          padding: 30px 0;
          text-align: center;
        }
        .logo {
          max-width: 120px;
          height: auto;
        }
        .content {
          padding: 40px;
        }
        h1 {
          color: #2d3748;
          font-size: 28px;
          margin-bottom: 20px;
          text-align: center;
        }
        p {
          color: #4a5568;
          font-size: 16px;
          line-height: 1.6;
          margin-bottom: 20px;
        }
        .button {
          display: inline-block;
          background-color: #4299e1;
          color: white;
          text-decoration: none;
          padding: 12px 24px;
          border-radius: 50px;
          font-weight: bold;
          text-align: center;
          transition: background-color 0.3s ease;
        }
        .button:hover {
          background-color: #3182ce;
        }
        .footer {
          background-color: #edf2f7;
          padding: 20px;
          text-align: center;
          color: #718096;
          font-size: 14px;
        }
        .social-links {
          margin-top: 20px;
        }
        .social-links a {
          display: inline-block;
          margin: 0 10px;
        }
        .social-links img {
          width: 30px;
          height: 30px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <img src="https://your-logo-url.com/logo.png" alt="워크소스 로고" class="logo">
        </div>
        <div class="content">
          <h1>워크소스에 오신 것을 환영합니다!</h1>
          <p>안녕하세요, <strong>${userName}</strong>님.</p>
          <p>워크소스에 가입해 주셔서 진심으로 감사드립니다. 저희 서비스를 통해 당신의 업무 효율성을 높이고 성공적인 결과를 얻으실 수 있기를 바랍니다.</p>
          <p>지금 바로 워크소스를 시작해보세요:</p>
          <p style="text-align: center; margin-top: 30px; margin-bottom: 30px;">
            <a href="http://localhost:3000/test?groupId=${groupId}" class="button">워크소스 시작하기</a>
          </p>
          <p>궁금한 점이 있으시면 언제든지 문의해 주세요. 저희 팀이 항상 도와드릴 준비가 되어 있습니다.</p>
          <p>감사합니다.</p>
          <p><em>워크소스 팀 드림</em></p>
        </div>
        <div class="footer">
          <p>본 이메일은 발신 전용입니다. 문의사항은 고객센터를 이용해 주세요.</p>
          <p>&copy; 2024 워크소스. All rights reserved.</p>
          <div class="social-links">
            <a href="#" target="_blank"><img src="https://example.com/facebook-icon.png" alt="Facebook"></a>
            <a href="#" target="_blank"><img src="https://example.com/twitter-icon.png" alt="Twitter"></a>
            <a href="#" target="_blank"><img src="https://example.com/instagram-icon.png" alt="Instagram"></a>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
}
