"use client";

import { useState } from "react";
import { Dropdown } from "primereact/dropdown"; // Import PrimeReact Dropdown
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "./login.css";
import Logo from "../../../public/assets/VahaanBazar1.png";
import Image from "next/image";
import useLoginService from "@/services/useLoginService";
import useToastService from "@/services/useToastService";

export default function Signup({ setUserRegistration }) {
  const { signup, verifySignup ,resendSignupOtp} = useLoginService();
  const { updateToSuccessToast, updateToErrorToast, showLoadingToast } = useToastService();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [userType, setUserType] = useState("");
  const [error, setError] = useState("");
  const [mobileVerification, setMobileVerification] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [otp, setOtp] = useState(new Array(6).fill(""));

  const userTypeOptions = [
    { label: "Customer", value: "customer" },
    { label: "Dealer", value: "dealer" },
    { label: "Admin", value: "admin" },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMobileVerification(true);
    if (password !== confirmPassword) {
      setError("Passwords do not match");
    }
    setError("");
    console.log({
      username,
      email,
      password,
      mobile_number: mobile,
      first_name: firstName,
      last_name: lastName,
      state,
      city,
      user_type: userType,
    });

    const credentials = {
      username,
      email,
      password,
      mobile_number: mobile,
      first_name: firstName,
      last_name: lastName,
      state,
      city,
      user_type: userType,
    };
    const toastId = showLoadingToast("Signing up...");
     signup(credentials).then((response) => {
        if (response) {
          updateToSuccessToast(toastId, "Signup successful! Please verify your mobile number.");
          setMobileVerification(true); // Show mobile verification screen
        } else {
          updateToErrorToast(toastId, "Signup failed. Please try again.");
        }
      })
      .catch((error) => {
        updateToErrorToast(toastId, "Signup failed: " + error.message);
      });
  };

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

  const handleVerifyOtp = (otpno) => {
    const otpValue = otpno.join("");
    if (otpValue.length === 6) {
      console.log("Verifying OTP:", otpValue);
      // Call your API to verify OTP here
      const toastId = showLoadingToast("Verifying OTP...");
      verifySignup({mobile_number:mobile, otp_code: otpValue })
        .then((response) => {
          if (response) {
            updateToSuccessToast(toastId, "OTP verified successfully!");
            setUserRegistration(true);
          } else {
            updateToErrorToast(toastId, "OTP verification failed. Please try again.");
          }
        })
        .catch((error) => {
          updateToErrorToast(toastId, "OTP verification failed: " + error.message);
        });
      // Navigate to the next step after successful verification
    } else {
      alert("Please enter a valid 6-digit OTP.");
    }
  };

  const handleResendOtp = () => {
    setResendLoading(true);
    const toastId = showLoadingToast("Resending OTP...");
    resendSignupOtp({ mobile_number: mobile })
      .then((response) => {
        if (response) {
          updateToSuccessToast(toastId,"OTP resent successfully!");
          setOtp(new Array(6).fill("")); // Reset OTP input boxes
        } else {
          updateToErrorToast(toastId,"Failed to resend OTP. Please try again.");
        }
      })
      .catch((error) => {
        updateToErrorToast(toastId,"Failed to resend OTP: " + error.message);
      });
    setTimeout(() => {
      setResendLoading(false);
      console.log("OTP resent successfully.");
    }, 2000); // Simulate API call delay
  };

  return mobileVerification ? (
    <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-xl transform transition duration-500 hover:scale-100">
      <div className="flex flex-col items-center justify-center relative">
        {/* Back Arrow */}
        <button
          className="absolute top-0 left-0 mt-2 ml-2 text-gray-500 hover:text-blue-600 flex items-center gap-2"
          onClick={() => setMobileVerification(false)} // Navigate back to signup
        >
          <i className="pi pi-arrow-left"></i> {/* PrimeIcons back arrow */}
          <span>Back</span>
        </button>

        <Image src={Logo} alt="Logo" className="mb-4" width={200} height={200} />
        <h2 className="text-2xl font-bold mb-4">Verify Mobile Number</h2>
        <p className="text-gray-600 mb-4">Enter the verification code sent to your mobile number.</p>

        {/* OTP Input Boxes */}
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

        {/* Resend OTP Button */}
        <div className="flex justify-center items-center gap-3">
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
        </div>
      </div>
    </div>
  ) : (
    <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-2xl transform transition duration-500 hover:scale-100">
      <div className="flex justify-center items-center mb-6">
        <Image src={Logo} alt="VahaanBazar" width={200} height={200} />
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        <div className="grid grid-cols-2 gap-4">
          <div className="form-group">
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
              First Name:
            </label>
            <input
              type="text"
              id="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
              Last Name:
            </label>
            <input
              type="text"
              id="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              required
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="form-group">
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
              Username:
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email Address:
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              required
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
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
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="userType" className="block text-sm font-medium text-gray-700">
              User Type:
            </label>
            <Dropdown id="userType" value={userType} onChange={(e) => setUserType(e.value)} options={userTypeOptions} placeholder="Select User Type" className="w-full" required />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="form-group">
            <label htmlFor="state" className="block text-sm font-medium text-gray-700">
              State:
            </label>
            <input
              type="text"
              id="state"
              value={state}
              onChange={(e) => setState(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="city" className="block text-sm font-medium text-gray-700">
              City:
            </label>
            <input
              type="text"
              id="city"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="form-group">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Create Password:
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
              Confirm Password:
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              required
            />
          </div>
        </div>
        <button
          type="submit"
          className="w-full loginBackground text-white py-2 px-4 rounded-lg hover:from-purple-500 hover:to-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transform transition duration-300 hover:scale-105"
        >
          Sign Up
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-gray-600">
        Already have an account?{" "}
        <span className="text-blue-500 hover:underline cursor-pointer" onClick={() => setUserRegistration(true)}>
          Login
        </span>
      </p>
    </div>
  );
}
