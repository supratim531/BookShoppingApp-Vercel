import React, { useContext, useEffect, useState } from "react";
import { authorizedAxios } from "../../axios/axios";
import RootContext from "../../context/RootContext";
import SuccessToaster from "../toaster/SuccessToaster";

function AllUsers() {
  const context = useContext(RootContext);
  const [users, setUsers] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');

  const fetchAllUser = async () => {
    try {
      const res = await authorizedAxios(context.secretToken).get("/user/fetch-all");
      console.log("res:", res);
      setUsers(res.data);
    } catch (err) {
      console.log("err:", err);
    }
  }

  const deactivateUser = async username => {
    try {
      const res = await authorizedAxios(context.secretToken).delete(`/user/deactivate-account/${username}`);
      console.log("res:", res);
      fetchAllUser();
      setSuccessMessage(res.data);
    } catch (err) {
      console.log("err:", err);
    }
  }

  const deactivateUserAccount = username => {
    deactivateUser(username);
  }

  useEffect(() => {
    fetchAllUser();
  }, []);

  return (
    <div>
      <SuccessToaster message={successMessage} setMessage={setSuccessMessage} />

      <span>All Users</span>
      {
        users?.map(user =>
          <div className="" key={user.username}>
            <div className="space-x-6">
              <span>{user.username}</span>
              <span>{user.customer?.firstName}</span>
              <span>{user.customer?.lastName}</span>
              <span>{user.customer?.email}</span>
              <span>{user.customer?.phone}</span>
              <span>{user.userRole}</span>
              {
                (user.userRole === "ROLE_USER") &&
                <button onClick={() => deactivateUserAccount(user.username)}><i className="fa-solid fa-trash-can text-red-600"></i></button>
              }
            </div>
          </div>
        )
      }
    </div>
  );
}

export default AllUsers;
