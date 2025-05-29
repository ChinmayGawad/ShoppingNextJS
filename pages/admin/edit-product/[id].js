import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import Link from 'next/link';
import withAuth from '../../../components/withAuth';
import { getSupabase } from '../../../utils/supabase';

const EditProduct = () => {
  const router = useRouter();
  const { id } = router.query;
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    category: '',
    image: '',
    specs: ['', '', '', '']
  });

  useEffect(() => {
    if (id) {
      loadProduct();
    }
  }, [id]);

  const loadProduct = async () => {
    try {
      const supabase = getSupabase();
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      
      if (!data) {
        setError('Product not found');
        return;
      }

      setFormData({
        title: data.title,
        price: data.price,
        category: data.category,
        image: data.image,
        specs: [...data.specs || [], '', '', '', ''].slice(0, 4)
      });
      setLoading(false);
    } catch (err) {
      setError('Failed to load product: ' + err.message);
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
      specs: newSpecs.filter(spec => spec !== '')
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    
    if (!formData.title || !formData.price || !formData.image) {
      setError('Please fill in all required fields');
      setSaving(false);
      return;
    }

    try {
      const supabase = getSupabase();
      const { error } = await supabase
        .from('products')
        .update({
          title: formData.title,
          price: parseFloat(formData.price),
          category: formData.category,
          image: formData.image,
          specs: formData.specs.filter(spec => spec !== '')
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

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <>
      <Header />
      <div className="edit-product-container">
        <div className="form-card">
          <div className="form-header">
            <h1>Edit Product</h1>
            <Link href="/admin">
              <button className="back-btn">Back to Admin</button>
            </Link>
          </div>

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="title">Product Title*</label>
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
              <label htmlFor="price">Price (₹)*</label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                min="0"
                step="0.01"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="category">Category*</label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              >
                <option value="Desktops">Desktops</option>
                <option value="Laptops">Laptops</option>
                <option value="Mobiles">Mobiles</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="image">Image URL*</label>
              <input
                type="text"
                id="image"
                name="image"
                value={formData.image}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Specifications</label>
              {formData.specs.map((spec, index) => (
                <input
                  key={index}
                  type="text"
                  value={spec}
                  onChange={(e) => handleSpecChange(index, e.target.value)}
                  placeholder={`Specification ${index + 1}`}
                />
              ))}
            </div>

            <button 
              type="submit" 
              className="submit-btn"
              disabled={saving}
            >
              {saving ? 'Updating Product...' : 'Update Product'}
            </button>
          </form>
        </div>
      </div>
      <Footer />

      <style jsx>{`
        /* ... existing styles ... */

        .submit-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
      `}</style>
    </>
  );
};

export default withAuth(EditProduct);