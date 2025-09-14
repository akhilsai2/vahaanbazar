import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Divider } from "primereact/divider";
import React, { useEffect, useState } from "react";
import useBuySell from "../../../services/useBuySell";

import { Checkbox } from "primereact/checkbox";
const VehicleInterest = () => {
  const { getBuySellVehiclesInterest } = useBuySell();
  const [pagination, setPagination] = useState({
    first: 0, // starting index
    rows: 10, // page size
    page: 0, // current page index
  });
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [count, setCount] = useState(0);
  const [inspectionRequired, setInspectionRequired] = useState("yes");
  const [isInterested, setIsInterested] = useState("yes");
  const [vehicleOffer, setVehicleOffer] = useState();

  const fetchVehiclesInterest = async (page, isInterested, inspectionRequired, vehicleOffer) => {
    setLoading(true);
    try {
      getBuySellVehiclesInterest({ limit: page.rows, page: page.page + 1, inspection_requested: inspectionRequired, is_interested: isInterested, vehicle_offer: vehicleOffer })
        .then((res) => {
          if (res && res.data) {
            setData(res.data.interests);
            setCount(res.data.total_count);
            setLoading(false);
          }
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    } catch (er) {
      console.log(err);
    }
  };
  useEffect(() => {
    fetchVehiclesInterest(pagination, isInterested, inspectionRequired, vehicleOffer);
  }, [pagination, isInterested, inspectionRequired,vehicleOffer]);
  const onPageChange = (event) => {
    setPagination({
      first: event.first,
      rows: event.rows,
      page: event.page,
    });
  };

  return (
    <div className="viewDetailsSection">
      <div className="flex justify-between items-center row">
        <h2 className="text-xl font-bold">Buy & Sell</h2>
        <div className="flex items-center gap-2">
          <Checkbox checked={inspectionRequired === "yes"} onChange={(e) => setInspectionRequired(e.checked ? "yes" : "no")} />
          <span className="text-black fw-bold text-[15px] ">Inspection Required</span>
          <Checkbox checked={isInterested === "yes"} onChange={(e) => setIsInterested(e.checked ? "yes" : "no")} />
          <span className="text-black fw-bold text-[15px] ">Interested</span>
          <Checkbox checked={vehicleOffer === "has_offer"} onChange={(e) => setVehicleOffer(e.checked ? "has_offer" : undefined)} />
          <span className="text-black fw-bold text-[15px] ">Vehicle Offer</span>
        </div>
      </div>
      <Divider />

      <DataTable
        value={data}
        responsiveLayout="scroll"
        lazy
        paginator
        loading={loading}
        rows={pagination.rows}
        first={pagination.first}
        onPage={onPageChange}
        rowsPerPageOptions={[10, 25, 50, 100]}
        totalRecords={count}
        id="buyselltable"
        className="p-datatable-gridlines h-100"
        dataKey="sb_vehicle_id" 
      >
        <Column field="sb_vehicle_id" header="Vehicle ID" />
        <Column field="owner_details_access" header="Owner Details Access" body={(rowData) => <Checkbox checked={rowData.owner_details_access === "yes"} disabled />} align="center" />
        <Column field="inspection_requested" header="Inspection Requested" body={(rowData) => <Checkbox checked={rowData.inspection_requested === "yes"} disabled />} align="center" />
        <Column field="vehicle_details_access" header="Vehicle Details Access" body={(rowData) => <Checkbox checked={rowData.vehicle_details_access === "yes"} disabled />} align="center" />
        <Column field="vehicle_offer" header="Vehicle Offer" body={(rowData) => <Checkbox checked={rowData.vehicle_offer === "yes"} disabled />} align="center" />
        <Column field="is_interested" header="Is Interested" body={(rowData) => <Checkbox checked={rowData.is_interested === "yes"} disabled />} align="center" />
        <Column field="status" header="Status" body={(rowData) => <Checkbox inputId={`status-${rowData.sb_vehicle_id}`} checked={rowData.status === "active"} disabled />} align="center" />
        <Column field="inserted_at" header="Created At" body={(row) => row.inserted_at?.slice(0, 19).replace("T", " ")} />
        <Column field="modified_at" header="Modified At" body={(row) => row.modified_at?.slice(0, 19).replace("T", " ")} />
      </DataTable>
    </div>
  );
};

export default VehicleInterest;
