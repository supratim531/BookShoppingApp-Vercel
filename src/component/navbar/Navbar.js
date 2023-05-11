import React, { useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import RootContext from "../../context/RootContext";
import logo from "../../assets/navlogo.png";
import "./navbar.css";

function Navbar() {
  const navigate = useNavigate();
  const context = useContext(RootContext);

  const logout = () => {
    localStorage.clear();
    window.location.reload();
  }

  return (
    <nav className="z-10 w-full sticky top-0 mb-2 p-2 shadow-sm shadow-slate-600 text-white bg-[#2874f0]">
      <div className="p-2 flex justify-between items-center">
        <div className="px-2 font-medium text-lg cursor-pointer" onClick={() => navigate('/')}>
          <img className="w-32 rounded-sm" src={logo} alt="" />
          {/* <span>BookWorm</span> */}
        </div>
        <div className="">
          <ul className="flex items-center" onClick={() => {
            console.log("NAVBAR CLICKED..!");
            context.authSetup();
          }}>
            <NavLink className="px-4 py-1.5" to={'/'}><li>Home</li></NavLink>
            {(!context.isAdmin) && <NavLink className="px-4 py-1.5" to={"/top-50-books"}><li>Top 50 Books</li></NavLink>}
            {(context.isLogin || context.isAdmin) && <NavLink className="px-4 py-1.5" to={"/account-profile"}><li>Profile</li></NavLink>}
            {(context.isLogin && !context.isAdmin) && <NavLink className="px-4 py-1.5" to={"/orders"}><li>Orders</li></NavLink>}
            {(!context.isAdmin) && <NavLink className="relative px-4 py-1.5" to={"/book-cart"}><li><i className="fa-solid fa-cart-shopping text-lg"></i> {(context.cartItems.length > 0) && <span className="absolute top-[-4px] right-1 px-[0.325rem] py-[0.007rem] border rounded-full text-[0.7rem] bg-red-500">{context.cartItems.length}</span>}</li></NavLink>}
            {(context.isAdmin && context.isLogin) && <NavLink className="px-4 py-1.5" to={"/add-book"}><li>Add Book</li></NavLink>}
            {(!context.isLogin && !context.isAdmin) && <NavLink className="px-4 py-1.5" to={"/login"}><li>Login</li></NavLink>}
            {(!context.isLogin && !context.isAdmin) && <NavLink className="px-4 py-1.5" to={"/signup"}><li>Signup</li></NavLink>}
            {(context.isLogin || context.isAdmin) && <li><button onClick={logout} className="mx-2 px-4 py-1.5 rounded font-medium bg-red-600">Logout <i className="fa-solid fa-power-off"></i></button></li>}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
