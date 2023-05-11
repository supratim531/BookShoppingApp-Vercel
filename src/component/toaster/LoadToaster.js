import React, { useEffect, useRef } from "react";
import { toast, ToastContainer } from "react-toastify";

function LoadToaster({ isLoading, loadingMessage, successMessage, setSuccessMessage, errorMessage, setErrorMessage }) {
  const toastId = useRef(null);

  useEffect(() => {
    if (isLoading) {
      toastId.current = toast.loading(loadingMessage);
    } else {
      console.log("LoadToaster:", errorMessage, successMessage);

      if (errorMessage !== '') {
        toast.update(toastId.current, {
          type: toast.TYPE.ERROR,
          render: errorMessage,
          isLoading: false,
          autoClose: 700
        });
        setErrorMessage('');
      } else if (successMessage !== '') {
        toast.update(toastId.current, {
          type: toast.TYPE.SUCCESS,
          render: successMessage,
          isLoading: false,
          autoClose: 700
        });
        setSuccessMessage('');
      }
    }
  }, [isLoading]);

  return (
    <div>
      <ToastContainer />
    </div>
  );
}

export default LoadToaster;
