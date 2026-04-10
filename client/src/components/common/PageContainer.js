import React from "react";
import "./PageContainer.css";

/**
 * Reusable page container component with consistent styling
 */
const PageContainer = ({
  children,
  className = "",
  maxWidth = "1200px",
  padding = true,
}) => {
  return (
    <div
      className={`page-container ${className}`}
      style={{
        maxWidth,
        padding: padding ? "var(--spacing-xl)" : 0,
      }}
    >
      {children}
    </div>
  );
};

export default PageContainer;

