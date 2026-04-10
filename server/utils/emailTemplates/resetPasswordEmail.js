const resetPasswordEmail = (user, resetPasswordLink, EMAIL_FROM) => {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>Reset Your Password - Expense Management System</title>
    <style>
        @media only screen and (max-width: 600px) {
            .email-container { width: 100% !important; max-width: 100% !important; }
            .email-content { padding: 20px !important; }
            .header-title { font-size: 24px !important; }
            .content-title { font-size: 20px !important; }
            .button { padding: 14px 28px !important; font-size: 14px !important; }
        }
    </style>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif; background: linear-gradient(135deg, #f8fafc 0%, #e5e7eb 100%); -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background: linear-gradient(135deg, #f8fafc 0%, #e5e7eb 100%); padding: 40px 20px;">
        <tr>
            <td align="center">
                <!-- Header -->
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width: 600px; margin-bottom: 30px;">
                    <tr>
                        <td align="center" style="padding: 0 0 20px 0;">
                            <h1 class="header-title" style="margin: 0; color: #6366f1; font-size: 28px; font-weight: 700; background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">
                                Expense Management System
                            </h1>
                        </td>
                    </tr>
                </table>

                <!-- Main Email Container -->
                <table role="presentation" class="email-container" width="600" cellspacing="0" cellpadding="0" border="0" style="max-width: 600px; background: #ffffff; border-radius: 16px; box-shadow: 0 20px 60px rgba(99, 102, 241, 0.15); overflow: hidden;">
                    <!-- Gradient Header -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); padding: 30px 40px; text-align: center;">
                            <h2 class="content-title" style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 700; letter-spacing: 0.5px;">
                                🔑 Reset Your Password
                            </h2>
                        </td>
                    </tr>

                    <!-- Content Area -->
                    <tr>
                        <td class="email-content" style="padding: 40px;">
                            <p style="margin: 0 0 20px 0; color: #1f2937; font-size: 16px; line-height: 1.6;">
                                Hi <strong style="color: #6366f1;">${user.name}</strong>,
                            </p>

                            <p style="margin: 0 0 24px 0; color: #4b5563; font-size: 15px; line-height: 1.7;">
                                We received a request to reset the password for your <strong style="color: #6366f1;">Expense Management System</strong> account. If you made this request, click the button below to create a new password.
                            </p>

                            <!-- Security Notice -->
                            <div style="background: #fef3c7; border-left: 4px solid #f59e0b; border-radius: 8px; padding: 16px; margin: 24px 0;">
                                <p style="margin: 0; color: #92400e; font-size: 14px; line-height: 1.6;">
                                    ⚠️ <strong>Important:</strong> If you didn't request a password reset, please ignore this email. Your password will remain unchanged.
                                </p>
                            </div>

                            <!-- Reset Button -->
                            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin: 32px 0;">
                                <tr>
                                    <td align="center">
                                        <a href="${resetPasswordLink}" class="button" style="display: inline-block; background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); color: #ffffff; text-decoration: none; padding: 16px 32px; border-radius: 10px; font-size: 16px; font-weight: 600; box-shadow: 0 4px 15px rgba(239, 68, 68, 0.4); transition: all 0.3s ease;">
                                            🔐 Reset Password
                                        </a>
                                    </td>
                                </tr>
                            </table>

                            <!-- Alternative Link -->
                            <p style="margin: 24px 0 0 0; color: #6b7280; font-size: 13px; line-height: 1.6; text-align: center;">
                                Button not working? Copy and paste this link into your browser:<br>
                                <a href="${resetPasswordLink}" style="color: #6366f1; text-decoration: underline; word-break: break-all;">${resetPasswordLink}</a>
                            </p>

                            <!-- Expiry Info -->
                            <div style="background: #f3f4f6; border-radius: 10px; padding: 20px; margin: 32px 0;">
                                <p style="margin: 0 0 12px 0; color: #1f2937; font-size: 14px; font-weight: 600;">
                                    ⏰ Password Reset Details:
                                </p>
                                <ul style="margin: 0; padding-left: 20px; color: #4b5563; font-size: 14px; line-height: 1.8;">
                                    <li>This link is valid for a limited time</li>
                                    <li>You can only use this link once</li>
                                    <li>After resetting, you'll be able to login with your new password</li>
                                </ul>
                            </div>

                            <!-- Security Warning -->
                            <div style="background: #fee2e2; border-left: 4px solid #ef4444; border-radius: 8px; padding: 16px; margin: 24px 0;">
                                <p style="margin: 0; color: #991b1b; font-size: 14px; line-height: 1.6;">
                                    🔒 <strong>Security Tip:</strong> Never share your password reset link with anyone. Our support team will never ask for this link.
                                </p>
                            </div>

                            <!-- Support -->
                            <p style="margin: 32px 0 0 0; color: #4b5563; font-size: 14px; line-height: 1.7;">
                                Need assistance? Contact us at <a href="mailto:${EMAIL_FROM}" style="color: #6366f1; text-decoration: none; font-weight: 600;">${EMAIL_FROM}</a>
                            </p>

                            <p style="margin: 24px 0 0 0; color: #1f2937; font-size: 15px; line-height: 1.7;">
                                Best regards,<br>
                                <strong style="color: #6366f1;">Expense Management System Team</strong>
                            </p>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="background: #f9fafb; border-top: 1px solid #e5e7eb; padding: 24px 40px; text-align: center;">
                            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                                <tr>
                                    <td align="center" style="padding-bottom: 16px;">
                                        <a href="https://www.linkedin.com/in/prakash-saw-5b1215220/" style="display: inline-block; margin: 0 12px; text-decoration: none;">
                                            <img src="https://cdn-icons-png.flaticon.com/512/174/174857.png" alt="LinkedIn" width="32" height="32" style="border-radius: 6px;">
                                        </a>
                                        <a href="https://github.com/Prakashsaw" style="display: inline-block; margin: 0 12px; text-decoration: none;">
                                            <img src="https://cdn-icons-png.flaticon.com/512/25/25231.png" alt="GitHub" width="32" height="32" style="border-radius: 6px;">
                                        </a>
                                        <a href="https://prakashsawportfolio.netlify.app/" style="display: inline-block; margin: 0 12px; text-decoration: none;">
                                            <img src="https://cdn-icons-png.flaticon.com/512/1006/1006771.png" alt="Website" width="32" height="32" style="border-radius: 6px;">
                                        </a>
                                    </td>
                                </tr>
                            </table>
                            <p style="margin: 0; color: #9ca3af; font-size: 12px; line-height: 1.6;">
                                This message was sent from Prakash & Company Pvt. Ltd<br>
                                BCIT Park, Bangalore, Karnataka, India 560064
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>`;
};

module.exports = resetPasswordEmail;
