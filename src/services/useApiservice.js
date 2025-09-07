// import useSWR from "swr";
"use client"
import Cookies from "js-cookie";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL; // Replace with your actual API base URL
const BASE_AUTH =process.env.NEXT_PUBLIC_AUTH_TOKEN;

const headers =Cookies.get("AccessToken") ? {
  "Content-Type": "application/json",
  "X-API-Key": `${BASE_AUTH}`,
  "Authorization": `Bearer ${Cookies.get("AccessToken")}`,
} :  {
  "Content-Type": "application/json",
  "X-API-Key": `${BASE_AUTH}`,
  
};

// Fetcher function for SWR
// const fetcher = async (url) => {
//   const response = await fetch(url,{
//     method: "GET",
//     headers,
//   });
//   if (!response.ok) {
//     throw new Error("Failed to fetch data");
//   }
//   return response.json();
// };

// Custom Hook
const useApiService = () => {
  // GET request using SWR
  const Get = async (endpoint) => {
    const response = await fetch(`${BASE_URL}${endpoint}`,{
      method: "GET",
      headers,
    });
    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }
    return response.json();
  };

  // POST request
  const post = async (endpoint, body) => {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });
    if (!response.ok) {
      throw new Error("Failed to post data");
    }
    return response.json();
  };

  // PUT request
  const put = async (endpoint, body) => {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: "PUT",
      headers,
      body: JSON.stringify(body),
    });
    if (!response.ok) {
      throw new Error("Failed to update data");
    }
    return response.json();
  };

  const putUploadImage = async (endpoint,body)=>{
    delete headers["Content-Type"]
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: "PUT",
      headers:{...headers },
      body
    });
    if (!response.ok) {
      throw new Error("Failed to update data");
    }
    return response.json();
  }
  const postData = async (endpoint,body)=>{
    delete headers["Content-Type"]
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: "POST",
      headers:{...headers },
      body
    });
    if (!response.ok) {
      throw new Error("Failed to update data");
    }
    return response.json();
  }

  // DELETE request
  const remove = async (endpoint) => {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: "DELETE",
      headers,
    });
    if (!response.ok) {
      throw new Error("Failed to delete data");
    }
    return response.json();
  };

  return { Get, post, put, remove ,putUploadImage,postData};
};

export default useApiService;