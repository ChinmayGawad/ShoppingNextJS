import React, { useState, useContext, useEffect } from 'react';
import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import { CartContext } from '../context/CartContext';
import { getSupabase, isSupabaseConfigured } from '../utils/supabase';

const categories = ['Desktops', 'Laptops', 'Mobiles'];

const Home = () => {
  const [cartMessage, setCartMessage] = useState('');
  const { addToCart } = useContext(CartContext);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadProducts() {
      try {
        if (!isSupabaseConfigured()) {
          throw new Error('Database service is not configured');
        }

        const supabase = getSupabase();
        const { data, error: supabaseError } = await supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: false });

        if (supabaseError) throw supabaseError;
        setProducts(data || []);
      } catch (err) {
        console.error('Error loading products:', err);
        setError('Failed to load products');
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, []);

  const handleAddToCart = (product) => {
    addToCart(product);
    setCartMessage(`${product.title} added to cart!`);
    setTimeout(() => setCartMessage(''), 2000);
  };

  if (loading) {
    return (
      <div className="home-bg">
        <Header />
        <main className="main-container">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading products...</p>
          </div>
        </main>
        <Footer />
        <style jsx>{`
          .loading-container {
            min-height: 60vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
          }
          .loading-spinner {
            width: 50px;
            height: 50px;
            border: 3px solid #f3f3f3;
            border-top: 3px solid #3498db;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin-bottom: 1rem;
          }
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div className="home-bg">
        <Header />
        <main className="main-container">
          <div className="error-container">
            <h2>Error</h2>
            <p>{error}</p>
          </div>
        </main>
        <Footer />
        <style jsx>{`
          .error-container {
            min-height: 60vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            text-align: center;
          }
          .error-container h2 {
            color: #ef4444;
            margin-bottom: 1rem;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="home-bg">
      <Header />
      <main className="main-container">
        <h1 className="main-title">🛒 Featured Products</h1>
        {cartMessage && (
          <div className="cart-message">{cartMessage}</div>
        )}
        {categories.map((cat) => {
          const categoryProducts = products.filter(p => p.category === cat);
          if (categoryProducts.length === 0) return null;

          return (
            <div key={cat} className="category-section">
              <h2 className="category-title">{cat}</h2>
              <div className="product-grid">
                {categoryProducts.map(product => (
                  <Link href={`/product/${product.id}`} key={product.id}>
                    <div className="product-link">
                      <ProductCard product={product} onAddToCart={handleAddToCart} />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          );
        })}
      </main>
      <Footer />
      <style jsx>{`
        .home-bg {
          min-height: 100vh;
          background: #ffffff;
        }

        .main-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 2rem;
        }

        .main-title {
          text-align: center;
          margin: 2.5rem 0 2rem 0;
          font-size: 2.5rem;
          font-weight: 800;
          color: #2d2d2d;
          letter-spacing: 1px;
        }

        .cart-message {
          background: #e0ffe0;
          color: #007a1f;
          padding: 1rem 2rem;
          border-radius: 10px;
          text-align: center;
          margin: 0 auto 1.5rem auto;
          max-width: 400px;
          font-weight: bold;
          font-size: 1.1rem;
          animation: fadeIn 0.5s;
        }

        .category-section {
          margin-bottom: 4rem;
        }

        .category-title {
          margin: 2rem 0 1.5rem 0;
          color: #4f46e5;
          font-size: 2rem;
          font-weight: 700;
          padding-bottom: 0.5rem;
          border-bottom: 2px solid #e5e7eb;
        }

        .product-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 2rem;
          padding: 1rem 0;
        }

        .product-link {
          text-decoration: none;
          color: inherit;
          transition: transform 0.3s ease;
        }

        .product-link:hover {
          transform: translateY(-5px);
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @media (max-width: 768px) {
          .main-container {
            padding: 0 1rem;
          }

          .product-grid {
            grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
            gap: 1.5rem;
          }

          .main-title {
            font-size: 2rem;
            margin: 2rem 0 1.5rem 0;
          }

          .category-title {
            font-size: 1.75rem;
          }
        }
      `}</style>
    </div>
  );
};

export default Home;