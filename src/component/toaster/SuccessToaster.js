import React, { useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";

function SuccessToaster(props) {
  useEffect(() => {
    if (props.message !== '') {
      toast.success(props.message, {
        autoClose: 700,
        position: "bottom-center",
        theme: "dark"
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

export default SuccessToaster;
