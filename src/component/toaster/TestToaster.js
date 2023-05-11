import React, { useRef } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function TestToaster() {
  let toastId = useRef(null);

  const showToast = () => {
    toast("Toast Example", {
      autoClose: 500,
      position: "top-right"
    });
  }

  const showSuccessToast = () => {
    toast.success("Success Toast Example", {
      autoClose: 500,
      position: "top-right"
    });
  }

  const showWarningToast = () => {
    toast.warning("Warning Toast Example", {
      autoClose: 500,
      position: "top-right"
    });
  }

  const showErrorToast = () => {
    toast.error("Error Toast Example", {
      autoClose: 500,
      position: "top-right"
    });
  }

  const showLoadingToast = () => {
    toast.promise(
      new Promise((resolve, reject) => {
        setTimeout(() => {
          // resolve();
          reject();
        }, 1500);
      }),
      {
        pending: "Loading Content",
        success: "Loaded Successfully",
        error: "Error Occured"
      },
      {
        autoClose: 700
      }
    );
  }

  const customProgress = () => {
    toastId.current = toast.loading("Loading", {
      position: "bottom-right",
      theme: "dark"
    });
    console.log(toastId.current);
  }

  const updateProgress = () => {
    toast.update(toastId.current, {
      isLoading: false,
      autoClose: 500
    })
  }

  return (
    <div className="m-4">
      <button className="px-6 py-1.5 rounded border-2 border-black" onClick={showToast}>Show Toast</button>
      <button className="px-6 py-1.5 rounded border-2 border-black" onClick={showSuccessToast}>Show Success Toast</button>
      <button className="px-6 py-1.5 rounded border-2 border-black" onClick={showWarningToast}>Show Warning Toast</button>
      <button className="px-6 py-1.5 rounded border-2 border-black" onClick={showErrorToast}>Show Error Toast</button>
      <button className="px-6 py-1.5 rounded border-2 border-black" onClick={showLoadingToast}>Show Promise Toast</button>
      <button className="px-6 py-1.5 rounded border-2 border-black" onClick={customProgress}>Show Custom Progress</button>
      <button className="px-6 py-1.5 rounded border-2 border-black" onClick={updateProgress}>Update Custom Progress</button>
      <ToastContainer />
    </div>
  );
}

export default TestToaster;
