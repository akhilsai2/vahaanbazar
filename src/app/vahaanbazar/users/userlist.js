"use client";
import { Button } from "primereact/button";
import { Checkbox } from "primereact/checkbox";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Divider } from "primereact/divider";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import React, { useEffect, useState } from "react";
import useUserService from "@/services/useUserService";
import useToastService from "../../../services/useToastService";

const UserList = () => {
  const { showLoadingToast, updateToSuccessToast, updateToErrorToast } = useToastService();

  const { getUserList, createUser, deleteUser } = useUserService(); // Fetch user list from useUserService
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false); // State to control dialog visibility
  const [newUser, setNewUser] = useState({
    username: "",
    first_name: "",
    last_name: "",
    email: "",
    mobile_number: "",
    state: "",
    city: "",
    is_verified: false,
  }); // State to store new user data
  const fetchUsers = async () => {
    try {
      const response = await getUserList();
      setUsers(response.results); // Assuming the API response has a `results` field
    } catch (error) {
      console.error("Error fetching users:", error.message);
    } finally {
      setLoading(false);
    }
  };
  // Fetch users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  const isActiveBodyTemplate = (rowData) => {
    const toggleActive = () => {
      const updatedUsers = users.map((user) => (user.username === rowData.username ? { ...user, is_active: !user.is_active } : user));
      setUsers(updatedUsers);
    };

    return <Checkbox checked={rowData.is_active} onChange={toggleActive} className="p-checkbox-sm" />;
  };
  const isVerifiedBodyTemplate = (rowData) => {
    const toggleActive = () => {
      const updatedUsers = users.map((user) => (user.username === rowData.username ? { ...user, is_verified: !user.is_verified } : user));
      setUsers(updatedUsers);
    };

    return <Checkbox checked={rowData.is_verified} onChange={toggleActive} className="p-checkbox-sm" />;
  };

  const handleCreateUser = async () => {
    const toastId = showLoadingToast("Approving Bid...");
    if (!newUser.username || !newUser.first_name || !newUser.email) {
      updateToErrorToast(toastId, "Please fill in all mandatory fields.");
      return;
    }
    try {
      const response = await createUser(newUser);
      if (response) {
        setUsers([...users, newUser]); // Add the new user to the list
        setShowDialog(false); // Close the dialog
        setNewUser({
          username: "",
          first_name: "",
          last_name: "",
          email: "",
          mobile_number: "",
          state: "",
          city: "",
          is_verified: false,
        }); // Reset the form
        updateToSuccessToast(toastId, "User created successfully!");
        fetchUsers()
      } else {
        updateToErrorToast(toastId, "User creation failed!");
      }
    } catch (err) {
      console.log(err);
      updateToErrorToast(toastId, "User creation failed!");
    }
  };

  const removeRow = async (rowData, rowIndex) => {
    try {
      const toastId = showLoadingToast("Deleting User...");
      const response = await deleteUser(rowData.username);
      if (response) {
        const updatedUsers = [...users];
        updatedUsers.splice(rowIndex, 1);
        setUsers(updatedUsers);
        updateToSuccessToast(toastId, "User deleted successfully!");
      } else {
        updateToErrorToast(toastId, "User deletion failed!");
      }
    } catch (err) {
      console.log(err);
      updateToErrorToast(toastId, "User deletion failed!");
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

  return (
    <div className="viewDetailsSection">
      <div className="flex justify-between items-center ">
        <h2 className="text-xl font-bold">Users</h2>
        <div className="flex gap-2">
          <Button
            label="Create"
            className="secondaryBtn py-1 px-3"
            onClick={() => setShowDialog(true)} // Open the dialog
          />
          <Button label="Save" className="py-1 px-3" />
        </div>
      </div>
      <Divider />

      <div className="h-full">
        <DataTable value={users} editMode="cell" className="p-datatable-gridlines h-100" dataKey="username" columnResizeMode="expand" scrollable scrollHeight="flex" loading={loading}>
          <Column field="username" header="Username" bodyStyle={{ minWidth: "150px", maxWidth: "400px" }} />
          <Column field="first_name" header="First Name" bodyStyle={{ minWidth: "150px", maxWidth: "150px" }} />
          <Column field="last_name" header="Last Name" bodyStyle={{ minWidth: "150px", maxWidth: "150px" }} />
          <Column field="is_active" header="Active" body={isActiveBodyTemplate} bodyStyle={{ minWidth: "100px", maxWidth: "100px", textAlign: "center" }} align={"center"} />
          <Column field="is_verified" header="Verified" body={isVerifiedBodyTemplate} bodyStyle={{ minWidth: "100px", maxWidth: "100px", textAlign: "center" }} align={"center"} />
          <Column field="user_type" header="User Type" bodyStyle={{ minWidth: "150px", maxWidth: "150px" }} />
          <Column field="email" header="Email" bodyStyle={{ minWidth: "200px", maxWidth: "400px" }} />
          <Column field="mobile_number" header="Mobile Number" bodyStyle={{ minWidth: "150px", maxWidth: "150px" }} />
          <Column field="state" header="State" bodyStyle={{ minWidth: "150px", maxWidth: "150px" }} />
          <Column field="city" header="City" bodyStyle={{ minWidth: "150px", maxWidth: "150px" }} />
          <Column body={actionBodyTemplate} header="" bodyStyle={{ minWidth: "80px", maxWidth: "80px", textAlign: "center" }} />
        </DataTable>
      </div>

      {/* Dialog for Creating a New User */}
      <Dialog
        header="Create User"
        visible={showDialog}
        style={{ width: "500px" }}
        onHide={() => setShowDialog(false)} // Close the dialog
        footer={
          <div className="flex justify-end gap-4">
            <Button label="Cancel" className="secondaryBtn p-button-text text-gray-500 hover:text-gray-700" onClick={() => setShowDialog(false)} />
            <Button label="Create" className="bg-blue-500 text-white px-4 py-2 rounded-md shadow hover:bg-blue-600 transition" onClick={handleCreateUser} />
          </div>
        }
      >
        <form
          onSubmit={(e) => {
            e.preventDefault(); // Prevent default form submission
            handleCreateUser(); // Call the create user handler
          }}
          className="p-fluid space-y-4"
        >
          <div className="field">
            <label htmlFor="username" className="block text-sm font-medium mb-1 text-gray-700">
              Username*
            </label>
            <InputText
              id="username"
              value={newUser.username}
              onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
              className="mt-1 block w-full h-8 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 "
              required
            />
          </div>
          <div className="field">
            <label htmlFor="first_name" className="block text-sm font-medium mb-1 text-gray-700">
              First Name*
            </label>
            <InputText
              id="first_name"
              value={newUser.first_name}
              onChange={(e) => setNewUser({ ...newUser, first_name: e.target.value })}
              className="mt-1 block w-full h-8 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 "
              required
            />
          </div>
          <div className="field">
            <label htmlFor="last_name" className="block text-sm font-medium mb-1 text-gray-700">
              Last Name
            </label>
            <InputText
              id="last_name"
              value={newUser.last_name}
              onChange={(e) => setNewUser({ ...newUser, last_name: e.target.value })}
              className="mt-1 block w-full h-8 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 "
            />
          </div>
          <div className="field">
            <label htmlFor="email" className="block text-sm font-medium mb-1 text-gray-700">
              Email*
            </label>
            <InputText
              id="email"
              value={newUser.email}
              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              className="mt-1 block w-full h-8 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 "
              required
            />
          </div>
          <div className="field">
            <label htmlFor="mobile_number" className="block text-sm font-medium mb-1 text-gray-700">
              Mobile Number
            </label>
            <InputText
              id="mobile_number"
              value={newUser.mobile_number}
              onChange={(e) => setNewUser({ ...newUser, mobile_number: e.target.value })}
              className="mt-1 block w-full h-8 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 "
            />
          </div>
          <div className="field">
            <label htmlFor="city" className="block text-sm font-medium mb-1 text-gray-700">
              City
            </label>
            <InputText
              id="city"
              value={newUser.city}
              onChange={(e) => setNewUser({ ...newUser, city: e.target.value })}
              className="mt-1 block w-full h-8 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 "
            />
          </div>
          <div className="field">
            <label htmlFor="state" className="block text-sm font-medium mb-1 text-gray-700">
              State
            </label>
            <InputText
              id="state"
              value={newUser.state}
              onChange={(e) => setNewUser({ ...newUser, state: e.target.value })}
              className="mt-1 block w-full h-8 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 "
            />
          </div>
          <div className="field-checkbox flex items-center gap-2">
            <Checkbox inputId="is_verified" checked={newUser.is_verified} onChange={(e) => setNewUser({ ...newUser, is_verified: e.checked })} />
            <label htmlFor="is_verified" className="text-sm font-medium text-gray-700">
              Verified
            </label>
          </div>
        </form>
      </Dialog>
    </div>
  );
};

export default UserList;
