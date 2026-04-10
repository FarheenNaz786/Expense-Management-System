import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PageNotFound from "./pages/PageNotFound";
import ForgotPassword from "./pages/ForgotPassword/ForgotPassword";
import ResetPassword from "./pages/ForgotPassword/ResetPassword";
import EmailSent from "./pages/ForgotPassword/EmailSent";
import TermsAndConditions from "./pages/UserAgreement/TermsAndConditions";
import PrivacyAndPolicy from "./pages/UserAgreement/PrivacyAndPolicy";
import PasswordResetSuccess from "./pages/ForgotPassword/PasswordResetSuccess";
import UserProfile from "./pages/UserDetails/UserProfile";
import Home from "./components/Layout/Home";
import SendOTPAndVerifyPhone from "./pages/OTPPhoneVerification/SendOTPAndVerifyPhone";
import ChangePassword from "./pages/UserDetails/ChangePassword";
import ContactUs from "./pages/UserDetails/ContactUs";
import AboutUs from "./pages/UserDetails/AboutUs";
import AdminDashboard from "./pages/AdminDashboard/AdminDashboard";
import AdminLogin from "./pages/AdminDashboard/AdminLogin";
import RequestForAdminAccess from "./pages/AdminDashboard/RequestForAdminAccess";

function App() {
  return (
    <>
      <Routes>
        <Route
          path="/user"
          element={
            <ProtectedRoutes>
              <HomePage />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/user/user-profile"
          element={
            <ProtectedRoutes>
              <UserProfile />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/user/change-password"
          element={
            <ProtectedRoutes>
              <ChangePassword />
            </ProtectedRoutes>
          }
        />
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/forgot-email-sent" element={<EmailSent />} />
        <Route
          path="/reset-password/:expenseAppUserId/:token"
          element={<ResetPassword />}
        />
        <Route
          path="/password-reset-success"
          element={<PasswordResetSuccess />}
        />
        <Route path="/terms-conditions" element={<TermsAndConditions />} />
        <Route path="/privacy-policy" element={<PrivacyAndPolicy />} />
        {/* send otp and verify email */}
        {/* Send OTP and verify phone */}
        <Route
          path="/phone-otp-verification"
          element={<SendOTPAndVerifyPhone />}
        />
        <Route path="/contact-us" element={<ContactUs />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/request-access" element={<RequestForAdminAccess />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        {/* if path is not correct then navigate to page not found page */}
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </>
  );
}

export function ProtectedRoutes(props) {
  if (localStorage.getItem("user")) {
    return props.children;
  } else {
    return <Navigate to="/" />;
  }
}

export default App;
