import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  UserOutlined,
  DownOutlined,
  EditOutlined,
  PoweroffOutlined,
  LogoutOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { Dropdown, message, Button, Modal } from "antd";
import "../../styles/HeaderStyles.css";
import logo from "../../../src/Images/logo.png";
const Header = () => {
  const [loginUser, setLoginUser] = useState("");
  const [isLogoutModalVisible, setIsLogoutModalVisible] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      setLoginUser(user);
    }
  }, []);

  // Handle user logout - show confirmation modal
  const logoutHandler = () => {
    setIsLogoutModalVisible(true);
  };

  // Confirm logout and perform actual logout
  const confirmLogout = () => {
    localStorage.removeItem("user");
    message.success("Logout Successfully");
    navigate("/");
  };

  const items = [
    {
      label: <Link to="/user/user-profile">My Profile</Link>,
      key: "1",
      icon: <UserOutlined />,
      link: "/login",
    },
    {
      label: <Link to="/user/change-password">Change Password</Link>,
      key: "2",
      icon: <EditOutlined />,
    },
    {
      type: "divider",
    },
    {
      label: (
        <div 
          className="logout-menu-item"
          onClick={logoutHandler}
        >
          <LogoutOutlined />
          <span>Logout</span>
        </div>
      ),
      key: "3",
      danger: true,
    },
  ];
  const menuProps = {
    items,
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg bg-dark sticky-top">
        <Link className="navbar-brand" to="/user">
          <img src={logo} alt="logo" />
          Expense Management System
        </Link>
        <div className="container-fluid">
          <button
            className="responsive-btn navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarToggleExternalContent"
            aria-controls="navbarToggleExternalContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon align-end" />
          </button>
          <div
            className="collapse navbar-collapse"
            id="navbarToggleExternalContent"
          >
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0 ">
              <li className="nav-item">
                <h6 className="nav-link">
                  <Button className="nav-item home-btn">
                    <Link to="/user" style={{ color: 'inherit', textDecoration: 'none' }}>Home</Link>
                  </Button>
                </h6>
              </li>
              <li className="nav-item">
                {" "}
                <h6 className="nav-link ">
                  <Dropdown.Button
                    menu={menuProps}
                    placement="bottom"
                    // icon={<UserOutlined />}
                    icon={<DownOutlined />}
                  >
                    {loginUser && loginUser.name}
                  </Dropdown.Button>
                </h6>{" "}
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Logout Confirmation Modal */}
      <Modal
        title={
          <span style={{ color: "#ff4d4f" }}>
            <ExclamationCircleOutlined style={{ marginRight: 8, color: "#ff4d4f" }} />
            Confirm Logout
          </span>
        }
        open={isLogoutModalVisible}
        onCancel={() => setIsLogoutModalVisible(false)}
        footer={[
          <Button
            key="cancel"
            onClick={() => setIsLogoutModalVisible(false)}
          >
            Cancel
          </Button>,
          <Button
            key="logout"
            type="primary"
            danger
            icon={<LogoutOutlined />}
            onClick={confirmLogout}
          >
            Logout
          </Button>,
        ]}
        width={500}
        className="logout-confirmation-modal"
      >
        <div style={{ padding: "10px 0" }}>
          <p style={{ fontSize: "15px", marginBottom: "0", fontWeight: 500 }}>
            Are you sure you want to logout from the Expense Management System?
          </p>
        </div>
      </Modal>
    </>
  );
};

export default Header;
