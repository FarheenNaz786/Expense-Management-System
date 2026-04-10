import { Alert, Button } from "antd";
import React from "react";
import { useNavigate } from "react-router-dom";
import "./ForgotPassword.css";
const PasswordResetSuccess = () => {
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
                message="Password Reset Successfully."
                description="Your password has been reset successfully. Go to login page and login with your new password."
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

export default PasswordResetSuccess;
