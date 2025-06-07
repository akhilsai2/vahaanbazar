"use client";
import dynamic from "next/dynamic";
import Loader from "@/app/components/loaders";

const Login = dynamic(() => import("./mainlogin.js"), { loading: () => <Loader />, ssr: false });

export default function LoginPage() {
  return <Login />;
}
