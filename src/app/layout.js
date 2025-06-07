"use client";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { usePathname,useRouter } from "next/navigation";
import PrivateLayout from "./private-layout.js";
import dynamic from "next/dynamic";
import Loader from "./components/loaders.js";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { notFound } from "next/navigation";
import Cookies from "js-cookie"; 
import { useEffect } from "react";

const DynamicLogin = dynamic(() => import("./login/mainlogin.js"), { loading: () => <Loader />, ssr: false });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});



const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const MainLayout = ({ children }) => {
  const pathname = usePathname();
  const router = useRouter();

  // Check for AccessToken and RefreshToken in cookies
  const accessToken = Cookies.get("AccessToken");
  const refreshToken = Cookies.get("RefreshToken");

  useEffect(() => {
    // Redirect to login if tokens are missing
    if (!accessToken || !refreshToken) {
      router.push("/login");
    }
  }, [accessToken, refreshToken, router]);

  if (pathname === "/login") {
    return <>{children}</>;
  } else if (pathname === "/") {
    return <DynamicLogin />;
  } else if (!pathname) {
    notFound(); // Explicitly render the notFound page for undefined routes
  }

  // Render private layout if tokens are present
  if (accessToken && refreshToken) {
    return <PrivateLayout>{children}</PrivateLayout>;
  }

  // Return null while redirecting
  return null;
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ToastContainer />
        <MainLayout>{children}</MainLayout>
      </body>
    </html>
  );
}
