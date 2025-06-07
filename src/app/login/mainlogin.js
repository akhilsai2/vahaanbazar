"use client";
import React, { useState } from "react";
import Login from "./login.js";
import SignUp from "./signup.js";

const Mainlogin = () => {
 const [userRegistration,setUserRegistration] = useState(true);
  return (
    <div className="min-h-screen flex items-center justify-center loginBackground">
      {userRegistration ? <Login setUserRegistration={setUserRegistration}/> : <SignUp setUserRegistration={setUserRegistration}/>}
      <div className="absolute bottom-4 left-4 text-white font-500 text-sm flex justify-between gap-3 w-[97%]">
      <span >Terms of Use | Privacy Policy | Contact Us</span>
      <span>© Copyright {new Date().getFullYear()} VahaanBazar. All Rights Reserved</span>
      </div>
    </div>
  );
};

export default Mainlogin;
