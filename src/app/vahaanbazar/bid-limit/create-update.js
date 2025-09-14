import { Checkbox } from "primereact/checkbox";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import React from "react";

const CreateUpdate = (props) => {
  const { newPlan, setNewPlan, handleDialogSubmit } = props;
  return (
    <form onSubmit={()=>handleDialogSubmit(newPlan)} className="space-y-4">
    
        <div className="w-[100%]">
          <label className="block text-sm font-medium text-gray-700 mb-1">Plan Name*</label>
          <InputText  value={newPlan.plan_name} onChange={(e) => setNewPlan({ ...newPlan, plan_name: e.target.value })} className="w-full h-8 px-4 py-2" required />
        </div>
        <div className="w-[100%]">
          <label className="block text-sm font-medium text-gray-700 mb-1">Plan Code*</label>
          <InputText  value={newPlan.plan_code} onChange={(e) => setNewPlan({ ...newPlan, plan_code: e.target.value })} className="w-full h-8 px-4 py-2" required />
        </div>
        <div className="w-[100%]">
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <InputTextarea autoResize value={newPlan.description} onChange={(e) => setNewPlan({ ...newPlan, description: e.target.value })} className="w-full h-8 px-4 py-3" />
        </div>
    
      <div className="flex gap-4">
        <div className="w-1/2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Price*</label>
          <InputText type="number" value={newPlan.price} onChange={(e) => setNewPlan({ ...newPlan, price: e.target.value })} className="w-full h-8 px-4 py-2" required />
        </div>
        <div className="w-1/2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Spend Limit*</label>
          <InputText type="number" value={newPlan.spend_limit} onChange={(e) => setNewPlan({ ...newPlan, spend_limit: e.target.value })} className="w-full h-8 px-4 py-2" required />
        </div>
      </div>
      <div className="flex gap-4">
              <div className="w-1/2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Validity Days/Amount*</label>
          <Dropdown value={newPlan.plan_metric} options={["days","amount"]} onChange={(e) => setNewPlan({ ...newPlan, plan_metric: e.value })} />
        </div>
        <div className="w-1/2 flex items-center gap-2 mt-6">
          <Checkbox inputId="is_active" checked={newPlan.is_active} onChange={(e) => setNewPlan({ ...newPlan, is_active: e.checked })} />
          <label htmlFor="is_active" className="text-sm font-medium text-gray-700">
            Active
          </label>
        </div>
      </div>
    </form>
  );
};

export default CreateUpdate;
