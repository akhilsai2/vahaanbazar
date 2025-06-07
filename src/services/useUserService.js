"use client";

import useApiService from "@/services/useApiservice";
import { USERS } from "./apiurls"; // Import the USERS endpoint from apiurls.js

const useUserService = () => {
  const { Get,post,remove } = useApiService(); // Use the Get method from useApiService

  // Fetch user list
  const getUserList = async (options = {}) => {
    try {
      const response = await Get(USERS.VIEW_USERS_LIST, options); // USERS.LIST_USERS should point to the user list endpoint
      return response;
    } catch (error) {
      console.error("Error fetching user list:", error.message);
      throw error;
    }
  };

  const createUser = async (body) => {
    try {
      const response = await post(USERS.VIEW_USERS_LIST, body); // USERS.CREATE_USER should point to the user creation endpoint
      return response;
    } catch (error) {
      console.error("Error creating user:", error.message);
      throw error;
    }
  };

  const deleteUser = async (username) => {
    try {
      const response = await remove(`${USERS.VIEW_USERS_LIST}/${username}`); // USERS.DELETE_USER should point to the user deletion endpoint
      return response;
    } catch (error) {
      console.error("Error deleting user:", error.message);
      throw error;
    }
  };  

  const getUserPlans = async ()=>{
    try {
      const response = await Get(USERS.VIEW_USER_PLANS); // USERS.VIEW_USER_PLANS should point to the user plans endpoint
      return response;
    } catch (error) {
      console.error("Error fetching user plans:", error.message);
      throw error;
    }
  }

  return { getUserList ,createUser,deleteUser,getUserPlans};
};

export default useUserService;