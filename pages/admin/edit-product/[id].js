import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import Link from 'next/link';
import withAuth from '../../../components/withAuth';
import { getSupabase, isSupabaseConfigured } from '../../../utils/supabase';

const EditProduct = () => {
  const router = useRouter();
  const { id } = router.query;
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    image: '',
    stock: '',
    specs: ['']
  });
  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (id) {
      loadProduct();
    }
  }, [id]);

  const loadProduct = async () => {
    try {
      if (!isSupabaseConfigured()) {
        throw new Error('Database service is not configured');
      }

      const supabase = getSupabase();
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      
      if (!data) {
        throw new Error('Product not found');
      }

      setFormData({
        title: data.title || '',
        description: data.description || '',
        price: data.price || '',
        category: data.category || '',
        image: data.image || '',
        stock: data.stock || '',
        specs: [...(data.specs || []), ''].slice(0, 4)
      });
    } catch (err) {
      setError('Failed to load product: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSpecChange = (index, value) => {
    const newSpecs = [...formData.specs];
    newSpecs[index] = value;
    setFormData(prev => ({
      ...prev,
      specs: newSpecs
    }));
  };

  const addSpecField = () => {
    if (formData.specs.length < 8) {
      setFormData(prev => ({
        ...prev,
        specs: [...prev.specs, '']
      }));
    }
  };

  const removeSpecField = (index) => {
    setFormData(prev => ({
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

      // If there's an existing image, delete it
      if (formData.image) {
        const oldImagePath = formData.image.split('/').pop();
        await supabase.storage
          .from('products')
          .remove([`product-images/${oldImagePath}`]);
      }

      // Upload new image
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
      const filePath = `product-images/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('products')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('products')
        .getPublicUrl(filePath);

      setFormData(prev => ({
        ...prev,
        image: publicUrl
      }));
    } catch (err) {
      setError('Failed to upload image: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    
    try {
      if (!isSupabaseConfigured()) {
        throw new Error('Database service is not configured');
      }

      const supabase = getSupabase();
      const { error } = await supabase
        .from('products')
        .update({
          title: formData.title,
          description: formData.description,
          price: parseFloat(formData.price),
          category: formData.category,
          image: formData.image,
          stock: parseInt(formData.stock),
          specs: formData.specs.filter(spec => spec.trim() !== '')
        })
        .eq('id', id);

      if (error) throw error;

      router.push('/admin');
    } catch (err) {
      setError('Failed to update product: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading product...</p>
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

  return (
    <>
      <Header />
      <div className="edit-container">
        <div className="edit-content">
          <h1>Edit Product</h1>
          
          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="title">Title</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
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
                  value={formData.price}
                  onChange={handleChange}
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
                  value={formData.stock}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="category">Category</label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              >
                <option value="">Select a category</option>
                <option value="Desktops">Desktops</option>
                <option value="Laptops">Laptops</option>
                <option value="Mobiles">Mobiles</option>
                <option value="Tablets">Tablets</option>
                <option value="Accessories">Accessories</option>
              </select>
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
                {formData.image && (
                  <div className="image-preview">
                    <img src={formData.image} alt="Product preview" />
                  </div>
                )}
              </div>
            </div>

            <div className="form-group">
              <label>Specifications</label>
              {formData.specs.map((spec, index) => (
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
              {formData.specs.length < 8 && (
                <button
                  type="button"
                  onClick={addSpecField}
                  className="add-spec-btn"
                >
                  + Add Specification
                </button>
              )}
            </div>

            <div className="button-group">
              <button
                type="button"
                onClick={() => router.push('/admin')}
                className="cancel-btn"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="save-btn"
                disabled={saving || uploading}
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
      <Footer />

      <style jsx>{`
        .edit-container {
          min-height: 80vh;
          padding: 2rem;
          background: linear-gradient(135deg, #f8fafc 0%, #e0e7ff 100%);
        }

        .edit-content {
          max-width: 800px;
          margin: 0 auto;
          background: white;
          padding: 2rem;
          border-radius: 12px;
          box-shadow: 0 4px 24px rgba(0,0,0,0.1);
        }

        h1 {
          text-align: center;
          color: #2d2d2d;
          margin-bottom: 2rem;
          font-size: 2rem;
          font-weight: 700;
        }

        .error-message {
          background: #fee2e2;
          color: #991b1b;
          padding: 1rem;
          border-radius: 6px;
          margin-bottom: 1.5rem;
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

        .button-group {
          display: flex;
          gap: 1rem;
          margin-top: 2rem;
        }

        .cancel-btn, .save-btn {
          flex: 1;
          padding: 0.75rem;
          border: none;
          border-radius: 6px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .cancel-btn {
          background: #f3f4f6;
          color: #374151;
        }

        .save-btn {
          background: #4f46e5;
          color: white;
        }

        .cancel-btn:hover {
          background: #e5e7eb;
        }

        .save-btn:hover:not(:disabled) {
          background: #4338ca;
        }

        .save-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        @media (max-width: 768px) {
          .edit-container {
            padding: 1rem;
          }

          .edit-content {
            padding: 1.5rem;
          }

          .form-row {
            grid-template-columns: 1fr;
          }

          .button-group {
            flex-direction: column;
          }
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

export default withAuth(EditProduct);