import { Divider } from "primereact/divider";
import { Dropdown } from "primereact/dropdown";
import React, { useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import useBids from "../../../services/useBids";
import { Checkbox } from "primereact/checkbox";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import PaymentApproval from "./paymentApproval";
import useToastService from "../../../services/useToastService";

const ApproveBids = () => {
  const { GetAuctions, ApprovedBids,ApproveBid } = useBids();
  const { showLoadingToast, updateToSuccessToast, updateToErrorToast } = useToastService();
  const [loading, setLoading] = useState(false);
  const [dropdownLoading, setDropdownLoading] = useState(false);
  const [dropdownValue, setDropdownValue] = useState();
  const [auctions, setAuctions] = useState([]);
  const [bidPaymentApprove, setBidPaymentApprove] = useState(null);
  const [approvedBids, setApprovedBids] = useState([]);
  const [showDialog, setShowDialog] = useState(false);
  const FetchBids = async (days) => {
    setDropdownLoading(true);
    try {
      const response = await GetAuctions(days);
      if (response || response.data) setAuctions(response.data?.auctions);
      setDropdownLoading(false);
    } catch (error) {
      console.error("Error fetching bids:", error.message);
    } finally {
      setDropdownLoading(false);
    }
  };
  useEffect(() => {
    FetchBids(7);
  }, []);

  const dateTemplate = (rowData, field) => {
    if (!rowData[field]) return "-";
    return rowData[field]?.slice(0, 19).replace("T", " ");
  };

  const fetchApprovedBids = async (id) => {
    try {
      setLoading(true);
      const response = await ApprovedBids({ auction_id: id });
      if (response || response.data) setApprovedBids(response.data?.approved_bids);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching bids:", error.message);
    } finally {
      setDropdownLoading(false);
    }
  };

  const onChangeAuction = (e) => {
    setDropdownValue(e.value);
    fetchApprovedBids(e.value?.auction_id);
  };

  const GetBankApproved = (rowData) => {
    return (
      <div className="d-flex justify-content-center">
        {["pending", "bank_approved"].includes(rowData.payment_status) && (
          <Button
            label="Approve"
            className="approval-button"
            style={{ backgroundColor: "#2196F3", color: "white", border: "none" }}
            onClick={() => {
              setBidPaymentApprove({
                payment_status: rowData.payment_status,
                payment_reference: "",
                remarks: "",
                auction_id: dropdownValue.auction_id,
                vehicle_id: rowData.vehicle_id,
                user_id: rowData.user_id,
              });
              setShowDialog(true);
            }}
          />
        )}
      </div>
    );
  };

  const handleDialogClose = () => {
    setShowDialog(false);
    setBidPaymentApprove(null);
  };

  const handleDialogSubmit = async (bidPaymentApprove) => {
    const toastId = showLoadingToast("Loading Approval...");
    let error = true
    if (bidPaymentApprove.payment_status === "done") {
      if (bidPaymentApprove.payment_reference === "" && bidPaymentApprove.remarks === "") {
        updateToErrorToast(toastId, "payment reference and remarks must required");
        error=false
      }
    }
    if (bidPaymentApprove.payment_status === "failed") {
      if (bidPaymentApprove.remarks === "") {
        updateToErrorToast(toastId, "remarks must required");
        error=false
      }
    }
    if(error){
        try {
          const response = await ApproveBid(bidPaymentApprove);
          if (response || response.data) {
            setShowDialog(false);
            fetchApprovedBids(dropdownValue.auction_id);
            updateToSuccessToast(toastId, "Approved successfully");
          } else {
            updateToErrorToast(toastId, "Error Occured");
          }
        } catch (err) {
          updateToErrorToast(toastId, "Error Occured");
        }

    }
  };

  return (
    <>
      <Dialog
        header={"Payment Approval"}
        visible={showDialog}
        style={{ width: "30%" }}
        onHide={() => handleDialogClose()}
        footer={
          <div className="flex justify-end gap-4">
            <Button label="Cancel" className=" secondaryBtn p-button-text" onClick={() => handleDialogClose()} />
            <Button label={"Approve"} className="bg-blue-500 text-white" onClick={() => handleDialogSubmit(bidPaymentApprove)} />
          </div>
        }
      >
        <PaymentApproval bidPaymentApprove={bidPaymentApprove} setBidPaymentApprove={setBidPaymentApprove} />
      </Dialog>
      <div className="viewDetailsSection">
        <div className="flex justify-between items-center row">
          <div className="col-4">
            <h2 className="text-xl font-bold">Approved Bids</h2>
          </div>
          <div className="col-4">
            <Dropdown
              options={auctions}
              value={dropdownValue}
              onChange={onChangeAuction}
              optionLabel="auction_id"
              dataKey="auction_id"
              placeholder="Select Auction"
              loading={dropdownLoading}
              loadingIcon
            />
          </div>
        </div>
        <Divider />
        <div className="h-full">
          <DataTable value={approvedBids} className="p-datatable-gridlines h-100" dataKey="plan_id" columnResizeMode="expand" scrollable scrollHeight="flex" loading={loading}>
            <Column field="bid_id" header="Bid ID" bodyStyle={{ minWidth: "120px", maxWidth: "150px" }} />
            <Column field="user_id" header="User ID" bodyStyle={{ minWidth: "120px", maxWidth: "200px" }} />
            <Column field="vehicle_id" header="Vehicle ID" bodyStyle={{ minWidth: "120px", maxWidth: "200px" }} />
            <Column field="bidding_amount" header="Bidding Amount" bodyStyle={{ minWidth: "140px", maxWidth: "200px" }} />
            <Column field="user_vehicle_bid_count" header="Bid Count" bodyStyle={{ minWidth: "100px", maxWidth: "150px" }} />

            <Column field="payment_status" header="Payment Status" bodyStyle={{ minWidth: "140px", maxWidth: "200px" }} />
            <Column
              field="winning_letter_status"
              header="Winning Letter"
              bodyStyle={{ minWidth: "150px", maxWidth: "220px" }}
              align={"center"}
              body={(rowData) => <Checkbox inputId={`winning_letter_status-${rowData.bid_id}`} checked={rowData.winning_letter_status === "sent"} disabled />}
            />
            <Column
              field="insurance_interest"
              header="Insurance Interest"
              bodyStyle={{ minWidth: "150px", maxWidth: "220px" }}
              align={"center"}
              body={(rowData) => <Checkbox inputId={`insurance_interest-${rowData.bid_id}`} checked={rowData.insurance_interest === "Yes"} disabled />}
            />
            <Column field="vehicle_make" header="Make" bodyStyle={{ minWidth: "200px", maxWidth: "300px" }} />
            <Column field="vehicle_model" header="Model" bodyStyle={{ minWidth: "120px", maxWidth: "200px" }} />
            <Column field="vehicle_year" header="Year" bodyStyle={{ minWidth: "100px", maxWidth: "150px" }} />
            <Column field="registration_no" header="Reg No." bodyStyle={{ minWidth: "160px", maxWidth: "220px" }} />
            <Column field="fuel_type" header="Fuel" bodyStyle={{ minWidth: "100px", maxWidth: "150px" }} />
            <Column field="transmission" header="Transmission" bodyStyle={{ minWidth: "140px", maxWidth: "200px" }} />
            <Column field="kilometres" header="KMs" bodyStyle={{ minWidth: "100px", maxWidth: "150px" }} />
            <Column field="colour" header="Colour" bodyStyle={{ minWidth: "120px", maxWidth: "180px" }} />
            <Column field="minimum_price" header="Min Price" bodyStyle={{ minWidth: "140px", maxWidth: "200px" }} />
            <Column field="reserve_price" header="Reserve Price" bodyStyle={{ minWidth: "150px", maxWidth: "220px" }} />
            <Column field="market_value" header="Market Value" bodyStyle={{ minWidth: "150px", maxWidth: "220px" }} />
            <Column field="bid_date" header="Bid Date" body={(rowData) => dateTemplate(rowData, "bid_date")} bodyStyle={{ minWidth: "180px", maxWidth: "250px" }} />
            <Column field="approval_date" header="Approval Date" body={(rowData) => dateTemplate(rowData, "approval_date")} bodyStyle={{ minWidth: "180px", maxWidth: "250px" }} />
            <Column field="user_name" header="User Name" bodyStyle={{ minWidth: "160px", maxWidth: "250px" }} />
            <Column field="user_email" header="Email" bodyStyle={{ minWidth: "200px", maxWidth: "300px" }} />
            <Column field="user_phone" header="Phone" bodyStyle={{ minWidth: "140px", maxWidth: "200px" }} />
            <Column header="Bank / Payment Approval" body={GetBankApproved} bodyStyle={{ minWidth: "200px", maxWidth: "200px" }} />
          </DataTable>
        </div>
      </div>
    </>
  );
};

export default ApproveBids;
