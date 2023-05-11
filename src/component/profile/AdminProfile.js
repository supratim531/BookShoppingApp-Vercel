import React, { useContext } from "react";
import RootContext from "../../context/RootContext";

function AdminProfile() {
  const context = useContext(RootContext);

  return (
    <div className="px-2 text-lg font-medium space-x-6 bg-yellow-500">
      <span>{context?.user?.username}</span>
      <span>{context?.user?.userRole}</span>
    </div>
  );
}

export default AdminProfile;
