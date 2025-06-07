"use client";
import useApiService from "@/services/useApiservice";
import { PAYMENT } from "./apiurls";

const usePaymentService = () => {
  const { Get  } = useApiService();

  const GetPayment = (id) => {
    let url = PAYMENT.PAYMENT_HISTORY;
    if (id && typeof id !== "string") {
      url = `${url}/${id}`;
    }
    const response = Get(url);
    return response;
  };

  
  return { GetPayment };
};
export default usePaymentService;