import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <>
      <div className="footer bg-dark text-light p-3">
        <h4 className="text-center">
          All rights reserved
        </h4>
        <p className="text-center mt-3">
          <a
            target="_blank"
            rel="noopener noreferrer"
          >
            About
          </a>
          |<Link to="/contact-us">Contact</Link>|
          <Link to="/privacy-policy">Privacy Policy</Link>
        </p>
      </div>
    </>
  );
};

export default Footer;
