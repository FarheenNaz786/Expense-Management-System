/**
 * Extracts error message from API error response
 * @param {Error} error - The error object from axios
 * @returns {string|null} - The error message or null
 */
export const getResponseError = (error) => {
  if (!error) {
    return null;
  }

  // Handle network errors
  if (error.message && !error.response) {
    return "Network error. Please check your connection.";
  }

  // Handle response errors
  if (error.response) {
    const { status, data } = error.response;

    // Return specific error messages for common status codes
    if (data?.message) {
      return data.message;
    }

    // Default messages for status codes
    switch (status) {
      case 400:
        return "Invalid request. Please check your input.";
      case 401:
        return "Unauthorized. Please login again.";
      case 403:
        return "Access forbidden.";
      case 404:
        return "Resource not found.";
      case 500:
        return "Server error. Please try again later.";
      default:
        return "An error occurred. Please try again.";
    }
  }

  return "An unexpected error occurred.";
};
