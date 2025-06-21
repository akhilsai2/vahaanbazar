"use client";
import React, { useEffect, useRef, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import { Button } from "primereact/button";
import { Divider } from "primereact/divider";
import useToastService from "../../../services/useToastService";
import Cookies from "js-cookie";
import useVehicleService from "../../../services/useVehicleService";
import { Checkbox } from "primereact/checkbox";
import { FaRegEye } from "react-icons/fa";
import { Galleria } from "primereact/galleria";
import { Dialog } from "primereact/dialog";
import VehicleUpdate from "./vehicel-update"; 

const VehicleVerification = () => {
  const { showLoadingToast, updateToSuccessToast, updateToErrorToast } = useToastService();
  const { GetVehicleVerfication, ApproveVehicleVerification } = useVehicleService(); // Fetch bids using useBids service
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [images, setImages] = useState([]); // State to hold images for the gallery
  const galleria = useRef(null);
  const [showUpdateDialog, setShowUpdateDialog] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);

  // ID column body template
  const idBody = (rowData) => (
    <span
      className="text-blue-600 hover:underline cursor-pointer"
      onClick={() => {
        setSelectedVehicle(rowData);
        setShowUpdateDialog(true);
      }}
    >
      {rowData.id}
    </span>
  );

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
  const FetchVehicleVerification = async () => {
    setLoading(true); // Start loading spinner
    try {
      const response = await GetVehicleVerfication();
      if (response || response.data) setData(response.data); // Set the fetched data
      setLoading(false); // Stop loading spinner
    } catch (error) {
      console.error("Error fetching bids:", error.message);
    } finally {
      setLoading(false); // Stop loading spinner
    }
  };
  useEffect(() => {
    FetchVehicleVerification();
  }, [Cookies.get("AccessToken")]);

  // Approve Button Renderer
  const approveButtonTemplate = (rowData) => {
    const handleApprove = () => {
      const body = {
        application_id: rowData.id,
        registration_number: rowData.registration_number,
      };
      const toastId = showLoadingToast("Approving Vehicle...");
      ApproveVehicleVerification(body)
        .then((response) => {
          if (response) updateToSuccessToast(toastId, "Vehicle approved successfully");
          FetchVehicleVerification();
        })
        .catch(() => {
          updateToErrorToast(toastId, "Error approving vehicle");
        });
    };

    return <Button label="Approve" className="approval-button" style={{ backgroundColor: "#4CAF50", color: "white", border: "none" }} onClick={handleApprove} />;
  };

  const isActiveInsurance = (rowData) => {
    return <Checkbox checked={rowData.insurance} disable={"true"} className="p-checkbox-sm" />;
  };
  const isActiveGst = (rowData) => {
    return <Checkbox checked={rowData.gst_applicable} disable={"true"} className="p-checkbox-sm" />;
  };

  const isOrginalInvoice = (rowData) => {
    return <Checkbox checked={rowData.original_invoice} disable={"true"} className="p-checkbox-sm" />;
  };

  const itemTemplate = (item) => <img src={item?.itemImageSrc} alt={item.alt} style={{ width: "100%", display: "block" }} />;

  const thumbnailTemplate = (item) => <img src={item?.itemImageSrc} alt={item.alt} style={{ display: "block" }} />;
  const openGallery = (rowData) => {
    if (galleria.current) {
      galleria.current.show();  
      setImages(rowData.fitness_images.map((url) => ({ itemImageSrc: url.image, alt: "Vehicle Image" })));
    }
  };
  const imageBody = (rowData) => (
    <div className="d-flex justify-content-center link_pointer" onClick={() => openGallery(rowData)}>
      <FaRegEye color={"blue"} size={17} />
    </div>
  );

  return (
    <>
     <Dialog
        header="Update Vehicle"
        visible={showUpdateDialog}
        style={{ width: "75%" }}
        onHide={() => setShowUpdateDialog(false)}
      >
        {selectedVehicle && (
          <VehicleUpdate
            initialData={selectedVehicle}
            // onSubmit={handleVehicleUpdate}
          />
        )}
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
          <h2 className="text-xl font-bold">Vehicle Verification</h2>
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
            <Column field="id" header="ID" bodyStyle={{ minWidth: "60px", maxWidth: "80px" }} body={idBody} />
            <Column field="category" header="Category" bodyStyle={{ minWidth: "100px", maxWidth: "120px" }} />
            <Column field="price" header="Price" bodyStyle={{ minWidth: "120px", maxWidth: "140px" }} align={"right"} />
            <Column field="registration_number" header="Registration Number" bodyStyle={{ minWidth: "150px", maxWidth: "180px" }} align={"right"} />
            <Column field="state" header="State" bodyStyle={{ minWidth: "100px", maxWidth: "120px" }} />
            <Column field="brand" header="Brand" bodyStyle={{ minWidth: "100px", maxWidth: "120px" }} />
            <Column field="no_of_tyres" header="No. of Tyres" bodyStyle={{ minWidth: "100px", maxWidth: "120px" }} align={"right"} />
            <Column field="chassis_number" header="Chassis Number" bodyStyle={{ minWidth: "150px", maxWidth: "180px" }} />
            <Column field="location" header="Location" bodyStyle={{ minWidth: "120px", maxWidth: "140px" }} />
            <Column field="original_invoice" header="Original Invoice" body={isOrginalInvoice} bodyStyle={{ minWidth: "120px", maxWidth: "140px" }} align={"center"} />
            <Column field="asset_description" header="Asset Description" bodyStyle={{ minWidth: "150px", maxWidth: "200px" }} />
            <Column field="year_of_manufacturing" header="Manufacturing(Yrs)" bodyStyle={{ minWidth: "120px", maxWidth: "170px" }} align={"center"} />
            <Column field="odometer" header="Odometer(KM)" bodyStyle={{ minWidth: "100px", maxWidth: "120px" }} align={"right"} />
            <Column field="insurance" header="Insurance" body={isActiveInsurance} bodyStyle={{ minWidth: "100px", maxWidth: "120px" }} align={"center"} />
            <Column field="gst_applicable" header="GST Applicable" body={isActiveGst} bodyStyle={{ minWidth: "120px", maxWidth: "140px" }} align={"center"} />
            <Column field="" header="Images" bodyStyle={{ minWidth: "50px" }} body={imageBody} />
            <Column
              header="Approval"
              body={(rowData) => (!rowData.verified ? approveButtonTemplate(rowData) : <span className="text-green-700 font-bold">Approved</span>)}
              bodyStyle={{ minWidth: "150px", textAlign: "center" }}
              align={"center"}
            />
          </DataTable>
        </div>
      </div>
    </>
  );
};

export default VehicleVerification;
