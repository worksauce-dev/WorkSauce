export const deployUrl =
  process.env.NEXT_PUBLIC_DEPLOY_URL || "https://worksauce.kr/";

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
}

export const sendTestEmail = async (
  options: SendEmailOptions
): Promise<boolean> => {
  try {
    const res = await fetch("/api/send-email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        From: `"WorkSauce" <noreply@worksauce.kr>`,
        "Message-ID": `<${Date.now()}@worksauce.kr>`,
      },
      body: JSON.stringify(options),
    });
    return res.ok;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
};
