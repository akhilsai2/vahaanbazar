"use client";
import useApiService from "@/services/useApiservice";
import { VEHICLES } from "./apiurls";

const useVehicleService = () => {
  const { Get, post, put } = useApiService();

  const GetVehicleVerfication = (id) => {
    let url = VEHICLES.VEHICLE_VERFICATION;
    if (id && typeof id !== "string") {
      url = `${url}/${id}`;
    }
    const response = Get(url);
    return response;
  };

  const ApproveVehicleVerification = async (body) => {
    try {
      const response = await post(VEHICLES.VEHICLE_APPROVAL, body);
      return response;
    } catch (error) {
      console.error("Error approving vehicle verification:", error.message);
      throw error;
    }
  };

  const CategoryImageUpload = async (files, selectedCategory, id) => {
    
    const formData = new FormData();
    formData.append("category", selectedCategory);

    files.forEach((file) => {
      formData.append("image", file);
    });
   for (let pair of formData.entries()) {
  console.log(pair[0], pair[1]);
}
    try {
      const response = await put(`${VEHICLES.VEHICLE_CATEGORY_IMAGE_UPDATE}${id}`, formData);
      return response;
    } catch (error) {
      console.error("Error while uplaoding:", error.message);
      throw error;
    }
  };

  const getCategories = async () => {
    try {
      const response = await Get(VEHICLES.CATEGORIES);
      return response;
    } catch (error) {
      throw error;
    }
  };

  return { GetVehicleVerfication, ApproveVehicleVerification, CategoryImageUpload, getCategories };
};
export default useVehicleService;
