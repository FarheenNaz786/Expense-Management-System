import React, { useState, useEffect } from "react";
import { Form, Input, message, Alert, Checkbox } from "antd";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/RegisterPage.css";
import { getResponseError } from "../utils/getResponseError";
import { BASE_URL } from "../utils/baseURL";
import {
  LoadingOutlined,
  LockOutlined,
  MailOutlined,
  PhoneFilled,
  UserOutlined,
} from "@ant-design/icons";
import Footer from "../components/Layout/Footer";
import Header1 from "../components/Layout/Header1";

const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [registerError, setRegisterError] = useState(null);
  const [responseMessage, setResponseMessage] = useState(null);
  //from submit
  const submitHandler = async (values) => {
    try {
      // validate all frontend validation
      // Email validation
      if (!values.email.includes("@") || !values.email.includes(".")) {
        setRegisterError(
          "Please enter a valid email address. Include '@' and ' . '"
        );
        return;
      }
      // Phone number is optional here but if provided then if firt digit is 0 then it should be 11 digits long and if not then it should be 10 digits long only
      if (values.phoneNumber) {
        if (values.phoneNumber.length < 10) {
          setRegisterError("Phone number must be atleast 10 digits long...!");
          return;
        }
        if (values.phoneNumber[0] === "0" && values.phoneNumber.length !== 11) {
          setRegisterError(
            "Phone number must be 11 digits long if it starts with 0...!"
          );
          return;
        }
        if (values.phoneNumber[0] !== "0" && values.phoneNumber.length !== 10) {
          setRegisterError(
            "Phone number must be 10 digits long if it does not start with 0...!"
          );
          return;
        }
        if (isNaN(values.phoneNumber)) {
          setRegisterError("Phone number must be a number...!");
          return;
        }
      }
      
      // Password validation
      if (values.password.length < 8) {
        setRegisterError("Password must be atleast 8 characters long...!");
        return;
      }

      if (values.password !== values.confirmPassword) {
        setRegisterError("Password and confirm password should be same...!");
        return;
      }

      setLoading(true);
      const { data } = await axios.post(`${BASE_URL}/api/v1/users/register`, values);
      setLoading(false);
      message.success("Registration Successful");
      
      // Direct login after signup
      localStorage.setItem("user", JSON.stringify({ 
        ...data.newUser, 
        registeredWith: data.registeredWith || "EMAIL" 
      }));

      setResponseMessage(
        "Successfully Registered."
      );
      setRegisterError(null);
      setTimeout(() => {
        navigate("/user");
      }, 1000);
    } catch (error) {
      setLoading(false);
      setResponseMessage(null);
      setRegisterError(getResponseError(error));
      message.error("Something went wrong");
    }
  };

  //prevent for login user
  useEffect(() => {
    if (localStorage.getItem("user")) {
      navigate("/user");
    }
  }, [navigate]);
  return (
    <div className="auth-page-wrapper">
      <Header1 />
      <div className="register-content">
        <div className="register-page">
          <div className="col-md-5 register-form">
            <Form
              layout="vertical"
              initialValues={{
                remember: true,
              }}
              onFinish={submitHandler}
              autoComplete="off"
            >
              <h2 className="header-name">Sign Up</h2>

              <Form.Item
                label="Name"
                name="name"
                rules={[
                  {
                    required: true,
                    message: "Please enter your name...!",
                  },
                ]}
              >
                <Input
                  prefix={<UserOutlined />}
                  className="form-input"
                  type="text"
                  placeholder="Please enter your name"
                  size="large"
                />
              </Form.Item>
              <Form.Item
                label="Email"
                name="email"
                rules={[
                  {
                    required: true,
                    message: "Please enter your valid eamil...!",
                  },
                ]}
              >
                <Input
                  prefix={<MailOutlined />}
                  className="form-input"
                  type="text"
                  placeholder="Enter your valid email address"
                  size="large"
                />
              </Form.Item>
              <Form.Item
                label="Phone Number"
                name="phoneNumber"
                rules={[
                  {
                    required: false,
                    message: "Enter your phone number...!",
                  },
                ]}
              >
                <Input
                  prefix={<PhoneFilled />}
                  className="form-input"
                  type="number"
                  placeholder="Phone Number"
                  size="large"
                />
              </Form.Item>
              <Form.Item
                label="Password"
                name="password"
                rules={[
                  {
                    required: true,
                    message: "Password must be a strong password...!",
                  },
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  className="form-input"
                  type="password"
                  placeholder="Create password"
                  size="large"
                />
              </Form.Item>
              <Form.Item
                label="Confirm Password"
                name="confirmPassword"
                rules={[
                  {
                    required: true,
                    message: "Password must be a strong password...!",
                  },
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  className="form-input"
                  type="password"
                  placeholder="Re-enter password"
                  size="large"
                />
              </Form.Item>

              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox>
                  I agree to the{" "}
                  <Link className="link link1" to="/terms-conditions">
                    Terms & Conditions
                  </Link>{" "}
                  and{" "}
                  <Link className="link link1" to="/privacy-policy">
                    Privacy policy
                  </Link>
                  .
                </Checkbox>
              </Form.Item>

              {registerError && (
                <Alert
                  message={registerError}
                  type="error"
                  showIcon
                  style={{ marginTop: 10 }}
                />
              )}
              {responseMessage && (
                <Alert
                  message={responseMessage}
                  type="success"
                  showIcon
                  style={{ marginTop: 10 }}
                />
              )}

              <div className="button pb-0 mt-0 d-flex justify-content-center">
                <button className="btn" disabled={loading}>
                  {loading ? <LoadingOutlined /> : "Sign Up"}
                </button>
              </div>
              <div className="pt-2 d-flex justify-content-center">
                <div className="text">
                  Already Registered?
                  <Link to="/login">Login!</Link>
                </div>
              </div>
            </Form>

            <div className="line"></div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Register;
