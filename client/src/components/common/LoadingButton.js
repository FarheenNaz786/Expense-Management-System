import React from "react";
import { Button } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

/**
 * Reusable loading button component
 */
const LoadingButton = ({
  loading,
  children,
  icon,
  onClick,
  type = "primary",
  htmlType = "button",
  disabled,
  className,
  style,
  ...props
}) => {
  return (
    <Button
      type={type}
      htmlType={htmlType}
      onClick={onClick}
      disabled={loading || disabled}
      className={className}
      style={style}
      icon={loading ? <LoadingOutlined /> : icon}
      {...props}
    >
      {loading ? "Loading..." : children}
    </Button>
  );
};

export default LoadingButton;

