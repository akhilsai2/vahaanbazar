"use client";
import React, { useEffect, useState } from "react";
import { InputText } from "primereact/inputtext";
import { Checkbox } from "primereact/checkbox";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import useVehicleService from "../../../services/useVehicleService";
import useToastService from "../../../services/useToastService";
import { FileUpload } from "primereact/fileupload";

const initialState = {
  id: "",
  category: "",
  price: "",
  registration_number: "",
  state: "",
  brand: "",
  no_of_tyres: "",
  chassis_number: "",
  location: "",
  original_invoice: false,
  asset_description: "",
  year_of_manufacturing: "",
  odometer: "",
  insurance: false,
  gst_applicable: false,
  fitness_images: [],
};

const VehicleUpdate = ({ initialData = initialState, onSubmit }) => {
  const { showLoadingToast, updateToSuccessToast, updateToErrorToast, showErrorToast } = useToastService();
  const [selectedCategory, setSelectedCategory] = useState(initialData.category ?? "");
  const [form, setForm] = useState(initialData);
  const { getCategories } = useVehicleService();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState([]);

  useEffect(() => {
    setLoading(true);
    getCategories()
      .then((res) => {
        if (res) {
          setCategories(res);
          setLoading(false);
        }
      })
      .catch((err) => {
        showErrorToast("Unable to get Categories");
        setLoading(false);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckbox = (e) => {
    const { name, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: checked }));
  };

  const handleImageChange = (e) => {
    setForm((prev) => ({ ...prev, fitness_images: Array.from(e) }));
    setFiles(e);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const toastId = showLoadingToast("Updating Vehicle...");
    if (onSubmit) onSubmit(form, toastId);
  };

  return (
    <form onSubmit={handleSubmit} className=" mx-auto p-1  space-y-5 ">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <span className="my-1">
          <label>Category</label>
          <Dropdown
            value={selectedCategory}
            optionLabel="category"
            optionValue="category"
            dataKey="id"
            loading={loading}
            options={categories}
            onChange={(e) => {
              setSelectedCategory(e.value);
              setForm((prev)=>({...prev,category:e.value}));
            }}
            placeholder="Select a category"
            className="w-full"
          />
        </span>
        <span className="my-1">
          <label>Price</label>
          <InputText name="price" value={form.price} onChange={handleChange} className="w-full h-8 px-4 py-2" />
        </span>
        <span className="my-1">
          <label>Registration Number</label>
          <InputText name="registration_number" value={form.registration_number} onChange={handleChange} className="w-full h-8 px-4 py-2" />
        </span>
        <span className="my-1">
          <label>Brand</label>
          <InputText name="brand" value={form.brand} onChange={handleChange} className="w-full h-8 px-4 py-2" />
        </span>
        <span className="my-1">
          <label>No. of Tyres</label>
          <InputText name="no_of_tyres" value={form.no_of_tyres} onChange={handleChange} className="w-full h-8 px-4 py-2" />
        </span>
        <span className="my-1">
          <label>Chassis Number</label>
          <InputText name="chassis_number" value={form.chassis_number} onChange={handleChange} className="w-full h-8 px-4 py-2" />
        </span>
        <span className="my-1">
          <label>State</label>
          <InputText name="state" value={form.state} onChange={handleChange} className="w-full h-8 px-4 py-2" />
        </span>
        <span className="my-1">
          <label>Location</label>
          <InputText name="location" value={form.location} onChange={handleChange} className="w-full h-8 px-4 py-2" />
        </span>
        <span className="my-1">
          <label>Asset Description</label>
          <InputText name="asset_description" value={form.asset_description} onChange={handleChange} className="w-full h-8 px-4 py-2" />
        </span>
        <span className="my-1">
          <label>Manufacturing (Yrs)</label>
          <InputText name="year_of_manufacturing" value={form.year_of_manufacturing} onChange={handleChange} className="w-full h-8 px-4 py-2" />
        </span>
        <span className="my-1">
          <label>Odometer (KM)</label>
          <InputText name="odometer" value={form.odometer} onChange={handleChange} className="w-full h-8 px-4 py-2" />
        </span>
        <span className="my-1">
          <label>Owner Mobile Number</label>
          <InputText name="mobileNumber" value={form.owner_mobile_number} onChange={handleChange} className="w-full h-8 px-4 py-2" />
        </span>
        <span className="flex items-center gap-2">
          <Checkbox inputId="insurance" name="insurance" checked={form.insurance} onChange={handleCheckbox} />
          <label htmlFor="insurance">Insurance</label>
        </span>
        <span className="flex items-center gap-2">
          <Checkbox inputId="gst_applicable" name="gst_applicable" checked={form.gst_applicable} onChange={handleCheckbox} />
          <label htmlFor="gst_applicable">GST Applicable</label>
        </span>
        <span className="flex items-center gap-2">
          <Checkbox inputId="original_invoice" name="original_invoice" checked={form.original_invoice} onChange={handleCheckbox} />
          <label htmlFor="original_invoice">Original Invoice</label>
        </span>
      </div>
      {!initialData.id && (
        <span>
          <FileUpload
            name="images"
            customUpload
            multiple
            accept="image/*"
            maxFileSize={5000000}
            chooseLabel="Browse"
            uploadLabel="Upload"
            cancelLabel="Cancel"
            emptyTemplate={<p className="m-0">Drag and drop images here to upload.</p>}
            onSelect={(e) => handleImageChange(e.files)}
            onClear={() => setFiles([])}
            files={files}
            key={files}
            previewWidth={200}
            className="w-full"
            mode="advanced"
            auto={false}
          />
        </span>
      )}
      <Button type="submit" label={initialData.id ? "Update Vehicle" : "Create Vehicle"} className="mt-5 float-end"  disabled={!initialData.id}/>
    </form>
  );
};

export default VehicleUpdate;
