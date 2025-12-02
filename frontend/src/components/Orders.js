import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Orders.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

function Orders({ token, orders: initialOrders }) {
  const [orders, setOrders] = useState(initialOrders || []);

  useEffect(() => {
    const interval = setInterval(() => {
      loadOrders();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const loadOrders = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/orders`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(response.data);
    } catch (error) {
      console.error('error loading orders:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING':
        return '#f39c12';
      case 'PROCESSING':
        return '#3498db';
      case 'SHIPPED':
        return '#9b59b6';
      case 'DELIVERED':
        return '#27ae60';
      case 'CANCELLED':
        return '#e74c3c';
      default:
        return '#95a5a6';
    }
  };

  if (orders.length === 0) {
    return (
      <div className="orders-empty">
        <p>no orders yet</p>
      </div>
    );
  }

  return (
    <div className="orders">
      <h2>my orders</h2>
      <div className="orders-list">
        {orders.map(order => (
          <div key={order.id} className="order-card">
            <div className="order-header">
              <div>
                <h3>order #{order.id}</h3>
                <p className="order-date">
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div
                className="order-status"
                style={{ backgroundColor: getStatusColor(order.status) }}
              >
                {order.status.toLowerCase()}
              </div>
            </div>
            <div className="order-items">
              {order.items && order.items.map(item => (
                <div key={item.id} className="order-item">
                  <span>{item.product.name}</span>
                  <span>x{item.quantity}</span>
                  <span>${item.price}</span>
                </div>
              ))}
            </div>
            <div className="order-total">
              <strong>total: ${order.total}</strong>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Orders;

