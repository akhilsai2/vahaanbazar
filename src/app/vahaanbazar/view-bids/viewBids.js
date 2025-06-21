"use client";
import React, { useEffect, useRef, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { ColumnGroup } from "primereact/columngroup";
import { Row } from "primereact/row";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import { Button } from "primereact/button";
import { Divider } from "primereact/divider";
import useBids from "../../../services/useBids";
import useToastService from "../../../services/useToastService";
import Cookies from "js-cookie";
import { Galleria } from "primereact/galleria";
import { FaRegEye } from "react-icons/fa";
import Image from "next/image";

const ViewBids = () => {
  const { showLoadingToast, updateToSuccessToast, updateToErrorToast } = useToastService();
  const { GetBids, ApproveBid } = useBids(); // Fetch bids using useBids service
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
 const[images, setImages] = useState([]); // State to hold images for the gallery
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

  const FetchBids = async () => {
    setLoading(true); // Start loading spinner
    try {
      const response = await GetBids();
      if (response || response.data) setData(response.data); // Set the fetched data
      setLoading(false); // Stop loading spinner
    } catch (error) {
      console.error("Error fetching bids:", error.message);
    } finally {
      setLoading(false); // Stop loading spinner
    }
  };
  useEffect(() => {
    FetchBids();
  }, [Cookies.get("AccessToken")]);

  // Approve Button Renderer
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
      <span
        className={`${
          rowData.status === "approved"
            ? "text-green-800 font-bold" // Tailwind class for green text
            : rowData.status === "pending"
            ? "text-yellow-500 font-bold" // Tailwind class for yellow text
            : "text-red-500 font-bold" // Tailwind class for red text
        }`}
      >
        {rowData.status.toUpperCase()}
      </span>
    );
  };

  // Define the header group
  const headerGroup = (
    <ColumnGroup>
      <Row>
        <Column header="Bid Details" colSpan={5} />
        <Column header="Vehicle Details" colSpan={25} />
      </Row>
      <Row>
        <Column header="Auction ID" />
        <Column header="Bid ID" />
        <Column header="Vehicle ID" />
        <Column header="Bid Amount" />
        <Column header="Status" />
        <Column header="Registration No" />
        <Column header="Make" />
        <Column header="Model" />
        <Column header="Year" />
        <Column header="Fuel Type" />
        <Column header="State" />
        <Column header="City" />
        <Column header="Yard Name" />
        <Column header="RC Availability" />
        <Column header="Chassis No" />
        <Column header="Engine No" />
        <Column header="Owner" />
        <Column header="Reg Date" />
        <Column header="Market Value" />
        <Column header="Min Price" />
        <Column header="Max Bids" />
        <Column header="Current Highest Bid" />
        <Column header="Reserve Price" />
        <Column header="Seller Reference" />
        <Column header="Repo Date" />
        <Column header="Parking Charges" />
        <Column header="Transaction Fees" />
        <Column header="Contact Person" />
        <Column header="Images" />
        <Column header="Approval" />
      </Row>
    </ColumnGroup>
  );

 const itemTemplate = (item) => (
  <Image src={item?.itemImageSrc} alt={item?.alt} style={{ width: "full", display: "block" }} width={1000} height={1000}/>
);

const thumbnailTemplate = (item) => (
  <Image src={item?.itemImageSrc} alt={item?.alt} style={{ display: "block" }} width={100} height={100} />
);

 const openGallery = (rowData) => {
  if (galleria.current) {
    galleria.current.show();
    let urls = [];
    try {
      const imgObj = rowData.vehicle_details.images?.[0];
      if (imgObj && typeof imgObj.image_url === "string") {
        urls = JSON.parse(imgObj.image_url);
      }
    } catch (e) {
      console.error("Error parsing image URLs:", e);
      urls = [];
    }
    if(urls && urls.length>0){
      setImages(urls?.map(url => ({ itemImageSrc: url, alt: "Vehicle Image" })));
    }
  }
};

  const imageBody = (rowData) => (
    <div className="d-flex justify-content-center link_pointer" onClick={()=>openGallery(rowData)}>
      <FaRegEye color={"blue"} size={17} />
    </div>
  );

  return (
    <>
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
        onHide={()=>{
          galleria.current.hide()
          setImages([])
        }}
      />
      <div className="viewDetailsSection">
        <div className="flex justify-between items-center ">
          <h2 className="text-xl font-bold">View Bids</h2>
        </div>
        <Divider />

        <div className="h-full">
          <DataTable
            value={data}
            columnResizeMode="expand"
            scrollable
            scrollHeight="flex" // Vertical scroll
            headerColumnGroup={headerGroup}
            className="p-datatable-gridlines h-100"
            loading={loading} // Show loading spinner
            lazy
          >
            {/* Bid Details Columns */}
            <Column field="auction_id" header="Auction ID" bodyStyle={{ minWidth: "80px" }} />
            <Column field="bid_id" header="Bid ID" bodyStyle={{ minWidth: "80px" }} />
            <Column field="vehicle_id" header="Vehicle ID" bodyStyle={{ minWidth: "90px" }} />
            <Column field="bid_amount" header="Bid Amount" bodyStyle={{ minWidth: "120px" }} />
            <Column field="status" header="Status" bodyStyle={{ minWidth: "120px" }} body={statusBodyTemplate} />

            {/* Vehicle Details Columns */}
            <Column field="vehicle_details.registration_no" header="Registration No" bodyStyle={{ minWidth: "200px" }} />
            <Column field="vehicle_details.make" header="Make" bodyStyle={{ minWidth: "120px" }} />
            <Column field="vehicle_details.model" header="Model" bodyStyle={{ minWidth: "150px" }} />
            <Column field="vehicle_details.year" header="Year" bodyStyle={{ minWidth: "100px" }} />
            <Column field="vehicle_details.fuel_type" header="Fuel Type" bodyStyle={{ minWidth: "120px" }} />
            <Column field="vehicle_details.state" header="State" bodyStyle={{ minWidth: "120px" }} />
            <Column field="vehicle_details.city" header="City" bodyStyle={{ minWidth: "120px" }} />
            <Column field="vehicle_details.yard_name" header="Yard Name" bodyStyle={{ minWidth: "150px" }} />
            <Column field="vehicle_details.rc_availability" header="RC Availability" bodyStyle={{ minWidth: "150px" }} />
            <Column field="vehicle_details.chassis_no" header="Chassis No" bodyStyle={{ minWidth: "150px" }} />
            <Column field="vehicle_details.engine_no" header="Engine No" bodyStyle={{ minWidth: "150px" }} />
            <Column field="vehicle_details.owner" header="Owner" bodyStyle={{ minWidth: "120px" }} />
            <Column field="vehicle_details.reg_date" header="Reg Date" bodyStyle={{ minWidth: "120px" }} />
            <Column field="vehicle_details.market_value" header="Market Value" bodyStyle={{ minWidth: "120px" }} />
            <Column field="vehicle_details.min_price" header="Min Price" bodyStyle={{ minWidth: "120px" }} />
            <Column field="vehicle_details.max_bids" header="Max Bids" bodyStyle={{ minWidth: "120px" }} />
            <Column field="vehicle_details.current_highest_bid" header="Current Highest Bid" bodyStyle={{ minWidth: "150px" }} />
            <Column field="vehicle_details.reserve_price" header="Reserve Price" bodyStyle={{ minWidth: "150px" }} />
            <Column field="vehicle_details.seller_reference" header="Seller Reference" bodyStyle={{ minWidth: "150px" }} />
            <Column field="vehicle_details.repo_date" header="Repo Date" bodyStyle={{ minWidth: "120px" }} />
            <Column field="vehicle_details.parking_charges" header="Parking Charges" bodyStyle={{ minWidth: "150px" }} />
            <Column field="vehicle_details.transaction_fees" header="Transaction Fees" bodyStyle={{ minWidth: "150px" }} />
            <Column field="vehicle_details.contact_person" header="Contact Person" bodyStyle={{ minWidth: "150px" }} />
            <Column field="" header="Images" bodyStyle={{ minWidth: "50px" }} body={imageBody} />
            <Column
              header="Actions"
              body={(rowData) => (rowData.status !== "approved" ? approveButtonTemplate(rowData) : null)}
              bodyStyle={{ minWidth: "150px", textAlign: "center" }}
              align={"center"}
            />
          </DataTable>
        </div>
      </div>
    </>
  );
};

export default ViewBids;
