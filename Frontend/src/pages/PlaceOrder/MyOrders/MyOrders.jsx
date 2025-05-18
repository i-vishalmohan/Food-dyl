import React, { useContext, useEffect, useState } from 'react';
import './MyOrders.css';
import { StoreContext } from '../../../Context/StoreContext';
import axios from 'axios';
import { assets } from '../../../assets/assets';

const MyOrders = () => {
  const { url, token } = useContext(StoreContext);
  const [data, setData] = useState([]);

  const fetchOrders = async () => {
    try {
      const response = await axios.post(
        url + "/api/order/userorders",
        {},
        { headers: { token } }
      );
      setData(response.data.data);
      console.log(response.data.data);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    }
  };

  useEffect(() => {
    if (token) {
      fetchOrders();
    }
  }, [token]);

  return (
    <div className='my-orders'>
      <h2>My Orders</h2>
      <div className="container">
        {data.map((order, index) => (
          <div key={index} className='my-order-order'>
            <img src={assets.parcel_icon} alt="Parcel Icon" />
            <p>
              {order.item.map((item, i) => (
                <span key={i}>
                  {item.name}x{item.quantity}
                  {i !== order.item.length - 1 ? ', ' : ''}
                </span>
              ))}
            </p>
            <p>${order.amount}.00</p>
            <p>Items: {order.item.length}</p>
            <p><span>&#x25cf;</span> <b>{order.status}</b></p>
            <button onClick={fetchOrders}>Track Order</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyOrders;
