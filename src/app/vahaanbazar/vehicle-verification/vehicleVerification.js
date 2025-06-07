"use client";
import React, { useEffect, useState } from "react";
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

const VehicleVerification = () => {
  const { showLoadingToast, updateToSuccessToast, updateToErrorToast } = useToastService();
  const { GetVehicleVerfication,ApproveVehicleVerification } = useVehicleService(); // Fetch bids using useBids service
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
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
      return <Checkbox checked={rowData.insurance}  disable={"true"} className="p-checkbox-sm" />;
    };
    const isActiveGst = (rowData) => {
  
  
      return <Checkbox checked={rowData.gst_applicable} disable={"true"} className="p-checkbox-sm" />;
    };
   
    const isOrginalInvoice = (rowData) => {   
      return <Checkbox checked={rowData.original_invoice}  disable={"true"} className="p-checkbox-sm" />;
    };



  return (
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
          <Column field="id" header="ID" bodyStyle={{ minWidth: "60px", maxWidth: "80px" }} />
          <Column field="category" header="Category" bodyStyle={{ minWidth: "100px", maxWidth: "120px" }} />
          <Column field="price" header="Price" bodyStyle={{ minWidth: "120px", maxWidth: "140px" }} align={"right"} />
          <Column field="registration_number" header="Registration Number" bodyStyle={{ minWidth: "150px", maxWidth: "180px" }} align={"right"}/>
          <Column field="state" header="State" bodyStyle={{ minWidth: "100px", maxWidth: "120px" }} />
          <Column field="brand" header="Brand" bodyStyle={{ minWidth: "100px", maxWidth: "120px" }} />
          <Column field="no_of_tyres" header="No. of Tyres" bodyStyle={{ minWidth: "100px", maxWidth: "120px" }} align={"right"}/>
          <Column field="chassis_number" header="Chassis Number" bodyStyle={{ minWidth: "150px", maxWidth: "180px" }} />
          <Column field="location" header="Location" bodyStyle={{ minWidth: "120px", maxWidth: "140px" }} />
          <Column field="original_invoice" header="Original Invoice" body={isOrginalInvoice} bodyStyle={{ minWidth: "120px", maxWidth: "140px" }} align={"center"} />
          <Column field="asset_description" header="Asset Description" bodyStyle={{ minWidth: "150px", maxWidth: "200px" }} />
          <Column field="year_of_manufacturing" header="Manufacturing(Yrs)" bodyStyle={{ minWidth: "120px", maxWidth: "170px" }} align={"center"} />
          <Column field="odometer" header="Odometer(KM)" bodyStyle={{ minWidth: "100px", maxWidth: "120px" }} align={"right"}   />
          <Column field="insurance" header="Insurance" body={isActiveInsurance} bodyStyle={{ minWidth: "100px", maxWidth: "120px" }} align={"center"}/>
          <Column field="gst_applicable" header="GST Applicable" body={isActiveGst} bodyStyle={{ minWidth: "120px", maxWidth: "140px" }} align={"center"} />
          <Column field="" header="Images" bodyStyle={{ minWidth: "50px" }} />
          <Column
            header="Approval"
            body={(rowData) => (!rowData.verified ? approveButtonTemplate(rowData) : null)}
            bodyStyle={{ minWidth: "150px", textAlign: "center" }}
            align={"center"}
          />
        </DataTable>
      </div>
    </div>
  );
};

export default VehicleVerification;
