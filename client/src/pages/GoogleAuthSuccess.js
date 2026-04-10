// GoogleAuthSuccess.js
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { message, Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import Header1 from "../components/Layout/Header1";
import Footer from "../components/Layout/Footer";
import "./GoogleAuthSuccess.css";

const GoogleAuthSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");
    const name = urlParams.get("name");
    const expenseAppUserId = urlParams.get("expenseAppUserId");
    const isVerified = urlParams.get("isVerified");

    if (token) {
      localStorage.setItem(
        "user",
        JSON.stringify({ 
          expenseAppUserId, 
          isVerified, 
          name, 
          token,
          registeredWith: "GOOGLE" // Flag to identify Google auth users
        })
      );
      message.success("Google Login Successful!");
      navigate("/user");
    }
  }, [navigate]);

  const antIcon = (
    <LoadingOutlined
      style={{
        fontSize: 48,
        color: "var(--primary-color)",
      }}
      spin
    />
  );

  return (
    <>
      <Header1 />
      <div className="auth-page-wrapper">
        <div className="google-auth-content">
          <div className="google-auth-page">
            <div className="google-auth-form">
              <div className="loading-container">
                <Spin indicator={antIcon} tip="Processing Google Authentication..." size="large" />
                <p className="loading-text">Please wait while we authenticate your account...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default GoogleAuthSuccess;
