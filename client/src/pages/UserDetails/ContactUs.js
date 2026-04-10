import React, { useState } from "react";
import "./ContactUs.css";
import Footer from "../../components/Layout/Footer";
import Header1 from "../../components/Layout/Header1";
import { Alert, message } from "antd";
import { getResponseError } from "../../utils/getResponseError";
import axios from "axios";
import { BASE_URL } from "../../utils/baseURL";
import {
  HomeOutlined,
  LoadingOutlined,
  MailOutlined,
  PhoneOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [messageSendingError, setMessageSendingError] = useState(null);
  const [responseMessage, setResponseMessage] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    e.preventDefault();
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      setResponseMessage(null);
      // validate form data
      if (!formData.name || !formData.email || !formData.message) {
        setMessageSendingError("All fields are required.");
        return;
      }
      // validate email format
      if (
        !/^[a-zA-Z0-9._:$!%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(
          formData.email
        )
      ) {
        setMessageSendingError("Invalid email. Please enter valid email.");
        return;
      }

      setLoading(true);
      const response = await axios.post(
        `${BASE_URL}/api/v1/user-information/contact-us`,
        formData
      );
      setLoading(false);
      setMessageSendingError(null);
      setResponseMessage(
        "Message sent successfully. We will reach out to you soon."
      );
      message.success(
        "Message sent successfully. We will reach out to you soon."
      );
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (error) {
      setLoading(false);
      setResponseMessage(null);
      setMessageSendingError(getResponseError(error));
      message.error(
        "Something went wrong in sending message. Please try again."
      );
    }
  };

  return (
    <>
      <Header1 />
      <div className="auth-page-wrapper">
        <div className="contact-content">
          <div className="contact-container">
            <div className="contact-form-wrapper">
              <div className="contact-info">
                <div className="contact-detail">
                  <div className="contact-icon">
                    <HomeOutlined />
                  </div>
                  <div className="contact-info-content">
                    <div className="contact-topic">Address</div>
                    <div className="contact-text">Prakash & Company Pvt. Ltd, BCIT Park</div>
                    <div className="contact-text">Bangalore, Karnataka, India 560064</div>
                  </div>
                </div>
                <div className="contact-detail">
                  <div className="contact-icon">
                    <PhoneOutlined />
                  </div>
                  <div className="contact-info-content">
                    <div className="contact-topic">Phone</div>
                    <div className="contact-text">+91 8873323323</div>
                    <div className="contact-text">+91 8873323323</div>
                  </div>
                </div>
                <div className="contact-detail">
                  <div className="contact-icon">
                    <MailOutlined />
                  </div>
                  <div className="contact-info-content">
                    <div className="contact-topic">Email</div>
                    <div className="contact-text">
                      <a href="mailto:prakash8873saw@gmail.com">
                        prakash8873saw@gmail.com
                      </a>
                    </div>
                    <div className="contact-text">
                      <a href="mailto:info.prakash.company@gmail.com">
                        info.prakash.company@gmail.com
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              <div className="contact-form">
                <h2 className="header-name">Send Us Message</h2>
                <p className="contact-description">
                  If you have any inquiries, feedback, or require assistance related to
                  the Expense Management System application, please feel free to send us
                  a message. We are here to help and will respond to you as soon as possible.
                </p>
                <form onSubmit={handleFormSubmit}>
                  <div className="input-box">
                    <input
                      type="text"
                      id="name"
                      name="name"
                      placeholder="Enter your name"
                      onChange={handleChange}
                      value={formData.name}
                    />
                  </div>
                  <div className="input-box">
                    <input
                      type="text"
                      id="email"
                      name="email"
                      placeholder="Enter your email"
                      onChange={handleChange}
                      value={formData.email}
                    />
                  </div>
                  <div className="input-box message-box">
                    <textarea
                      id="message"
                      name="message"
                      placeholder="How can we help you?..."
                      onChange={handleChange}
                      value={formData.message}
                    />
                  </div>

                  {messageSendingError && (
                    <Alert
                      message={messageSendingError}
                      type="error"
                      showIcon
                      style={{ marginBottom: 10 }}
                    />
                  )}
                  {responseMessage && (
                    <Alert
                      message={responseMessage}
                      type="success"
                      showIcon
                      style={{ marginBottom: 10 }}
                    />
                  )}
                  <div className="button pb-0 mt-0 d-flex justify-content-center">
                    <button className="btn" type="submit" disabled={loading}>
                      {loading ? <LoadingOutlined /> : "Send Now"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ContactUs;
