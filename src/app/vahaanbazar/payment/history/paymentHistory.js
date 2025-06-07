"use client";
import React, { useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import { Button } from "primereact/button";
import { Divider } from "primereact/divider";
import useToastService from "../../../../services/useToastService";
import { FaRegEye } from "react-icons/fa";

import Cookies from "js-cookie";
import { Checkbox } from "primereact/checkbox";
import usePaymentService from "../../../../services/usePaymentService";

const PaymentHistory = () => {
  const { showLoadingToast, updateToSuccessToast, updateToErrorToast } = useToastService();
  const { GetPayment } = usePaymentService();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPaymentHistory = async () => {
    setLoading(true); // Start loading spinner

    try {
      const response = await GetPayment();
      if (response) {
        setData(response); // Set the fetched data
      }
    } catch (error) {
      updateToErrorToast("Error fetching payment history", error.message);
      console.error("Error fetching payment history:", error.message);
    } finally {
      setLoading(false); // Stop loading spinner
    }
  };

  useEffect(() => {
    fetchPaymentHistory();
  }, []);

  const responseMessage = (row) => {
    return (
      <div className="d-flex justify-center">
        <FaRegEye color={"blue"} />
      </div>
    );
  };

  const statusTemplate =(rowData) =>{
      return (
      <span
        className={`${
          rowData.status === "Success"
            ? "text-green-800 font-bold" // Tailwind class for green text
            : rowData.status === "Pending"
            ? "text-yellow-500 font-bold" // Tailwind class for yellow text
            : "text-red-500 font-bold" // Tailwind class for red text
        }`}
      >
        {rowData.status.toUpperCase()}
      </span>
    );
  }

  return (
    <div className="viewDetailsSection">
      <div className="flex justify-between items-center ">
        <h2 className="text-xl font-bold">Payment History</h2>
      </div>
      <Divider />

      <div className="h-full">
        <DataTable value={data} className="p-datatable-gridlines h-100" dataKey="id" columnResizeMode="expand" scrollable scrollHeight="flex" loading={loading}>
          <Column field="id" header="ID" bodyStyle={{ minWidth: "60px", maxWidth: "80px" }} />
          <Column field="transaction_id" header="Transaction ID" bodyStyle={{ minWidth: "150px", maxWidth: "200px" }} />
          <Column field="order_id" header="Order ID" bodyStyle={{ minWidth: "150px", maxWidth: "200px" }} />
          <Column field="amount" header="Amount" bodyStyle={{ minWidth: "80px", maxWidth: "100px" }} align="right" />
          <Column field="currency" header="Currency" bodyStyle={{ minWidth: "80px", maxWidth: "100px" }} />
          <Column field="category" header="Category" bodyStyle={{ minWidth: "120px", maxWidth: "150px" }} />
          <Column field="status" header="Status" bodyStyle={{ minWidth: "100px", maxWidth: "120px" }} body={statusTemplate}/>
          <Column field="payment_method" header="Payment Method" bodyStyle={{ minWidth: "120px", maxWidth: "150px",color:"blue" }} />
          <Column field="payment_date" header="Payment Date" body={(row) => row.payment_date?.slice(0, 19).replace("T", " ")} bodyStyle={{ minWidth: "160px", maxWidth: "200px" }} />
          {/* <Column field="response_message" header="Response Message" bodyStyle={{ minWidth: "200px", maxWidth: "400px" }} body={responseMessage} align={"center"} /> */}
          <Column field="productinfo" header="Product Info" bodyStyle={{ minWidth: "100px", maxWidth: "150px" }} />
          <Column field="username" header="Username" bodyStyle={{ minWidth: "100px", maxWidth: "150px" }} />
          <Column field="email" header="Email" bodyStyle={{ minWidth: "180px", maxWidth: "220px" }} />
          <Column field="phone" header="Phone" bodyStyle={{ minWidth: "120px", maxWidth: "150px" }} />
          <Column field="reference_number" header="Reference Number" bodyStyle={{ minWidth: "150px", maxWidth: "200px" }} />
        </DataTable>
      </div>
    </div>
  );
};

export default PaymentHistory;
