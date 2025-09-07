"use client";
import React, { useEffect, useRef, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import { Divider } from "primereact/divider";
import useBids from "../../../services/useBids";
import Cookies from "js-cookie";
import { Calendar } from "primereact/calendar";
import { InputMask } from "primereact/inputmask";
import { Checkbox } from "primereact/checkbox";
import Link from "next/link";

const ViewBids = () => {
  const { GetAuctions } = useBids();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [inputMaskValue, setInputMaskValue] = useState([new Date(new Date().setDate(new Date().getDate() - 7)), new Date(new Date().setDate(new Date().getDate()))]);
  const [showCalendar, setShowCalendar] = useState(false);
  const [dates, setDates] = useState([new Date(new Date().setDate(new Date().getDate() - 7)), new Date(new Date().setDate(new Date().getDate()))]);
  const calendarRef = useRef(null);

  const FetchBids = async (days) => {
    setLoading(true); // Start loading spinner
    try {
      const response = await GetAuctions(days);
      if (response || response.data) setData(response.data?.auctions); // Set the fetched data
      setLoading(false); // Stop loading spinner
    } catch (error) {
      console.error("Error fetching bids:", error.message);
    } finally {
      setLoading(false); // Stop loading spinner
    }
  };
  useEffect(() => {
    const start = new Date(inputMaskValue[0]);
    const end = new Date(inputMaskValue[1]);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    FetchBids(diffDays);
  }, [Cookies.get("AccessToken")]);

  const handleInputMaskValue = (e) => {
    if (e && e.length > 0) {
      const formattedDates = e
        .filter((date) => date)
        .map((date) => {
          const modifiedDate = date instanceof Date ? date : new Date(date);
          const year = modifiedDate.getFullYear();
          const month = String(modifiedDate.getMonth() + 1).padStart(2, "0");
          const day = String(modifiedDate.getDate()).padStart(2, "0");
          return `${month}-${day}-${year}`;
        });

      if (formattedDates.length === 1) {
        return `${formattedDates[0]} to`;
      }
      if (formattedDates.length === 2) {
        return `${formattedDates[0]} to ${formattedDates[1]}`;
      }
      return "";
    }
    return "";
  };

  const handleDateChange = (dateEvent) => {
    const value = dateEvent?.value;
    setDates(value);
    setInputMaskValue(value);
    if (value && value[0] && value[1]) {
      setShowCalendar(false);
      const start = new Date(value[0]);
      const end = new Date(value[1]);
      const diffTime = Math.abs(end - start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      FetchBids(diffDays);
    }
  };

  const isActiveBodyTemplate = (rowData) => {
    return <Checkbox checked={rowData.status === "active" ? true : false} className="p-checkbox-sm" disabled={true} />;
  };

  const planBodyTemplate = (rowData) => {
    return (
      <Link prefetch={false} href={`/vahaanbazar/view-auctions/${rowData.auction_id}`} passhref legacyBehavior>
        <span className="text-blue-500 cursor-pointer hover:underline">{rowData.auction_id}</span>
      </Link>
    );
  };

  return (
    <>
     
      <div className="viewDetailsSection">
        <div className="flex justify-between items-center ">
          <h2 className="text-xl font-bold">View Auctions</h2>

          <div className="col-3 col-xl-2 d-flex align-items-center">
            <div className="position-relative d-inline-block w-100" ref={calendarRef}>
              <InputMask
                value={handleInputMaskValue(inputMaskValue)}
                onClick={() => setShowCalendar(true)}
                className="w-100 fw-bold"
                tabIndex="0"
                dateFormat="mm-dd-yy"
                readOnly={true}
                placeholder="MM-DD-YYYY to MM-DD-YYYY"
                mask="99-99-9999 to 99-99-9999"
              />

              {showCalendar && (
                <div className="orderCalender-container">
                  <Calendar
                    id="orders_calender"
                    className="fw-bold rounded"
                    dateFormat="mm-dd-yy"
                    maxDate={new Date(new Date().setMonth(new Date().getMonth() + 3, new Date().getDate()))}
                    value={dates}
                    onChange={handleDateChange}
                    selectionMode="range"
                    readOnlyInput
                    hideOnRangeSelection
                    inline={true}
                  />
                </div>
              )}
            </div>
          </div>
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
            {/* Bid Details Columns */}
            <Column field="auction_id" header="Auction ID" bodyStyle={{ minWidth: "120px", maxWidth: "160px" }} body={planBodyTemplate} />
            <Column field="auction_title" header="Auction Title" bodyStyle={{ minWidth: "200px", maxWidth: "300px" }} />
            <Column field="category" header="Category" bodyStyle={{ minWidth: "100px", maxWidth: "120px" }} />
            <Column field="region" header="Region" bodyStyle={{ minWidth: "100px", maxWidth: "120px" }} />
            <Column field="state" header="State" bodyStyle={{ minWidth: "100px", maxWidth: "120px" }} />
            <Column field="vehicle_type" header="Vehicle Type" bodyStyle={{ minWidth: "100px", maxWidth: "120px" }} />
            <Column field="active_vehicles" header="Active Vehicles" bodyStyle={{ minWidth: "120px", maxWidth: "140px" }} align="right" />
            <Column field="total_vehicles" header="Total Vehicles" bodyStyle={{ minWidth: "120px", maxWidth: "140px" }} align="right" />
            <Column field="total_bids" header="Total Bids" bodyStyle={{ minWidth: "100px", maxWidth: "120px" }} align="right" />
            <Column field="status" header="Status" bodyStyle={{ minWidth: "100px", maxWidth: "120px" }} body={isActiveBodyTemplate} align="center" />
            <Column field="start_at" header="Start At" body={(row) => row.start_at?.slice(0, 19).replace("T", " ")} bodyStyle={{ minWidth: "180px", maxWidth: "220px" }} />
            <Column field="end_at" header="End At" body={(row) => row.end_at?.slice(0, 19).replace("T", " ")} bodyStyle={{ minWidth: "180px", maxWidth: "220px" }} />
            <Column field="inserted_at" header="Inserted At" body={(row) => row.inserted_at?.slice(0, 19).replace("T", " ")} bodyStyle={{ minWidth: "180px", maxWidth: "220px" }} />
            <Column field="updated_at" header="Updated At" body={(row) => row.updated_at?.slice(0, 19).replace("T", " ")} bodyStyle={{ minWidth: "180px", maxWidth: "220px" }} />
          </DataTable>
        </div>
      </div>
    </>
  );
};

export default ViewBids;
