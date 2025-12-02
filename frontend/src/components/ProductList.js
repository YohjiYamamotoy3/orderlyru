import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ProductList.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

function ProductList({ token, onCartUpdate }) {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [category, setCategory] = useState('');
  const [search, setSearch] = useState('');
  const itemsPerPage = 12;

  useEffect(() => {
    loadProducts();
  }, [category, search]);

  const loadProducts = async () => {
    try {
      const params = {};
      if (category) params.category = category;
      if (search) params.search = search;

      const response = await axios.get(`${API_URL}/api/products`, { params });
      setProducts(response.data);
      setCurrentPage(1);
    } catch (error) {
      console.error('error loading products:', error);
    }
  };

  const addToCart = async (productId) => {
    try {
      await axios.post(
        `${API_URL}/api/cart/add`,
        { productId, quantity: 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      onCartUpdate();
    } catch (error) {
      console.error('error adding to cart:', error);
    }
  };

  const paginatedProducts = products.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const totalPages = Math.ceil(products.length / itemsPerPage);

  return (
    <div className="product-list">
      <div className="filters">
        <input
          type="text"
          placeholder="search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="category-select"
        >
          <option value="">all categories</option>
          <option value="electronics">electronics</option>
          <option value="clothing">clothing</option>
          <option value="books">books</option>
          <option value="food">food</option>
        </select>
      </div>

      <div className="products-grid">
        {paginatedProducts.map(product => (
          <div key={product.id} className="product-card">
            {product.imageUrl && (
              <img src={product.imageUrl} alt={product.name} className="product-image" />
            )}
            <h3>{product.name}</h3>
            <p className="product-price">${product.price}</p>
            {product.description && (
              <p className="product-description">{product.description}</p>
            )}
            <p className="product-stock">stock: {product.stock}</p>
            <button
              onClick={() => addToCart(product.id)}
              disabled={!product.stock || product.stock === 0}
              className="add-to-cart-btn"
            >
              add to cart
            </button>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
          >
            previous
          </button>
          <span>page {currentPage} of {totalPages}</span>
          <button
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
          >
            next
          </button>
        </div>
      )}
    </div>
  );
}

export default ProductList;

