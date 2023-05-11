import React, { useContext, useEffect } from "react";
import Helmet from "react-helmet";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import RootContext from "../../context/RootContext";
import Books from "../book/Books";

function Home() {
  const navigate = useNavigate();
  const context = useContext(RootContext);

  useEffect(() => {
    if (!context.isAdmin) {
      navigate('/');
    }
  }, []);

  return (
    <div>
      <Helmet><title>Home | BookWorm</title></Helmet>

      {
        (context.isAdmin) &&
        // <h1>Landing Page: This is admin side</h1>
        <div className="flex flex-col">
          <div className="p-4 bg-red-400">
            <ul className="flex space-x-8">
              <li><NavLink className="p-2 text-white" to={""}>All Users</NavLink></li>
              <li><NavLink className="p-2 text-white" to={"all-books"}>All Books</NavLink></li>
              <li><NavLink className="p-2 text-white" to={"all-orders"}>All Orders</NavLink></li>
            </ul>
          </div>
          <div className="p-4">
            <Outlet />
          </div>
        </div>
      }

      {
        (!context.isAdmin) &&
        <Books />
      }
    </div>
  );
}

export default Home;
