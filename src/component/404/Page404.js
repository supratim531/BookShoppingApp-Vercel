import React from "react";
import Helmet from "react-helmet";
import { Link } from "react-router-dom";

function Page404() {
  return (
    <div>
      <Helmet><title>Page Not Found | BookWorm</title></Helmet>

      <h1 className="text-3xl font-semibold">404 :") Page Not Found!</h1>
      <span>Go back to <Link className="text-blue-600" to={'/'}>Home</Link></span>
    </div>
  );
}

export default Page404;
