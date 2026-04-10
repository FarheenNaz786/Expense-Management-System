const SibApiV3Sdk = require('@getbrevo/brevo');
const EMAIL_FROM_ADDRESS = "no-reply@expense-management-system.com";

/**
 * Global Mailer Wrapper for Brevo API
 * @param {Object} options - { to, subject, html }
 */
const sendMailThroughBrevo = async ({ to, subject, html }) => {
  // 1. Instantiate the API class directly
  const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

  // 2. Set the API key using the 'setApiKey' method
  // Note: TransactionalEmailsApiApiKeys.apiKey is the standard way to reference the key type
  apiInstance.setApiKey(
    SibApiV3Sdk.TransactionalEmailsApiApiKeys.apiKey,
    process.env.BREVO_COMMON_API_KEY
  );

  // 3. Create the email object
  let sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

  sendSmtpEmail.subject = subject;
  sendSmtpEmail.to = [{ email: to }];
  sendSmtpEmail.htmlContent = html;

  // Use a fixed sender address instead of environment configuration
  sendSmtpEmail.sender = {
    name: "Expense Management System",
    email: EMAIL_FROM_ADDRESS,
  };

  try {
    // 4. Send the email
    const data = await apiInstance.sendTransacEmail(sendSmtpEmail);
    // The SDK returns the response inside the 'body' property
    console.log('Email sent successfully. ID:', data.body.messageId); 
    
    return data.body; // Return the body so controllers have access to the ID
  } catch (error) {
    // Brevo API errors are often returned in error.response.body
    console.error('Brevo API Error:', error.response ? error.response.body : error.message);
    throw error;
  }
};

module.exports = sendMailThroughBrevo;