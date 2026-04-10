import React from "react";
import { Alert } from "antd";

/**
 * Reusable error alert component
 */
const ErrorAlert = ({ error, onClose, style, ...props }) => {
  if (!error) return null;

  return (
    <Alert
      message={error}
      type="error"
      showIcon
      closable={!!onClose}
      onClose={onClose}
      style={{ marginBottom: 16, ...style }}
      {...props}
    />
  );
};

export default ErrorAlert;

