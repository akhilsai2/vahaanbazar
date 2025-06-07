"use client";
import React, { useEffect, useState } from "react";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Divider } from "primereact/divider";
import { Checkbox } from "primereact/checkbox";
import useBids from "../../../services/useBids";
import { v4 } from "uuid";
import { Dialog } from "primereact/dialog";
import CreateUpdate from "./create-update-vehicle.js";
import useToastService from "../../../services/useToastService.js";

const VehicleAccess = () => {
  const { GetVehicleSubscription ,createUpateVehicleSubscription,deleteVehicleSubscription} = useBids(); // Fetch bids using useBids service
  const { showLoadingToast, updateToSuccessToast, updateToErrorToast } = useToastService();
  const [plans, setPlans] = useState([]);

  const [loading, setLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [newPlan, setNewPlan] = useState({
    plan_name: "",
    description: "",
    price: "",
    plan_id: v4(),
    validity_days: "",
    is_active: false,
  });

  const FetchBidSub = async (id) => {
    try {
      if (id && typeof id !== "string") {
        const response = await GetVehicleSubscription(id);
        setNewPlan({
          ...newPlan,
          plan_name: response.plan_name,
          description: response.description,
          price: response.price,
          validity_days: response.validity_days,
          is_active: response.is_active,
          plan_id: response.plan_id,
        }); // Set the fetched data
        setShowDialog(true);
      }
      const response = await GetVehicleSubscription();
      setPlans(response.data); // Set the fetched data
    } catch (error) {
      console.error("Error fetching bids:", error.message);
    } finally {
      setLoading(false); // Stop loading spinner
    }
  };
  useEffect(() => {
    FetchBidSub();
  }, []);

 const removeRow = async (rowData, index) => {
    try {
      const toastId = showLoadingToast("Deleting Bid...");
      const response = await deleteVehicleSubscription(rowData.plan_id);
      if (response) {
        const updated = [...plans];
        updated.splice(index, 1);
        setPlans(updated);
        updateToSuccessToast(toastId, "Vehicle Subscription Plan Deleted Successfully");
        FetchBidSub()
      }
    } catch (error) {
      console.error("Error deleting bid subscription plan:", error.message);
      updateToErrorToast(toastId, "Failed to delete bid subscription plan. Please try again.");
    }
  };

  const actionBodyTemplate = (rowData, { rowIndex }) => {
    return (
      <div className="flex gap-2">
        {typeof rowData.plan_id !== "string" ? (
          <Button icon="pi pi-trash" className=" bg-transparent " onClick={() => removeRow(rowData,rowIndex)} id="deleteIcon" />
        ) : (
          <Button icon="pi pi-times" className=" bg-transparent" onClick={() => removeRow(rowData,rowIndex)} id="deleteIcon" />
        )}
      </div>
    );
  };
  const isActiveBodyTemplate = (rowData) => {
    const toggleActive = () => {
      const updatedPlans = plans.map((plan) => (plan.plan_id === rowData.plan_id ? { ...plan, is_active: !plan.is_active } : plan));
      setPlans(updatedPlans);
    };

    return <Checkbox checked={rowData.is_active} onChange={toggleActive} className="p-checkbox-sm" />;
  };

   const handleDialogSubmit = async (newPlan) => {
    
    if (!newPlan.plan_name || !newPlan.price || !newPlan.validity_days) {
      alert("Please fill all required fields");
      return;
    }

    setLoading(true);
    const toastId = showLoadingToast("Loading Bid...");
    try {
      const response = await createUpateVehicleSubscription(newPlan);
      if (response) {
        if (typeof newPlan.plan_id !== "string") {
          updateToSuccessToast(toastId, "Vehicle Subscription Plan Updated Successfully");
        } else {
          updateToSuccessToast(toastId, "Vehicle Subscription Plan Created Successfully");
        }
      }
      await FetchBidSub();
      // Reset form and close dialog
      setShowDialog(false);
      setNewPlan({
        plan_id: v4(),
        plan_name: "",
        description: "",
        price: "",
        validity_days: "",
        is_active: false,
      });
    } catch (error) {
      console.error("Error submitting Vehicle subscription plan:", error.message);
      updateToErrorToast(toastId, "Failed to save Vehicle subscription plan. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const planBodyTemplate = (rowData) => {
    return (
      <span className="text-blue-500 cursor-pointer hover:underline" onClick={() => addUpdateRow(rowData.plan_id)}>
        {rowData.plan_name}
      </span>
    );
  };

  const addRow = () => {
    setShowDialog(true);
  };

  const addUpdateRow = (id) => {
    FetchBidSub(id);
  };

  const handleDialogClose = () => {
    setShowDialog(false);
    setNewPlan({
      plan_id: v4(),
      plan_name: "",
      description: "",
      price: "",
      spend_limit: "",
      validity_days: "",
      is_active: false,
    });
  };

  return (
    <div className="viewDetailsSection">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Vehicle Access Subscriptions</h2>
        <div className="flex gap-2">
          <Button label="Add Subscription" icon="pi pi-plus" onClick={addRow} className="py-1 px-3" />
        </div>
      </div>
      <Divider />
      <Dialog
        header={typeof newPlan.plan_id !== "string" ? "Update Vehicle Access Subscription" : "Create Vehicle Access Subscription"}
        visible={showDialog}
        style={{ width: "500px" }}
        onHide={() => handleDialogClose()}
        footer={
          <div className="flex justify-end gap-4">
            <Button label="Cancel" className=" secondaryBtn p-button-text" onClick={() => handleDialogClose()} />
            <Button label={typeof newPlan.plan_id !== "string" ? "Update" : "Create"} className="bg-blue-500 text-white" onClick={() => handleDialogSubmit(newPlan)} />
          </div>
        }
      >
        <CreateUpdate handleDialogSubmit={handleDialogSubmit} newPlan={newPlan} setNewPlan={setNewPlan} />
      </Dialog>

      <div className="h-full">
        <DataTable value={plans} className="p-datatable-gridlines h-100" dataKey="plan_id" columnResizeMode="expand" scrollable scrollHeight="flex" loading={loading}>
          <Column field="plan_name" header="Plan Name" bodyStyle={{ minWidth: "150px", maxWidth: "150px" }} body={planBodyTemplate} />
          <Column field="description" header="Description" bodyStyle={{ minWidth: "200px", maxWidth: "200px" }} />
          <Column field="is_active" header="Active" align={"center"} body={isActiveBodyTemplate} bodyStyle={{ minWidth: "100px", maxWidth: "100px", textAlign: "center" }} />
          <Column field="price" header="Price" bodyStyle={{ minWidth: "120px", maxWidth: "120px" }} align={"right"} />

          <Column field="validity_days" header="Validity (Days)" bodyStyle={{ minWidth: "150px", maxWidth: "150px" }} align="right" />
          <Column body={actionBodyTemplate} header="" align={"center"} />
        </DataTable>
      </div>
    </div>
  );
};

export default VehicleAccess;
