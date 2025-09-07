"use client";
import useApiService from "@/services/useApiservice";
import { BIDS } from "./apiurls";
import Cookies from "js-cookie";

const useBids = () => {
  const { Get, post, put, remove } = useApiService();

  // Fetch bids using useGet
  const GetAuctions = (options) => {
    const response = post(BIDS.VIEW_AUCTIONS, {
      frequency_days: options,
    });
    return response;
  };
  const GetAuctionVehicles = (options) => {
    const response = post(BIDS.VIEW_VEHICLES, {
      auction_id: options,
    });
    return response;
  };
  const GetTopBids = (options) => {
    const response = post(BIDS.GET_TOP_BIDS, {
      auction_id: options.auction_id,
      vehicle_id: options.vehicle_id,
    });
    return response;
  };
  const GetBidSubscription = (id) => {
    let url = BIDS.BID_SUBSCRIPTION;

    const response = post(url, {
      user_id: Cookies.get("UserId"),
      subscription_source: "SUBT002",
      plan_code: id,
    });
    return response;
  };
  const createUpateBidSubscription = async (body,option) => {
    try {
      const _body = { ...body };
      const response = option ? await post(`${BIDS.CREATE_UPDATE_BID_SUBSCRIPTION}/add`, _body) : await put(`${BIDS.CREATE_UPDATE_BID_SUBSCRIPTION}/modify`, _body);
      if (response && response.error) {
        throw response.error.message;
      } else {
        return response;
      }
    } catch (error) {
      console.error("Error creating bid subscription:", error.message);
      throw error;
    }
  };
  const createUpateVehicleSubscription = async (body,option) => {
    try {
       const _body = { ...body };
      const response = option ? await post(`${BIDS.CREATE_UPDATE_BID_SUBSCRIPTION}/add`, _body) : await put(`${BIDS.CREATE_UPDATE_BID_SUBSCRIPTION}/modify`, _body);
      if (response && response.error) {
        throw response.error.message;
      } else {
        return response;
      }
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
   let url = BIDS.BID_SUBSCRIPTION;

    const response = post(url, {
      user_id: Cookies.get("UserId"),
      subscription_source: "SUBT001",
      plan_code: id,
    });
    return response;
  };

  const ApproveBid = async (body) => {
    try {
      const response = await post(BIDS.BID_APPROVAL_PAYMENT, body);
      return response;
    } catch (error) {
      console.error("Error approving bid:", error.message);
      throw error;
    }
  };
  const ApprovedBids = async (body) => {
    try {
      const response = await post(BIDS.APPROVED_BIDS, body);
      return response;
    } catch (error) {
      console.error("Error bid:", error.message);
      throw error;
    }
  };



  return { GetAuctions,GetAuctionVehicles,GetTopBids, ApproveBid, GetBidSubscription, GetVehicleSubscription, createUpateBidSubscription, deleteBidSubscription, deleteVehicleSubscription, createUpateVehicleSubscription,ApprovedBids };
};

export default useBids;
