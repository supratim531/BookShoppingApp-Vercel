import React, { useEffect, useMemo, useRef } from "react";
import { toast, ToastContainer } from "react-toastify";

function VoiceToaster({ input, listening }) {
  const toastId = useRef(null);

  useMemo(() => {
    toastId.current = toast.info(input ? input : "Speak Now", {
      autoClose: false,
      position: "top-center",
      theme: "dark",
      icon: <i className="fa-solid fa-microphone text-2xl text-red-400"></i>
    });
  }, []);

  useEffect(() => {
    toast.update(toastId.current, {
      type: toast.TYPE.INFO,
      render: input
    });
  }, [input, listening]);

  return (
    <div>
      <ToastContainer />
    </div>
  );
}

export default VoiceToaster;
