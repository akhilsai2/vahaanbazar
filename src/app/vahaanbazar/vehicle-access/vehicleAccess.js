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
  const { GetVehicleSubscription, createUpateVehicleSubscription, deleteVehicleSubscription } = useBids(); // Fetch bids using useBids service
  const { showLoadingToast, updateToSuccessToast, updateToErrorToast } = useToastService();
  const [plans, setPlans] = useState([]);

  const [loading, setLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [newPlan, setNewPlan] = useState({
    plan_name: "",
    description: "",
    price: "",
    id: v4(),
    plan_metric: "days",
    spend_limit:"",
    status: false,
  });

  const FetchBidSub = async (id) => {
    try {
      if (id) {
        const response = plans.filter((plan) => plan.plan_code === id)[0];
        delete newPlan?.id
        setNewPlan({
          ...newPlan,
          plan_name: response.name,
          description: response.feat_description,
          price: response.price,
          spend_limit: response.plan_metric_value,
          plan_code: response.plan_code,
          status: response.status === "active" ? true : false,
          plan_code: response.plan_code,
          plan_metric:response.plan_metric
        });
        setShowDialog(true);
      }
      const response = await GetVehicleSubscription();
      if (response.data.plans && response.data?.plans.length > 0) {
        setPlans(response.data.plans);
      } else {
        console.error("Error fetching vehicle subscription:", error.message);
      }
    } catch (error) {
      console.error("Error fetching vehicle subscription:", error.message);
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
        FetchBidSub();
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
          <Button icon="pi pi-trash" className=" bg-transparent " onClick={() => removeRow(rowData, rowIndex)} id="deleteIcon" />
        ) : (
          <Button icon="pi pi-times" className=" bg-transparent" onClick={() => removeRow(rowData, rowIndex)} id="deleteIcon" />
        )}
      </div>
    );
  };
    const isActiveBodyTemplate = (rowData) => {
      const toggleActive = () => {
        const updatedPlans = plans.map((plan) => (plan.plan_code === rowData.plan_code ? { ...plan, status: plan.status === "active" ? true : false } : plan));
        setPlans(updatedPlans);
      };
  
      return <Checkbox checked={rowData.status === "active" ? true : false} onChange={toggleActive} className="p-checkbox-sm" disabled={true} />;
    };

  const handleDialogSubmit = async (newPlan) => {
    if (!newPlan.plan_name || !newPlan.price || !newPlan.spend_limit) {
      alert("Please fill all required fields");
      return;
    }

    setLoading(true);
    const toastId = showLoadingToast("Loading Bid...");
    try {
       const _body = {
        feat_description: newPlan?.description ,
        name: newPlan.plan_name,
        plan_code: newPlan?.plan_code,
        plan_metric: newPlan?.plan_metric,
        plan_metric_value: newPlan.spend_limit,
        price: newPlan.price,
        status: newPlan.status ? "active" : "inactive",
        type_code: "SUBT001",
      };
      const response = await createUpateVehicleSubscription(_body);
      if (response) {
           if (newPlan.plan_code) {
          updateToSuccessToast(toastId, "Vehicle Subscription Plan Updated Successfully");
        } else {
          updateToSuccessToast(toastId, "Vehicle Subscription Plan Created Successfully");
        }
      }
      await FetchBidSub();
      // Reset form and close dialog
      setShowDialog(false);
      setNewPlan({
        id: v4(),
        plan_name: "",
        description: "",
        price: "",
        validity_days: "",
        plan_metric:"days",
        spend_limit:"",
        status: false,
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
      <span className="text-blue-500 cursor-pointer hover:underline" onClick={() => addUpdateRow(rowData.plan_code)}>
        {rowData.name}
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
      id: v4(),
      plan_name: "",
      description: "",
      price: "",
      spend_limit: "",
      plan_metric: "",
      status: true,
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
        header={!newPlan.id ? "Update Bid Limit" : "Create Bid Limit"}
        visible={showDialog}
        style={{ width: "500px" }}
        onHide={() => handleDialogClose()}
        footer={
          <div className="flex justify-end gap-4">
            <Button label="Cancel" className=" secondaryBtn p-button-text" onClick={() => handleDialogClose()} />
            <Button label={!newPlan.id ? "Update" : "Create"} className="bg-blue-500 text-white" onClick={() => handleDialogSubmit(newPlan)} />
          </div>
        }
      >
        <CreateUpdate handleDialogSubmit={handleDialogSubmit} newPlan={newPlan} setNewPlan={setNewPlan} />
      </Dialog>


      <div className="h-full">
        <DataTable value={plans} className="p-datatable-gridlines h-100" dataKey="plan_code" columnResizeMode="expand" scrollable scrollHeight="flex" loading={loading}>
          <Column field="plan_name" header="Plan Name" bodyStyle={{ minWidth: "150px", maxWidth: "150px" }} body={planBodyTemplate} />
          <Column field="plan_code" header="Code" bodyStyle={{ minWidth: "150px", maxWidth: "150px" }} />
          <Column field="feat_description" header="Description" bodyStyle={{ minWidth: "200px", maxWidth: "200px" }} />
          <Column field="is_active" header="Status" align={"center"} body={isActiveBodyTemplate} bodyStyle={{ minWidth: "100px", maxWidth: "100px", textAlign: "center" }} />
          <Column field="price" header="Price" bodyStyle={{ minWidth: "120px", maxWidth: "120px" }} align={"right"} />
          <Column field="plan_metric_value" header="Spend Limit(Days / Amount)" bodyStyle={{ minWidth: "150px", maxWidth: "150px" }} align={"right"} />
          <Column field="plan_metric" header="Validity (Days / Amount)" bodyStyle={{ minWidth: "150px", maxWidth: "150px" }} align="right" />
          {/* <Column body={actionBodyTemplate} header="" align={"center"} /> */}
        </DataTable>
      </div>
    </div>
  );
};

export default VehicleAccess;
