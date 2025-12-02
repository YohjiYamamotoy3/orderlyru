import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Cart.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

function Cart({ token, onCartUpdate, onCreateOrder }) {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadCart();
  }, []);

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

  const updateQuantity = async (productId, quantity) => {
    try {
      await axios.put(
        `${API_URL}/api/cart/update`,
        { productId, quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      loadCart();
      onCartUpdate();
    } catch (error) {
      console.error('error updating cart:', error);
    }
  };

  const removeItem = async (productId) => {
    try {
      await axios.delete(`${API_URL}/api/cart/remove/${productId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      loadCart();
      onCartUpdate();
    } catch (error) {
      console.error('error removing item:', error);
    }
  };

  const createOrder = async () => {
    setLoading(true);
    try {
      await axios.post(
        `${API_URL}/api/orders/create`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await axios.delete(`${API_URL}/api/cart/clear`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      loadCart();
      onCartUpdate();
      onCreateOrder();
      alert('order created successfully');
    } catch (error) {
      console.error('error creating order:', error);
      alert('error creating order');
    } finally {
      setLoading(false);
    }
  };

  const total = cartItems.reduce((sum, item) => {
    return sum + (parseFloat(item.product.price) * item.quantity);
  }, 0);

  if (cartItems.length === 0) {
    return (
      <div className="cart-empty">
        <p>your cart is empty</p>
      </div>
    );
  }

  return (
    <div className="cart">
      <h2>shopping cart</h2>
      <div className="cart-items">
        {cartItems.map(item => (
          <div key={item.id} className="cart-item">
            <div className="item-info">
              <h3>{item.product.name}</h3>
              <p className="item-price">${item.product.price} each</p>
            </div>
            <div className="item-actions">
              <div className="quantity-controls">
                <button onClick={() => updateQuantity(item.product.id, item.quantity - 1)}>
                  -
                </button>
                <span>{item.quantity}</span>
                <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)}>
                  +
                </button>
              </div>
              <button
                onClick={() => removeItem(item.product.id)}
                className="remove-btn"
              >
                remove
              </button>
            </div>
            <div className="item-total">
              ${(parseFloat(item.product.price) * item.quantity).toFixed(2)}
            </div>
          </div>
        ))}
      </div>
      <div className="cart-footer">
        <div className="cart-total">
          <strong>total: ${total.toFixed(2)}</strong>
        </div>
        <button
          onClick={createOrder}
          disabled={loading}
          className="checkout-btn"
        >
          {loading ? 'processing...' : 'checkout'}
        </button>
      </div>
    </div>
  );
}

export default Cart;

