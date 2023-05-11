import React, { useContext, useEffect } from "react";
import Helmet from "react-helmet";
import { Link, Outlet, useNavigate } from "react-router-dom";
import RootContext from "../../context/RootContext";
import AdminProfile from "./AdminProfile";

function Profile() {
  const navigate = useNavigate();
  const context = useContext(RootContext);
  console.log("Profile.jsx: user:", context.user);

  useEffect(() => {
    if (context.isAdmin) {
      navigate("/account-profile");
    }
  }, []);

  useEffect(() => {
    context.userSetup();
  }, []);

  return (
    <div>
      <Helmet><title>Your Profile | BookWorm</title></Helmet>

      {
        (context.isAdmin) &&
        <div className="mx-2">
          <AdminProfile />
        </div>
      }

      {
        (!context.isAdmin) &&
        <div>
          <div className="flex">
            <div className="p-4 bg-red-400">
              <ul className="">
                <li><Link to={''}>Profile Information</Link></li>
                <li><Link to={"address"}>Manage Addresses</Link></li>
              </ul>
            </div>
            <div className="p-4 bg-blue-400">
              <Outlet />
            </div>
          </div>
        </div>
      }
    </div>
  );
}

export default Profile;
