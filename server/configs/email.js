import Brevo from "@getbrevo/brevo";

const client = new Brevo.TransactionalEmailsApi();
client.setApiKey(Brevo.TransactionalEmailsApiApiKeys.apiKey, process.env.BREVO_API_KEY);

/**
 * sendEmail({ to, subject, html })
 * @param {string} to - recipient email
 * @param {string} subject - email subject
 * @param {string} html - email HTML content
 */
export async function sendEmail({ to, subject, html }) {
  const emailPayload = {
    sender: { email: process.env.BREVO_SENDER_EMAIL, name: "Order Placed" },
    to: [{ email: to }],
    subject,
    htmlContent: html,
  };

  try {
    const response = await client.sendTransacEmail(emailPayload);
    console.log("✅ Email sent:", response);
    return response;
  } catch (error) {
    console.error("❌ Brevo API error:", error?.response || error?.body || error);
    throw error;
  }
}
