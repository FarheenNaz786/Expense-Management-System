import React from "react";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import "./Spinner.css";

/**
 * Modern loading spinner component
 */
const Spinner = ({ 
  size = "large", 
  tip = "Loading...", 
  fullScreen = false,
  className = "" 
}) => {
  const antIcon = (
    <LoadingOutlined
      style={{
        fontSize: size === "large" ? 48 : size === "small" ? 24 : 32,
        color: "var(--primary-color)",
      }}
      spin
    />
  );

  if (fullScreen) {
    return (
      <div className={`spinner-fullscreen ${className}`}>
        <Spin indicator={antIcon} tip={tip} size={size} />
      </div>
    );
  }

  return (
    <div className={`spinner-container ${className}`}>
      <Spin indicator={antIcon} tip={tip} size={size} />
    </div>
  );
};

export default Spinner;
