import React, { useEffect, useState } from "react";
import Header from "../../components/Layout/Header";
import Footer from "../../components/Layout/Footer";
import { useNavigate } from "react-router-dom";
import { getResponseError } from "../../utils/getResponseError";
import { message, Card, Tag, Button, Input, Select, Spin, Alert, Modal, Form } from "antd";
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  HomeOutlined,
  CalendarOutlined,
  TrophyOutlined,
  ManOutlined,
  WomanOutlined,
  EditOutlined,
  CheckOutlined,
  CloseOutlined,
  ProfileOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  DeleteOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import axios from "axios";
import { BASE_URL } from "../../utils/baseURL";
import moment from "moment";
import OTPInput from "../../components/OTPInput";
import "./UserProfile.css";

const { Option } = Select;

const UserProfile = () => {
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    isPhoneVerified: false,
    address: "",
    birthDate: "",
    favouriteSport: "",
    gender: "Male",
    isVerified: false,
    secondaryEmail: null,
    isSecondaryEmailVerified: false,
    createdAt: null,
  });

  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [userUpdateError, setUserUpdateError] = useState(null);
  const [editingField, setEditingField] = useState(null);
  const [editValues, setEditValues] = useState({});
  
  // Phone OTP states
  const [phoneOTPModalVisible, setPhoneOTPModalVisible] = useState(false);
  const [phoneOTPSent, setPhoneOTPSent] = useState(false);
  const [sendingPhoneOTP, setSendingPhoneOTP] = useState(false);
  const [verifyingPhoneOTP, setVerifyingPhoneOTP] = useState(false);
  const [phoneOTP, setPhoneOTP] = useState("");
  const [phoneOTPError, setPhoneOTPError] = useState(null);
  const [tempPhoneNumber, setTempPhoneNumber] = useState("");

  // Secondary Email states
  const [secondaryEmailModalVisible, setSecondaryEmailModalVisible] = useState(false);
  const [secondaryEmailOTPSent, setSecondaryEmailOTPSent] = useState(false);
  const [sendingSecondaryEmailOTP, setSendingSecondaryEmailOTP] = useState(false);
  const [verifyingSecondaryEmailOTP, setVerifyingSecondaryEmailOTP] = useState(false);
  const [secondaryEmailOTP, setSecondaryEmailOTP] = useState("");
  const [secondaryEmailOTPError, setSecondaryEmailOTPError] = useState(null);
  const [tempSecondaryEmail, setTempSecondaryEmail] = useState("");
  const [removingSecondaryEmail, setRemovingSecondaryEmail] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        setLoading(true);
        setUserUpdateError(null);

        const response = await axios.get(
          `${BASE_URL}/api/v1/users/logged-user`,
          {
            headers: {
              Authorization: `Bearer ${
                JSON.parse(localStorage.getItem("user")).token
              }`,
            },
          }
        );

        setUserData((prev) => ({
          ...prev,
          ...response.data.user,
          gender: response.data.user.gender ?? prev.gender,
        }));

        setLoading(false);
      } catch (error) {
        setLoading(false);
        setUserUpdateError(getResponseError(error));
        message.error(
          "Something went wrong in fetching user details. Please try again."
        );
      }
    };

    fetchUserDetails();
  }, []);

  const handleEdit = (field, value) => {
    setEditingField(field);
    // If value is "Not Provided", start with empty string for better editing experience
    const editValue = (value && value !== "Not Provided") ? value : "";
    setEditValues({ [field]: editValue });
  };

  const handleCancelEdit = () => {
    setEditingField(null);
    setEditValues({});
  };

  const handleSaveField = async (field) => {
    // Special handling for phone number - requires OTP verification
    if (field === "phoneNumber") {
      const fieldValue = editValues[field]?.trim() || "";
      if (fieldValue === "" || fieldValue === "Not Provided") {
        message.warning("Please enter a valid phone number");
        return;
      }
      setTempPhoneNumber(fieldValue);
      setPhoneOTPModalVisible(true);
      setPhoneOTPSent(false);
      setPhoneOTP("");
      setPhoneOTPError(null);
      return;
    }

    try {
      setUpdating(true);
      setUserUpdateError(null);

      // If the edited value is empty, set it to "Not Provided" for backend compatibility
      const fieldValue = editValues[field]?.trim() || "";
      const finalValue = fieldValue === "" ? "Not Provided" : fieldValue;

      const updatedData = {
        ...userData,
        [field]: finalValue,
      };

      await axios.post(
        `${BASE_URL}/api/v1/users/update-user-profile`,
        updatedData,
        {
          headers: {
            Authorization: `Bearer ${
              JSON.parse(localStorage.getItem("user")).token
            }`,
          },
        }
      );

      // Update local state
      setUserData(updatedData);

      // Update localStorage if name changed
      if (field === "name") {
        const user = JSON.parse(localStorage.getItem("user"));
        user.name = updatedData.name;
        localStorage.setItem("user", JSON.stringify(user));
      }

      setEditingField(null);
      setEditValues({});
      setUpdating(false);
      message.success(`${field.charAt(0).toUpperCase() + field.slice(1)} updated successfully!`);
    } catch (error) {
      setUpdating(false);
      setUserUpdateError(getResponseError(error));
      message.error("Failed to update profile. Please try again.");
    }
  };

  // Phone OTP Functions
  const handleSendPhoneOTP = async () => {
    try {
      setSendingPhoneOTP(true);
      setPhoneOTPError(null);

      const response = await axios.post(
        `${BASE_URL}/api/v1/users/send-phone-otp-profile`,
        { phoneNumber: tempPhoneNumber },
        {
          headers: {
            Authorization: `Bearer ${
              JSON.parse(localStorage.getItem("user")).token
            }`,
          },
        }
      );

      if (response.data.status === "success") {
        setPhoneOTPSent(true);
        message.success("OTP sent successfully to your phone number!");
      }
    } catch (error) {
      setPhoneOTPError(getResponseError(error));
      message.error("Failed to send OTP. Please try again.");
    } finally {
      setSendingPhoneOTP(false);
    }
  };

  const handleVerifyPhoneOTP = async () => {
    if (phoneOTP.length !== 6) {
      setPhoneOTPError("Please enter a valid 6-digit OTP");
      return;
    }

    try {
      setVerifyingPhoneOTP(true);
      setPhoneOTPError(null);

      const response = await axios.post(
        `${BASE_URL}/api/v1/users/verify-phone-otp-profile`,
        { phoneNumber: tempPhoneNumber, otp: phoneOTP },
        {
          headers: {
            Authorization: `Bearer ${
              JSON.parse(localStorage.getItem("user")).token
            }`,
          },
        }
      );

      if (response.data.status === "success") {
        // Update user data
        const updatedData = {
          ...userData,
          phoneNumber: tempPhoneNumber,
          isPhoneVerified: true,
        };
        setUserData(updatedData);
        
        // Close modal and reset states
        setPhoneOTPModalVisible(false);
        setPhoneOTPSent(false);
        setPhoneOTP("");
        setTempPhoneNumber("");
        setEditingField(null);
        setEditValues({});
        
        message.success("Phone number verified and updated successfully!");
      }
    } catch (error) {
      setPhoneOTPError(getResponseError(error));
      message.error("Invalid OTP. Please try again.");
    } finally {
      setVerifyingPhoneOTP(false);
    }
  };

  const handleCancelPhoneOTP = () => {
    setPhoneOTPModalVisible(false);
    setPhoneOTPSent(false);
    setPhoneOTP("");
    setTempPhoneNumber("");
    setPhoneOTPError(null);
    setEditingField(null);
    setEditValues({});
  };

  // Secondary Email Functions
  const handleAddSecondaryEmail = () => {
    setTempSecondaryEmail("");
    setSecondaryEmailModalVisible(true);
    setSecondaryEmailOTPSent(false);
    setSecondaryEmailOTP("");
    setSecondaryEmailOTPError(null);
  };

  const handleSendSecondaryEmailOTP = async () => {
    if (!tempSecondaryEmail || !tempSecondaryEmail.includes("@")) {
      setSecondaryEmailOTPError("Please enter a valid email address");
      return;
    }

    if (tempSecondaryEmail === userData.email) {
      setSecondaryEmailOTPError("Secondary email cannot be same as primary email");
      return;
    }

    try {
      setSendingSecondaryEmailOTP(true);
      setSecondaryEmailOTPError(null);

      const response = await axios.post(
        `${BASE_URL}/api/v1/users/send-secondary-email-otp`,
        { secondaryEmail: tempSecondaryEmail },
        {
          headers: {
            Authorization: `Bearer ${
              JSON.parse(localStorage.getItem("user")).token
            }`,
          },
        }
      );

      if (response.data.status === "success") {
        setSecondaryEmailOTPSent(true);
        message.success("OTP sent successfully to your secondary email!");
      }
    } catch (error) {
      setSecondaryEmailOTPError(getResponseError(error));
      message.error("Failed to send OTP. Please try again.");
    } finally {
      setSendingSecondaryEmailOTP(false);
    }
  };

  const handleVerifySecondaryEmailOTP = async () => {
    if (secondaryEmailOTP.length !== 6) {
      setSecondaryEmailOTPError("Please enter a valid 6-digit OTP");
      return;
    }

    try {
      setVerifyingSecondaryEmailOTP(true);
      setSecondaryEmailOTPError(null);

      const response = await axios.post(
        `${BASE_URL}/api/v1/users/verify-secondary-email-otp`,
        { secondaryEmail: tempSecondaryEmail, otp: secondaryEmailOTP },
        {
          headers: {
            Authorization: `Bearer ${
              JSON.parse(localStorage.getItem("user")).token
            }`,
          },
        }
      );

      if (response.data.status === "success") {
        // Update user data
        const updatedData = {
          ...userData,
          secondaryEmail: tempSecondaryEmail,
          isSecondaryEmailVerified: true,
        };
        setUserData(updatedData);
        
        // Close modal and reset states
        setSecondaryEmailModalVisible(false);
        setSecondaryEmailOTPSent(false);
        setSecondaryEmailOTP("");
        setTempSecondaryEmail("");
        
        message.success("Secondary email verified and added successfully!");
      }
    } catch (error) {
      setSecondaryEmailOTPError(getResponseError(error));
      message.error("Invalid OTP. Please try again.");
    } finally {
      setVerifyingSecondaryEmailOTP(false);
    }
  };

  const handleRemoveSecondaryEmail = async () => {
    try {
      setRemovingSecondaryEmail(true);

      const response = await axios.post(
        `${BASE_URL}/api/v1/users/remove-secondary-email`,
        {},
        {
          headers: {
            Authorization: `Bearer ${
              JSON.parse(localStorage.getItem("user")).token
            }`,
          },
        }
      );

      if (response.data.status === "success") {
        const updatedData = {
          ...userData,
          secondaryEmail: null,
          isSecondaryEmailVerified: false,
        };
        setUserData(updatedData);
        message.success("Secondary email removed successfully!");
      }
    } catch (error) {
      message.error("Failed to remove secondary email. Please try again.");
    } finally {
      setRemovingSecondaryEmail(false);
    }
  };

  const handleCancelSecondaryEmail = () => {
    setSecondaryEmailModalVisible(false);
    setSecondaryEmailOTPSent(false);
    setSecondaryEmailOTP("");
    setTempSecondaryEmail("");
    setSecondaryEmailOTPError(null);
  };

  const handleInputChange = (field, value) => {
    setEditValues({ [field]: value });
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="user-profile-wrapper">
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
            <Spin size="large" tip="Loading profile..." />
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="user-profile-wrapper">
        <div className="user-profile-container">
          <Card className="user-profile-card">
            <div className="user-profile-header">
              <ProfileOutlined className="profile-header-icon" />
              <div className="profile-header-text">
                <h1 className="profile-header-title">User Profile</h1>
                <p className="profile-header-subtitle">Manage your account information</p>
              </div>
            </div>

            {userUpdateError && (
              <Alert
                message={userUpdateError}
                type="error"
                showIcon
                closable
                onClose={() => setUserUpdateError(null)}
                style={{ marginBottom: "24px" }}
              />
            )}

            <div className="user-profile-content">
              <div className="detail-section-horizontal">
                <div className="detail-row">
                  <div className="detail-item-horizontal">
                    <span className="detail-label">
                      <UserOutlined style={{ marginRight: 8, color: "#667eea" }} />
                      Full Name
                    </span>
                    {editingField === "name" ? (
                      <div className="field-edit-section">
                        <Input
                          value={editValues.name !== undefined ? editValues.name : (userData.name && userData.name !== "Not Provided" ? userData.name : "")}
                          onChange={(e) => handleInputChange("name", e.target.value)}
                          placeholder="Enter full name"
                          prefix={<UserOutlined style={{ color: "#667eea" }} />}
                          style={{ marginTop: "8px", marginBottom: "8px" }}
                          allowClear
                        />
                        <div className="field-edit-buttons">
                          <Button
                            type="primary"
                            size="small"
                            icon={<CheckOutlined />}
                            onClick={() => handleSaveField("name")}
                            loading={updating}
                            style={{ marginRight: "8px" }}
                          >
                            Save
                          </Button>
                          <Button
                            size="small"
                            icon={<CloseOutlined />}
                            onClick={handleCancelEdit}
                            disabled={updating}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="field-display-section">
                        <span className="detail-value">{userData.name || "Not Provided"}</span>
                        <Button
                          type="link"
                          size="small"
                          icon={<EditOutlined />}
                          onClick={() => handleEdit("name", userData.name)}
                          style={{ marginLeft: "8px", padding: 0 }}
                        >
                          Edit
                        </Button>
                      </div>
                    )}
                  </div>

                  <div className="detail-item-horizontal">
                    <span className="detail-label">
                      <MailOutlined style={{ marginRight: 8, color: "#667eea" }} />
                      Email Address
                    </span>
                    <div className="field-display-section">
                      <span className="detail-value">{userData.email}</span>
                      <Tag color="green" style={{ marginLeft: "8px" }}>
                        <CheckCircleOutlined style={{ marginRight: 4 }} />
                        Verified
                      </Tag>
                    </div>
                  </div>
                </div>

                <div className="detail-row">
                  <div className="detail-item-horizontal">
                    <span className="detail-label">
                      <PhoneOutlined style={{ marginRight: 8, color: "#667eea" }} />
                      Phone Number
                    </span>
                    {editingField === "phoneNumber" ? (
                      <div className="field-edit-section">
                        <Input
                          value={editValues.phoneNumber !== undefined ? editValues.phoneNumber : (userData.phoneNumber && userData.phoneNumber !== "Not Provided" ? userData.phoneNumber : "")}
                          onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
                          placeholder="Enter phone number"
                          prefix={<PhoneOutlined style={{ color: "#667eea" }} />}
                          style={{ marginTop: "8px", marginBottom: "8px" }}
                          allowClear
                        />
                        <div className="field-edit-buttons">
                          <Button
                            type="primary"
                            size="small"
                            icon={<CheckOutlined />}
                            onClick={() => handleSaveField("phoneNumber")}
                            loading={updating}
                            style={{ marginRight: "8px" }}
                          >
                            Save
                          </Button>
                          <Button
                            size="small"
                            icon={<CloseOutlined />}
                            onClick={handleCancelEdit}
                            disabled={updating}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="field-display-section">
                        <span className="detail-value">
                          {userData.phoneNumber && userData.phoneNumber !== "Not Provided" 
                            ? (
                              <>
                                {userData.phoneNumber}
                                {userData.isPhoneVerified ? (
                                  <Tag color="green" style={{ marginLeft: "8px" }}>
                                    <CheckCircleOutlined style={{ marginRight: 4 }} />
                                    Verified
                                  </Tag>
                                ) : (
                                  <Tag color="orange" style={{ marginLeft: "8px" }}>
                                    <CloseCircleOutlined style={{ marginRight: 4 }} />
                                    Not Verified
                                  </Tag>
                                )}
                              </>
                            )
                            : <Tag color="default">Not Provided</Tag>}
                        </span>
                        <Button
                          type="link"
                          size="small"
                          icon={<EditOutlined />}
                          onClick={() => handleEdit("phoneNumber", userData.phoneNumber)}
                          style={{ marginLeft: "8px", padding: 0 }}
                        >
                          Edit
                        </Button>
                      </div>
                    )}
                  </div>

                  <div className="detail-item-horizontal">
                    <span className="detail-label">
                      <CalendarOutlined style={{ marginRight: 8, color: "#667eea" }} />
                      Birth Date
                    </span>
                    {editingField === "birthDate" ? (
                      <div className="field-edit-section">
                        <Input
                          type="date"
                          value={editValues.birthDate !== undefined ? editValues.birthDate : (userData.birthDate && userData.birthDate !== "Not Provided" ? userData.birthDate : "")}
                          onChange={(e) => handleInputChange("birthDate", e.target.value)}
                          style={{ marginTop: "8px", marginBottom: "8px" }}
                        />
                        <div className="field-edit-buttons">
                          <Button
                            type="primary"
                            size="small"
                            icon={<CheckOutlined />}
                            onClick={() => handleSaveField("birthDate")}
                            loading={updating}
                            style={{ marginRight: "8px" }}
                          >
                            Save
                          </Button>
                          <Button
                            size="small"
                            icon={<CloseOutlined />}
                            onClick={handleCancelEdit}
                            disabled={updating}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="field-display-section">
                        <span className="detail-value">
                          {userData.birthDate && userData.birthDate !== "Not Provided"
                            ? moment(userData.birthDate).format("DD MMM YYYY")
                            : <Tag color="default">Not Provided</Tag>}
                        </span>
                        <Button
                          type="link"
                          size="small"
                          icon={<EditOutlined />}
                          onClick={() => handleEdit("birthDate", userData.birthDate)}
                          style={{ marginLeft: "8px", padding: 0 }}
                        >
                          Edit
                        </Button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="detail-row">
                  <div className="detail-item-horizontal full-width">
                    <span className="detail-label">
                      <HomeOutlined style={{ marginRight: 8, color: "#667eea" }} />
                      Address
                    </span>
                    {editingField === "address" ? (
                      <div className="field-edit-section">
                        <Input
                          value={editValues.address !== undefined ? editValues.address : (userData.address && userData.address !== "Not Provided" ? userData.address : "")}
                          onChange={(e) => handleInputChange("address", e.target.value)}
                          placeholder="Enter address"
                          prefix={<HomeOutlined style={{ color: "#667eea" }} />}
                          style={{ marginTop: "8px", marginBottom: "8px" }}
                          allowClear
                        />
                        <div className="field-edit-buttons">
                          <Button
                            type="primary"
                            size="small"
                            icon={<CheckOutlined />}
                            onClick={() => handleSaveField("address")}
                            loading={updating}
                            style={{ marginRight: "8px" }}
                          >
                            Save
                          </Button>
                          <Button
                            size="small"
                            icon={<CloseOutlined />}
                            onClick={handleCancelEdit}
                            disabled={updating}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="field-display-section">
                        <span className="detail-value">
                          {userData.address && userData.address !== "Not Provided"
                            ? userData.address
                            : <Tag color="default">Not Provided</Tag>}
                        </span>
                        <Button
                          type="link"
                          size="small"
                          icon={<EditOutlined />}
                          onClick={() => handleEdit("address", userData.address)}
                          style={{ marginLeft: "8px", padding: 0 }}
                        >
                          Edit
                        </Button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="detail-row">
                  <div className="detail-item-horizontal">
                    <span className="detail-label">
                      <TrophyOutlined style={{ marginRight: 8, color: "#667eea" }} />
                      Favorite Sport
                    </span>
                    {editingField === "favouriteSport" ? (
                      <div className="field-edit-section">
                        <Input
                          value={editValues.favouriteSport !== undefined ? editValues.favouriteSport : (userData.favouriteSport && userData.favouriteSport !== "Not Provided" ? userData.favouriteSport : "")}
                          onChange={(e) => handleInputChange("favouriteSport", e.target.value)}
                          placeholder="Enter favorite sport"
                          prefix={<TrophyOutlined style={{ color: "#667eea" }} />}
                          style={{ marginTop: "8px", marginBottom: "8px" }}
                          allowClear
                        />
                        <div className="field-edit-buttons">
                          <Button
                            type="primary"
                            size="small"
                            icon={<CheckOutlined />}
                            onClick={() => handleSaveField("favouriteSport")}
                            loading={updating}
                            style={{ marginRight: "8px" }}
                          >
                            Save
                          </Button>
                          <Button
                            size="small"
                            icon={<CloseOutlined />}
                            onClick={handleCancelEdit}
                            disabled={updating}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="field-display-section">
                        <span className="detail-value">
                          {userData.favouriteSport && userData.favouriteSport !== "Not Provided"
                            ? <Tag color="green">{userData.favouriteSport}</Tag>
                            : <Tag color="default">Not Provided</Tag>}
                        </span>
                        <Button
                          type="link"
                          size="small"
                          icon={<EditOutlined />}
                          onClick={() => handleEdit("favouriteSport", userData.favouriteSport)}
                          style={{ marginLeft: "8px", padding: 0 }}
                        >
                          Edit
                        </Button>
                      </div>
                    )}
                  </div>

                  <div className="detail-item-horizontal">
                    <span className="detail-label">
                      {userData.gender === "Male" ? (
                        <ManOutlined style={{ marginRight: 8, color: "#667eea" }} />
                      ) : userData.gender === "Female" ? (
                        <WomanOutlined style={{ marginRight: 8, color: "#667eea" }} />
                      ) : (
                        <UserOutlined style={{ marginRight: 8, color: "#667eea" }} />
                      )}
                      Gender
                    </span>
                    {editingField === "gender" ? (
                      <div className="field-edit-section">
                        <Select
                          value={editValues.gender !== undefined ? editValues.gender : (userData.gender || "Male")}
                          onChange={(value) => handleInputChange("gender", value)}
                          style={{ width: "100%", marginTop: "8px", marginBottom: "8px" }}
                        >
                          <Option value="Male">Male</Option>
                          <Option value="Female">Female</Option>
                          <Option value="Prefer not to say">Prefer not to say</Option>
                        </Select>
                        <div className="field-edit-buttons">
                          <Button
                            type="primary"
                            size="small"
                            icon={<CheckOutlined />}
                            onClick={() => handleSaveField("gender")}
                            loading={updating}
                            style={{ marginRight: "8px" }}
                          >
                            Save
                          </Button>
                          <Button
                            size="small"
                            icon={<CloseOutlined />}
                            onClick={handleCancelEdit}
                            disabled={updating}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="field-display-section">
                        <span className="detail-value">
                          <Tag color="purple">{userData.gender || "Not Provided"}</Tag>
                        </span>
                        <Button
                          type="link"
                          size="small"
                          icon={<EditOutlined />}
                          onClick={() => handleEdit("gender", userData.gender)}
                          style={{ marginLeft: "8px", padding: 0 }}
                        >
                          Edit
                        </Button>
                      </div>
                    )}
                  </div>
                </div>

                {userData.createdAt && (
                  <div className="detail-row">
                    <div className="detail-item-horizontal full-width">
                      <span className="detail-label">
                        <CalendarOutlined style={{ marginRight: 8, color: "#667eea" }} />
                        Account Created
                      </span>
                      <span className="detail-value">
                        {moment(userData.createdAt).format("DD MMM YYYY, HH:mm")}
                      </span>
                    </div>
                  </div>
                )}

                {/* Secondary Email Section */}
                <div className="detail-row">
                  <div className="detail-item-horizontal full-width">
                    <span className="detail-label">
                      <MailOutlined style={{ marginRight: 8, color: "#667eea" }} />
                      Secondary Email
                    </span>
                    {userData.secondaryEmail ? (
                      <div className="field-display-section">
                        <span className="detail-value">
                          {userData.secondaryEmail}
                          {userData.isSecondaryEmailVerified ? (
                            <Tag color="green" style={{ marginLeft: "8px" }}>
                              <CheckCircleOutlined style={{ marginRight: 4 }} />
                              Verified
                            </Tag>
                          ) : (
                            <Tag color="orange" style={{ marginLeft: "8px" }}>
                              <CloseCircleOutlined style={{ marginRight: 4 }} />
                              Not Verified
                            </Tag>
                          )}
                        </span>
                        <Button
                          type="link"
                          size="small"
                          danger
                          icon={<DeleteOutlined />}
                          onClick={handleRemoveSecondaryEmail}
                          loading={removingSecondaryEmail}
                          style={{ marginLeft: "8px", padding: 0 }}
                        >
                          Remove
                        </Button>
                      </div>
                    ) : (
                      <div className="field-display-section">
                        <Tag color="default" style={{ marginRight: "8px" }}>Not Added</Tag>
                        <Button
                          type="link"
                          size="small"
                          icon={<PlusOutlined />}
                          onClick={handleAddSecondaryEmail}
                          style={{ padding: 0 }}
                        >
                          Add Secondary Email
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="user-profile-footer">
              <Button
                type="default"
                onClick={() => navigate("/user")}
                style={{ marginRight: "12px" }}
              >
                Back to Home
              </Button>
            </div>
          </Card>
        </div>
      </div>

      {/* Phone OTP Verification Modal */}
      <Modal
        title={
          <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <PhoneOutlined style={{ color: "#667eea" }} />
            Verify Phone Number
          </span>
        }
        open={phoneOTPModalVisible}
        onCancel={handleCancelPhoneOTP}
        footer={null}
        width={500}
        closable={!verifyingPhoneOTP}
        maskClosable={!verifyingPhoneOTP}
      >
        <div style={{ padding: "20px 0" }}>
          {!phoneOTPSent ? (
            <>
              <p style={{ marginBottom: "16px", fontSize: "15px" }}>
                Enter your phone number to receive OTP:
              </p>
              <Input
                value={tempPhoneNumber}
                onChange={(e) => setTempPhoneNumber(e.target.value)}
                placeholder="Enter phone number"
                prefix={<PhoneOutlined style={{ color: "#667eea" }} />}
                style={{ marginBottom: "16px" }}
                allowClear
              />
              {phoneOTPError && (
                <Alert
                  message={phoneOTPError}
                  type="error"
                  showIcon
                  style={{ marginBottom: "16px" }}
                />
              )}
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
                <Button onClick={handleCancelPhoneOTP}>Cancel</Button>
                <Button
                  type="primary"
                  onClick={handleSendPhoneOTP}
                  loading={sendingPhoneOTP}
                  disabled={!tempPhoneNumber || tempPhoneNumber.trim() === ""}
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
                  onClick={handleSendPhoneOTP}
                  loading={sendingPhoneOTP}
                  disabled={sendingPhoneOTP}
                >
                  Resend OTP
                </Button>
                <div style={{ display: "flex", gap: "8px" }}>
                  <Button onClick={handleCancelPhoneOTP}>Cancel</Button>
                  <Button
                    type="primary"
                    onClick={handleVerifyPhoneOTP}
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

      {/* Secondary Email OTP Verification Modal */}
      <Modal
        title={
          <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <MailOutlined style={{ color: "#667eea" }} />
            Add Secondary Email
          </span>
        }
        open={secondaryEmailModalVisible}
        onCancel={handleCancelSecondaryEmail}
        footer={null}
        width={500}
        closable={!verifyingSecondaryEmailOTP}
        maskClosable={!verifyingSecondaryEmailOTP}
      >
        <div style={{ padding: "20px 0" }}>
          {!secondaryEmailOTPSent ? (
            <>
              <p style={{ marginBottom: "16px", fontSize: "15px" }}>
                Enter your secondary email address to receive OTP:
              </p>
              <Input
                value={tempSecondaryEmail}
                onChange={(e) => setTempSecondaryEmail(e.target.value)}
                placeholder="Enter secondary email"
                prefix={<MailOutlined style={{ color: "#667eea" }} />}
                style={{ marginBottom: "16px" }}
                allowClear
                type="email"
              />
              {secondaryEmailOTPError && (
                <Alert
                  message={secondaryEmailOTPError}
                  type="error"
                  showIcon
                  style={{ marginBottom: "16px" }}
                />
              )}
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
                <Button onClick={handleCancelSecondaryEmail}>Cancel</Button>
                <Button
                  type="primary"
                  onClick={handleSendSecondaryEmailOTP}
                  loading={sendingSecondaryEmailOTP}
                  disabled={!tempSecondaryEmail || !tempSecondaryEmail.includes("@")}
                >
                  Send OTP
                </Button>
              </div>
            </>
          ) : (
            <>
              <p style={{ marginBottom: "16px", fontSize: "15px" }}>
                Enter the 6-digit OTP sent to <strong>{tempSecondaryEmail}</strong>:
              </p>
              <div style={{ display: "flex", justifyContent: "center", marginBottom: "16px" }}>
                <OTPInput
                  otp={secondaryEmailOTP.split("")}
                  onChange={(otp) => setSecondaryEmailOTP(otp)}
                />
              </div>
              {secondaryEmailOTPError && (
                <Alert
                  message={secondaryEmailOTPError}
                  type="error"
                  showIcon
                  style={{ marginBottom: "16px" }}
                />
              )}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Button
                  type="link"
                  onClick={handleSendSecondaryEmailOTP}
                  loading={sendingSecondaryEmailOTP}
                  disabled={sendingSecondaryEmailOTP}
                >
                  Resend OTP
                </Button>
                <div style={{ display: "flex", gap: "8px" }}>
                  <Button onClick={handleCancelSecondaryEmail}>Cancel</Button>
                  <Button
                    type="primary"
                    onClick={handleVerifySecondaryEmailOTP}
                    loading={verifyingSecondaryEmailOTP}
                    disabled={secondaryEmailOTP.length !== 6}
                  >
                    Verify
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </Modal>

      <Footer />
    </>
  );
};

export default UserProfile;
