"use client";
import useApiService from "@/services/useApiservice";
import { VEHICLES } from "./apiurls";

const useVehicleService = () => {
  const { Get, post,  } = useApiService();

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
  return { GetVehicleVerfication, ApproveVehicleVerification };
};
export default useVehicleService;
