import React from "react";
import Header1 from "../../components/Layout/Header1";
import Footer from "../../components/Layout/Footer";
import "./TermsAndConditions.css";

const TermsAndConditions = () => {
  return (
    <>
      <Header1 />
      <div className="auth-page-wrapper">
        <div className="legal-content">
          <div className="legal-container">
            <div className="legal-document">
              <h1 className="legal-title">Terms and Conditions</h1>
              <p className="legal-last-updated">Last Updated: January 2026</p>

              <section className="legal-section">
                <h2 className="legal-heading">1. Acceptance of Terms</h2>
                <p className="legal-text">
                  By accessing and using the Expense Management System ("the Service"), 
                  you accept and agree to be bound by the terms and provision of this agreement. 
                  If you do not agree to abide by the above, please do not use this service.
                </p>
              </section>

              <section className="legal-section">
                <h2 className="legal-heading">2. Description of Service</h2>
                <p className="legal-text">
                  The Expense Management System is a web-based financial management application 
                  that allows users to:
                </p>
                <ul className="legal-list">
                  <li>Track and manage income and expense transactions</li>
                  <li>Categorize financial transactions for better organization</li>
                  <li>View analytics and insights through charts and graphs</li>
                  <li>Filter transactions by date range, type, and category</li>
                  <li>Export transaction data to Excel format</li>
                  <li>Manage user profile and account settings</li>
                </ul>
              </section>

              <section className="legal-section">
                <h2 className="legal-heading">3. User Account and Registration</h2>
                <p className="legal-text">
                  To use the Service, you must:
                </p>
                <ul className="legal-list">
                  <li>Create an account by providing accurate, current, and complete information</li>
                  <li>Verify your email address through the verification link sent to your email</li>
                  <li>Maintain and promptly update your account information</li>
                  <li>Maintain the security of your password and identification</li>
                  <li>Accept responsibility for all activities that occur under your account</li>
                  <li>Notify us immediately of any unauthorized use of your account</li>
                </ul>
              </section>

              <section className="legal-section">
                <h2 className="legal-heading">4. User Responsibilities</h2>
                <p className="legal-text">
                  You agree to:
                </p>
                <ul className="legal-list">
                  <li>Use the Service only for lawful purposes and in accordance with these Terms</li>
                  <li>Provide accurate and truthful information when creating transactions</li>
                  <li>Not attempt to gain unauthorized access to the Service or other users' accounts</li>
                  <li>Not use the Service to transmit any malicious code or harmful content</li>
                  <li>Not interfere with or disrupt the Service or servers connected to the Service</li>
                  <li>Not use automated systems or bots to access the Service without permission</li>
                </ul>
              </section>

              <section className="legal-section">
                <h2 className="legal-heading">5. Financial Data and Accuracy</h2>
                <p className="legal-text">
                  While we strive to provide accurate financial tracking tools, you acknowledge that:
                </p>
                <ul className="legal-list">
                  <li>You are solely responsible for the accuracy of all financial data you enter</li>
                  <li>The Service is a tool for tracking and does not provide financial advice</li>
                  <li>We are not responsible for any financial decisions made based on the data in the Service</li>
                  <li>You should verify important financial information independently</li>
                </ul>
              </section>

              <section className="legal-section">
                <h2 className="legal-heading">6. Data Export and Backup</h2>
                <p className="legal-text">
                  The Service provides functionality to export your transaction data to Excel format. 
                  You are responsible for:
                </p>
                <ul className="legal-list">
                  <li>Regularly backing up your data using the export feature</li>
                  <li>Maintaining copies of your exported data</li>
                  <li>Understanding that data loss may occur if you fail to maintain backups</li>
                </ul>
              </section>

              <section className="legal-section">
                <h2 className="legal-heading">7. Account Termination</h2>
                <p className="legal-text">
                  We reserve the right to:
                </p>
                <ul className="legal-list">
                  <li>Suspend or terminate your account if you violate these Terms</li>
                  <li>Delete your account and data after a period of inactivity</li>
                  <li>Refuse service to anyone for any reason at any time</li>
                </ul>
                <p className="legal-text">
                  You may terminate your account at any time by contacting us or deleting your account 
                  through the Service settings.
                </p>
              </section>

              <section className="legal-section">
                <h2 className="legal-heading">8. Intellectual Property</h2>
                <p className="legal-text">
                  The Service and its original content, features, and functionality are owned by 
                  Prakash & Company Pvt Ltd and are protected by international copyright, trademark, 
                  patent, trade secret, and other intellectual property laws.
                </p>
              </section>

              <section className="legal-section">
                <h2 className="legal-heading">9. Limitation of Liability</h2>
                <p className="legal-text">
                  In no event shall Prakash & Company Pvt Ltd, its directors, employees, or agents 
                  be liable for any indirect, incidental, special, consequential, or punitive damages, 
                  including without limitation, loss of profits, data, use, goodwill, or other intangible 
                  losses, resulting from your use of the Service.
                </p>
              </section>

              <section className="legal-section">
                <h2 className="legal-heading">10. Service Availability</h2>
                <p className="legal-text">
                  We do not guarantee that the Service will be available at all times. The Service 
                  may be unavailable due to maintenance, updates, or circumstances beyond our control. 
                  We are not liable for any loss or damage resulting from Service unavailability.
                </p>
              </section>

              <section className="legal-section">
                <h2 className="legal-heading">11. Changes to Terms</h2>
                <p className="legal-text">
                  We reserve the right to modify these Terms at any time. We will notify users of 
                  any material changes by posting the new Terms on this page and updating the 
                  "Last Updated" date. Your continued use of the Service after such changes 
                  constitutes acceptance of the new Terms.
                </p>
              </section>

              <section className="legal-section">
                <h2 className="legal-heading">12. Contact Information</h2>
                <p className="legal-text">
                  If you have any questions about these Terms and Conditions, please contact us at:
                </p>
                <ul className="legal-list">
                  <li>Email: prakash8873saw@gmail.com</li>
                  <li>Email: info.prakash.company@gmail.com</li>
                  <li>Phone: +91 8873323323</li>
                  <li>Address: Prakash & Company Pvt. Ltd, BCIT Park, Bangalore, Karnataka, India 560064</li>
                </ul>
              </section>

              <section className="legal-section">
                <h2 className="legal-heading">13. Governing Law</h2>
                <p className="legal-text">
                  These Terms shall be governed by and construed in accordance with the laws of India, 
                  without regard to its conflict of law provisions. Any disputes arising from these 
                  Terms or the Service shall be subject to the exclusive jurisdiction of the courts 
                  in Bangalore, Karnataka, India.
                </p>
              </section>

              <section className="legal-section">
                <h2 className="legal-heading">14. Entire Agreement</h2>
                <p className="legal-text">
                  These Terms constitute the entire agreement between you and Prakash & Company Pvt Ltd 
                  regarding the use of the Expense Management System and supersede all prior agreements 
                  and understandings.
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

export default TermsAndConditions;
