import React, { useContext, useEffect, useState } from "react";
import Helmet from "react-helmet";
import { Link, useNavigate } from "react-router-dom";
import { authorizedAxios } from "../../axios/axios";
import RootContext from "../../context/RootContext";
import NewSuccessToaster from "../toaster/NewSuccessToaster";
import "./cart.css";

function Cart() {
  const navigate = useNavigate();
  const context = useContext(RootContext);
  const [addressId, setAddressId] = useState('');
  const [quantities, setQuantities] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [successMessage, setSuccessMessage] = useState('');

  const updateQuantity = (index, operator, indexPrice) => {
    let newQuantities = [...quantities]; // copying the old datas array

    if (operator === '+') {
      newQuantities[index] += 1;
      setTotalPrice(e => e + indexPrice);
    } else {
      newQuantities[index] -= 1;
      setTotalPrice(e => e - indexPrice);
    }

    setQuantities(newQuantities);
  }

  const removeItemFromCart = (id, book) => {
    let newQuantities = [...quantities];
    const items = JSON.parse(localStorage.getItem("cart"));
    items.splice(id, 1);
    newQuantities.splice(id, 1);
    context.setCartItems(items);
    setQuantities(newQuantities);
    setTotalPrice(e => e - (book.price * quantities[id]));
    localStorage.setItem("cart", JSON.stringify(items));
    setSuccessMessage(`Removed book ${book.bookName} from cart successfully`);
  }

  const placeOrder = async (addressId, payload) => {
    try {
      const res = await authorizedAxios(context.secretToken).post(`/order/place-order?addressId=${addressId}`, payload);
      console.log("res:", res);
      context.updateUser(context.secretToken, context.user.username);
      navigate('/');
    } catch (err) {
      console.log("err:", err);
    }
  }

  const submitPlaceOrder = () => {
    const orderPayload = [[], []];

    context.cartItems.forEach(e => {
      if (e.stock !== 0) {
        orderPayload[0].push(e.bookId);
      }
    });

    context.cartItems.forEach((e, id) => {
      if (e.stock !== 0) {
        orderPayload[1].push(quantities[id]);
      }
    });

    console.log(addressId, orderPayload);
    placeOrder(addressId, orderPayload);
  }

  useEffect(() => {
    if (context.isAdmin) {
      navigate('/');
    }

    setAddressId(context.user?.customer.addresses[0]?.addressId);
  }, [context.user]);

  useEffect(() => {
    if (context.cartItems.length !== 0) {
      let totalPrice = 0;
      let newQuantities = [];

      context.cartItems.forEach(e => {
        if (e.stock !== 0) {
          totalPrice += e.price;
        }

        newQuantities.push(1);
      });

      setTotalPrice(totalPrice);
      setQuantities(newQuantities);
      console.log("BARBAR");
    }
  }, [context.cartItems, context.user, context.books.length]);

  useEffect(() => {
    context.updateCartItems();
  }, []);

  return (
    <div>
      <Helmet><title>Book Shopping Cart | BookWorm</title></Helmet>

      {(successMessage !== '') && <NewSuccessToaster message={successMessage} setMessage={setSuccessMessage} />}

      {
        (context.isLogin) &&
        <div className="m-4">
          <div className="sm:container sm:mx-auto">
            <div className="flex gap-4">
              <div className="w-full flex flex-col space-y-4">
                <div className="p-6 rounded-sm shadow-sm shadow-slate-400 border text-lg text-blue-600 border-slate-200">BookWorm ({context.cartItems.length})</div>
                <div className="address p-6 rounded-sm shadow-sm shadow-slate-400 border border-slate-200">
                  <span className="uppercase font-medium text-slate-500">Delivery Address <span><i className="fa-solid fa-check text-blue-600"></i></span></span>
                  <div className="">
                    {
                      (context.user?.customer.addresses.length === 0) &&
                      <span className="space-x-4 text-slate-700">
                        <span><b>{context.user.username}, </b>Add Address(es) to Place Order</span>
                        <span className="p-1 space-x-2 rounded bg-[#d3cfcf]">
                          <i className="fa-solid fa-circle-exclamation text-red-600"></i>
                          <span>Required to place order</span>
                        </span>
                      </span>
                    }
                    <span className="space-x-0">
                      {
                        context.user?.customer?.addresses.map(address =>
                          <span key={address.addressId} className="pt-2 flex space-x-2">
                            <input className="self-start mt-1.5 cursor-pointer" type="radio" name="addressId" id={address.addressId} value={address.addressId} onChange={(e) => setAddressId(e.target.value)} checked={addressId === address.addressId} />
                            <label className="cursor-pointer" htmlFor={address.addressId}>
                              <div className={(addressId === address.addressId) ? "px-4 pb-4 flex flex-col rounded-sm bg-slate-200" : "px-4 pb-4 flex flex-col rounded-sm hover:bg-slate-200"}>
                                <div className="font-medium space-x-4 text-slate-800">
                                  <span>{address.name}</span>
                                  <span>{address.phone}</span>
                                </div>
                                <div className="text-slate-600">
                                  <p>{address.addressLine}, {address.city}, {address.state} - {address.pinCode}</p>
                                </div>
                              </div>
                            </label>
                          </span>
                        )
                      }
                    </span>
                    <div className="mt-4">
                      <button className="px-6 py-3 rounded-sm shadow shadow-slate-600 text-white bg-blue-600" onClick={() => navigate("/account-profile/address")}>ADD ADDRESS</button>
                    </div>
                  </div>
                </div>
                <div className="order-info p-6 space-y-4 rounded-sm shadow-sm border shadow-slate-400 border-slate-200">
                  {
                    (context.cartItems.length === 0) &&
                    <div className="flex flex-col justify-center items-center">
                      <img className="w-60" src={"https://rukminim1.flixcart.com/www/800/800/promos/16/05/2019/d438a32e-765a-4d8b-b4a6-520b560971e8.png?q=90"} alt="" />
                      <div className="mt-4 text-lg text-slate-800">Your cart is empty!</div>
                      <div className="mt-2 text-sm text-slate-600">Add books to it now.</div>
                      <button className="mt-2 px-16 py-2 rounded-sm shadow-sm shadow-slate-600 text-sm text-white bg-[#2874f0]" onClick={() => navigate("/")}>Shop Now</button>
                    </div>
                  }
                  {
                    (context.cartItems.length !== 0) &&
                    <div className="">
                      <div className="books h-[320px] overflow-y-scroll">
                        {
                          context.cartItems.map((cartItem, id) =>
                            <div key={cartItem?.bookId} className="relative">
                              {
                                (cartItem?.stock <= 0) &&
                                <>
                                  <div className="absolute h-full w-full opacity-80 bg-black">
                                  </div>
                                  <div className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
                                    <span className="px-6 py-2 rounded-sm bg-white">Not Available</span>
                                  </div>
                                </>
                              }
                              <div className="">
                                <div className="flex space-x-10">
                                  <div className="flex flex-col items-center space-y-4">
                                    <Link to={`/book/${cartItem.bookName.replaceAll(' ', '-')}?bookId=${cartItem.bookId}`}>
                                      <img className="mb-4 w-24 border" src={cartItem?.bookImage} alt="book" />
                                    </Link>
                                    <div className="space-x-4">
                                      <button className={(quantities[id] > 1) ? "px-1.5 py-0.5 rounded-full border-2 border-black" : "px-1.5 py-0.5 rounded-full border-2 text-slate-400 border-slate-400"} disabled={quantities[id] === 1} onClick={() => updateQuantity(id, '-', cartItem.price)}><i className="fa-solid fa-minus"></i></button>
                                      <span className="px-4 py-1 border-2 border-slate-600">{cartItem?.stock === 0 ? 0 : quantities[id]}</span>
                                      <button className={(quantities[id] < cartItem.stock) ? "px-1.5 py-0.5 rounded-full border-2 border-black" : "px-1.5 py-0.5 rounded-full border-2 text-slate-400 border-slate-400"} disabled={quantities[id] >= cartItem.stock} onClick={() => updateQuantity(id, '+', cartItem.price)}><i className="fa-solid fa-plus"></i></button>
                                    </div>
                                    {
                                      (quantities[id] >= cartItem.stock && cartItem.stock !== 0) &&
                                      <div className="text-sm text-red-600">Reached to it's maximum stock</div>
                                    }
                                  </div>
                                  <div className="relative flex flex-col">
                                    <Link to={`/book/${cartItem.bookName.replaceAll(' ', '-')}?bookId=${cartItem.bookId}`}>
                                      <span className="font-medium text-lg text-slate-900 hover:text-blue-600">{cartItem?.bookName}</span>
                                    </Link>
                                    <div>
                                      <span className="font-medium">Author(s): </span>
                                      {
                                        cartItem?.authors?.map((author, id) =>
                                          <span key={author.authorId} className="text-slate-500">{author.authorName}{((cartItem?.authors.length - 1) === id) ? '' : ", "}</span>
                                        )
                                      }
                                    </div>
                                    <span>Publisher: N/A</span>
                                    <span className="text-lg">{cartItem?.pageCount} Pages</span>
                                    <span className="text-lg font-medium">Price: ₹{cartItem?.price}</span>
                                    <div className="absolute bottom-0 uppercase cursor-pointer text-lg hover:text-blue-600" onClick={() => removeItemFromCart(id, cartItem)}>Remove</div>
                                  </div>
                                </div>
                                {
                                  ((context.cartItems.length - 1) !== id) && <hr className="my-6" />
                                }
                              </div>
                            </div>
                          )
                        }
                      </div>
                      {
                        (context.user?.customer.addresses.length > 0) &&
                        <div className="px-4 pt-7 pb-1 mt-2 flex justify-end border-t-2">
                          <button className="px-8 py-4 uppercase font-semibold rounded-sm shadow-sm shadow-slate-600 text-white bg-[#fb641b]" onClick={submitPlaceOrder}>NOTHING TO PAY - BUY</button>
                        </div>
                      }
                    </div>
                  }
                </div>
              </div>
              {
                (context.cartItems.length !== 0) &&
                <div className="h-[250px] w-[600px] px-6 py-3 rounded-sm shadow-sm shadow-slate-400 border border-slate-200">
                  <div className="uppercase font-semibold text-slate-400">Price Details</div>
                  <hr className="my-4" />
                  <div className="flex justify-between items-center">
                    <span>Price ({context.cartItems.length} items)</span>
                    <span>₹{totalPrice}</span>
                  </div>
                  <div className="mt-4 flex justify-between items-center">
                    <span>Discount</span>
                    <span className="text-green-600">₹0</span>
                  </div>
                  <div className="mt-4 flex justify-between items-center">
                    <span>Delivery Charges</span>
                    <span className="text-green-600">Free</span>
                  </div>
                  <hr className="my-4" />
                  <div className="flex justify-between items-center font-semibold text-lg text-slate-800">
                    <span>Total Amount</span>
                    <span>₹{totalPrice}</span>
                  </div>
                </div>
              }
            </div>
          </div>
        </div>
      }
      {
        (!context.isLogin) &&
        <button onClick={() => navigate("/login")} className="px-6 py-1.5 rounded bg-orange-500">Login To View Cart</button>
      }
    </div>
  );
}

export default Cart;
