import React from "react";
import Header1 from "../../components/Layout/Header1";
import Footer from "../../components/Layout/Footer";
import "./AboutUs.css";

const AboutUs = () => {
  return (
    <>
      <Header1 />
      <div className="auth-page-wrapper">
        <div className="about-us-content">
          <div className="about-us-page">
            <div className="about-us-card">
              <h1 className="about-us-title">About Us</h1>
              
              <div className="about-section">
                <h2 className="section-title">Our Company</h2>
                <p className="section-text">
                  Prakash & Company Pvt. Ltd is a forward-thinking technology company 
                  dedicated to providing innovative solutions that simplify financial 
                  management for individuals and businesses. Based in Bangalore, Karnataka, 
                  we are committed to delivering high-quality software solutions that 
                  empower our users to take control of their finances.
                </p>
              </div>

              <div className="about-section">
                <h2 className="section-title">Expense Management System</h2>
                <p className="section-text">
                  Our Expense Management System is a comprehensive web application designed 
                  to help you track, manage, and analyze your income and expenses efficiently. 
                  Built with modern technologies, the platform offers intuitive features 
                  including transaction management, category-wise analytics, customizable 
                  date ranges, and detailed financial reports. Whether you're managing 
                  personal finances or tracking business expenses, our system provides 
                  the tools you need to make informed financial decisions.
                </p>
              </div>

              <div className="about-section">
                <h2 className="section-title">Key Features</h2>
                <ul className="features-list">
                  <li>Easy transaction recording with income and expense tracking</li>
                  <li>Category-wise financial analytics and insights</li>
                  <li>Flexible date range filtering (Daily, Weekly, Monthly, Yearly)</li>
                  <li>Secure user authentication and data protection</li>
                  <li>Export functionality for financial reports</li>
                  <li>Real-time balance calculations and visualizations</li>
                </ul>
              </div>

              <div className="about-section">
                <h2 className="section-title">Our Mission</h2>
                <p className="section-text">
                  Our mission is to make financial management accessible, simple, and 
                  effective for everyone. We believe that with the right tools, anyone 
                  can achieve better financial control and make smarter decisions about 
                  their money. We are continuously working to improve our platform and 
                  add new features based on user feedback.
                </p>
              </div>

              <div className="about-section">
                <h2 className="section-title">Contact Information</h2>
                <div className="contact-info">
                  <p className="section-text">
                    <strong>Company:</strong> Prakash & Company Pvt. Ltd<br />
                    <strong>Address:</strong> BCIT Park, Bangalore, Karnataka, India 560064<br />
                    <strong>For inquiries:</strong> Please visit our{" "}
                    <a href="/contact-us" className="contact-link">Contact Us</a> page
                  </p>
                </div>
              </div>

              <div className="about-section">
                <p className="closing-text">
                  Thank you for choosing our Expense Management System. We are committed 
                  to providing you with the best possible experience and continuously 
                  improving our services to meet your financial management needs.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AboutUs;
