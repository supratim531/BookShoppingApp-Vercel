import React, { useContext, useEffect, useState } from "react";
import Helmet from "react-helmet";
import { useLocation, useNavigate } from "react-router-dom";
import { authorizedAxios } from "../../axios/axios";
import RootContext from "../../context/RootContext";

function PlaceOrder() {
  const location = useLocation();
  const navigate = useNavigate();
  const context = useContext(RootContext);
  const [book, setBook] = useState({});
  const [quantity, setQuantity] = useState(1);
  const [addressId, setAddressId] = useState('');

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
    console.log("order:", addressId, book.bookId, quantity);
    orderPayload[0].push(book.bookId);
    orderPayload[1].push(quantity);
    placeOrder(addressId, orderPayload);
  }

  useEffect(() => {
    if (context.isAdmin) {
      navigate('/');
    }

    if (location.state !== null) {
      console.log(location);
      setBook(location.state);
      setAddressId(context.user?.customer.addresses[0]?.addressId);
    } else {
      navigate('/');
    }
  }, [context.user]);

  return (
    <div>
      <Helmet><title>Place Your Order | BookWorm</title></Helmet>

      <div className="m-4">
        <div className="sm:container sm:mx-auto">
          <div className="flex flex-col space-y-4">
            <div className="name flex flex-col px-6 py-4 rounded-sm shadow-sm shadow-slate-400 border border-slate-200">
              <span className="uppercase font-medium text-slate-500">Login <span><i className="fa-solid fa-check text-blue-600"></i></span></span>
              {
                (context.user?.customer.firstName === null) &&
                <span className="text-slate-700">
                  <b>{context.user.username}, </b>Update Your Profile
                  <button className="px-2 py-1 block rounded shadow text-sm text-white bg-teal-600" onClick={() => navigate("/account-profile")}><i className="fa-solid fa-pen-to-square"></i></button>
                </span>
              }
              <span className="text-slate-800"><b>{context.user?.customer?.firstName} {context.user?.customer?.lastName}</b> {context.user?.customer?.phone}</span>
            </div>
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
              <span className="uppercase font-medium text-slate-500">Order Summary <span><i className="fa-solid fa-check text-blue-600"></i></span></span>
              <div className="flex space-x-10">
                <div className="flex flex-col items-center space-y-4">
                  <img className="mb-4 w-24 border" src={book?.bookImage} alt="book" />
                  <div className="space-x-4">
                    <button className={(quantity > 1) ? "px-1.5 py-0.5 rounded-full border-2 border-black" : "px-1.5 py-0.5 rounded-full border-2 text-slate-400 border-slate-400"} disabled={quantity === 1} onClick={() => setQuantity(e => e - 1)}><i className="fa-solid fa-minus"></i></button>
                    <span className="px-4 py-1 border-2 border-slate-600">{quantity}</span>
                    <button className={(quantity < book.stock) ? "px-1.5 py-0.5 rounded-full border-2 border-black" : "px-1.5 py-0.5 rounded-full border-2 text-slate-400 border-slate-400"} disabled={quantity === book.stock} onClick={() => setQuantity(e => e + 1)}><i className="fa-solid fa-plus"></i></button>
                  </div>
                  {
                    (quantity === book.stock) &&
                    <span className="text-sm text-red-600">Reached to it's maximum stock</span>
                  }
                </div>
                <div className="relative flex flex-col">
                  <span className="font-medium text-lg text-slate-900">{book?.bookName}</span>
                  <div>
                    <span className="font-medium">Author(s): </span>
                    {
                      book?.authors?.map((author, id) =>
                        <span key={author.authorId} className="text-slate-500">{author.authorName}{((book?.authors.length - 1) === id) ? '' : ", "}</span>
                      )
                    }
                  </div>
                  <span>Publisher: N/A</span>
                  <span className="text-lg">{book?.pageCount} Pages</span>
                  <span className="text-lg font-medium">Price: ₹{book?.price}</span>
                  <span className="absolute bottom-0 text-lg font-medium">Budget: ₹{book?.price * quantity}</span>
                </div>
              </div>
            </div>
            <div className="">
              {
                (context.user?.customer.addresses.length > 0) &&
                <button className="px-6 py-3 uppercase font-semibold rounded-sm shadow shadow-slate-600 text-white bg-[#fb641b]" onClick={submitPlaceOrder}>NOTHING TO PAY - BUY</button>
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PlaceOrder;
