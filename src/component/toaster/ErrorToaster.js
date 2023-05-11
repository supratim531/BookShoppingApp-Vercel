import React, { useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";

function ErrorToaster(props) {
  useEffect(() => {
    if (props.message !== '') {
      toast.error(props.message, {
        autoClose: 700
      });
      props.setMessage('');
    }
  });

  return (
    <div>
      <ToastContainer />
    </div>
  );
}

export default ErrorToaster;
