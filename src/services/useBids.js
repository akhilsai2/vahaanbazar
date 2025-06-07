"use client";
import useApiService from "@/services/useApiservice";
import { BIDS } from "./apiurls";

const useBids = () => {
  const { Get, post, put, remove } = useApiService();

  // Fetch bids using useGet
  const GetBids = (options = {}) => {
    const response = Get(BIDS.VIEW_BIDS, options);
    return response;
  };
  const GetBidSubscription = (id) => {
    let url = BIDS.BID_SUBSCRIPTION;
    if (id && typeof id !== "string") {
      url = `${url}/${id}`;
    }
    const response = Get(url);
    return response;
  };
  const createUpateBidSubscription = async (body) => {
    try {
      const id = body.plan_id;
      delete body.plan_id;
      delete body.is_active;
      const _body = { ...body, spend_limit: parseInt(body.spend_limit) };
      const response = typeof id === "string" ? await post(BIDS.BID_SUBSCRIPTION, _body) : await put(`${BIDS.BID_SUBSCRIPTION}/${id}`, _body);
      return response;
    } catch (error) {
      console.error("Error creating bid subscription:", error.message);
      throw error;
    }
  };
  const createUpateVehicleSubscription = async (body) => {
    try {
      const id = body.plan_id;
      delete body.plan_id;
      delete body.is_active;
      const _body = { ...body };     
      const response =  typeof id === "string" ? await post(BIDS.VEHICLE_SUBSCRIPTION, _body) : await put(`${BIDS.VEHICLE_SUBSCRIPTION}/${id}`, _body);
      return response;
    } catch (error) {
      console.error("Error creating Vehicle subscription:", error.message);
      throw error;
    }
  };

  const deleteVehicleSubscription = async (id) => {
    try {
      const response = await remove(`${BIDS.VEHICLE_SUBSCRIPTION}/${id}`);
      return response;
    } catch (error) {
      console.error("Error deleting Vehicle subscription:", error.message);
      throw error;
    }
  };
  const deleteBidSubscription = async (id) => {
    try {
      const response = await remove(`${BIDS.BID_SUBSCRIPTION}/${id}`);
      return response;
    } catch (error) {
      console.error("Error deleting bid subscription:", error.message);
      throw error;
    }
  };
  const GetVehicleSubscription = (id) => {
    let url = BIDS.VEHICLE_SUBSCRIPTION;
    if (id && typeof id !== "string") {
      url = `${url}/${id}`;
    }
    const response = Get(url);
    return response;
  };

  const ApproveBid = async (body) => {
    try {
      const response = await post(BIDS.BID_APPROVAL, body);
      return response;
    } catch (error) {
      console.error("Error approving bid:", error.message);
      throw error;
    }
  };

  return { GetBids, ApproveBid, GetBidSubscription, GetVehicleSubscription, createUpateBidSubscription, deleteBidSubscription,deleteVehicleSubscription,createUpateVehicleSubscription };
};

export default useBids;
