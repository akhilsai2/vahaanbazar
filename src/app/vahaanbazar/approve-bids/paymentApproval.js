import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import React from "react";

const PaymentApproval = ({ bidPaymentApprove, handleDialogSubmit, setBidPaymentApprove }) => {
  return (
    <form onSubmit={() => handleDialogSubmit(newPlan)} className="space-y-4">
      <div className="w-[100%]">
        <label className="block text-sm font-medium text-gray-700 mb-1">Payment Status</label>
        <Dropdown
          options={["done", "failed", "pending", "bank_approved"]}
          value={bidPaymentApprove?.payment_status}
          className="w-full h-8"
          onChange={(e) => setBidPaymentApprove({ ...bidPaymentApprove, payment_status: e.value })}
        />
      </div>
      <div className="w-[100%]">
        <label className="block text-sm font-medium text-gray-700 mb-1">Payment Reference*</label>
        <InputText
          value={bidPaymentApprove?.payment_reference}
          className="w-full h-8 px-4 py-2"
          required
          onChange={(e) => setBidPaymentApprove({ ...bidPaymentApprove, payment_reference: e.value })}
        />
      </div>
      <div className="w-[100%]">
        <label className="block text-sm font-medium text-gray-700 mb-1">Remarks</label>
        <InputText value={bidPaymentApprove?.remarks} autoResize className="w-full h-8 px-4 py-3" onChange={(e) => setBidPaymentApprove({ ...bidPaymentApprove, remarks: e.value })} />
      </div>
    </form>
  );
};

export default PaymentApproval;
