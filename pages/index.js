import React, { useState, useContext, useEffect } from 'react';
import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import { CartContext } from '../context/CartContext';

const categories = ['Desktops', 'Laptops', 'Mobiles'];

const Home = () => {
  const [cartMessage, setCartMessage] = useState('');
  const { addToCart } = useContext(CartContext);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    async function loadProducts() {
      try {
        const res = await fetch('/products.json');
        if (!res.ok) throw new Error('Failed to fetch products');
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        setProducts([]);
      }
    }
    loadProducts();
  }, []);

  const handleAddToCart = (product) => {
    addToCart(product);
    setCartMessage(`${product.title} added to cart!`);
    setTimeout(() => setCartMessage(''), 2000);
  };

  return (
    <div className="home-bg">
      <Header />
      <main>
        <h1 className="main-title">🛒 Featured Products</h1>
        {cartMessage && (
          <div className="cart-message">{cartMessage}</div>
        )}
        {categories.map((cat) => (
          <div key={cat} className="category-section">
            <h2 className="category-title">{cat}</h2>
            <div className="product-grid">
              {products.filter(p => p.category === cat).map(product => (
                <div key={product.id} className="product-card-wrapper">
                  <Link href={`/product/${product.id}`} legacyBehavior>
                    <a style={{ width: '100%' }}>
                      <ProductCard product={product} onAddToCart={handleAddToCart} />
                    </a>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        ))}
        <div className="shop-info">
          <h2>Why Shop With Us?</h2>
          <ul>
            <li>🚚 Fast & Free Shipping</li>
            <li>🔒 Secure Checkout</li>
            <li>💬 24/7 Customer Support</li>
            <li>⭐ Top Rated Products</li>
          </ul>
        </div>
      </main>
      <Footer />
      <style jsx>{`
        .home-bg {
          min-height: 100vh;
          background: linear-gradient(135deg, #f8fafc 0%, #e0e7ff 100%);
        }
        .main-title {
          text-align: center;
          margin: 2.5rem 0 2rem 0;
          font-size: 2.5rem;
          font-weight: 800;
          color: #2d2d2d;
          letter-spacing: 1px;
        }
        .product-grid {
          display: flex;
          flex-direction: row;
          overflow-x: auto;
          gap: 2.5rem;
          padding: 2rem 2vw 3rem 2vw;
          scroll-snap-type: x mandatory;
        }
        .product-card-wrapper {
          min-width: 270px;
          max-width: 320px;
          flex: 0 0 auto;
          background: #fff;
          border-radius: 18px;
          box-shadow: 0 4px 24px rgba(0,0,0,0.10);
          padding: 2rem 1.5rem 1.5rem 1.5rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          transition: transform 0.22s, box-shadow 0.22s;
          position: relative;
          scroll-snap-align: start;
        }
        .product-card-wrapper:hover {
          transform: translateY(-10px) scale(1.04);
          box-shadow: 0 12px 36px rgba(0,0,0,0.13);
        }
        .add-to-cart-btn {
          margin-top: 1.2rem;
          padding: 0.6rem 2rem;
          background: linear-gradient(90deg, #0070f3 60%, #4f46e5 100%);
          color: #fff;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-size: 1.08rem;
          font-weight: 600;
          box-shadow: 0 2px 8px rgba(79,70,229,0.08);
          transition: background 0.2s, transform 0.15s;
        }
        .add-to-cart-btn:hover {
          background: linear-gradient(90deg, #005bb5 60%, #3730a3 100%);
          transform: scale(1.06);
        }
        .cart-message {
          background: #e0ffe0;
          color: #007a1f;
          padding: 1rem 2rem;
          border-radius: 10px;
          text-align: center;
          margin-bottom: 1.5rem;
          font-weight: bold;
          font-size: 1.1rem;
          box-shadow: 0 2px 8px rgba(0,0,0,0.06);
          animation: fadeIn 0.5s;
        }
        .shop-info {
          background: #fff;
          border-radius: 16px;
          box-shadow: 0 2px 12px rgba(0,0,0,0.07);
          margin: 3rem auto 2rem auto;
          max-width: 600px;
          padding: 2rem 2.5rem;
          text-align: center;
        }
        .shop-info h2 {
          margin-bottom: 1rem;
          color: #4f46e5;
          font-size: 1.5rem;
        }
        .shop-info ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        .shop-info li {
          font-size: 1.13rem;
          margin: 0.7rem 0;
          color: #333;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          justify-content: center;
        }
        .category-section {
          margin-bottom: 3.5rem;
        }
        .category-title {
          margin: 2rem 0 1.2rem 0;
          color: #4f46e5;
          font-size: 2rem;
          font-weight: 700;
          text-align: left;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default Home;