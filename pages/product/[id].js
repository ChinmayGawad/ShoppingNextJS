import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

const allProducts = [
  {
    id: 1,
    title: 'Dell Inspiron Desktop',
    price: 499.99,
    image: '/images/desktop1.jpg',
    category: 'Desktops',
    specs: [
      'Intel Core i5',
      '8GB RAM',
      '1TB HDD',
      'Windows 11 Home',
    ],
  },
  {
    id: 2,
    title: 'HP Pavilion Desktop',
    price: 599.99,
    image: '/images/desktop2.jpg',
    category: 'Desktops',
    specs: [
      'Intel Core i7',
      '16GB RAM',
      '512GB SSD',
      'Windows 11 Pro',
    ],
  },
  {
    id: 3,
    title: 'Apple MacBook Air',
    price: 999.99,
    image: '/images/laptop1.jpg',
    category: 'Laptops',
    specs: [
      'Apple M2 Chip',
      '8GB RAM',
      '256GB SSD',
      'macOS Sonoma',
    ],
  },
  {
    id: 4,
    title: 'Lenovo ThinkPad',
    price: 849.99,
    image: '/images/laptop2.jpg',
    category: 'Laptops',
    specs: [
      'Intel Core i5',
      '16GB RAM',
      '512GB SSD',
      'Windows 11 Pro',
    ],
  },
  {
    id: 5,
    title: 'iPhone 15',
    price: 1099.99,
    image: '/images/mobile1.jpg',
    category: 'Mobiles',
    specs: [
      '6.1-inch OLED',
      'A16 Bionic Chip',
      '128GB Storage',
      'iOS 17',
    ],
  },
  {
    id: 6,
    title: 'Samsung Galaxy S24',
    price: 899.99,
    image: '/images/mobile2.jpg',
    category: 'Mobiles',
    specs: [
      '6.2-inch AMOLED',
      'Exynos 2400',
      '256GB Storage',
      'Android 14',
    ],
  },
];

const ProductPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [product, setProduct] = useState(null);

  useEffect(() => {
    if (id) {
      const found = allProducts.find((p) => p.id === Number(id));
      setProduct(found || null);
    }
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