import React from "react";
import Footer from "./Footer";
import Header from "./Header";
import "./Layout.css";

/**
 * Main layout component for authenticated pages
 */
const Layout = ({ children, className = "" }) => {
  return (
    <div className={`layout-wrapper ${className}`}>
      <Header />
      <main className="layout-content">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
