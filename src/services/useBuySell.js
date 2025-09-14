"use client";
import useApiService from "@/services/useApiservice";
import { BUY_SELL } from "./apiurls";
import Cookies from "js-cookie";

const useBuySell = () => {
  const { Get, post, put, remove } = useApiService();

  const getBuySellVehicles = async (page) => {
    const response = await post(BUY_SELL.LIST_VEHICLES, {
      page: page.page,
      limit: page.row,
      approved_status: page.status,
    });
    return response;
  };
  const getBuySellVehiclesInterest = async (page) => {
    const response = await post(BUY_SELL.LIST_VEHICLES_INTEREST, page);
    return response;
  };

  const ApproveVehicles = async (body) => {
    const response = await post(BUY_SELL.APPROVE_BUY_SELL, body);
    return response;
  };
  return { getBuySellVehicles, ApproveVehicles,getBuySellVehiclesInterest };
};
export default useBuySell;
