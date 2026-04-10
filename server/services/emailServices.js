const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY_FOR_EMAIL_SERVICES_7380_EMAIL);

const sendEmailThroughResend = async ({ to, subject, html }) => {
  const response = await resend.emails.send({
    from: "Expense Management System <no-reply@resend.dev>",
    to,
    subject,
    html,
  });

  if (response.error) {
    console.error("Resend error:", response.error);
    throw new Error(response.error.message);
  }

  return response;
};

module.exports = { sendEmailThroughResend };
