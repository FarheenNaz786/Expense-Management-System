import React, { useState, useEffect } from "react";
import { Form, Input, Button, message, Alert } from "antd";
import { MailOutlined, KeyOutlined, LockOutlined } from "@ant-design/icons";
import { useNavigate, Link } from "react-router-dom";
import Header1 from "../../components/Layout/Header1";
import Footer from "../../components/Layout/Footer";
import axios from "axios";
import { BASE_URL } from "../../utils/baseURL";
import { getResponseError } from "../../utils/getResponseError";
import "./AdminLogin.css";

const AdminLogin = () => {
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState(null);
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const submitHandler = async (values) => {
    try {
      // Validate email format
      if (!values.email.includes("@") || !values.email.includes(".")) {
        setLoginError("Please enter a valid email address. Include '@' and '.'");
        return;
      }

      // Validate admin key format (16 uppercase alphanumeric characters)
      if (!/^[A-Z0-9]{16}$/.test(values.adminKey)) {
        setLoginError("Admin key must be exactly 16 uppercase alphanumeric characters (A-Z, 0-9).");
        return;
      }

      setLoading(true);
      setLoginError(null);

      const { data } = await axios.post(
        `${BASE_URL}/api/v1/admin/login`,
        values
      );

      setLoading(false);

      if (data.status === "success") {
        // Store admin data (adminId, email, name) - NOT adminKey (password)
        localStorage.setItem("admin", JSON.stringify({ ...data.admin }));
        message.success("Admin login successful");
        navigate("/admin/dashboard");
      } else {
        setLoginError(data.message || "Login failed. Please check your credentials.");
        message.error(data.message || "Login failed. Please check your credentials.");
      }
    } catch (error) {
      setLoading(false);
      const errorMessage = getResponseError(error);
      setLoginError(errorMessage);
      message.error(errorMessage || "Login failed. Please check your credentials.");
    }
  };

  // Prevent access if already logged in as admin
  useEffect(() => {
    if (localStorage.getItem("admin")) {
      navigate("/admin/dashboard");
    }
  }, [navigate]);

  return (
    <>
      <Header1 />
      <div className="auth-page-wrapper">
        <div className="admin-login-content">
          <div className="admin-login-page">
            <div className="admin-login-form">
              <h2 className="admin-login-header">Admin Login</h2>
              <p className="admin-login-description">
                Please enter your email and security admin key to access the admin dashboard.
              </p>

              {loginError && (
                <Alert
                  message="Login Error"
                  description={loginError}
                  type="error"
                  showIcon
                  closable
                  onClose={() => setLoginError(null)}
                  className="admin-login-alert"
                />
              )}

              <Form
                form={form}
                layout="vertical"
                onFinish={submitHandler}
                autoComplete="off"
                className="admin-login-form-fields"
              >
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
                    className="admin-login-input"
                  />
                </Form.Item>

                <Form.Item
                  label="Security Admin Key"
                  name="adminKey"
                  rules={[
                    {
                      required: true,
                      message: "Please enter your security admin key!",
                    },
                    {
                      pattern: /^[A-Z0-9]{16}$/,
                      message: "Admin key must be exactly 16 uppercase alphanumeric characters (A-Z, 0-9)!",
                    },
                  ]}
                >
                  <Input.Password
                    prefix={<KeyOutlined />}
                    placeholder="Enter your admin key"
                    size="large"
                    className="admin-login-input"
                    maxLength={16}
                  />
                </Form.Item>

                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    size="large"
                    loading={loading}
                    icon={<LockOutlined />}
                    className="admin-login-submit-btn"
                    block
                  >
                    {loading ? "Logging in..." : "Login"}
                  </Button>
                </Form.Item>
              </Form>

              <div className="admin-login-footer-links">
                <p>
                  Don't have an admin key?{" "}
                  <Link to="/admin/request-access" className="admin-login-link">
                    Request Admin Access
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

export default AdminLogin;
