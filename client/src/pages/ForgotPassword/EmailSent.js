import { Alert, Button } from "antd";
import React from "react";
import { useNavigate } from "react-router-dom";
import "./ForgotPassword.css";
const EmailSent = () => {
  const navigate = useNavigate();

  const onClickHandler = async () => {
    navigate("/login");
  };
  return (
    <>
      <div className="auth-page-wrapper">
        <div className="forgot-password-content">
          <div className="forgot-password-page">
            <div className="forgot-password-form">
              <Alert
                message="Email sent. Check your mail."
                description="An email has been sent to your email with the reset link to reset your password."
                type="success"
                showIcon
                className="success-alert"
              />
              <Button
                type="primary"
                className="success-btn"
                onClick={onClickHandler}
                block
              >
                Back to Login Page
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EmailSent;
