import React from "react";
import { Alert } from "antd";

/**
 * Reusable success alert component
 */
const SuccessAlert = ({ message: messageText, onClose, style, ...props }) => {
  if (!messageText) return null;

  return (
    <Alert
      message={messageText}
      type="success"
      showIcon
      closable={!!onClose}
      onClose={onClose}
      style={{ marginBottom: 16, ...style }}
      {...props}
    />
  );
};

export default SuccessAlert;

