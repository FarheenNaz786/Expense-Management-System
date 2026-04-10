import React from "react";
import Header1 from "../../components/Layout/Header1";
import Footer from "../../components/Layout/Footer";
import "./PrivacyAndPolicy.css";

const PrivacyAndPolicy = () => {
  return (
    <>
      <Header1 />
      <div className="auth-page-wrapper">
        <div className="legal-content">
          <div className="legal-container">
            <div className="legal-document">
              <h1 className="legal-title">Privacy Policy</h1>
              <p className="legal-last-updated">Last Updated: January 2026</p>

              <section className="legal-section">
                <h2 className="legal-heading">1. Introduction</h2>
                <p className="legal-text">
                  Prakash & Company Pvt Ltd ("we," "our," or "us") operates the Expense Management 
                  System ("the Service"). This Privacy Policy informs you of our policies regarding 
                  the collection, use, and disclosure of personal data when you use our Service and 
                  the choices you have associated with that data.
                </p>
                <p className="legal-text">
                  We are committed to protecting your privacy and ensuring the security of your 
                  personal information. By using our Service, you agree to the collection and use 
                  of information in accordance with this policy.
                </p>
              </section>

              <section className="legal-section">
                <h2 className="legal-heading">2. Information We Collect</h2>
                
                <h3 className="legal-subheading">2.1 Personal Information</h3>
                <p className="legal-text">
                  When you register for an account, we collect:
                </p>
                <ul className="legal-list">
                  <li>Name</li>
                  <li>Email address</li>
                  <li>Phone number (optional)</li>
                  <li>Address (optional)</li>
                  <li>Birth date (optional)</li>
                  <li>Password (encrypted and stored securely)</li>
                </ul>

                <h3 className="legal-subheading">2.2 Financial Transaction Data</h3>
                <p className="legal-text">
                  When you use the Service, we collect and store:
                </p>
                <ul className="legal-list">
                  <li>Income and expense transactions</li>
                  <li>Transaction amounts, dates, and categories</li>
                  <li>Transaction descriptions and notes</li>
                </ul>

                <h3 className="legal-subheading">2.3 Usage Data</h3>
                <p className="legal-text">
                  We may collect information about how you access and use the Service, including:
                </p>
                <ul className="legal-list">
                  <li>IP address</li>
                  <li>Browser type and version</li>
                  <li>Pages visited and time spent on pages</li>
                  <li>Date and time of access</li>
                  <li>Device information</li>
                </ul>
              </section>

              <section className="legal-section">
                <h2 className="legal-heading">3. How We Use Your Information</h2>
                <p className="legal-text">
                  We use the collected information for various purposes:
                </p>
                <ul className="legal-list">
                  <li>To provide and maintain our Service</li>
                  <li>To notify you about changes to our Service</li>
                  <li>To allow you to participate in interactive features of our Service</li>
                  <li>To provide customer support and respond to your inquiries</li>
                  <li>To gather analysis or valuable information to improve our Service</li>
                  <li>To monitor the usage of our Service</li>
                  <li>To detect, prevent, and address technical issues</li>
                  <li>To send you email verification links and password reset links</li>
                  <li>To send OTP (One-Time Password) for phone verification</li>
                </ul>
              </section>

              <section className="legal-section">
                <h2 className="legal-heading">4. Data Security</h2>
                <p className="legal-text">
                  We implement appropriate security measures to protect your personal information:
                </p>
                <ul className="legal-list">
                  <li>Passwords are encrypted using Bcrypt hashing algorithm</li>
                  <li>Authentication is secured using JWT (JSON Web Tokens)</li>
                  <li>Data transmission is encrypted using HTTPS/SSL protocols</li>
                  <li>Access to personal data is restricted to authorized personnel only</li>
                  <li>Regular security audits and updates are performed</li>
                </ul>
                <p className="legal-text">
                  However, no method of transmission over the Internet or electronic storage is 
                  100% secure. While we strive to use commercially acceptable means to protect 
                  your data, we cannot guarantee absolute security.
                </p>
              </section>

              <section className="legal-section">
                <h2 className="legal-heading">5. Data Storage and Retention</h2>
                <p className="legal-text">
                  Your data is stored securely in our database. We retain your personal information 
                  and transaction data for as long as your account is active or as needed to provide 
                  you with the Service. If you delete your account, we will delete or anonymize your 
                  personal information, except where we are required to retain it by law.
                </p>
              </section>

              <section className="legal-section">
                <h2 className="legal-heading">6. Third-Party Services</h2>
                <p className="legal-text">
                  We may use trusted third-party services to support login, password reset,
                  and notifications. These providers receive only the information necessary to
                  deliver the requested service.
                </p>

                <h3 className="legal-subheading">6.1 Email Services</h3>
                <p className="legal-text">
                  We use email services to send password reset links and other service-related
                  communications. Your email address is shared with these services solely for
                  the purpose of sending emails.
                </p>

                <h3 className="legal-subheading">6.2 SMS Services</h3>
                <p className="legal-text">
                  If you choose to verify your phone number, we use SMS services to send OTP codes.
                  Your phone number is shared with these services solely for the purpose of sending
                  verification codes.
                </p>
              </section>

              <section className="legal-section">
                <h2 className="legal-heading">7. Your Rights and Choices</h2>
                <p className="legal-text">
                  You have the right to:
                </p>
                <ul className="legal-list">
                  <li>Access your personal information and transaction data</li>
                  <li>Update or correct your personal information through your account settings</li>
                  <li>Delete your account and associated data</li>
                  <li>Export your transaction data using the Excel export feature</li>
                  <li>Opt-out of certain communications (except service-related emails)</li>
                  <li>Request a copy of your data</li>
                </ul>
              </section>

              <section className="legal-section">
                <h2 className="legal-heading">8. Cookies and Tracking Technologies</h2>
                <p className="legal-text">
                  We use cookies and similar tracking technologies to:
                </p>
                <ul className="legal-list">
                  <li>Maintain your login session</li>
                  <li>Remember your preferences</li>
                  <li>Analyze Service usage</li>
                  <li>Improve user experience</li>
                </ul>
                <p className="legal-text">
                  You can instruct your browser to refuse all cookies or to indicate when a cookie 
                  is being sent. However, if you do not accept cookies, you may not be able to use 
                  some portions of our Service.
                </p>
              </section>

              <section className="legal-section">
                <h2 className="legal-heading">9. Children's Privacy</h2>
                <p className="legal-text">
                  Our Service is not intended for children under the age of 18. We do not knowingly 
                  collect personal information from children under 18. If you are a parent or guardian 
                  and believe your child has provided us with personal information, please contact 
                  us immediately.
                </p>
              </section>

              <section className="legal-section">
                <h2 className="legal-heading">10. Data Sharing and Disclosure</h2>
                <p className="legal-text">
                  We do not sell, trade, or rent your personal information to third parties. We may 
                  share your information only in the following circumstances:
                </p>
                <ul className="legal-list">
                  <li>With your explicit consent</li>
                  <li>To comply with legal obligations or court orders</li>
                  <li>To protect our rights, privacy, safety, or property</li>
                  <li>With service providers who assist us in operating our Service (under strict 
                      confidentiality agreements)</li>
                  <li>In connection with a business transfer or merger</li>
                </ul>
              </section>

              <section className="legal-section">
                <h2 className="legal-heading">11. International Data Transfers</h2>
                <p className="legal-text">
                  Your information may be transferred to and maintained on computers located outside 
                  of your state, province, country, or other governmental jurisdiction where data 
                  protection laws may differ. By using our Service, you consent to the transfer of 
                  your information to our facilities and those third parties with whom we share it 
                  as described in this Privacy Policy.
                </p>
              </section>

              <section className="legal-section">
                <h2 className="legal-heading">12. Changes to This Privacy Policy</h2>
                <p className="legal-text">
                  We may update our Privacy Policy from time to time. We will notify you of any 
                  changes by posting the new Privacy Policy on this page and updating the "Last 
                  Updated" date. You are advised to review this Privacy Policy periodically for 
                  any changes.
                </p>
              </section>

              <section className="legal-section">
                <h2 className="legal-heading">13. Contact Us</h2>
                <p className="legal-text">
                  If you have any questions about this Privacy Policy or wish to exercise your 
                  rights regarding your personal data, please contact us at:
                </p>
                <ul className="legal-list">
                  <li>Email: prakash8873saw@gmail.com</li>
                  <li>Email: info.prakash.company@gmail.com</li>
                  <li>Phone: +91 8873323323</li>
                  <li>Address: Prakash & Company Pvt. Ltd, BCIT Park, Bangalore, Karnataka, India 560064</li>
                </ul>
              </section>

              <section className="legal-section">
                <h2 className="legal-heading">14. Consent</h2>
                <p className="legal-text">
                  By using our Service, you consent to our Privacy Policy and agree to its terms. 
                  If you do not agree with this policy, please do not use our Service.
                </p>
              </section>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default PrivacyAndPolicy;
