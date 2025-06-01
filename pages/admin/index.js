import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { getSupabase, isSupabaseConfigured } from '../../utils/supabase';
import Link from 'next/link';

const AdminDashboard = () => {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);
  const [newProduct, setNewProduct] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    image: '',
    stock: '',
    specs: ['']
  });

  useEffect(() => {
    checkAdmin();
    fetchProducts();
  }, []);

  const checkAdmin = async () => {
    try {
      console.log('Checking Supabase configuration...');
      if (!isSupabaseConfigured()) {
        console.error('Supabase is not configured');
        throw new Error('Authentication service is not configured. Please check environment variables in Vercel.');
      }

      console.log('Getting Supabase client...');
      const supabase = getSupabase();
      console.log('Getting session...');
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error('Session error:', sessionError);
        throw sessionError;
      }

      if (!session) {
        console.log('No session found, redirecting to login...');
        router.push('/admin/login');
        return;
      }

      console.log('Checking admin status...');
      // Check if user is admin
      let { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .maybeSingle();

      if (profileError) {
        console.error('Profile error:', profileError);
        throw profileError;
      }

      // If profile doesn't exist, create it with default role
      if (!profile) {
        console.log('Creating new profile...');
        const { data: newProfile, error: insertError } = await supabase
          .from('profiles')
          .insert([{ 
            id: session.user.id,
            role: 'user'
          }])
          .select('role')
          .single();

        if (insertError) {
          console.error('Insert error:', insertError);
          throw insertError;
        }
        profile = newProfile;
      }

      if (profile?.role !== 'admin') {
        console.log('User is not admin, redirecting...');
        router.push('/');
        return;
      }

      console.log('Admin check successful');
    } catch (err) {
      console.error('Error in checkAdmin:', err);
      setError(err.message || 'Failed to check admin status');
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

  const handleSpecChange = (index, value) => {
    const newSpecs = [...newProduct.specs];
    newSpecs[index] = value;
    setNewProduct(prev => ({
      ...prev,
      specs: newSpecs
    }));
  };

  const addSpecField = () => {
    setNewProduct(prev => ({
      ...prev,
      specs: [...prev.specs, '']
    }));
  };

  const removeSpecField = (index) => {
    setNewProduct(prev => ({
      ...prev,
      specs: prev.specs.filter((_, i) => i !== index)
    }));
  };

  const handleImageUpload = async (e) => {
    try {
      const file = e.target.files[0];
      if (!file) return;

      setUploading(true);
      const supabase = getSupabase();

      // Create a unique file name
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
      const filePath = `product-images/${fileName}`;

      // Upload the file to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('products')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('products')
        .getPublicUrl(filePath);

      setNewProduct(prev => ({
        ...prev,
        image: publicUrl
      }));
    } catch (err) {
      setError('Failed to upload image: ' + err.message);
    } finally {
      setUploading(false);
    }
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
          stock: parseInt(newProduct.stock),
          specs: newProduct.specs.filter(spec => spec.trim() !== '')
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
        stock: '',
        specs: ['']
      });
    } catch (err) {
      setError('Failed to add product: ' + err.message);
    }
  };

  const handleDeleteProduct = async (productId, imageUrl) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      const supabase = getSupabase();

      // Delete the image from storage if it exists
      if (imageUrl) {
        const imagePath = imageUrl.split('/').pop();
        await supabase.storage
          .from('products')
          .remove([`product-images/${imagePath}`]);
      }

      // Delete the product from the database
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId);

      if (error) throw error;

      setProducts(prev => prev.filter(product => product.id !== productId));
    } catch (err) {
      setError('Failed to delete product: ' + err.message);
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
                  <label htmlFor="price">Price (₹)</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    id="price"
                    name="price"
                    value={newProduct.price}
                    onChange={handleInputChange}
                    placeholder="Enter price in ₹"
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
                <label htmlFor="image">Product Image</label>
                <div className="image-upload-container">
                  <input
                    type="file"
                    id="image"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="image-input"
                  />
                  {uploading && <span className="upload-status">Uploading...</span>}
                  {newProduct.image && (
                    <div className="image-preview">
                      <img src={newProduct.image} alt="Product preview" />
                    </div>
                  )}
                </div>
              </div>

              <div className="form-group">
                <label>Specifications</label>
                {newProduct.specs.map((spec, index) => (
                  <div key={index} className="spec-input-group">
                    <input
                      type="text"
                      value={spec}
                      onChange={(e) => handleSpecChange(index, e.target.value)}
                      placeholder="Enter specification"
                    />
                    {index > 0 && (
                      <button
                        type="button"
                        onClick={() => removeSpecField(index)}
                        className="remove-spec-btn"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addSpecField}
                  className="add-spec-btn"
                >
                  + Add Specification
                </button>
              </div>

              <button type="submit" className="add-button">Add Product</button>
            </form>
          </div>

          <div className="products-section">
            <h2>Manage Products</h2>
            <div className="product-grid">
              {products.map((product) => (
                <div key={product.id} className="product-card">
                  <img src={product.image} alt={product.title} className="product-image" />
                  <div className="product-info">
                    <h3>{product.title}</h3>
                    <p>Price: ₹{product.price.toLocaleString('en-IN')}</p>
                    <p>Stock: {product.stock}</p>
                    <div className="product-actions">
                      <Link href={`/admin/edit-product/${product.id}`}>
                        <button className="edit-btn">Edit</button>
                      </Link>
                      <button
                        onClick={() => handleDeleteProduct(product.id, product.image)}
                        className="delete-btn"
                      >
                        Delete
                      </button>
                    </div>
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

        input, textarea, select {
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

        input:focus, textarea:focus, select:focus {
          outline: none;
          border-color: #4f46e5;
          box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
        }

        .image-upload-container {
          position: relative;
        }

        .image-input {
          width: 100%;
          padding: 0.75rem;
          border: 2px dashed #d1d5db;
          border-radius: 6px;
          cursor: pointer;
        }

        .upload-status {
          display: inline-block;
          margin-top: 0.5rem;
          color: #4f46e5;
        }

        .image-preview {
          margin-top: 1rem;
          max-width: 200px;
        }

        .image-preview img {
          width: 100%;
          height: auto;
          border-radius: 6px;
        }

        .spec-input-group {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 0.5rem;
        }

        .remove-spec-btn {
          background: #fee2e2;
          color: #991b1b;
          border: none;
          border-radius: 4px;
          width: 32px;
          height: 32px;
          cursor: pointer;
        }

        .add-spec-btn {
          background: #f3f4f6;
          color: #374151;
          border: none;
          border-radius: 6px;
          padding: 0.5rem 1rem;
          cursor: pointer;
          width: 100%;
          margin-top: 0.5rem;
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

        .product-grid {
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

        .product-actions {
          display: flex;
          gap: 1rem;
          margin-top: 1rem;
        }

        .edit-btn, .delete-btn {
          flex: 1;
          padding: 0.5rem;
          border: none;
          border-radius: 4px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .edit-btn {
          background: #4f46e5;
          color: white;
        }

        .edit-btn:hover {
          background: #4338ca;
        }

        .delete-btn {
          background: #fee2e2;
          color: #991b1b;
        }

        .delete-btn:hover {
          background: #fecaca;
        }

        .error-message {
          background: #fee2e2;
          color: #dc2626;
          padding: 1rem;
          border-radius: 6px;
          margin-bottom: 1.5rem;
          text-align: center;
        }

        input[type="number"]::-webkit-inner-spin-button,
        input[type="number"]::-webkit-outer-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        input[type="number"] {
          -moz-appearance: textfield;
        }
      `}</style>
    </>
  );
};

export default AdminDashboard; 