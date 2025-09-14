import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Divider } from "primereact/divider";
import React, { useEffect, useState } from "react";
import useBuySell from "../../../services/useBuySell";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { Checkbox } from "primereact/checkbox";
import Cookies from "js-cookie";
import useToastService from "../../../services/useToastService";
const BuySell = () => {
  const { getBuySellVehicles, ApproveVehicles } = useBuySell();
  const [pagination, setPagination] = useState({
    first: 0, // starting index
    rows: 10, // page size
    page: 0, // current page index
  });
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [count, setCount] = useState(0);
  const [selectedVehicles, setSelectedVehicles] = useState([]); // ✅ track selected rows
  const [selectedStatus, setSelectedStatus] = useState("all");
  const { showLoadingToast, updateToSuccessToast, updateToErrorToast } = useToastService();

  const fetchVehicles = async (page, status) => {
    setLoading(true);
    try {
      getBuySellVehicles({ row: page.rows, page: page.page + 1, status: status })
        .then((res) => {
          if (res && res.data) {
            setData(res.data.vehicles);
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
    fetchVehicles(pagination, selectedStatus);
  }, [pagination, selectedStatus]);
  const onPageChange = (event) => {
    setPagination({
      first: event.first,
      rows: event.rows,
      page: event.page,
    });
  };
  const onChangeStatus = (e) => {
    setSelectedStatus(e.value);
  };

  const handleApprove = (vehicles, status) => {
   const toastId = showLoadingToast("Approving Vehicle...");

    try {
      const _body = {
        sb_vehicle_ids: vehicles.map(({ sb_vehicle_id }) => sb_vehicle_id),
        approved_status: status,
        admin_id: Cookies.get("UserId"),
      };
      ApproveVehicles(_body).then((res) => {
        if (res && res.data) {
          updateToSuccessToast(toastId, "Vehicle Approved Successfully");
          setSelectedVehicles([])
          fetchVehicles(pagination, selectedStatus);
        } else {
          updateToErrorToast(toastId, "Error Occured Please try again");
        }
      });
    } catch (err) {
      updateToErrorToast(toastId, "Error Occured Please try again");
    }

    console.log(_body);
  };

  return (
    <div className="viewDetailsSection">
      <div className="flex justify-between items-center row">
        <h2 className="text-xl font-bold">Buy & Sell</h2>
        <div className="flex items-center gap-2">
          <span className="text-black fw-bold text-[15px] ">Approved Status:</span>
          <Dropdown placeholder="Select Status" options={["yes", "no", "all"]} value={selectedStatus} onChange={onChangeStatus} />
          <Button
            label="Approve"
            className="approval-button"
            style={{ backgroundColor: "#2196F3", color: "white", border: "none" }}
            onClick={() => handleApprove(selectedVehicles, "yes")}
            disabled={selectedVehicles.length === 0}
          />
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
        selection={selectedVehicles} // ✅ selection state
        onSelectionChange={(e) => setSelectedVehicles(e.value)} // ✅ handle checkbox selection
        dataKey="sb_vehicle_id" // ✅ unique key for each row
      >
        <Column selectionMode="multiple" headerStyle={{ width: "3rem" }} />
        <Column field="sb_vehicle_id" header="Vehicle ID" />
        <Column field="category_name" header="Category" />
        <Column field="state_name" header="State" />
        <Column field="city_name" header="City" />
        <Column field="brand_name" header="Brand" />
        <Column field="manufacturing_year" header="Year" />
        <Column field="price" header="Price" body={(row) => row.price.toLocaleString()} />
        <Column field="registration_number" header="Reg. No" />
        <Column field="chassis_number" header="Chassis No" />
        <Column field="owner_mobile" header="Owner Mobile" />
        <Column
          field="status"
          header="Status"
          body={(rowData) => (
            <Checkbox
              inputId={`status-${rowData.bid_id}`}
              checked={rowData.status === "active"} // or whatever status condition you want
              disabled
            />
          )}
          align="center"
        />
        <Column field="uploaded_by_name" header="Uploaded By" />
        <Column field="inserted_at" header="Created At" body={(row) => row.inserted_at?.slice(0, 19).replace("T", " ")} />

        <Column
          header="Actions"
          body={(row) => (
            <div className="flex gap-2">
              <Button label="Reject" className="approval-button" style={{ backgroundColor: "#e30404", color: "white", border: "none" }} onClick={() => handleApprove([row], "no")} />
            </div>
          )}
        />
      </DataTable>
    </div>
  );
};

export default BuySell;
