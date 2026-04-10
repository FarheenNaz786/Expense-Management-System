import React, { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Result } from "antd";
import { HomeOutlined } from "@ant-design/icons";
import Footer from "../components/Layout/Footer";
import Header1 from "../components/Layout/Header1";
import "./PageNotFound.css";

const PageNotFound = () => {
  const navigate = useNavigate();

  const handleGoHome = useCallback(() => {
    navigate("/");
  }, [navigate]);

  const handleGoLogin = useCallback(() => {
    navigate("/login");
  }, [navigate]);

  return (
    <>
      <Header1 />
      <div className="page-not-found-container">
        <Result
          status="404"
          title={
            <span className="page-not-found-title">404</span>
          }
          subTitle={
            <span className="page-not-found-subtitle">
              Sorry, the page you visited does not exist.
            </span>
          }
          extra={[
            <Button
              type="primary"
              icon={<HomeOutlined />}
              onClick={handleGoHome}
              key="home"
              size="large"
              style={{
                marginRight: "1rem",
              }}
            >
              Go Home
            </Button>,
            <Button
              onClick={handleGoLogin}
              key="login"
              size="large"
            >
              Back to Login
            </Button>,
          ]}
        />
      </div>
      <Footer />
    </>
  );
};

export default PageNotFound;
