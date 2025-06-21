import React, { useEffect, useState } from "react";
import { FileUpload } from "primereact/fileupload";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import { Divider } from "primereact/divider";
import useVehicleService from "../../../services/useVehicleService";
import useToastService from "../../../services/useToastService";

const categoryOptions = [
  { id: 1, label: "Truck", value: "truck" },
  { id: 2, label: "Car", value: "car" },
  { id: 3, label: "Bus", value: "bus" },
  { id: 4, label: "Tractor", value: "tractor" },
  // Add more categories as needed
];

const VehicleUpload = () => {
  const { CategoryImageUpload, getCategories } = useVehicleService();
  const { showLoadingToast, updateToSuccessToast, updateToErrorToast, showErrorToast } = useToastService();

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categories, setCategories] = useState([]);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);

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

  const onUpload = async ({ files }) => {
    console.log(files);
    const toastId = showLoadingToast("Uploading...");

    try {
      const res = await CategoryImageUpload(files,selectedCategory.category, selectedCategory.id);

      if (res) updateToSuccessToast(toastId, "Uploaded Successfully");
    } catch (err) {
      updateToErrorToast(toastId, "Error in uploading");
      console.error(err);
    }
  };

  return (
    <div className=" mx-auto  p-3  space-y-4">
      <div>
        <h2 className="text-xl font-bold ">Upload Category Image</h2>
        <Divider />
      </div>

      <div className="w-25">
        <label className="block mb-2 text-sm  text-gray-700  font-bold">Category</label>
        <Dropdown value={selectedCategory} optionLabel="category" dataKey="id" options={categories} onChange={(e) => setSelectedCategory(e.value)} placeholder="Select a category" className="w-100" />
      </div>
      <div>
        <label className="block mb-2 text-sm  text-gray-700 font-bold">Images</label>
        <FileUpload
          name="images"
          customUpload
          accept="image/*"
          maxFileSize={5000000}
          chooseLabel="Browse"
          uploadLabel="Upload"
          cancelLabel="Cancel"
          emptyTemplate={<p className="m-0">Drag and drop images here to upload.</p>}
          onSelect={(e) => setFiles(e.files)}
          onClear={() => setFiles([])}
          onUpload={onUpload}
          files={files}
          previewWidth={200}
          className="w-full"
          mode="advanced"
          auto={false}
        />
      </div>
      <Button label="Upload" icon="pi pi-upload" className=" bg-blue-600 text-white" onClick={() => onUpload({ files })} disabled={!selectedCategory || files.length === 0} />
    </div>
  );
};

export default VehicleUpload;
