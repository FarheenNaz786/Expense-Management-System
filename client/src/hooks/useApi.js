import React, { useState, useCallback } from "react";
import axios from "axios";
import { message } from "antd";
import { BASE_URL } from "../utils/baseURL";
import { getResponseError } from "../utils/getResponseError";
import { useAuth } from "./useAuth";

/**
 * Custom hook for API calls with loading and error states
 */
export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { getAuthHeaders } = useAuth();

  const request = useCallback(
    async (config) => {
      setLoading(true);
      setError(null);

      try {
        const headers = config.requiresAuth
          ? { ...getAuthHeaders(), ...(config.headers || {}) }
          : config.headers || {};

        const response = await axios({
          ...config,
          url: `${BASE_URL}${config.url}`,
          headers,
        });

        setLoading(false);
        return { data: response.data, error: null };
      } catch (err) {
        setLoading(false);
        const errorMessage = getResponseError(err);
        setError(errorMessage);
        return { data: null, error: errorMessage };
      }
    },
    [getAuthHeaders]
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return { request, loading, error, clearError };
};

/**
 * Hook for API call with automatic error handling via Ant Design message
 */
export const useApiWithMessage = () => {
  const [loading, setLoading] = useState(false);
  const { getAuthHeaders } = useAuth();

  const request = useCallback(
    async (config, options = {}) => {
      const {
        successMessage,
        errorMessage = "Something went wrong",
        showSuccess = true,
        showError = true,
      } = options;

      setLoading(true);

      try {
        // Get fresh auth headers on each request (not in dependencies to prevent loop)
        const currentAuthHeaders = getAuthHeaders();
        const headers = config.requiresAuth
          ? { ...currentAuthHeaders, ...(config.headers || {}) }
          : config.headers || {};

        const response = await axios({
          ...config,
          url: `${BASE_URL}${config.url}`,
          headers,
        });

        setLoading(false);

        if (successMessage && showSuccess) {
          message.success(successMessage);
        }

        return { data: response.data, error: null };
      } catch (err) {
        setLoading(false);
        const errorMessageText = getResponseError(err);

        if (showError) {
          message.error(errorMessageText || errorMessage);
        }

        return { data: null, error: errorMessageText || errorMessage };
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [] // Empty deps - getAuthHeaders is called inside, not as dependency
  );

  return { request, loading };
};

