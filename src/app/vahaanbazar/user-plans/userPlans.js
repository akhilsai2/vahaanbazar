"use client";
import { Checkbox } from "primereact/checkbox";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Divider } from "primereact/divider";
import React, { useEffect, useState } from "react";
import useUserService from "../../../services/useUserService";

const UserPlans = () => {
  const { getUserPlans } = useUserService() // Fetch user plans using useBids service
  const [userPlans, setUserPlans] = useState([])
  const [loading, setLoading] = useState(false);

  const fetchUserPlans = async () => {
    setLoading(true)
    const response = await getUserPlans()
    if(response){
      setUserPlans(response.data)
    }
    setLoading(false)
  }

  useEffect(()=>{
    fetchUserPlans()
    return () => {
      // Cleanup user plans on unmount
    }
  }
  ,[])

    const isActiveBodyTemplate = (rowData) => {  
      return <Checkbox checked={rowData.is_active}  className="p-checkbox-sm" disabled={true} />;
    };
  return (
    <div className="viewDetailsSection">
      <div className="flex justify-between items-center ">
        <h2 className="text-xl font-bold">User Plans</h2>
        {/* <Button label="Save" className="py-1 px-3 " /> */}
      </div>
      <Divider />

      <div className="h-full">
        <DataTable value={userPlans} className="p-datatable-gridlines h-100" dataKey="username" columnResizeMode="expand" scrollable scrollHeight="flex" loading={loading}>
          <Column field="username" header="Username" bodyStyle={{ minWidth: "150px", maxWidth: "200px" }} />
          <Column field="plan" header="Plan" bodyStyle={{ minWidth: "80px", maxWidth: "100px" }} align="right"/>
          <Column field="spend_limit" header="Spend Limit" bodyStyle={{ minWidth: "120px", maxWidth: "150px" }} align="right" />
          <Column field="remaining_spend_limit" header="Remaining Limit" bodyStyle={{ minWidth: "120px", maxWidth: "150px" }} align="right" />
          <Column field="is_active" header="Active" align="center" body={isActiveBodyTemplate} bodyStyle={{ minWidth: "80px", maxWidth: "100px", textAlign: "center" }} />
          <Column field="start_date" header="Start Date" align={"center"} body={(row) => row.start_date?.slice(0, 10)} bodyStyle={{ minWidth: "120px", maxWidth: "150px" }} />
          <Column field="end_date" header="End Date" align={"center"} body={(row) => row.end_date?.slice(0, 10)} bodyStyle={{ minWidth: "120px", maxWidth: "150px" }} />
        </DataTable>
      </div>
    </div>
  );
};

export default UserPlans;
