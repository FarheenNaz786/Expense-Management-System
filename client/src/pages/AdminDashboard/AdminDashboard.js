import React, { useState, useMemo, useEffect } from "react";
import { Table, Modal, Card, Statistic, Tag, Button, message, Input, Spin, Dropdown, Select, Alert } from "antd";
import {
  UserOutlined,
  DollarOutlined,
  EyeOutlined,
  PhoneOutlined,
  MailOutlined,
  CalendarOutlined,
  HomeOutlined,
  TrophyOutlined,
  ManOutlined,
  WomanOutlined,
  DashboardOutlined,
  LogoutOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  SearchOutlined,
  ProfileOutlined,
  DownOutlined,
  StopOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import axios from "axios";
import { BASE_URL } from "../../utils/baseURL";
import { getResponseError } from "../../utils/getResponseError";
import OTPInput from "../../components/OTPInput";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [userIdFilter, setUserIdFilter] = useState("");
  const [emailFilter, setEmailFilter] = useState("");
  const [isVerifiedFilter, setIsVerifiedFilter] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [adminProfile, setAdminProfile] = useState(null);
  const [isProfileModalVisible, setIsProfileModalVisible] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);
  const [isEditingPhone, setIsEditingPhone] = useState(false);
  const [phoneValue, setPhoneValue] = useState("");
  const [phoneOTPModalVisible, setPhoneOTPModalVisible] = useState(false);
  const [phoneOTPSent, setPhoneOTPSent] = useState(false);
  const [phoneOTP, setPhoneOTP] = useState("");
  const [sendingPhoneOTP, setSendingPhoneOTP] = useState(false);
  const [verifyingPhoneOTP, setVerifyingPhoneOTP] = useState(false);
  const [phoneOTPError, setPhoneOTPError] = useState(null);
  const [tempPhoneNumber, setTempPhoneNumber] = useState("");
  const [isDeactivateModalVisible, setIsDeactivateModalVisible] = useState(false);
  const [deactivating, setDeactivating] = useState(false);
  const [isLogoutModalVisible, setIsLogoutModalVisible] = useState(false);
  const [summaryStats, setSummaryStats] = useState({
    totalUsers: 0,
    totalTurnover: 0,
  });
  const navigate = useNavigate();

  // Check if admin is logged in and fetch dashboard data
  useEffect(() => {
    // Check if admin is logged in
    const adminData = localStorage.getItem("admin");
    if (!adminData) {
      message.error("Please login to access the dashboard");
      navigate("/admin/login");
      return;
    }

    const admin = JSON.parse(adminData);
    if (!admin || !admin.adminId) {
      message.error("Invalid admin session");
      localStorage.removeItem("admin");
      navigate("/admin/login");
      return;
    }

    const fetchDashboardData = async () => {
      try {

        setLoading(true);
        const { data } = await axios.post(`${BASE_URL}/api/v1/admin/dashboard`, {
          adminId: admin.adminId,
        });

        if (data.status === "success") {
          setUsers(data.data.users || []);
          setSummaryStats({
            totalUsers: data.data.summary.totalUsers || 0,
            totalTurnover: data.data.summary.totalTurnover || 0,
          });
        } else {
          message.error(data.message || "Failed to fetch dashboard data");
        }
      } catch (error) {
        console.error("Dashboard data fetch error:", error);
        const errorMessage = getResponseError(error);
        message.error(errorMessage || "Failed to fetch dashboard data");
        
        // If unauthorized, redirect to login
        if (error.response?.status === 401) {
          localStorage.removeItem("admin");
          navigate("/admin/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [navigate]);

  // Filter users based on search text and column filters
  const filteredUsers = useMemo(() => {
    let filtered = users;

    // Apply column filters first
    if (userIdFilter.trim()) {
      filtered = filtered.filter((user) =>
        user.userId?.toLowerCase().includes(userIdFilter.toLowerCase().trim())
      );
    }

    if (emailFilter.trim()) {
      filtered = filtered.filter((user) =>
        user.email?.toLowerCase().includes(emailFilter.toLowerCase().trim())
      );
    }

    if (isVerifiedFilter !== null) {
      filtered = filtered.filter((user) => user.isVerified === isVerifiedFilter);
    }

    // Apply search text filter
    if (searchText.trim()) {
      const searchLower = searchText.toLowerCase().trim();
      filtered = filtered.filter((user) => {
        // Search across all user attributes
        const userId = user.userId?.toLowerCase() || "";
        const email = user.email?.toLowerCase() || "";
        const phone = user.phone?.toLowerCase() || "";
        const isVerified = user.isVerified ? "verified" : "not verified";
        const createdDate = moment(user.createdDate).format("DD MMM YYYY, HH:mm").toLowerCase();
        const totalTurnover = user.totalTurnover?.toString() || "";
        const name = user.name?.toLowerCase() || "";
        const address = user.address?.toLowerCase() || "";
        const favoriteSport = user.favoriteSport?.toLowerCase() || "";
        const gender = user.gender?.toLowerCase() || "";
        const registeredWith = user.registeredWith?.toLowerCase() || "";

        return (
          userId.includes(searchLower) ||
          email.includes(searchLower) ||
          phone.includes(searchLower) ||
          isVerified.includes(searchLower) ||
          createdDate.includes(searchLower) ||
          totalTurnover.includes(searchLower) ||
          name.includes(searchLower) ||
          address.includes(searchLower) ||
          favoriteSport.includes(searchLower) ||
          gender.includes(searchLower) ||
          registeredWith.includes(searchLower)
        );
      });
    }

    return filtered;
  }, [users, searchText, userIdFilter, emailFilter, isVerifiedFilter]);

  // Handle row click to show user details
  const handleRowClick = (record) => {
    setSelectedUser(record);
    setIsModalVisible(true);
  };

  // Handle admin logout - show confirmation modal
  const handleLogout = () => {
    setIsLogoutModalVisible(true);
  };

  // Confirm logout and perform actual logout
  const confirmLogout = () => {
    // Remove admin session from localStorage
    localStorage.removeItem("admin");
    message.success("Logged out from Admin Dashboard successfully");
    // Navigate to home page
    navigate("/");
  };

  // Handle view admin profile
  const handleViewProfile = async () => {
    try {
      const adminData = localStorage.getItem("admin");
      if (!adminData) {
        message.error("Please login to view profile");
        navigate("/admin/login");
        return;
      }

      const admin = JSON.parse(adminData);
      if (!admin || !admin.adminId) {
        message.error("Invalid admin session");
        localStorage.removeItem("admin");
        navigate("/admin/login");
        return;
      }

      setProfileLoading(true);
      const { data } = await axios.post(`${BASE_URL}/api/v1/admin/profile`, {
        adminId: admin.adminId,
      });

      if (data.status === "success") {
        setAdminProfile(data.admin);
        setPhoneValue(data.admin.phone !== "Not Provided" ? data.admin.phone : "");
        setIsProfileModalVisible(true);
      } else {
        message.error(data.message || "Failed to fetch admin profile");
      }
    } catch (error) {
      console.error("Profile fetch error:", error);
      const errorMessage = getResponseError(error);
      message.error(errorMessage || "Failed to fetch admin profile");
      
      if (error.response?.status === 401) {
        localStorage.removeItem("admin");
        navigate("/admin/login");
      }
    } finally {
      setProfileLoading(false);
    }
  };

  // Handle update phone number - triggers OTP flow
  const handleUpdatePhone = async () => {
    const fieldValue = phoneValue.trim() || "";
    if (fieldValue === "" || fieldValue === "Not Provided") {
      message.warning("Please enter a valid phone number");
      return;
    }

    // Validate phone number format
    const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/;
    if (!phoneRegex.test(fieldValue)) {
      message.warning("Please enter a valid phone number format");
      return;
    }

    setTempPhoneNumber(fieldValue);
    setPhoneOTPModalVisible(true);
    setPhoneOTPSent(false);
    setPhoneOTP("");
    setPhoneOTPError(null);
  };

  // Send OTP for admin phone verification
  const handleSendAdminPhoneOTP = async () => {
    try {
      const adminData = localStorage.getItem("admin");
      if (!adminData) {
        message.error("Please login to update profile");
        navigate("/admin/login");
        return;
      }

      const admin = JSON.parse(adminData);
      if (!admin || !admin.adminId) {
        message.error("Invalid admin session");
        localStorage.removeItem("admin");
        navigate("/admin/login");
        return;
      }

      setSendingPhoneOTP(true);
      setPhoneOTPError(null);

      const { data } = await axios.post(`${BASE_URL}/api/v1/admin/send-phone-otp`, {
        adminId: admin.adminId,
        phoneNumber: tempPhoneNumber,
      });

      if (data.status === "success") {
        setPhoneOTPSent(true);
        message.success("OTP sent successfully to your phone number!");
      } else {
        setPhoneOTPError(data.message || "Failed to send OTP");
        message.error(data.message || "Failed to send OTP");
      }
    } catch (error) {
      console.error("Send phone OTP error:", error);
      const errorMessage = getResponseError(error);
      setPhoneOTPError(errorMessage);
      message.error(errorMessage || "Failed to send OTP. Please try again.");
      
      if (error.response?.status === 401) {
        localStorage.removeItem("admin");
        navigate("/admin/login");
      }
    } finally {
      setSendingPhoneOTP(false);
    }
  };

  // Verify admin phone OTP
  const handleVerifyAdminPhoneOTP = async () => {
    if (phoneOTP.length !== 6) {
      setPhoneOTPError("Please enter a valid 6-digit OTP");
      return;
    }

    try {
      const adminData = localStorage.getItem("admin");
      if (!adminData) {
        message.error("Please login to update profile");
        navigate("/admin/login");
        return;
      }

      const admin = JSON.parse(adminData);
      if (!admin || !admin.adminId) {
        message.error("Invalid admin session");
        localStorage.removeItem("admin");
        navigate("/admin/login");
        return;
      }

      setVerifyingPhoneOTP(true);
      setPhoneOTPError(null);

      const { data } = await axios.post(`${BASE_URL}/api/v1/admin/verify-phone-otp`, {
        adminId: admin.adminId,
        phoneNumber: tempPhoneNumber,
        otp: phoneOTP,
      });

      if (data.status === "success") {
        setAdminProfile(data.admin);
        setIsEditingPhone(false);
        setPhoneOTPModalVisible(false);
        setPhoneOTPSent(false);
        setPhoneOTP("");
        setTempPhoneNumber("");
        setPhoneValue("");
        message.success("Phone number verified and updated successfully!");
      } else {
        setPhoneOTPError(data.message || "Invalid OTP");
        message.error(data.message || "Invalid OTP. Please try again.");
      }
    } catch (error) {
      console.error("Verify phone OTP error:", error);
      const errorMessage = getResponseError(error);
      setPhoneOTPError(errorMessage);
      message.error(errorMessage || "Invalid OTP. Please try again.");
      
      if (error.response?.status === 401) {
        localStorage.removeItem("admin");
        navigate("/admin/login");
      }
    } finally {
      setVerifyingPhoneOTP(false);
    }
  };

  // Cancel phone OTP verification
  const handleCancelPhoneOTP = () => {
    setPhoneOTPModalVisible(false);
    setPhoneOTPSent(false);
    setPhoneOTP("");
    setTempPhoneNumber("");
    setPhoneOTPError(null);
    setPhoneValue(adminProfile?.phone !== "Not Provided" ? adminProfile.phone : "");
  };

  // Handle cancel edit phone
  const handleCancelEditPhone = () => {
    setPhoneValue(adminProfile?.phone !== "Not Provided" ? adminProfile.phone : "");
    setIsEditingPhone(false);
  };

  // Handle deactivate account
  const handleDeactivateAccount = () => {
    setIsDeactivateModalVisible(true);
  };

  // Confirm deactivation
  const confirmDeactivateAccount = async () => {
    try {
      const adminData = localStorage.getItem("admin");
      if (!adminData) {
        message.error("Please login to deactivate account");
        navigate("/admin/login");
        return;
      }

      const admin = JSON.parse(adminData);
      if (!admin || !admin.adminId) {
        message.error("Invalid admin session");
        localStorage.removeItem("admin");
        navigate("/admin/login");
        return;
      }

      setDeactivating(true);
      const { data } = await axios.put(`${BASE_URL}/api/v1/admin/deactivate`, {
        adminId: admin.adminId,
      });

      if (data.status === "success") {
        message.success("Your account has been deactivated successfully");
        setIsDeactivateModalVisible(false);
        // Clear session and redirect to login
        localStorage.removeItem("admin");
        setTimeout(() => {
          navigate("/admin/login");
        }, 1500);
      } else {
        message.error(data.message || "Failed to deactivate account");
      }
    } catch (error) {
      console.error("Deactivate account error:", error);
      const errorMessage = getResponseError(error);
      message.error(errorMessage || "Failed to deactivate account");
      
      if (error.response?.status === 401) {
        localStorage.removeItem("admin");
        navigate("/admin/login");
      }
    } finally {
      setDeactivating(false);
    }
  };

  // Table columns
  const columns = [
    {
      title: "User ID",
      dataIndex: "userId",
      key: "userId",
      width: 120,
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div style={{ padding: 8 }}>
          <Input
            placeholder="Filter User ID"
            value={selectedKeys[0]}
            onChange={(e) => {
              setSelectedKeys(e.target.value ? [e.target.value] : []);
              setUserIdFilter(e.target.value || "");
            }}
            onPressEnter={confirm}
            style={{ marginBottom: 8, display: "block" }}
          />
          <div style={{ display: "flex", gap: 8 }}>
            <Button type="primary" onClick={confirm} size="small" style={{ width: 90 }}>
              Search
            </Button>
            <Button onClick={() => { clearFilters(); setUserIdFilter(""); }} size="small" style={{ width: 90 }}>
              Reset
            </Button>
          </div>
        </div>
      ),
      filterIcon: (filtered) => (
        <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
      ),
      render: (text) => <Tag color="blue">{text}</Tag>,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: 200,
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div style={{ padding: 8 }}>
          <Input
            placeholder="Filter Email"
            value={selectedKeys[0]}
            onChange={(e) => {
              setSelectedKeys(e.target.value ? [e.target.value] : []);
              setEmailFilter(e.target.value || "");
            }}
            onPressEnter={confirm}
            style={{ marginBottom: 8, display: "block" }}
          />
          <div style={{ display: "flex", gap: 8 }}>
            <Button type="primary" onClick={confirm} size="small" style={{ width: 90 }}>
              Search
            </Button>
            <Button onClick={() => { clearFilters(); setEmailFilter(""); }} size="small" style={{ width: 90 }}>
              Reset
            </Button>
          </div>
        </div>
      ),
      filterIcon: (filtered) => (
        <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
      ),
      render: (text) => (
        <span>
          <MailOutlined style={{ marginRight: 8, color: "#667eea" }} />
          {text}
        </span>
      ),
    },
    {
      title: "Registered With",
      dataIndex: "registeredWith",
      key: "registeredWith",
      width: 130,
      render: (text) => (
        <Tag color="blue">
          {text || "EMAIL"}
        </Tag>
      ),
      filters: [{ text: "EMAIL", value: "EMAIL" }],
      onFilter: (value, record) => record.registeredWith === value,
    },
    {
      title: "isVerified",
      dataIndex: "isVerified",
      key: "isVerified",
      width: 120,
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => {
        const { Option } = Select;
        return (
          <div style={{ padding: 8 }}>
            <Select
              placeholder="Select Status"
              value={selectedKeys[0] !== undefined ? selectedKeys[0] : undefined}
              onChange={(value) => {
                setSelectedKeys(value !== undefined && value !== null ? [value] : []);
                setIsVerifiedFilter(value !== undefined && value !== null ? value : null);
              }}
              style={{ width: "100%", marginBottom: 8 }}
              allowClear
            >
              <Option value={true}>Verified</Option>
              <Option value={false}>Not Verified</Option>
            </Select>
            <div style={{ display: "flex", gap: 8 }}>
              <Button type="primary" onClick={confirm} size="small" style={{ width: 90 }}>
                Search
              </Button>
              <Button onClick={() => { clearFilters(); setIsVerifiedFilter(null); }} size="small" style={{ width: 90 }}>
                Reset
              </Button>
            </div>
          </div>
        );
      },
      filterIcon: (filtered) => (
        <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
      ),
      render: (isVerified) => (
        <Tag color={isVerified ? "green" : "red"}>
          {isVerified ? (
            <>
              <CheckCircleOutlined style={{ marginRight: 4 }} />
              Verified
            </>
          ) : (
            <>
              <CloseCircleOutlined style={{ marginRight: 4 }} />
              Not Verified
            </>
          )}
        </Tag>
      ),
    },
    {
      title: "Created Date & Time",
      dataIndex: "createdDate",
      key: "createdDate",
      width: 200,
      render: (text) => (
        <span>
          <CalendarOutlined style={{ marginRight: 8, color: "#667eea" }} />
          {text ? moment(text).format("DD MMM YYYY, HH:mm") : "N/A"}
        </span>
      ),
      sorter: (a, b) => moment(a.createdDate).unix() - moment(b.createdDate).unix(),
    },
    {
      title: "Total Turnover",
      dataIndex: "totalTurnover",
      key: "totalTurnover",
      width: 150,
      render: (text) => (
        <span style={{ fontWeight: 600, color: "#667eea" }}>
          ₹{(text || 0).toLocaleString("en-IN")}
        </span>
      ),
      sorter: (a, b) => (a.totalTurnover || 0) - (b.totalTurnover || 0),
    },
    {
      title: "Action",
      key: "action",
      width: 120,
      render: (_, record) => (
        <Button
          type="primary"
          icon={<EyeOutlined />}
          onClick={(e) => {
            e.stopPropagation();
            handleRowClick(record);
          }}
          size="small"
          className="view-details-button"
        >
          View
        </Button>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="admin-dashboard-wrapper">
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
          <Spin size="large" tip="Loading dashboard data..." />
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard-wrapper">
      {/* Admin Dashboard Header */}
      <div className="admin-dashboard-header">
        <div className="admin-header-content">
          <div className="admin-header-left">
            <DashboardOutlined className="admin-header-icon" />
            <div className="admin-header-text">
              <h1 className="admin-header-title">Admin Dashboard</h1>
              <p className="admin-header-subtitle">for Expense Management System</p>
            </div>
          </div>
          <div className="admin-header-buttons">
            <Dropdown
              menu={{
                items: [
                  {
                    key: "profile",
                    label: (
                      <div className="admin-dropdown-menu-item">
                        <ProfileOutlined className="admin-dropdown-icon profile-icon" />
                        <span>Admin Profile</span>
                      </div>
                    ),
                    onClick: handleViewProfile,
                  },
                  {
                    type: "divider",
                    className: "admin-dropdown-divider",
                  },
                  {
                    key: "deactivate",
                    label: (
                      <div className="admin-dropdown-menu-item deactivate-item">
                        <StopOutlined className="admin-dropdown-icon deactivate-icon" />
                        <span>Deactivate Account</span>
                      </div>
                    ),
                    onClick: handleDeactivateAccount,
                  },
                ],
              }}
              trigger={["click"]}
              placement="bottomRight"
              overlayClassName="admin-profile-dropdown"
            >
              <Button
                type="default"
                icon={<ProfileOutlined />}
                size="large"
                className="admin-profile-button"
                loading={profileLoading}
                title="Admin Profile Menu"
              >
                Admin Profile <DownOutlined style={{ fontSize: "12px", marginLeft: "4px" }} />
              </Button>
            </Dropdown>
            <Button
              type="primary"
              icon={<LogoutOutlined />}
              size="large"
              className="admin-header-button"
              onClick={handleLogout}
              title="Logout from Dashboard and Go to Expense Management System"
            >
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="admin-dashboard-content">
        <div className="admin-dashboard-container">

          {/* Summary Cards */}
          <div className="admin-summary-cards">
            <Card className="summary-card">
              <Statistic
                title="Total Registered Users"
                value={summaryStats.totalUsers}
                prefix={<UserOutlined />}
                valueStyle={{ color: "#667eea" }}
              />
            </Card>
            <Card className="summary-card">
              <Statistic
                title="Total Turnover (All Users)"
                value={summaryStats.totalTurnover}
                prefix={<DollarOutlined />}
                valueStyle={{ color: "#667eea" }}
                formatter={(value) => `₹${value.toLocaleString("en-IN")}`}
              />
            </Card>
          </div>

          {/* Users Table */}
          <Card className="users-table-card">
            <div className="table-header-with-search">
              <h2 className="table-title">Registered Users</h2>
              <div className="filter-and-count-wrapper">
                <div className="admin-search-bar">
                  <Input
                    placeholder="Search by User ID, Email, Phone, Status, Date, Turnover, Name, etc."
                    allowClear
                    size="large"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    prefix={<SearchOutlined style={{ color: '#667eea', fontSize: '16px' }} />}
                    className="admin-search-input"
                  />
                </div>
                <div className="filtered-row-count">
                  <span className="filtered-count-label">Filtered Results:</span>
                  <span className="filtered-count-value">
                    {filteredUsers.length} {filteredUsers.length === 1 ? 'user' : 'users'}
                    {searchText && filteredUsers.length !== summaryStats.totalUsers && (
                      <span className="total-count"> of {summaryStats.totalUsers} total</span>
                    )}
                  </span>
                </div>
              </div>
            </div>
            <Table
              columns={columns}
              dataSource={filteredUsers}
              rowKey="userId"
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showTotal: (total, range) => 
                  `${range[0]}-${range[1]} of ${total} users${(searchText || userIdFilter || emailFilter || isVerifiedFilter !== null) ? ` (filtered from ${summaryStats.totalUsers} total)` : ''}`,
              }}
              loading={loading}
              onRow={(record) => ({
                onClick: () => handleRowClick(record),
                style: { cursor: "pointer" },
              })}
              className="admin-users-table"
            />
          </Card>

          {/* User Details Modal */}
          <Modal
            title={
              <span>
                <UserOutlined style={{ marginRight: 8 }} />
                User Details
              </span>
            }
            open={isModalVisible}
            onCancel={() => setIsModalVisible(false)}
            footer={[
              <Button key="close" onClick={() => setIsModalVisible(false)}>
                Close
              </Button>,
            ]}
            width={800}
            className="user-details-modal"
          >
            {selectedUser && (
              <div className="user-details-content">
                {/* Basic Information Section - Horizontal Layout */}
                <div className="detail-section-horizontal">
                  <div className="detail-row">
                    <div className="detail-item-horizontal">
                      <span className="detail-label">
                        <Tag color="blue" style={{ marginRight: 8 }}>
                          User ID
                        </Tag>
                      </span>
                      <span className="detail-value">{selectedUser.userId}</span>
                    </div>

                    <div className="detail-item-horizontal">
                      <span className="detail-label">
                        <MailOutlined style={{ marginRight: 8, color: "#667eea" }} />
                        Email
                      </span>
                      <span className="detail-value">{selectedUser.email}</span>
                    </div>
                  </div>

                  <div className="detail-row">
                    <div className="detail-item-horizontal">
                      <span className="detail-label">
                        {selectedUser.isVerified ? (
                          <CheckCircleOutlined style={{ marginRight: 8, color: "#52c41a" }} />
                        ) : (
                          <CloseCircleOutlined style={{ marginRight: 8, color: "#ff4d4f" }} />
                        )}
                        isVerified
                      </span>
                      <span className="detail-value">
                        <Tag color={selectedUser.isVerified ? "green" : "red"}>
                          {selectedUser.isVerified ? (
                            <>
                              <CheckCircleOutlined style={{ marginRight: 4 }} />
                              Verified
                            </>
                          ) : (
                            <>
                              <CloseCircleOutlined style={{ marginRight: 4 }} />
                              Not Verified
                            </>
                          )}
                        </Tag>
                      </span>
                    </div>

                    <div className="detail-item-horizontal">
                      <span className="detail-label">
                        <PhoneOutlined style={{ marginRight: 8, color: "#667eea" }} />
                        Phone Number
                      </span>
                      <span className="detail-value">
                        {selectedUser.phone ? selectedUser.phone : (
                          <Tag color="default">Not Provided</Tag>
                        )}
                      </span>
                    </div>
                  </div>

                  <div className="detail-row">
                    <div className="detail-item-horizontal">
                      <span className="detail-label">
                        <CalendarOutlined style={{ marginRight: 8, color: "#667eea" }} />
                        Registered Date
                      </span>
                      <span className="detail-value">
                        {moment(selectedUser.createdDate).format("DD MMM YYYY")}
                      </span>
                    </div>
                  </div>

                  <div className="detail-row">
                    <div className="detail-item-horizontal">
                      <span className="detail-label">
                        {selectedUser.gender === "Male" ? (
                          <ManOutlined style={{ marginRight: 8, color: "#667eea" }} />
                        ) : selectedUser.gender === "Female" ? (
                          <WomanOutlined style={{ marginRight: 8, color: "#667eea" }} />
                        ) : (
                          <UserOutlined style={{ marginRight: 8, color: "#667eea" }} />
                        )}
                        Gender
                      </span>
                      <span className="detail-value">
                        <Tag color="purple">{selectedUser.gender}</Tag>
                      </span>
                    </div>

                    <div className="detail-item-horizontal">
                      <span className="detail-label">
                        <TrophyOutlined style={{ marginRight: 8, color: "#667eea" }} />
                        Favorite Sport
                      </span>
                      <span className="detail-value">
                        <Tag color="green">{selectedUser.favoriteSport || "Not Provided"}</Tag>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Address Section - Full Width Vertical */}
                <div className="detail-section-vertical">
                  <div className="detail-item-vertical">
                    <span className="detail-label">
                      <HomeOutlined style={{ marginRight: 8, color: "#667eea" }} />
                      Address
                    </span>
                    <span className="detail-value">{selectedUser.address || "Not Provided"}</span>
                  </div>
                </div>

                {/* Financial Information Section - Horizontal Layout */}
                <div className="detail-section-horizontal financial-section">
                  <div className="detail-row">
                    <div className="detail-item-horizontal financial-item">
                      <span className="detail-label">
                        <DollarOutlined style={{ marginRight: 8, color: "#667eea" }} />
                        Total Turnover
                      </span>
                      <span className="detail-value financial-value">
                        <strong style={{ color: "#667eea" }}>
                          ₹{(selectedUser.totalTurnover || 0).toLocaleString("en-IN")}
                        </strong>
                      </span>
                    </div>

                    <div className="detail-item-horizontal financial-item">
                      <span className="detail-label">Total Income</span>
                      <span className="detail-value financial-value" style={{ color: "#52c41a" }}>
                        ₹{(selectedUser.totalIncome || 0).toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>

                  <div className="detail-row">
                    <div className="detail-item-horizontal financial-item full-width">
                      <span className="detail-label">Total Expense</span>
                      <span className="detail-value financial-value" style={{ color: "#ff4d4f" }}>
                        ₹{(selectedUser.totalExpense || 0).toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </Modal>

          {/* Admin Profile Modal */}
          <Modal
            title={
              <span>
                <ProfileOutlined style={{ marginRight: 8 }} />
                Admin Profile
              </span>
            }
            open={isProfileModalVisible}
            onCancel={() => setIsProfileModalVisible(false)}
            footer={[
              <Button key="close" onClick={() => setIsProfileModalVisible(false)}>
                Close
              </Button>,
            ]}
            width={700}
            className="admin-profile-modal"
          >
            {adminProfile && (
              <div className="admin-profile-content">
                <div className="detail-section-horizontal">
                  <div className="detail-row">
                    <div className="detail-item-horizontal">
                      <span className="detail-label">
                        <UserOutlined style={{ marginRight: 8, color: "#667eea" }} />
                        Full Name
                      </span>
                      <span className="detail-value">{adminProfile.name}</span>
                    </div>

                    <div className="detail-item-horizontal">
                      <span className="detail-label">
                        <MailOutlined style={{ marginRight: 8, color: "#667eea" }} />
                        Email Address
                      </span>
                      <span className="detail-value">{adminProfile.email}</span>
                    </div>
                  </div>

                  <div className="detail-row">
                    <div className="detail-item-horizontal full-width">
                      <span className="detail-label">
                        <PhoneOutlined style={{ marginRight: 8, color: "#667eea" }} />
                        Phone Number
                      </span>
                      {isEditingPhone ? (
                        <div className="phone-edit-section">
                          <Input
                            value={phoneValue}
                            onChange={(e) => setPhoneValue(e.target.value)}
                            placeholder="Enter phone number"
                            prefix={<PhoneOutlined style={{ color: "#667eea" }} />}
                            style={{ marginTop: "8px", marginBottom: "8px" }}
                            allowClear
                          />
                          <div className="phone-edit-buttons">
                            <Button
                              type="primary"
                              size="small"
                              onClick={handleUpdatePhone}
                              style={{ marginRight: "8px" }}
                            >
                              Verify
                            </Button>
                            <Button
                              size="small"
                              onClick={handleCancelEditPhone}
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="phone-display-section">
                          <span className="detail-value">
                            {adminProfile.phone !== "Not Provided" ? (
                              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                <span>{adminProfile.phone}</span>
                                {adminProfile.isPhoneVerified ? (
                                  <Tag color="green" icon={<CheckCircleOutlined />}>
                                    Verified
                                  </Tag>
                                ) : (
                                  <Tag color="orange">Not Verified</Tag>
                                )}
                              </div>
                            ) : (
                              <Tag color="default">Not Provided</Tag>
                            )}
                          </span>
                          <Button
                            type="link"
                            size="small"
                            onClick={() => {
                              setIsEditingPhone(true);
                              setPhoneValue(adminProfile?.phone !== "Not Provided" ? adminProfile.phone : "");
                            }}
                            style={{ marginLeft: "8px", padding: 0 }}
                          >
                            {adminProfile.phone !== "Not Provided" ? "Edit" : "Add"}
                          </Button>
                        </div>
                      )}
                    </div>

                    <div className="detail-item-horizontal">
                      <span className="detail-label">
                        {adminProfile.isRequestApproved ? (
                          <CheckCircleOutlined style={{ marginRight: 8, color: "#52c41a" }} />
                        ) : (
                          <CloseCircleOutlined style={{ marginRight: 8, color: "#ff4d4f" }} />
                        )}
                        Request Status
                      </span>
                      <span className="detail-value">
                        <Tag color={adminProfile.isRequestApproved ? "green" : "red"}>
                          {adminProfile.isRequestApproved ? "Approved" : "Pending"}
                        </Tag>
                      </span>
                    </div>
                  </div>

                  <div className="detail-row">
                    <div className="detail-item-horizontal">
                      <span className="detail-label">
                        {adminProfile.isActive ? (
                          <CheckCircleOutlined style={{ marginRight: 8, color: "#52c41a" }} />
                        ) : (
                          <CloseCircleOutlined style={{ marginRight: 8, color: "#ff4d4f" }} />
                        )}
                        Account Status
                      </span>
                      <span className="detail-value">
                        <Tag color={adminProfile.isActive ? "green" : "red"}>
                          {adminProfile.isActive ? "Active" : "Inactive"}
                        </Tag>
                      </span>
                    </div>

                    <div className="detail-item-horizontal">
                      <span className="detail-label">
                        <CalendarOutlined style={{ marginRight: 8, color: "#667eea" }} />
                        Account Created
                      </span>
                      <span className="detail-value">
                        {moment(adminProfile.createdAt).format("DD MMM YYYY, HH:mm")}
                      </span>
                    </div>
                  </div>

                  {adminProfile.lastLogin && (
                    <div className="detail-row">
                      <div className="detail-item-horizontal full-width">
                        <span className="detail-label">
                          <CalendarOutlined style={{ marginRight: 8, color: "#667eea" }} />
                          Last Login
                        </span>
                        <span className="detail-value">
                          {moment(adminProfile.lastLogin).format("DD MMM YYYY, HH:mm")}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </Modal>

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
                Are you sure you want to logout from the Admin Dashboard?
              </p>
            </div>
          </Modal>

          {/* Deactivate Account Confirmation Modal */}
          <Modal
            title={
              <span style={{ color: "#ff4d4f" }}>
                <ExclamationCircleOutlined style={{ marginRight: 8, color: "#ff4d4f" }} />
                Deactivate Account
              </span>
            }
            open={isDeactivateModalVisible}
            onCancel={() => !deactivating && setIsDeactivateModalVisible(false)}
            footer={[
              <Button
                key="cancel"
                onClick={() => setIsDeactivateModalVisible(false)}
                disabled={deactivating}
              >
                Cancel
              </Button>,
              <Button
                key="confirm"
                type="primary"
                danger
                onClick={confirmDeactivateAccount}
                loading={deactivating}
              >
                Yes, Deactivate My Account
              </Button>,
            ]}
            width={500}
            className="deactivate-account-modal"
          >
            <div style={{ padding: "20px 0" }}>
              <p style={{ fontSize: "16px", marginBottom: "16px", fontWeight: 500 }}>
                Are you sure you want to deactivate your admin account?
              </p>
              <div style={{ background: "#fff7e6", border: "1px solid #ffd591", borderRadius: "8px", padding: "16px", marginBottom: "16px" }}>
                <p style={{ margin: 0, color: "#d46b08", fontSize: "14px" }}>
                  <strong>Warning:</strong> Once deactivated, you will not be able to:
                </p>
                <ul style={{ margin: "8px 0 0 0", paddingLeft: "20px", color: "#d46b08", fontSize: "14px" }}>
                  <li>Login to the admin dashboard</li>
                  <li>Access any admin features</li>
                  <li>View user data or statistics</li>
                </ul>
                <p style={{ margin: "12px 0 0 0", color: "#d46b08", fontSize: "14px" }}>
                  You will be logged out immediately after deactivation.
                </p>
              </div>
              <p style={{ fontSize: "14px", color: "#666", margin: 0 }}>
                If you want to reactivate your account later, please contact the system administrator.
              </p>
            </div>
          </Modal>

          {/* Phone OTP Verification Modal */}
          <Modal
            title={
              <span>
                <PhoneOutlined style={{ marginRight: 8, color: "#667eea" }} />
                Verify Phone Number
              </span>
            }
            open={phoneOTPModalVisible}
            onCancel={handleCancelPhoneOTP}
            footer={null}
            width={500}
            closable={!sendingPhoneOTP && !verifyingPhoneOTP}
            maskClosable={!sendingPhoneOTP && !verifyingPhoneOTP}
          >
            <div style={{ padding: "20px 0" }}>
              {!phoneOTPSent ? (
                <>
                  <p style={{ marginBottom: "16px", fontSize: "15px" }}>
                    We will send an OTP to <strong>{tempPhoneNumber}</strong> to verify your phone number.
                  </p>
                  {phoneOTPError && (
                    <Alert
                      message={phoneOTPError}
                      type="error"
                      showIcon
                      style={{ marginBottom: "16px" }}
                    />
                  )}
                  <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
                    <Button onClick={handleCancelPhoneOTP} disabled={sendingPhoneOTP}>
                      Cancel
                    </Button>
                    <Button
                      type="primary"
                      onClick={handleSendAdminPhoneOTP}
                      loading={sendingPhoneOTP}
                      icon={<PhoneOutlined />}
                    >
                      Send OTP
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <p style={{ marginBottom: "16px", fontSize: "15px" }}>
                    Enter the 6-digit OTP sent to <strong>{tempPhoneNumber}</strong>:
                  </p>
                  <div style={{ display: "flex", justifyContent: "center", marginBottom: "16px" }}>
                    <OTPInput
                      otp={phoneOTP.split("")}
                      onChange={(otp) => setPhoneOTP(otp)}
                    />
                  </div>
                  {phoneOTPError && (
                    <Alert
                      message={phoneOTPError}
                      type="error"
                      showIcon
                      style={{ marginBottom: "16px" }}
                    />
                  )}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Button
                      type="link"
                      onClick={handleSendAdminPhoneOTP}
                      loading={sendingPhoneOTP}
                      disabled={sendingPhoneOTP}
                    >
                      Resend OTP
                    </Button>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <Button onClick={handleCancelPhoneOTP} disabled={verifyingPhoneOTP}>
                        Cancel
                      </Button>
                      <Button
                        type="primary"
                        onClick={handleVerifyAdminPhoneOTP}
                        loading={verifyingPhoneOTP}
                        disabled={phoneOTP.length !== 6}
                      >
                        Verify
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
