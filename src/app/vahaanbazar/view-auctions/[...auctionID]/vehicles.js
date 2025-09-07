"use client";
import React, { useEffect, useRef, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import { Button } from "primereact/button";
import { Divider } from "primereact/divider";
import useBids from "../../../../services/useBids";
import useToastService from "../../../../services/useToastService";
import { Galleria } from "primereact/galleria";
import { FaRegEye } from "react-icons/fa";
import Image from "next/image";
import { Dialog } from "primereact/dialog";
import GetTopBids from "./get-top-bids";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Checkbox } from "primereact/checkbox";

const ViewBids = () => {
  const { showLoadingToast, updateToSuccessToast, updateToErrorToast } = useToastService();
  const { GetAuctionVehicles } = useBids();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [images, setImages] = useState([]);
  const [showDialog, setShowDialog] = useState(false);
  const [vehicleID, setVehicleID] = useState(null);
  const params = useParams();
  const AuctionId = params?.auctionID ? params.auctionID[0] : null;

  const galleria = useRef(null);

  const responsiveOptions = [
    {
      breakpoint: "1500px",
      numVisible: 5,
    },
    {
      breakpoint: "1024px",
      numVisible: 3,
    },
    {
      breakpoint: "768px",
      numVisible: 2,
    },
    {
      breakpoint: "560px",
      numVisible: 1,
    },
  ];

  const FetchVehicles = async (AuctionId) => {
    setLoading(true); // Start loading spinner
    try {
      const response = await GetAuctionVehicles(AuctionId);
      if (response || response.data) setData(response.data?.vehicles); // Set the fetched data
      setLoading(false); // Stop loading spinner
    } catch (error) {
      console.error("Error fetching Vehicles:", error.message);
    } finally {
      setLoading(false); // Stop loading spinner
    }
  };
  useEffect(() => {
    FetchVehicles(AuctionId);
  }, []);

  const approveButtonTemplate = (rowData) => {
    const handleApprove = () => {
      const body = {
        registration_no: rowData.vehicle_details.registration_no,
        auction_id: rowData.auction_id,
        vehicle_id: rowData.vehicle_id,
        bid_id: rowData.bid_id,
      };
      const toastId = showLoadingToast("Approving Bid...");
      ApproveBid(body)
        .then((response) => {
          if (response) updateToSuccessToast(toastId, "Bid approved successfully");
          FetchBids();
        })
        .catch(() => {
          updateToErrorToast(toastId, "Error approving bid");
        });
    };

    return <Button label="Approve" className="approval-button" style={{ backgroundColor: "#4CAF50", color: "white", border: "none" }} onClick={handleApprove} />;
  };

  const statusBodyTemplate = (rowData) => {
    return (
      <span className={`${rowData.status === "approved" ? "text-green-800 font-bold" : rowData.status === "pending" ? "text-yellow-500 font-bold" : "text-red-500 font-bold"}`}>
        {rowData.status.toUpperCase()}
      </span>
    );
  };

  const itemTemplate = (item) => <Image src={item?.itemImageSrc} alt={item?.alt} style={{ width: "full", display: "block" }} width={1000} height={1000} />;

  const thumbnailTemplate = (item) => <Image src={item?.itemImageSrc} alt={item?.alt} style={{ display: "block" }} width={100} height={100} />;

  const openGallery = (rowData) => {
    if (galleria.current) {
      galleria.current.show();
      let urls = [];
      try {
        const imgObj = rowData.images;
        urls = imgObj;
      } catch (e) {
        console.error("Error parsing image URLs:", e);
        urls = [];
      }
      if (urls && urls.length > 0) {
        setImages(urls?.map((url) => ({ itemImageSrc: url, alt: "Vehicle Image" })));
      }
    }
  };

  const imageBody = (rowData) => (
    <div className="d-flex justify-content-center link_pointer" onClick={() => openGallery(rowData)}>
      <FaRegEye color={"blue"} size={17} />
    </div>
  );

  const GetBids = (rowData) => {
    return (
      <div className="d-flex justify-content-center">
        <Button
          label="Get Bids"
          className="approval-button"
          style={{ backgroundColor: "#2196F3", color: "white", border: "none" }}
          onClick={() => {
            setVehicleID(rowData.vehicle_id);
            setShowDialog(true);
          }}
        />
      </div>
    );
  };

  const handleDialogClose = () => {
    setShowDialog(false);
    setVehicleID(null);
  };

  return (
    <>
      <Dialog header={"Get Top Bids"} visible={showDialog} style={{ width: "50%" }} onHide={() => handleDialogClose()}>
        <GetTopBids vehicleID={vehicleID} auctionID={AuctionId} />
      </Dialog>
      <Galleria
        ref={galleria}
        value={images}
        responsiveOptions={responsiveOptions}
        numVisible={9}
        baseZIndex={100000}
        style={{ maxWidth: "50%" }}
        circular
        fullScreen
        showItemNavigators
        item={itemTemplate}
        thumbnail={thumbnailTemplate}
        onHide={() => {
          galleria.current.hide();
          setImages([]);
        }}
      />
      <div className="viewDetailsSection">
        <div className="flex justify-between items-center ">
          <h2 className="text-xl font-bold">View Vehicles</h2>
        </div>
        <Divider />

        <div className="h-full">
          <DataTable
            value={data}
            columnResizeMode="expand"
            scrollable
            scrollHeight="flex" // Vertical scroll
            className="p-datatable-gridlines h-100"
            loading={loading} // Show loading spinner
            lazy
          >
            <Column field="vehicle_id" header="Vehicle ID" bodyStyle={{ minWidth: "120px", maxWidth: "160px" }} />
            <Column field="registration_no" header="Registration No" bodyStyle={{ minWidth: "150px", maxWidth: "200px" }} />
            <Column field="make" header="Make" bodyStyle={{ minWidth: "150px", maxWidth: "250px" }} />
            <Column field="model" header="Model" bodyStyle={{ minWidth: "150px", maxWidth: "200px" }} />
            <Column field="variant" header="Variant" bodyStyle={{ minWidth: "120px", maxWidth: "160px" }} />
            <Column field="year" header="Year" bodyStyle={{ minWidth: "100px", maxWidth: "120px" }} />
            <Column field="colour" header="Colour" bodyStyle={{ minWidth: "100px", maxWidth: "120px" }} />
            <Column field="fuel_type" header="Fuel Type" bodyStyle={{ minWidth: "120px", maxWidth: "140px" }} />
            <Column field="transmission" header="Transmission" bodyStyle={{ minWidth: "120px", maxWidth: "140px" }} />
            <Column field="chassis_no" header="Chassis No" bodyStyle={{ minWidth: "150px", maxWidth: "250px" }} />
            <Column field="engine_no" header="Engine No" bodyStyle={{ minWidth: "150px", maxWidth: "180px" }} />
            <Column field="owner" header="Owner" bodyStyle={{ minWidth: "120px", maxWidth: "140px" }} />
            <Column field="kilometers" header="Kilometers" bodyStyle={{ minWidth: "100px", maxWidth: "120px" }} align="right" />
            <Column field="market_value" header="Market Value" bodyStyle={{ minWidth: "120px", maxWidth: "140px" }} align="right" />
            <Column field="minimum_price" header="Min Price" bodyStyle={{ minWidth: "120px", maxWidth: "140px" }} align="right" />
            <Column field="reserve_price" header="Reserve Price" bodyStyle={{ minWidth: "120px", maxWidth: "140px" }} align="right" />
            <Column field="max_bids" header="Max Bids" bodyStyle={{ minWidth: "100px", maxWidth: "120px" }} align="right" />
            <Column field="parking_charges" header="Parking Charges" bodyStyle={{ minWidth: "120px", maxWidth: "140px" }} align="right" />
            <Column field="transaction_fees" header="Transaction Fees" bodyStyle={{ minWidth: "120px", maxWidth: "140px" }} align="right" />
            <Column field="rc_availability" header="RC Availability" bodyStyle={{ minWidth: "120px", maxWidth: "140px" }} />
            <Column field="registered_rto" header="Registered RTO" bodyStyle={{ minWidth: "150px", maxWidth: "180px" }} />
            <Column field="yard_name" header="Yard Name" bodyStyle={{ minWidth: "150px", maxWidth: "200px" }} />
            <Column field="yard_location" header="Yard Location" bodyStyle={{ minWidth: "200px", maxWidth: "400px" }} />
            <Column field="contact_person_name" header="Contact Person Name" bodyStyle={{ minWidth: "150px", maxWidth: "200px" }} />
            <Column field="contact_person_number" header="Contact Person Number" bodyStyle={{ minWidth: "150px", maxWidth: "200px" }} />
            <Column field="seller_reference" header="Seller Reference" bodyStyle={{ minWidth: "150px", maxWidth: "200px" }} />
            <Column field="repo_date" header="Repo Date" bodyStyle={{ minWidth: "150px", maxWidth: "200px" }} />
            <Column field="remarks" header="Remarks" bodyStyle={{ minWidth: "200px", maxWidth: "400px" }} />
            <Column
              field="status"
              header="Status"
              bodyStyle={{ minWidth: "100px", maxWidth: "120px" }}
              body={(rowData) => (
                <Checkbox
                  inputId={`status-${rowData.bid_id}`}
                  checked={rowData.status === "active"} // or whatever status condition you want
                  disabled
                />
              )}
            />
            <Column field="inserted_at" header="Inserted At" body={(row) => row.inserted_at?.slice(0, 19).replace("T", " ")} bodyStyle={{ minWidth: "180px", maxWidth: "220px" }} />
            <Column field="updated_at" header="Updated At" body={(row) => row.updated_at?.slice(0, 19).replace("T", " ")} bodyStyle={{ minWidth: "180px", maxWidth: "220px" }} />
            <Column field="images" header="Images" body={imageBody} bodyStyle={{ minWidth: "80px", maxWidth: "120px" }} />
            <Column header="Get Bids" body={GetBids} bodyStyle={{ minWidth: "80px", maxWidth: "120px" }} />
          </DataTable>
        </div>
      </div>
    </>
  );
};

export default ViewBids;
