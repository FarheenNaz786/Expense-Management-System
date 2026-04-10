import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

/**
 * Custom hook for authentication utilities
 */
export const useAuth = () => {
  const navigate = useNavigate();

  const getUser = () => {
    try {
      const userStr = localStorage.getItem("user");
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      return null;
    }
  };

  const getToken = () => {
    const user = getUser();
    return user?.token || null;
  };

  const isAuthenticated = () => {
    return !!getUser();
  };

  const setUser = (userData) => {
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const updateUser = (updates) => {
    const user = getUser();
    if (user) {
      setUser({ ...user, ...updates });
    }
  };

  const logout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  const getAuthHeaders = () => {
    const token = getToken();
    return token
      ? {
          Authorization: `Bearer ${token}`,
        }
      : {};
  };

  return {
    getUser,
    getToken,
    isAuthenticated,
    setUser,
    updateUser,
    logout,
    getAuthHeaders,
  };
};

/**
 * Hook to protect routes - redirects if not authenticated
 */
export const useRequireAuth = (redirectTo = "/") => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate(redirectTo);
    }
  }, [navigate, redirectTo]);

  return { isAuthenticated: isAuthenticated() };
};

/**
 * Hook to prevent logged-in users from accessing auth pages
 */
export const usePreventAuth = (redirectTo = "/user") => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated()) {
      navigate(redirectTo);
    }
  }, [navigate, redirectTo]);
};

