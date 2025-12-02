import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import ProductList from './components/ProductList';
import Cart from './components/Cart';
import Orders from './components/Orders';
import Login from './components/Login';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [currentView, setCurrentView] = useState('products');
  const [cartItems, setCartItems] = useState([]);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (token) {
      loadCart();
      loadOrders();
      startOrderStatusPolling();
    }
  }, [token]);

  const startOrderStatusPolling = () => {
    const interval = setInterval(() => {
      if (token) {
        loadOrders();
      }
    }, 5000);
    return () => clearInterval(interval);
  };

  const loadCart = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/cart`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCartItems(response.data.items || []);
    } catch (error) {
      console.error('error loading cart:', error);
    }
  };

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

  const handleLogin = (newToken) => {
    setToken(newToken);
    localStorage.setItem('token', newToken);
  };

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem('token');
    setCartItems([]);
    setOrders([]);
  };

  if (!token) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>elyts</h1>
        <nav>
          <button onClick={() => setCurrentView('products')}>products</button>
          <button onClick={() => setCurrentView('cart')}>cart ({cartItems.length})</button>
          <button onClick={() => setCurrentView('orders')}>orders</button>
          <button onClick={handleLogout}>logout</button>
        </nav>
      </header>
      <main className="app-content">
        {currentView === 'products' && (
          <ProductList token={token} onCartUpdate={loadCart} />
        )}
        {currentView === 'cart' && (
          <Cart token={token} onCartUpdate={loadCart} onCreateOrder={loadOrders} />
        )}
        {currentView === 'orders' && (
          <Orders token={token} orders={orders} />
        )}
      </main>
    </div>
  );
}

export default App;
