import React, { useState } from "react";
import { Form, Input, Button, message, Alert } from "antd";
import { UserOutlined, MailOutlined, PhoneOutlined, SendOutlined } from "@ant-design/icons";
import { useNavigate, Link } from "react-router-dom";
import Header1 from "../../components/Layout/Header1";
import Footer from "../../components/Layout/Footer";
import axios from "axios";
import { BASE_URL } from "../../utils/baseURL";
import { getResponseError } from "../../utils/getResponseError";
import "./RequestForAdminAccess.css";

const RequestForAdminAccess = () => {
  const [loading, setLoading] = useState(false);
  const [requestError, setRequestError] = useState(null);
  const [responseMessage, setResponseMessage] = useState(null);
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const submitHandler = async (values) => {
    try {
      // Validate email format
      if (!values.email.includes("@") || !values.email.includes(".")) {
        setRequestError("Please enter a valid email address. Include '@' and '.'");
        return;
      }

      setLoading(true);
      setRequestError(null);
      setResponseMessage(null);

      const { data } = await axios.post(
        `${BASE_URL}/api/v1/admin/request-access`,
        values
      );

      setLoading(false);
      
      if (data.status === "success") {
        setResponseMessage(data.message);
        message.success("Request submitted successfully!");
        form.resetFields();

        // Navigate to admin login after 3 seconds
        setTimeout(() => {
          navigate("/admin/login");
        }, 3000);
      } else {
        setRequestError(data.message || "Something went wrong. Please try again.");
        message.error(data.message || "Request failed. Please try again.");
      }
    } catch (error) {
      setLoading(false);
      setRequestError(getResponseError(error));
      message.error("Something went wrong. Please try again.");
    }
  };

  return (
    <>
      <Header1 />
      <div className="auth-page-wrapper">
        <div className="admin-request-content">
          <div className="admin-request-page">
            <div className="admin-request-form">
              <h2 className="admin-request-header">Request Admin Access</h2>
              <p className="admin-request-description">
                Please fill out the form below to request admin access. Our team will 
                review your request and send you a security admin key via email if approved.
              </p>

              {requestError && (
                <Alert
                  message="Error"
                  description={requestError}
                  type="error"
                  showIcon
                  closable
                  onClose={() => setRequestError(null)}
                  className="admin-request-alert"
                />
              )}

              {responseMessage && (
                <Alert
                  message="Request Submitted"
                  description={responseMessage}
                  type="success"
                  showIcon
                  closable
                  onClose={() => setResponseMessage(null)}
                  className="admin-request-alert"
                />
              )}

              <Form
                form={form}
                layout="vertical"
                onFinish={submitHandler}
                autoComplete="off"
                className="admin-request-form-fields"
              >
                <Form.Item
                  label="Full Name"
                  name="name"
                  rules={[
                    {
                      required: true,
                      message: "Please enter your full name!",
                    },
                    {
                      min: 3,
                      message: "Name must be at least 3 characters!",
                    },
                  ]}
                >
                  <Input
                    prefix={<UserOutlined />}
                    placeholder="Enter your full name"
                    size="large"
                    className="admin-request-input"
                  />
                </Form.Item>

                <Form.Item
                  label="Email"
                  name="email"
                  rules={[
                    {
                      required: true,
                      message: "Please enter your email!",
                    },
                    {
                      type: "email",
                      message: "Please enter a valid email address!",
                    },
                  ]}
                >
                  <Input
                    prefix={<MailOutlined />}
                    placeholder="Enter your email address"
                    size="large"
                    className="admin-request-input"
                  />
                </Form.Item>

                <Form.Item
                  label="Phone Number (Optional)"
                  name="phone"
                  rules={[
                    {
                      pattern: /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/,
                      message: "Please enter a valid phone number!",
                    },
                  ]}
                >
                  <Input
                    prefix={<PhoneOutlined />}
                    placeholder="Enter your phone number (optional)"
                    size="large"
                    className="admin-request-input"
                  />
                </Form.Item>

                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    size="large"
                    loading={loading}
                    icon={<SendOutlined />}
                    className="admin-request-submit-btn"
                    block
                  >
                    {loading ? "Submitting Request..." : "Submit Request"}
                  </Button>
                </Form.Item>
              </Form>

              <div className="admin-request-footer-links">
                <p>
                  Already have an admin key?{" "}
                  <Link to="/admin/login" className="admin-request-link">
                    Login here
                  </Link>
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

export default RequestForAdminAccess;
