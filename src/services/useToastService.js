"use client"
import { toast } from "react-toastify";

const useToastService = () => {
  // Function to show a loading toast
  const showLoadingToast = (message) => {
    return toast.loading(message, {
      position: "top-right",
      closeOnClick: false,
      draggable: false,
      theme: "colored",
    });
  };

  // Function to update a loading toast to success
  const updateToSuccessToast = (toastId, message) => {
    toast.update(toastId, {
      render: message,
      type: "success",
      isLoading: false,
      autoClose: 3000, // Closes after 3 seconds
      closeOnClick: true,
      draggable: true,
    });
  };

  // Function to update a loading toast to error
  const updateToErrorToast = (toastId, message) => {
    toast.update(toastId, {
      render: message,
      type: "error",
      isLoading: false,
      autoClose: 3000, // Closes after 3 seconds
      closeOnClick: true,
      draggable: true,
    });
  };

  // Function to show a success toast directly
  const showSuccessToast = (message) => {
    toast.success(message, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "colored",
    });
  };

  // Function to show an error toast directly
  const showErrorToast = (message) => {
    toast.error(message, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "colored",
    });
  };

  return {
    showLoadingToast,
    updateToSuccessToast,
    updateToErrorToast,
    showSuccessToast,
    showErrorToast,
  };
};

export default useToastService;