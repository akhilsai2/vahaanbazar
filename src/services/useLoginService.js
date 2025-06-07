"use client"
import { LOGINURL,REGISTER } from "./apiurls";
import useToastService from "./useToastService";
import useApiService from "./useApiservice";

const useLoginService = () => {
  const { showLoadingToast, updateToSuccessToast, updateToErrorToast } = useToastService();
  const { post } = useApiService();

  // Login function
  const login = async (credentials) => {
    const toastId = showLoadingToast("Logging in...");
    try {
      const response = await post(LOGINURL.LOGIN, credentials);
      updateToSuccessToast(toastId, "Login successful!");
      return response;
    } catch (error) {
      updateToErrorToast(toastId, "Login failed: " + error.message);
      return;
    }
  };

  const mobileLoginOtp = async (credentials) => {
    const toastId = showLoadingToast("Sending OTP...");
    try {
      const response = await post(LOGINURL.MOBILE_LOGIN_OTP, credentials);
      updateToSuccessToast(toastId, "OTP sent successfully!");
      return response;
    } catch (error) {
      updateToErrorToast(toastId, "Login failed: " + error.message);
      return;
    }
  };

  const LoginMobile = async (credentials) => {
    const toastId = showLoadingToast("Logging in...");
    try {
      const response = await post(LOGINURL.MOBILE_LOGIN, credentials);
      updateToSuccessToast(toastId, "Login successful!");
      return response;
    } catch (error) {
      updateToErrorToast(toastId, "Login failed: " + error.message);
      return;
    }
  };

  const forgetPasswordOtp = async (credentials) => {
    const toastId = showLoadingToast("Sending OTP...");
    try {
      const response = await post(LOGINURL.FORGET_PASSWORD_OTP, credentials);
      updateToSuccessToast(toastId, "OTP sent successfully!");
      return response;
    } catch (error) {
      updateToErrorToast(toastId, "Failed to send OTP: " + error.message);
      return;
    }
  };

  const resetPassword = async (credentials) => {
    const toastId = showLoadingToast("Resetting password...");
    try {
      const response = await post(LOGINURL.RESET_PASSWORD, credentials);
      updateToSuccessToast(toastId, "Password reset successful!");
      return response;
    } catch (error) {
      updateToErrorToast(toastId, "Password reset failed: " + error.message);
      return;
    }
  };
  const forgetPasswordOtpResend = async (credentials) => {
    const toastId = showLoadingToast("Resending OTP...");
    try {
      const response = await post(LOGINURL.FORGET_PASSWORD_OTP_RESEND, credentials);
      updateToSuccessToast(toastId, "OTP resent successfully!");
      return response;
    } catch (error) {
      updateToErrorToast(toastId, "Failed to resend OTP: " + error.message);
      return;
    }
  };

  // Logout function
  const logout = async () => {
    const toastId = showLoadingToast("Logging out...");
    try {
      const response = await post("/auth/logout", {});
      updateToSuccessToast(toastId, "Logout successful!");
      return response;
    } catch (error) {
      updateToErrorToast(toastId, "Logout failed: " + error.message);
      throw error;
    }
  };

  const signup = async (credentials) => {
    try {
      const response = await post(REGISTER.REGISTER, credentials);
      return response;
    } catch (error) {
      console.error("Signup error:", error);
      return;
    }
  }

  const verifySignup = async (credentials) => {
    try {
      const response = await post(REGISTER.VERIFY_REGISTER, credentials);
      return response;
    } catch (error) {
      console.error("Verify Signup error:", error);
      return;
    }
  }

  const resendSignupOtp = async (credentials) => {
    
    try {
      const response = await post(REGISTER.REGISTER_OTP_RESEND, credentials);
      return response;
    } catch (error) {
      console.error("Resend Signup OTP error:", error);
      return;
    }
  }

  return { login, logout, forgetPasswordOtp, resetPassword, forgetPasswordOtpResend ,signup,verifySignup,resendSignupOtp,LoginMobile,mobileLoginOtp};
};

export default useLoginService;
