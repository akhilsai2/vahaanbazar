"use client"
import React, { useRef } from "react";
import Image from "next/image";
import Logo from "../../../public/assets/VahaanBazar1.png"; 
import { Menu } from "primereact/menu";
import { useRouter } from "next/navigation.js";
import Cookies from "js-cookie";

const Navbar = ({toggleSidebar}) => {
    const router = useRouter()
    const menuShiftLeft= useRef(null)
  const user = {
    name: JSON.parse(Cookies.get("User")).username || "John Doe",
    email: JSON.parse(Cookies.get("User")).email || "johndoe@example.com",
  };

  const getInitials = (name) => {
    const words = name.split(" ");
    if (words.length >= 2) {
      return `${words[0][0]}${words[1][1] || ""}`.toUpperCase();
    }
    return name[0].toUpperCase(); // Fallback for single-word names
  };

  const itemRenderer = (item) => {
    return (
        <div className="flex items-center space-x-2">
            <button
            className="text-blue" onClick={()=>{
              router.push("/login")
              Cookies.remove("User")
              Cookies.remove("AccessToken")
              Cookies.remove("RefreshToken")
            }}>
                {item.label}
            </button>
        </div>
    )
  }

  const profileItems = [{
    label:"LogOut",
    key:"logout",
    template: () => itemRenderer({label:"LogOut"})
  }]
  return (
    <div
      className="bg-white text-gray-800 p-3 flex justify-between items-center shadow-md"
      style={{
        boxShadow: "0 4px 6px -1px rgba(84, 108, 39, 0.5), 0 2px 4px -2px rgba(97, 7, 2, 0.5)",
      }}
    >
      <div className="flex items-center space-x-4">
        <button
          onClick={toggleSidebar}
          className="text-black text-2xl focus:outline-none"
        >
          ☰
        </button>
        <Image src={Logo} alt="VahaanBazar Logo" width={150} height={150} />
      </div>

      <div className="flex items-center space-x-4">
      <Menu model={profileItems} popup popupAlignment="left" ref={menuShiftLeft} id="custom_menu" />

        <div className="flex flex-col">
          <span className="font-bold text-right">{user.name.toUpperCase()}</span>
          <span className="text-sm text-gray">{user.email}</span>
        </div>
      <button
          className="w-10 h-10 bg-gray-500 text-white rounded-[5px]  flex items-center justify-center text-xl font-bold"
          title={user.name}
          onClick={(e) => menuShiftLeft.current.toggle(e)}
        >
          {getInitials(user.name)}
        </button>
      </div>
    </div>
  );
};

export default Navbar;
