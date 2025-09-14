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
import CreateUpdate from "./create-update";
import useToastService from "../../../services/useToastService";

const BidLimit = () => {
  const { GetBidSubscription, createUpateBidSubscription, deleteBidSubscription } = useBids(); // Fetch bids using useBids service
  const { showLoadingToast, updateToSuccessToast, updateToErrorToast } = useToastService();
  const [plans, setPlans] = useState([]);

  const [loading, setLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [newPlan, setNewPlan] = useState({
    id:v4(),
    plan_name: "",
    plan_metric:"days",
    description: "",
    price: "",
    spend_limit: "",
    validity_days: "",
    status: true,
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
          plan_metric:response.plan_metric,
          spend_limit: response.plan_metric_value,
          plan_code: response.plan_code,
          is_active: response.status === "active" ? true : false,
          plan_code: response.plan_code,
        });
        setShowDialog(true);
      } else {
        const response = await GetBidSubscription();
        setPlans(response.data.plans); // Set the fetched data
      }
    } catch (error) {
      console.error("Error fetching bids:", error.message);
    } finally {
      setLoading(false); // Stop loading spinner
    }
  };
  useEffect(() => {
    FetchBidSub();
  }, []);

  const addRow = () => {
    setShowDialog(true);
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
        plan_metric: newPlan.plan_metric,
        plan_metric_value: newPlan.spend_limit,
        price: newPlan.price,
        status: newPlan.is_active ? "active" : "inactive",
        type_code: "SUBT002",
      };
      const response = await createUpateBidSubscription(_body,newPlan.id);
      if (response) {
        if (!newPlan.id) {
          updateToSuccessToast(toastId, "Bid Subscription Plan Updated Successfully");
                setNewPlan({ id:undefined,       plan_name: "",
        plan_code: "",
        description: "",
        price: "",
        spend_limit: "",
        is_active: false,
      });
        } else {
          updateToSuccessToast(toastId, "Bid Subscription Plan Created Successfully");
                setNewPlan({
        id:undefined,
        plan_name: "",
        plan_code: "",
        description: "",
        price: "",
        spend_limit: "",
        is_active: false,
      });
        }
      }
      await FetchBidSub();
      // Reset form and close dialog
      setShowDialog(false);

    } catch (error) {
      console.error("Error submitting bid subscription plan:", error.message);
      updateToErrorToast(toastId, "Failed to save bid subscription plan. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDialogClose = () => {
    setShowDialog(false);
    setNewPlan({
      id: v4(),
      plan_name: "",
      plan_code: "",
      plan_metric:"days",
      description: "",
      price: "",
      spend_limit: "",
      validity_days: "",
      status: false,
    });
  };

  const removeRow = async (rowData, index) => {
    try {
      const toastId = showLoadingToast("Deleting Bid...");
      const response = await deleteBidSubscription(rowData.plan_id);
      if (response) {
        const updated = [...plans];
        updated.splice(index, 1);
        setPlans(updated);
        updateToSuccessToast(toastId, "Bid Subscription Plan Deleted Successfully");
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
          <Button icon="pi pi-times" className=" bg-transparent" onClick={() => removeRow(rowIndex)} id="deleteIcon" />
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
  const addUpdateRow = (id) => {
    FetchBidSub(id);
  };

  const planBodyTemplate = (rowData) => {
    return (
      <span className="text-blue-500 cursor-pointer hover:underline" onClick={() => addUpdateRow(rowData.plan_code)}>
        {rowData.name}
      </span>
    );
  };
  console.log(newPlan)
  return (
    <div className="viewDetailsSection">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Bid Limit Subscriptions</h2>
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
        key={newPlan}
      >
        <CreateUpdate handleDialogSubmit={handleDialogSubmit} newPlan={newPlan} setNewPlan={setNewPlan} />
      </Dialog>

      <div className="h-full">
        <DataTable value={plans} className="p-datatable-gridlines h-100" dataKey="plan_id" columnResizeMode="expand" scrollable scrollHeight="flex" loading={loading}>
          <Column field="plan_name" header="Plan Name" bodyStyle={{ minWidth: "150px", maxWidth: "150px" }} body={planBodyTemplate} />
          <Column field="plan_code" header="Code" bodyStyle={{ minWidth: "150px", maxWidth: "150px" }} />
          <Column field="feat_description" header="Description" bodyStyle={{ minWidth: "200px", maxWidth: "200px" }} />
          <Column field="is_active" header="Active" body={isActiveBodyTemplate} bodyStyle={{ minWidth: "100px", maxWidth: "100px", textAlign: "center" }} align={"center"} />
          <Column field="price" header="Price" bodyStyle={{ minWidth: "120px", maxWidth: "120px" }} align="right" />
          <Column field="plan_metric_value" header="Spend Limit(Days / Amount)" bodyStyle={{ minWidth: "150px", maxWidth: "150px" }} align={"right"} />
          <Column field="plan_metric" header="Validity" bodyStyle={{ minWidth: "150px", maxWidth: "150px" }} align={"right"} />
          {/* <Column body={actionBodyTemplate} header="Actions" bodyStyle={{ minWidth: "80px", maxWidth: "80px", textAlign: "center" }} /> */}
        </DataTable>
      </div>
    </div>
  );
};

export default BidLimit;
