import React, { useEffect, useRef } from "react";
import { toast, ToastContainer, Slide } from "react-toastify";

function SuccessToaster(props) {
  const toastId = useRef(null);

  useEffect(() => {
    toast.dismiss();
    toastId.current = toast.success(props.message, {
      autoClose: 700,
      position: "bottom-center",
      theme: "dark",
      transition: Slide
    });
  });

  useEffect(() => {
    // setTimeout(() => {
    //   props.setMessage('');
    //   toast.dismiss(toastId.current);
    // }, 2000);

    if (props.message !== '') {
      toast.update(toastId.current, {
        render: props.message
      });
    }
  });

  return (
    <div>
      <ToastContainer />
    </div>
  );
}

export default SuccessToaster;
