"use client";

import { useState } from "react";
import "./login.css";
import Image from "next/image";
import Logo from "../../../public/assets/VahaanBazar1.png";
import { useRouter } from "next/navigation.js";
import useLoginService from "@/services/useLoginService";
import useToastService from "@/services/useToastService";
import Cookies from "js-cookie";
import { Button } from 'primereact/button'

export default function Login({ setUserRegistration }) {
  const router = useRouter();
  const { forgetPasswordOtpResend, forgetPasswordOtp, resetPassword, login ,mobileLoginOtp,LoginMobile} = useLoginService();
  const toastService = useToastService();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mobileLogin, setMobileLogin] = useState(false);
  const [forgotPassword, setForgotPassword] = useState(false);
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resendLoading, setResendLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toastService.showErrorToast("Please enter both email and password.");
    }
    try {
      const response = await login({ username_phone: email, password,login_type:"credentials" });
      if (response && response?.data) {
        Cookies.set("RefreshToken", response?.data.token);
        Cookies.set("AccessToken", response?.data?.token);
        Cookies.set("User", response?.data?.username);
        Cookies.set("UserId", response?.data?.user_id);
        Cookies.set("UserType", response?.data?.user_type);
        router.push("/vahaanbazar/view-bids");
      }
    } catch (err) {
      console.error("Login failed:", err.message);
    }
  };

  const handleSendOtp = async () => {

    if (mobile.length !== 10) {
      toastService.showErrorToast("Please enter a valid 10-digit mobile number.");
      return;
    }
    try {
      const res = await forgetPasswordOtp({ mobile_number: mobile });
      if (res) {
        setOtpSent(true);
      }
    } catch (error) {
      toastService.showErrorToast("Failed to send OTP. Please try again.");
      console.error("Error sending OTP:", error.message);
    }
  };
  const handleMobileSubmit = async (e) => {
    e.preventDefault();
    if (mobile.length !== 10) {
      alert("Please enter a valid 10-digit mobile number.");
      return;
    }
    setOtpSent(true);
    console.log("OTP sent to:", mobile);
   await mobileLoginOtp({ mobile_number: mobile }).then((res) => {
      if (res) {
        setOtpSent(true);
        // toastService.showSuccessToast("OTP sent successfully.");
      }
    }).catch((error) => {
      // toastService.showErrorToast("Failed to send OTP. Please try again.");
      console.error("Error sending OTP:", error.message);
    });
    // Call your API to send OTP here
  };

  const handleMobileOtpChange = (value, index) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Automatically move to the next input box
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`).focus();
    }

    // Automatically verify OTP when all boxes are filled
    if (newOtp.every((digit) => digit !== "")) {
      console.log("OTP entered:", newOtp.join(""));
      // Call your API to verify OTP here
      handleMobileVerifyOtp(newOtp); // Call the API to verify OTP
    }
  };

  const handleMobileVerifyOtp = async (otpNo) => {
    const otpValue = otpNo.join("");
    if (otpValue.length === 6) {
      console.log("Verifying OTP:", otpValue);
      try {
        const res = await LoginMobile({ mobile_number: mobile, otp: otpValue });
        if (res) {
          Cookies.set("RefreshToken", res?.tokens?.refresh);
          Cookies.set("AccessToken", res?.tokens?.access);
          Cookies.set("User", JSON.stringify(res?.tokens?.user));
          setOtpVerified(true); // Mark OTP as verified
          router.push("/vahaanbazar/view-bids");
        }
      } catch (error) {
        toastService.showErrorToast("Failed to verify OTP. Please try again.");
        console.error("Error verifying OTP:", error.message);
      }
    } else {
      alert("Please enter a valid 6-digit OTP.");
    }
  }

  const handleOtpChange = (value, index) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Automatically move to the next input box
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`).focus();
    }

    // Automatically verify OTP when all boxes are filled
    if (newOtp.every((digit) => digit !== "")) {
      console.log("OTP entered:", newOtp.join(""));
      handleVerifyOtp(newOtp); // Call the API to verify OTP
    }
  };

  const handleVerifyOtp = (otpNo) => {
    const otpValue = otpNo.join("");
    if (otpValue.length === 6) {
      console.log("Verifying OTP:", otpValue);
      // Call your API to verify OTP here
      setOtpVerified(true); // Mark OTP as verified
    } else {
      alert("Please enter a valid 6-digit OTP.");
    }
  };

  const handleResendOtp = async () => {
    setOtp(new Array(6).fill(""));
    setResendLoading(true);
    try {
      await forgetPasswordOtpResend({ mobile });
      toastService.showSuccessToast("OTP resent successfully.");
    } catch (error) {
      toastService.showErrorToast("Failed to resend OTP. Please try again.");
      console.error("Error resending OTP:", error.message);
    } finally {
      setResendLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (newPassword !== confirmPassword) {
      toastService.showErrorToast("Passwords do not match.");
      return;
    }
    try {
      const res = await resetPassword({ mobile_number: mobile, otp: otp.join(""), new_password: newPassword });
      if (res) {
        setForgotPassword(false);
        setOtpVerified(false);
        setOtpSent(false);
        setNewPassword("");
        setMobile("");
        setOtp(new Array(6).fill(""));
        setConfirmPassword("");
      }
    } catch (error) {
      toastService.showErrorToast("Failed to reset password. Please try again.");
      console.error("Error resetting password:", error.message);
    }
  };

  return mobileLogin ? (
    <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-xl transform transition duration-500 hover:scale-105">
      <div className="flex flex-col items-center justify-center relative">
        {/* Back Arrow */}
        <button
          className="absolute top-0 left-0 mt-2 ml-2 text-gray-500 hover:text-blue-600 flex items-center gap-2"
          onClick={() => {
            setMobileLogin(false)
            setOtpSent(false);
            setOtpVerified(false);
            setMobile("");
            setOtp(new Array(6).fill(""));
          } 
          }// Navigate back to email login
        >
          <i className="pi pi-arrow-left"></i> {/* PrimeIcons back arrow */}
          <span>Back</span>
        </button>

        <Image src={Logo} alt="Logo" className="mb-4" width={200} height={200} />
        {/* <h2 className="text-2xl font-bold mb-4">Mobile Login</h2> */}
        {!otpSent ? (
          <form onSubmit={handleMobileSubmit} className="space-y-6 w-[60%]">
            <div className="form-group">
              <label htmlFor="mobile" className="block text-sm font-medium text-gray-700">
                Mobile Number:
              </label>
              <input
                type="tel"
                id="mobile"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Enter your 10-digit mobile number"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transform transition duration-300 hover:scale-105 loginBackground"
            >
              Send OTP
            </button>
          </form>
        ) : (
          <div className="space-y-6">
            <p className="text-center text-gray-700">Enter the 6-digit OTP sent to {mobile}</p>
            <div className="flex justify-center gap-2">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleMobileOtpChange(e.target.value, index)}
                  className="w-12 h-12 text-center border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              ))}
            </div>
            <div className="flex justify-between items-center">
              <button
                className={`text-blue-500 bg-transparent border-none flex items-center gap-2 ${resendLoading ? "cursor-not-allowed" : "hover:underline"}`}
                onClick={!resendLoading ? handleResendOtp : undefined}
                disabled={resendLoading}
              >
                {resendLoading ? (
                  <i className="pi pi-spin pi-spinner"></i> // Spinner icon when loading
                ) : (
                  <i className="pi pi-refresh"></i> // Refresh icon when not loading
                )}
                Resend OTP
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  ) : forgotPassword ? (
    <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-xl transform transition duration-500 hover:scale-105">
      <div className="flex flex-col items-center justify-center relative">
        {/* Back Arrow */}
        <button
          className="absolute top-0 left-0 mt-2 ml-2 text-gray-500 hover:text-blue-600 flex items-center gap-2"
          onClick={() => setForgotPassword(false)} // Navigate back to login
        >
          <i className="pi pi-arrow-left"></i> {/* PrimeIcons back arrow */}
          <span>Back</span>
        </button>

        <Image src={Logo} alt="Logo" className="mb-4" width={200} height={200} />
        <h2 className="text-2xl font-bold mb-4">Forgot Password</h2>

        {/* Mobile Number Input */}
        {!otpSent && (
          <div className="flex items-center gap-2 mb-4 w-full">
            <input
              type="tel"
              placeholder="Enter Mobile Number"
              id="mobile"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              className="flex-grow border border-gray-300 rounded-md px-4 py-2"
              required
            />
            <button className="text-orange-500 border border-orange-500 px-4 py-2 rounded-md hover:bg-orange-100" onClick={handleSendOtp}>
              Send OTP
            </button>
          </div>
        )}

        {/* OTP Input Boxes */}
        {otpSent && !otpVerified && (
          <>
            <p className="text-gray-600 mb-4">Enter the 6-digit OTP sent to your mobile number.</p>
            <div className="flex justify-center gap-2 mb-4">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleOtpChange(e.target.value, index)}
                  className="w-12 h-12 text-center border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              ))}
            </div>
            <button
              className={`text-blue-500 bg-transparent border-none flex items-center gap-1 ${resendLoading ? "cursor-not-allowed" : "hover:underline"}`}
              onClick={!resendLoading ? handleResendOtp : undefined}
              disabled={resendLoading}
            >
              {resendLoading ? (
                <i className="pi pi-spin pi-spinner"></i> // Spinner icon when loading
              ) : (
                <i className="pi pi-refresh"></i> // Refresh icon when not loading
              )}
              Resend OTP
            </button>
          </>
        )}

        {/* New Password Fields */}
        {otpVerified && (
          <>
            <div className="form-group mt-4 w-full">
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                New Password:
              </label>
              <input
                type="password"
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Enter new password"
                required
              />
            </div>
            <div className="form-group mt-4 w-full">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm Password:
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Confirm new password"
                required
              />
            </div>
            <button
              className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transform transition duration-300 hover:scale-105 mt-4"
              onClick={handleResetPassword}
            >
              Reset Password
            </button>
          </>
        )}
      </div>
    </div>
  ) : (
    <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-xl transform transition duration-500 hover:scale-105">
      <div className="flex justify-center items-center mb-6">
        <Image src={Logo} alt="VahaanBazar" width={200} height={200} />
      </div>
      <form onSubmit={handleLoginSubmit} className="space-y-6">
        <div className="form-group">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Username:
          </label>
          <input
            type="text"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm  sm:text-sm text-black"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password:
          </label>
          <div className="p-inputgroup flex-1">
            <input
              type={showPassword ? "text":"password"}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm   sm:text-sm text-black"
              required
            />
            <Button icon="pi pi-eye" className="passWordBtn border-none" type="button" onClick={()=>{
              // e.preventDefault();
              // e.stopPropagation();
              setShowPassword(!showPassword)}} />
          </div>
        </div>
        <button type="submit" className="w-full text-white py-2 px-4 rounded-lg     transform transition duration-300 hover:scale-105 loginBackground">
          Login
        </button>
      </form>
      <div className="flex justify-between mt-4">
        <p className="mt-6 text-center text-sm text-gray-600">
          Don&apos;t have an account?{" "}
          <span onClick={() => setUserRegistration(false)} className="text-pink-500 hover:underline cursor-pointer">
            Sign up
          </span>
        </p>
        <div className="flex flex-col items-end justify-center mt-4">
          <p className="mt-2 text-center text-sm hover:underline text-blue-500 cursor-pointer" onClick={() => setMobileLogin(true)}>
            Log in with Mobile Number
          </p>
          <p className="mt-2 text-center text-sm hover:underline text-blue-500 cursor-pointer" onClick={() => setForgotPassword(true)}>
            Forgot Password?
          </p>
        </div>
      </div>
    </div>
  );
}
