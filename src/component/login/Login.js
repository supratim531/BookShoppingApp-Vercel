import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import RootContext from "../../context/RootContext";
import { unauthorizedAxios } from "../../axios/axios";
import Helmet from "react-helmet";
// import ErrorToaster from "../toaster/ErrorToaster";
import LoadToaster from "../toaster/LoadToaster";

function Login() {
  const navigate = useNavigate();
  const context = useContext(RootContext);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const login = async credential => {
    try {
      const res = await unauthorizedAxios.post("/auth/login", credential);
      console.log("res:", res);
      const data = res.data;
      const jwt = data.jwt;
      const userRole = data.user.userRole;
      localStorage.setItem("jwt", JSON.stringify(jwt));
      localStorage.setItem("role", JSON.stringify(userRole));
      setIsLoading(false);
      setSuccessMessage("Successfully Logged In");
      window.location.reload();
    } catch (err) {
      console.log("err:", err);
      setIsLoading(false);
      setErrorMessage("Server Error");
    }
  }

  const loginUser = e => {
    setIsLoading(true);
    login({ username, password });
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
      <Helmet><title>Login | BookWorm</title></Helmet>

      <LoadToaster
        isLoading={isLoading}
        loadingMessage={"Logging In"}
        successMessage={successMessage}
        setSuccessMessage={setSuccessMessage}
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
      />
      {/* <ErrorToaster message={errorMessage} setMessage={setErrorMessage} /> */}

      <form onSubmit={loginUser} className="w-[30%] p-4 flex flex-col space-y-4 bg-red-400">
        <span className="text-xl font-medium text-right">Log In</span>
        <input type="text" name="username" id="username" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="username" />
        <input type="password" name="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="password" />
        <button type="submit" className="px-6 py-1.5 rounded text-white bg-green-600">Login</button>
        {/* <span className="text-xl font-medium uppercase text-center">OR</span>
        <button onClick={() => navigate("face-recognition")} className="px-6 py-1.5 rounded bg-amber-500">Face Recognition</button> */}
        <span>Need a <Link className="text-blue-800" to={"/signup"}>signup?</Link></span>
      </form>
    </div>
  );
}

export default Login;
