import React, { useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import useBids from "../../../../services/useBids";
import { Button } from "primereact/button";
import useToastService from "../../../../services/useToastService";

const GetTopBids = ({ vehicleID, auctionID }) => {
  const [vehicleBids, setVehicleBids] = useState([]);
  const [loading, setLoading] = useState(false);
  const { GetTopBids ,ApproveBid} = useBids();
  const { showLoadingToast, updateToSuccessToast, updateToErrorToast } = useToastService();

  const fetchVehicleBids = async () => {
    setLoading(true);
    try {
      if (vehicleID) {
        const response = await GetTopBids({ vehicle_id: vehicleID, auction_id: auctionID });
        if (response || response.data) setVehicleBids(response.data?.bids);
      }
    } catch (error) {
      console.error("Error fetching bids:", error.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchVehicleBids();
  }, [vehicleID, auctionID]);

  
  const approveBidBody = (rowData) => {
      const handleApprove = async()=>{
      const toastId = showLoadingToast("Approving Bid...");
      const body = {
        auction_id: rowData.auction_id,
        vehicle_id: rowData.vehicle_id,
        user_id: rowData.user_id,
      }
          ApproveBid(body)
            .then((response) => {
              if (response && response.data) {
                updateToSuccessToast(toastId, "Bid approved successfully");
                fetchVehicleBids();
              }else{
                updateToErrorToast(toastId, response.error?.details?.message || "Error approving bid");
              }
            })
            .catch(() => {
              updateToErrorToast(toastId, "Error approving bid");
            });
      }
   return <Button label="Approve" className="approval-button" style={{ backgroundColor: "#4CAF50", color: "white", border: "none" }} onClick={handleApprove}  />
  }

  return (
    <div>
      <DataTable
        value={vehicleBids}
        loading={loading}
        className="p-datatable-gridlines"
        scrollable
        scrollHeight="200px"
      >
        <Column field="auction_id" header="Auction ID" bodyStyle={{ minWidth: "120px", maxWidth: "160px" }} />
        <Column field="vehicle_id" header="Vehicle ID" bodyStyle={{ minWidth: "120px", maxWidth: "160px" }} />
        <Column field="user_id" header="User ID" bodyStyle={{ minWidth: "120px", maxWidth: "160px" }} />
        <Column field="bidding_amount" header="Bidding Amount" bodyStyle={{ minWidth: "120px", maxWidth: "160px" }} align="right" />
            {/* <Column body={approveBidBody} header="Action" bodyStyle={{ minWidth: "120px", maxWidth: "160px" }} /> */}
      </DataTable>
    </div>
  );
};

export default GetTopBids;