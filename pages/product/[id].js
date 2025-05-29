import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

const ProductPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [product, setProduct] = useState(null);

  useEffect(() => {
    async function loadProduct() {
      if (id) {
        try {
          const res = await fetch('/products.json');
          if (!res.ok) throw new Error('Failed to fetch products');
          const products = await res.json();
          const found = products.find((p) => p.id === Number(id));
          setProduct(found || null);
        } catch (err) {
          console.error('Error loading product:', err);
          setProduct(null);
        }
      }
    }
    loadProduct();
  }, [id]);

  if (!product) {
    return <div style={{padding:'2rem',textAlign:'center'}}>Product not found</div>;
  }

  return (
    <>
      <Header />
      <div className="product-detail-container">
        <div className="product-detail-card">
          <img src={product.image} alt={product.title} className="product-detail-image" />
          <div className="product-detail-info">
            <h1>{product.title}</h1>
            <h2>₹{(product.price * 83).toLocaleString('en-IN', { maximumFractionDigits: 0 })}</h2>
            <p><strong>Category:</strong> {product.category}</p>
            <h3>Specifications</h3>
            <ul>
              {product.specs && product.specs.length > 0 ? (
                product.specs.map((spec, idx) => <li key={idx}>{spec}</li>)
              ) : (
                <li>No specifications available.</li>
              )}
            </ul>
            <Link href="/">
              <button className="back-btn">Back to Home</button>
            </Link>
          </div>
        </div>
      </div>
      <Footer />
      <style jsx>{`
        .product-detail-container {
          min-height: 80vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #f8fafc 0%, #e0e7ff 100%);
        }
        .product-detail-card {
          background: #fff;
          border-radius: 18px;
          box-shadow: 0 4px 24px rgba(0,0,0,0.10);
          padding: 2.5rem 2rem;
          display: flex;
          gap: 2.5rem;
          max-width: 700px;
          width: 100%;
        }
        .product-detail-image {
          width: 220px;
          height: 220px;
          object-fit: contain;
          border-radius: 12px;
          background: #f3f4f6;
        }
        .product-detail-info {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        .product-detail-info h1 {
          font-size: 2rem;
          margin-bottom: 0.5rem;
        }
        .product-detail-info h2 {
          color: #4f46e5;
          margin-bottom: 1rem;
        }
        .product-detail-info h3 {
          margin-top: 1.2rem;
          margin-bottom: 0.5rem;
        }
        .product-detail-info ul {
          padding-left: 1.2rem;
          margin-bottom: 1.5rem;
        }
        .back-btn {
          background: #0070f3;
          color: #fff;
          border: none;
          border-radius: 8px;
          padding: 0.6rem 2rem;
          font-size: 1rem;
          cursor: pointer;
          transition: background 0.2s;
        }
        .back-btn:hover {
          background: #005bb5;
        }
      `}</style>
    </>
  );
};

export default ProductPage;