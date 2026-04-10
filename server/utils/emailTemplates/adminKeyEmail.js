const adminKeyEmail = (adminName, adminKey, EMAIL_FROM) => {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>Admin Access Key - Expense Management System</title>
    <style>
        @media only screen and (max-width: 600px) {
            .email-container { width: 100% !important; max-width: 100% !important; }
            .email-content { padding: 20px !important; }
            .header-title { font-size: 24px !important; }
            .content-title { font-size: 20px !important; }
            .admin-key-box { padding: 16px !important; }
            .admin-key { font-size: 20px !important; letter-spacing: 1px !important; }
            .button { padding: 14px 28px !important; font-size: 14px !important; }
        }
    </style>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif; background: linear-gradient(135deg, #f8fafc 0%, #e5e7eb 100%); -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background: linear-gradient(135deg, #f8fafc 0%, #e5e7eb 100%); padding: 40px 20px;">
        <tr>
            <td align="center">
                <!-- Header with Logo/Title -->
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
                        <td style="background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%); padding: 30px 40px; text-align: center;">
                            <h2 class="content-title" style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 700; letter-spacing: 0.5px;">
                                🎉 Admin Access Approved
                            </h2>
                        </td>
                    </tr>

                    <!-- Content Area -->
                    <tr>
                        <td class="email-content" style="padding: 40px;">
                            <p style="margin: 0 0 20px 0; color: #1f2937; font-size: 16px; line-height: 1.6;">
                                Hi <strong style="color: #6366f1;">${adminName}</strong>,
                            </p>

                            <p style="margin: 0 0 24px 0; color: #4b5563; font-size: 15px; line-height: 1.7;">
                                Congratulations! Your request for admin access has been <strong style="color: #10b981;">approved</strong>. You can now access the Admin Dashboard using your credentials below.
                            </p>

                            <!-- Admin Key Highlight Box -->
                            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin: 30px 0;">
                                <tr>
                                    <td class="admin-key-box" style="background: linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(79, 70, 229, 0.1) 100%); border: 2px solid rgba(99, 102, 241, 0.2); border-radius: 12px; padding: 24px; text-align: center;">
                                        <p style="margin: 0 0 12px 0; color: #6366f1; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">
                                            🔑 Your Admin Key
                                        </p>
                                        <p class="admin-key" style="margin: 0; color: #6366f1; font-size: 28px; font-weight: 700; letter-spacing: 3px; font-family: 'Courier New', monospace; word-break: break-all;">
                                            ${adminKey}
                                        </p>
                                        <p style="margin: 12px 0 0 0; color: #6b7280; font-size: 12px;">
                                            16 uppercase alphanumeric characters
                                        </p>
                                    </td>
                                </tr>
                            </table>

                            <!-- Security Warning -->
                            <div style="background: #fef3c7; border-left: 4px solid #f59e0b; border-radius: 8px; padding: 16px; margin: 24px 0;">
                                <p style="margin: 0; color: #92400e; font-size: 14px; line-height: 1.6;">
                                    <strong>⚠️ Security Notice:</strong> Please keep this key secure and do not share it with anyone. This key provides full administrative access to the system.
                                </p>
                            </div>

                            <!-- Login Button -->
                            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin: 32px 0;">
                                <tr>
                                    <td align="center">
                                        <a href="https://expense-management-system-prakash.netlify.app/admin/login" class="button" style="display: inline-block; background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%); color: #ffffff; text-decoration: none; padding: 16px 32px; border-radius: 10px; font-size: 16px; font-weight: 600; box-shadow: 0 4px 15px rgba(99, 102, 241, 0.4); transition: all 0.3s ease;">
                                            🚀 Access Admin Dashboard
                                        </a>
                                    </td>
                                </tr>
                            </table>

                            <!-- Instructions -->
                            <div style="background: #f3f4f6; border-radius: 10px; padding: 20px; margin: 24px 0;">
                                <p style="margin: 0 0 12px 0; color: #1f2937; font-size: 14px; font-weight: 600;">
                                    📝 Login Instructions:
                                </p>
                                <ol style="margin: 0; padding-left: 20px; color: #4b5563; font-size: 14px; line-height: 1.8;">
                                    <li>Visit the Admin Login page using the button above</li>
                                    <li>Enter your registered email address</li>
                                    <li>Enter the 16-character admin key shown above</li>
                                    <li>Click "Login" to access your dashboard</li>
                                </ol>
                            </div>

                            <!-- Support Section -->
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
                            <!-- Social Links -->
                            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                                <tr>
                                    <td align="center" style="padding-bottom: 16px;">
                                        <a href="https://www.linkedin.com/in/prakash-saw-5b1215220/" style="display: inline-block; margin: 0 12px; text-decoration: none; transition: transform 0.2s;">
                                            <img src="https://cdn-icons-png.flaticon.com/512/174/174857.png" alt="LinkedIn" width="32" height="32" style="border-radius: 6px;">
                                        </a>
                                        <a href="https://github.com/Prakashsaw" style="display: inline-block; margin: 0 12px; text-decoration: none; transition: transform 0.2s;">
                                            <img src="https://cdn-icons-png.flaticon.com/512/25/25231.png" alt="GitHub" width="32" height="32" style="border-radius: 6px;">
                                        </a>
                                        <a href="https://prakashsawportfolio.netlify.app/" style="display: inline-block; margin: 0 12px; text-decoration: none; transition: transform 0.2s;">
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

module.exports = adminKeyEmail;
