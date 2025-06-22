"use client";
import useApiService from "@/services/useApiservice";
import { VEHICLES } from "./apiurls";

const useVehicleService = () => {
  const { Get, post, put, putUploadImage, postData } = useApiService();

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
    try {
      const response = await putUploadImage(`${VEHICLES.VEHICLE_CATEGORY_IMAGE_UPDATE}${id}`, formData);
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

  const VehicleUpdate = async (body) => {
    try {
      const response = await put(`${VEHICLES.VEHICLEUPDATE}${body.id}`, body);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const VehicleUpload = async (body) => {
    const formData = new FormData();
    console.log(body)
    try {
      // const response = await postData(VEHICLES.VEHICLEUPLOAD, formData);
      // return response;
    } catch (error) {
      throw error;
    }
  };

  return { GetVehicleVerfication, ApproveVehicleVerification, CategoryImageUpload, getCategories, VehicleUpload, VehicleUpdate };
};
export default useVehicleService;
