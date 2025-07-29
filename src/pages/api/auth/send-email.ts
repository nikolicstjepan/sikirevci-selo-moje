import { env } from "process";

interface SendEmailData {
  to: string;
  from: string;
  subject: string;
  text: string;
  html?: string;
  replyTo?: string;
}

interface SendEmailResponse {
  success?: boolean;
  error?: string;
}

export default async function sendEmail(data: SendEmailData): Promise<SendEmailResponse> {
  if (env.NODE_ENV === "development") {
    console.log("sendEmail (development mode)", data);
    return { success: true };
  }

  try {
    const response = await fetch(env.EMAIL_API_URL!, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        to: data.to,
        from: data.from,
        subject: data.subject,
        text: data.text,
        html: data.html,
        replyTo: data.replyTo,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    if (!result.success) {
      throw new Error(`Email could not be sent: ${result.message}`);
    }

    return result;
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error(`Email could not be sent: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}
