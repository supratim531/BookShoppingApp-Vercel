import React, { useContext, useEffect, useState } from "react";
import Helmet from "react-helmet";
import { Link, useNavigate } from "react-router-dom";
import { unauthorizedAxios } from "../../axios/axios";
import RootContext from "../../context/RootContext";
// import ErrorToaster from "../toaster/ErrorToaster";
import LoadToaster from "../toaster/LoadToaster";

function Signup() {
  const navigate = useNavigate();
  const context = useContext(RootContext);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const register = async credential => {
    try {
      const res = await unauthorizedAxios.post("/user/register", credential);
      console.log("res:", res);
      setIsLoading(false);
      setSuccessMessage("Successfully Signed Up");
      navigate("/login");
    } catch (err) {
      console.log("err:", err);
      setIsLoading(false);
      setErrorMessage("Server Error");
    }
  }

  const registerUser = e => {
    setIsLoading(true);
    register({ username, password, userRole: "USER" });
    // setUsername('');
    // setPassword('');
    e.preventDefault();
  }

  useEffect(() => {
    if (context.isLogin || context.isAdmin) {
      navigate('/');
    }
  });

  return (
    <div>
      <Helmet><title>Signup | BookWorm</title></Helmet>

      <LoadToaster
        isLoading={isLoading}
        loadingMessage={"Signing Up"}
        successMessage={successMessage}
        setSuccessMessage={setSuccessMessage}
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
      />
      {/* <ErrorToaster message={errorMessage} setMessage={setErrorMessage} /> */}

      <form onSubmit={registerUser} className="w-[30%] p-4 flex flex-col space-y-4 bg-red-400">
        <span className="text-xl font-medium">Sign Up</span>
        <input type="text" name="username" id="username" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="username" />
        <input type="password" name="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="password" />
        <button type="submit" className="px-6 py-1.5 rounded text-white bg-sky-600">Signup</button>
        <span>Need to <Link className="text-blue-800" to={"/login"}>login?</Link></span>
      </form>
    </div>
  );
}

export default Signup;
