import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { getSupabase, isSupabaseConfigured } from '../../utils/supabase';

const AdminDashboard = () => {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newProduct, setNewProduct] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    image: '',
    stock: ''
  });

  useEffect(() => {
    checkAdmin();
    fetchProducts();
  }, []);

  const checkAdmin = async () => {
    try {
      if (!isSupabaseConfigured()) {
        throw new Error('Authentication service is not configured');
      }

      const supabase = getSupabase();
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        router.push('/admin/login');
        return;
      }

      // Check if user is admin
      let { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .maybeSingle();

      if (profileError) throw profileError;

      // If profile doesn't exist, create it with default role
      if (!profile) {
        const { data: newProfile, error: insertError } = await supabase
          .from('profiles')
          .insert([{ 
            id: session.user.id,
            role: 'user'
          }])
          .select('role')
          .single();

        if (insertError) throw insertError;
        profile = newProfile;
      }

      if (profile?.role !== 'admin') {
        router.push('/');
        return;
      }
    } catch (err) {
      console.error('Error checking admin status:', err);
      router.push('/admin/login');
    }
  };

  const fetchProducts = async () => {
    try {
      if (!isSupabaseConfigured()) {
        throw new Error('Database service is not configured');
      }

      const supabase = getSupabase();
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (err) {
      setError('Failed to fetch products');
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      if (!isSupabaseConfigured()) {
        throw new Error('Database service is not configured');
      }

      const supabase = getSupabase();
      const { data, error } = await supabase
        .from('products')
        .insert([{
          ...newProduct,
          price: parseFloat(newProduct.price),
          stock: parseInt(newProduct.stock)
        }])
        .select();

      if (error) throw error;

      setProducts(prev => [...prev, data[0]]);
      setNewProduct({
        title: '',
        description: '',
        price: '',
        category: '',
        image: '',
        stock: ''
      });
    } catch (err) {
      setError('Failed to add product');
      console.error('Error adding product:', err);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      if (!isSupabaseConfigured()) {
        throw new Error('Database service is not configured');
      }

      const supabase = getSupabase();
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId);

      if (error) throw error;

      setProducts(prev => prev.filter(product => product.id !== productId));
    } catch (err) {
      setError('Failed to delete product');
      console.error('Error deleting product:', err);
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="admin-container">
          <div className="loading">Loading...</div>
        </div>
        <Footer />
        <style jsx>{`
          .admin-container {
            min-height: 80vh;
            padding: 2rem;
            background: linear-gradient(135deg, #f8fafc 0%, #e0e7ff 100%);
          }
          .loading {
            text-align: center;
            padding: 2rem;
          }
        `}</style>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="admin-container">
        <h1>Admin Dashboard</h1>
        
        {error && <div className="error-message">{error}</div>}

        <div className="admin-content">
          <div className="add-product-section">
            <h2>Add New Product</h2>
            <form onSubmit={handleAddProduct}>
              <div className="form-group">
                <label htmlFor="title">Title</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={newProduct.title}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={newProduct.description}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="price">Price</label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    value={newProduct.price}
                    onChange={handleInputChange}
                    step="0.01"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="stock">Stock</label>
                  <input
                    type="number"
                    id="stock"
                    name="stock"
                    value={newProduct.stock}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="category">Category</label>
                <input
                  type="text"
                  id="category"
                  name="category"
                  value={newProduct.category}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="image">Image URL</label>
                <input
                  type="url"
                  id="image"
                  name="image"
                  value={newProduct.image}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <button type="submit" className="add-button">Add Product</button>
            </form>
          </div>

          <div className="products-section">
            <h2>Manage Products</h2>
            <div className="products-grid">
              {products.map(product => (
                <div key={product.id} className="product-card">
                  <img src={product.image} alt={product.title} />
                  <div className="product-info">
                    <h3>{product.title}</h3>
                    <p className="price">₹{(product.price * 83).toLocaleString('en-IN')}</p>
                    <p className="stock">Stock: {product.stock}</p>
                    <button 
                      onClick={() => handleDeleteProduct(product.id)}
                      className="delete-button"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Footer />

      <style jsx>{`
        .admin-container {
          min-height: 80vh;
          padding: 2rem;
          background: linear-gradient(135deg, #f8fafc 0%, #e0e7ff 100%);
        }

        h1 {
          text-align: center;
          color: #2d2d2d;
          margin-bottom: 2rem;
          font-size: 2.2rem;
          font-weight: 800;
        }

        h2 {
          color: #2d2d2d;
          margin-bottom: 1.5rem;
          font-size: 1.5rem;
        }

        .admin-content {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 2fr;
          gap: 2rem;
        }

        .add-product-section {
          background: white;
          padding: 2rem;
          border-radius: 12px;
          box-shadow: 0 4px 24px rgba(0,0,0,0.1);
        }

        .form-group {
          margin-bottom: 1.5rem;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        label {
          display: block;
          margin-bottom: 0.5rem;
          color: #4a5568;
          font-weight: 500;
        }

        input, textarea {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid #e2e8f0;
          border-radius: 6px;
          font-size: 1rem;
        }

        textarea {
          min-height: 100px;
          resize: vertical;
        }

        input:focus, textarea:focus {
          outline: none;
          border-color: #4f46e5;
          box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
        }

        .add-button {
          width: 100%;
          padding: 0.75rem;
          background: linear-gradient(90deg, #0070f3 60%, #4f46e5 100%);
          color: white;
          border: none;
          border-radius: 6px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: transform 0.2s;
        }

        .add-button:hover {
          transform: translateY(-1px);
        }

        .products-section {
          background: white;
          padding: 2rem;
          border-radius: 12px;
          box-shadow: 0 4px 24px rgba(0,0,0,0.1);
        }

        .products-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 1.5rem;
        }

        .product-card {
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          overflow: hidden;
        }

        .product-card img {
          width: 100%;
          height: 150px;
          object-fit: contain;
          background: #f8fafc;
        }

        .product-info {
          padding: 1rem;
        }

        .product-info h3 {
          margin: 0;
          font-size: 1rem;
          color: #2d2d2d;
        }

        .price {
          color: #4f46e5;
          font-weight: 600;
          margin: 0.5rem 0;
        }

        .stock {
          color: #6b7280;
          font-size: 0.9rem;
          margin: 0.5rem 0;
        }

        .delete-button {
          width: 100%;
          padding: 0.5rem;
          background: #ef4444;
          color: white;
          border: none;
          border-radius: 4px;
          font-size: 0.9rem;
          cursor: pointer;
          transition: background 0.2s;
        }

        .delete-button:hover {
          background: #dc2626;
        }

        .error-message {
          background: #fee2e2;
          color: #dc2626;
          padding: 1rem;
          border-radius: 6px;
          margin-bottom: 1.5rem;
          text-align: center;
        }
      `}</style>
    </>
  );
};

export default AdminDashboard; 