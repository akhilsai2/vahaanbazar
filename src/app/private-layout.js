"use client";
import React, {  useEffect, useMemo, useState } from "react";
import NavBar from "./components/navbar.js";
import SideMenu from "./components/sidemenu.js";
const PrivateLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };
    handleResize(); // Call it once on mount
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  const sideMenu = useMemo(() => <SideMenu />, [isSidebarOpen]);

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar toggleSidebar={toggleSidebar} />
      <div className="flex flex-1 transition-all duration-300">
        <div className={`bg-gray-700 text-white w-45 px-3 py-1 fixed top-16 bottom-0 transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-64"} transition-transform duration-300 z-40`}>
          {sideMenu}
        </div>
        <div className={`flex-1 ml-0 w-65 ${isSidebarOpen ? "ml-45" : "ml-0"} transition-all duration-300 p-4 bg-[#c7c7c70f]`}>{children}</div>
      </div>
      <footer className=" text-gray-500 text-[11px] text-end pb-3 px-4 flex justify-end items-center gap-2 bg-[#c7c7c70f]">
        <span >Terms of Use | Privacy Policy | Contact Us</span>
        <span>© Copyright 2025 VahaanBazar. All Rights Reserved</span>
      </footer>
    </div>
  );
};

export default PrivateLayout;
