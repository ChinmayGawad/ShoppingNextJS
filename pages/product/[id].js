import { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { CartContext } from '../../context/CartContext';
import { getSupabase, isSupabaseConfigured } from '../../utils/supabase';

const ProductPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [addedToCart, setAddedToCart] = useState(false);
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    if (id) {
      fetchProductDetails();
    }
  }, [id]);

  const fetchProductDetails = async () => {
    try {
      if (!isSupabaseConfigured()) {
        throw new Error('Database service is not configured');
      }

      const supabase = getSupabase();
      const { data, error: supabaseError } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();

      if (supabaseError) throw supabaseError;
      
      if (!data) {
        throw new Error('Product not found');
      }

      setProduct(data);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching product:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    addToCart(product);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading product details...</p>
        </div>
        <Footer />
        <style jsx>{`
          .loading-container {
            min-height: 60vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            background: linear-gradient(135deg, #f8fafc 0%, #e0e7ff 100%);
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
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header />
        <div className="error-container">
          <div className="error-message">
            <h2>Error</h2>
            <p>{error}</p>
            <Link href="/">
              <button className="back-btn">Back to Home</button>
            </Link>
          </div>
        </div>
        <Footer />
        <style jsx>{`
          .error-container {
            min-height: 60vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: linear-gradient(135deg, #f8fafc 0%, #e0e7ff 100%);
          }
          .error-message {
            background: white;
            padding: 2rem;
            border-radius: 12px;
            box-shadow: 0 4px 24px rgba(0,0,0,0.1);
            text-align: center;
          }
          .error-message h2 {
            color: #ef4444;
            margin-bottom: 1rem;
          }
          .back-btn {
            margin-top: 1rem;
            background: #0070f3;
            color: white;
            border: none;
            padding: 0.75rem 1.5rem;
            border-radius: 6px;
            cursor: pointer;
          }
        `}</style>
      </>
    );
  }

  if (!product) {
    return null;
  }

  return (
    <>
      <Header />
      <div className="product-detail-container">
        <div className="product-detail-card">
          <div className="product-image-section">
            <img 
              src={product.image || '/images/placeholder.png'} 
              alt={product.title} 
              className="product-detail-image" 
            />
          </div>
          <div className="product-detail-info">
            <h1>{product.title}</h1>
            <div className="price-stock">
              <h2>₹{product.price.toLocaleString('en-IN')}</h2>
              <span className={`stock-badge ${product.stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
                {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
              </span>
            </div>
            
            <div className="description">
              <h3>Description</h3>
              <p>{product.description || 'No description available.'}</p>
            </div>

            <div className="category">
              <h3>Category</h3>
              <p>{product.category}</p>
            </div>

            {product.specs && (
              <div className="specifications">
                <h3>Specifications</h3>
                <ul>
                  {Array.isArray(product.specs) ? (
                    product.specs.map((spec, idx) => (
                      <li key={idx}>{spec}</li>
                    ))
                  ) : (
                    <li>No specifications available</li>
                  )}
                </ul>
              </div>
            )}

            <div className="actions">
              <button 
                onClick={handleAddToCart} 
                className="add-to-cart-btn"
                disabled={!product.stock}
              >
                {product.stock ? 'Add to Cart' : 'Out of Stock'}
              </button>
              <Link href="/">
                <button className="back-btn">Back to Home</button>
              </Link>
              {addedToCart && (
                <div className="cart-notification">
                  ✓ Added to cart successfully!
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
      <style jsx>{`
        .product-detail-container {
          min-height: 80vh;
          padding: 2rem;
          background: linear-gradient(135deg, #f8fafc 0%, #e0e7ff 100%);
        }

        .product-detail-card {
          max-width: 1200px;
          margin: 0 auto;
          background: white;
          border-radius: 18px;
          box-shadow: 0 4px 24px rgba(0,0,0,0.1);
          padding: 2.5rem;
          display: grid;
          grid-template-columns: 1fr 1.5fr;
          gap: 3rem;
        }

        .product-image-section {
          position: sticky;
          top: 2rem;
          height: fit-content;
        }

        .product-detail-image {
          width: 100%;
          aspect-ratio: 1;
          object-fit: contain;
          border-radius: 12px;
          background: #f3f4f6;
        }

        .product-detail-info {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .product-detail-info h1 {
          font-size: 2.5rem;
          font-weight: 700;
          color: #1a1a1a;
        }

        .price-stock {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .price-stock h2 {
          font-size: 2rem;
          color: #4f46e5;
        }

        .stock-badge {
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-size: 0.9rem;
          font-weight: 600;
        }

        .in-stock {
          background: #dcfce7;
          color: #166534;
        }

        .out-of-stock {
          background: #fee2e2;
          color: #991b1b;
        }

        .description, .category, .specifications {
          border-top: 1px solid #e5e7eb;
          padding-top: 1.5rem;
        }

        h3 {
          font-size: 1.2rem;
          font-weight: 600;
          margin-bottom: 0.75rem;
          color: #374151;
        }

        p {
          color: #4b5563;
          line-height: 1.6;
        }

        ul {
          list-style: none;
          padding: 0;
        }

        li {
          padding: 0.5rem 0;
          color: #4b5563;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        li:before {
          content: "•";
          color: #4f46e5;
          font-weight: bold;
        }

        .actions {
          margin-top: 2rem;
          display: flex;
          gap: 1rem;
          position: relative;
        }

        .add-to-cart-btn {
          flex: 2;
          background: linear-gradient(90deg, #0070f3 60%, #4f46e5 100%);
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .add-to-cart-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }

        .add-to-cart-btn:disabled {
          background: #e5e7eb;
          cursor: not-allowed;
          color: #9ca3af;
        }

        .back-btn {
          flex: 1;
          background: #f3f4f6;
          color: #374151;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s;
        }

        .back-btn:hover {
          background: #e5e7eb;
        }

        .cart-notification {
          position: fixed;
          bottom: 2rem;
          right: 2rem;
          background: #059669;
          color: white;
          padding: 1rem 2rem;
          border-radius: 8px;
          font-weight: 600;
          animation: slideIn 0.3s ease-out;
          z-index: 100;
        }

        @keyframes slideIn {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        @media (max-width: 768px) {
          .product-detail-card {
            grid-template-columns: 1fr;
            gap: 2rem;
            padding: 1.5rem;
          }

          .product-image-section {
            position: static;
          }

          .product-detail-info h1 {
            font-size: 2rem;
          }

          .price-stock {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.5rem;
          }

          .price-stock h2 {
            font-size: 1.75rem;
          }

          .actions {
            flex-direction: column;
          }

          .add-to-cart-btn, .back-btn {
            width: 100%;
          }
        }
      `}</style>
    </>
  );
};

export default ProductPage;