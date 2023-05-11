import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import RootContext from "../context/RootContext";

function ProtectedRoute(props) {
  const navigate = useNavigate();
  const context = useContext(RootContext);

  useEffect(() => {
    if (!context.isLogin) {
      console.log("Protected Took Place");
      navigate("/login");
    }
  });

  return (
    <props.component />
  );
}

export default ProtectedRoute;
