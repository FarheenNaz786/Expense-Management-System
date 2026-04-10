import React, { useEffect } from "react";
import Header1 from "./Header1";
import { Link, useNavigate } from "react-router-dom";
import Footer from "./Footer";
import "./Home.css";
import homepageImg from "../../../src/Images/homepage-img.png";

const Home = () => {
  const navigate = useNavigate();
  //prevent for login user
  useEffect(() => {
    if (localStorage.getItem("user")) {
      navigate("/user");
    }
  }, [navigate]);
  return (
    <>
      <Header1 />
      <div className="mt-0">
        <div className="home">
          <section className="hero-section">
            <div className="hero">
              <h2>Welcome to Expense Management System</h2>
              <p>
                Welcome to the{" "}
                <span className="app-name">Expense Management System</span> App.
                Take control of your finances with our powerful and intuitive expense tracking platform. 
                Track your income and expenses, analyze spending patterns with beautiful visualizations, 
                and make smarter financial decisions. Manage your money efficiently and achieve your financial goals.
              </p>
              <div className="buttons">
                <Link to="/login" className="join">
                  Join Now
                </Link>

                <Link to="/about-us" className="learn">
                  Learn More
                </Link>
              </div>
            </div>
            <div className="img">
              <img src={homepageImg} alt="homepage-img" />
            </div>
          </section>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Home;
