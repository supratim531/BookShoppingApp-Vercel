import React, { useContext, useEffect, useState } from "react";
import Helmet from "react-helmet";
import { useNavigate } from "react-router-dom";
import { authorizedAxios } from "../../axios/axios";
import RootContext from "../../context/RootContext";

function Orders() {
  const [allOrders, setAllOrders] = useState([]);
  const navigate = useNavigate();
  const context = useContext(RootContext);
  const [orders, setOrders] = useState([]);

  const fetchAllOrder = async () => {
    try {
      const res = await authorizedAxios(context.secretToken).get("/order/fetch-all");
      console.log("res:", res);
      setAllOrders(res.data);
    } catch (err) {
      console.log("err:", err);
    }
  }

  const fetchAllCustomerOrder = () => {
    fetchAllOrder();
  }

  const setCustomerOrders = () => {
    const myOrders = [];
    const myOrderIds = [];

    context.user?.customer.addresses.forEach(address => {
      address.orders.forEach(order => myOrderIds.push(order.orderId));
    });

    console.log("All Customer Order IDs:", myOrderIds);

    myOrderIds.forEach(myOrderId => {
      allOrders.forEach(order => {
        if (order.orderId, order.orderId === myOrderId) {
          myOrders.push(order);
        }
      });
    });

    setOrders(myOrders);
  }

  useEffect(() => {
    if (context.isAdmin) {
      navigate('/');
    }
  });

  useEffect(() => {
    fetchAllCustomerOrder();
  }, []);

  useEffect(() => {
    setCustomerOrders();
  }, [allOrders]);

  return (
    <div>
      <Helmet><title>Your Order's History | BookWorm</title></Helmet>

      <h1 className="mx-2 text-4xl">Orders</h1>
      <hr className="mb-1" />
      <div className="mx-2">
        {
          (orders.length === 0) &&
          <span className="select-none mt-2 opacity-60">No order is placed</span>
        }
        {
          orders?.map(order =>
            <div key={order.orderId} className="">
              <div>
                {
                  order.orderDetails?.map(orderDetail =>
                    <div key={orderDetail.detailsId} className="">
                      <div className="font-semibold">{orderDetail.detailsId}</div>
                      <span className="flex items-center space-x-6">
                        <span><img className="w-10 h-12" src={orderDetail.book?.bookImage} alt="" /></span>
                        <span className="font-medium text-blue-700">({orderDetail.quantity})</span>
                        <span>{orderDetail.book?.bookName}</span>
                        <span>₹{orderDetail.book?.price}</span>
                      </span>
                      <br />
                    </div>
                  )
                }
              </div>
            </div>
          )
        }
      </div>
    </div>
  );
}

export default Orders;
