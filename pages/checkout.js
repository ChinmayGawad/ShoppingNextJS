import { useState, useContext, useEffect } from 'react';
import { useRouter } from 'next/router';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { CartContext } from '../context/CartContext';
import { getSupabase } from '../utils/supabase';
import Link from 'next/link';

const Checkout = () => {
    const { cartItems, clearCart } = useContext(CartContext);
    const [shippingInfo, setShippingInfo] = useState({
        name: '',
        address: '',
        city: '',
        state: '',
        zip: '',
    });
    const [paymentMethod, setPaymentMethod] = useState('card');
    const [card, setCard] = useState({ number: '', expiry: '', cvv: '', holder: '' });
    const [upi, setUpi] = useState('');
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    // Check if cart is empty
    useEffect(() => {
        if (cartItems.length === 0 && !showConfirmation) {
            router.push('/cart');
        }
    }, [cartItems, showConfirmation]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setShippingInfo({ ...shippingInfo, [name]: value });
    };
    const handleCardChange = (e) => {
        const { name, value } = e.target;
        setCard({ ...card, [name]: value });
    };
    const handleUpiChange = (e) => setUpi(e.target.value);
    const handlePaymentChange = (e) => setPaymentMethod(e.target.value);

    const validate = () => {
        let errs = {};
        if (!shippingInfo.name) errs.name = 'Name required';
        if (!shippingInfo.address) errs.address = 'Address required';
        if (!shippingInfo.city) errs.city = 'City required';
        if (!shippingInfo.state) errs.state = 'State required';
        if (!shippingInfo.zip) errs.zip = 'Zip required';
        if (paymentMethod === 'card') {
            if (!/^\d{16}$/.test(card.number)) errs.cardNumber = 'Card number must be 16 digits';
            if (!/^\d{2}\/\d{2}$/.test(card.expiry)) errs.expiry = 'Expiry must be MM/YY';
            if (!/^\d{3}$/.test(card.cvv)) errs.cvv = 'CVV must be 3 digits';
            if (!card.holder) errs.holder = 'Card holder name required';
        }
        if (paymentMethod === 'upi') {
            if (!upi || !/^[\w.-]+@[\w.-]+$/.test(upi)) errs.upi = 'Enter valid UPI ID';
        }
        return errs;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const errs = validate();
        setErrors(errs);
        
        if (Object.keys(errs).length === 0) {
            setLoading(true);
            try {
                // Check if cart is empty
                if (cartItems.length === 0) {
                    setErrors({ submit: 'Your cart is empty' });
                    return;
                }

                // Check if user is logged in
                const supabase = getSupabase();
                const { data: { session } } = await supabase.auth.getSession();
                if (!session) {
                    // Save the current URL to redirect back after login
                    localStorage.setItem('redirectAfterLogin', '/checkout');
                    router.push('/login');
                    return;
                }

                // Calculate total amount
                const totalAmount = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

                // Create order in database
                const { error: orderError } = await supabase
                    .from('orders')
                    .insert({
                        user_id: session.user.id,
                        items: cartItems,
                        total_amount: totalAmount,
                        shipping_info: shippingInfo,
                        payment_method: paymentMethod,
                        status: 'pending',
                        payment_status: paymentMethod === 'cod' ? 'pending' : 'paid'
                    });

                if (orderError) throw orderError;

                // Clear the cart
                clearCart();
                
                // Show confirmation
                setShowConfirmation(true);
            } catch (err) {
                console.error('Error creating order:', err);
                setErrors({ submit: err.message || 'Failed to create order. Please try again.' });
            } finally {
                setLoading(false);
            }
        }
    };

    if (showConfirmation) {
        return (
            <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f8fafc 0%, #e0e7ff 100%)' }}>
                <Header />
                <div style={{ maxWidth: 500, margin: '4rem auto', background: '#fff', borderRadius: 16, boxShadow: '0 4px 24px rgba(0,0,0,0.10)', padding: '2.5rem 2rem', textAlign: 'center' }}>
                    <h2>🎉 Thank you, {shippingInfo.name}!</h2>
                    <p>Your order has been placed successfully.</p>
                    <p>We will deliver your products soon to:</p>
                    <div style={{ margin: '1rem 0', color: '#4f46e5' }}>
                        <div>{shippingInfo.address}</div>
                        <div>{shippingInfo.city}, {shippingInfo.state} - {shippingInfo.zip}</div>
                    </div>
                    <p style={{ fontWeight: 600, color: '#0070f3' }}>Payment Method: {paymentMethod === 'card' ? 'Card' : paymentMethod === 'upi' ? 'UPI' : 'Cash on Delivery'}</p>
                    <a href="/" style={{ display: 'inline-block', marginTop: 24, background: 'linear-gradient(90deg, #0070f3 60%, #4f46e5 100%)', color: '#fff', padding: '0.7rem 2.2rem', borderRadius: 8, fontWeight: 600, textDecoration: 'none' }}>Back to Home</a>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f8fafc 0%, #e0e7ff 100%)' }}>
            <Header />
            <h1 style={{ textAlign: 'center', margin: '2.5rem 0 2rem 0', fontSize: '2.2rem', fontWeight: 800, color: '#2d2d2d' }}>Checkout</h1>
            
            {/* Show general error message if any */}
            {errors.submit && (
                <div style={{ 
                    maxWidth: 500, 
                    margin: '0 auto 1rem auto', 
                    padding: '1rem', 
                    background: '#fee2e2', 
                    color: '#ef4444',
                    borderRadius: '8px',
                    textAlign: 'center'
                }}>
                    {errors.submit}
                </div>
            )}

            {/* Show loading state */}
            {loading && (
                <div style={{ 
                    maxWidth: 500, 
                    margin: '0 auto 1rem auto', 
                    padding: '1rem', 
                    background: '#f3f4f6',
                    borderRadius: '8px',
                    textAlign: 'center'
                }}>
                    Processing your order...
                </div>
            )}

            <form onSubmit={handleSubmit} style={{ maxWidth: 500, margin: '0 auto', background: '#fff', borderRadius: 16, boxShadow: '0 4px 24px rgba(0,0,0,0.10)', padding: '2.5rem 2rem' }}>
                <h2 style={{ color: '#4f46e5', marginBottom: 18 }}>Shipping Details</h2>
                <div style={{ marginBottom: 14 }}>
                    <label>Name:</label>
                    <input type="text" name="name" value={shippingInfo.name} onChange={handleChange} required style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #ccc', marginTop: 4 }} />
                    {errors.name && <div style={{ color: 'red', fontSize: 13 }}>{errors.name}</div>}
                </div>
                <div style={{ marginBottom: 14 }}>
                    <label>Address:</label>
                    <input type="text" name="address" value={shippingInfo.address} onChange={handleChange} required style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #ccc', marginTop: 4 }} />
                    {errors.address && <div style={{ color: 'red', fontSize: 13 }}>{errors.address}</div>}
                </div>
                <div style={{ marginBottom: 14 }}>
                    <label>City:</label>
                    <input type="text" name="city" value={shippingInfo.city} onChange={handleChange} required style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #ccc', marginTop: 4 }} />
                    {errors.city && <div style={{ color: 'red', fontSize: 13 }}>{errors.city}</div>}
                </div>
                <div style={{ marginBottom: 14 }}>
                    <label>State:</label>
                    <input type="text" name="state" value={shippingInfo.state} onChange={handleChange} required style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #ccc', marginTop: 4 }} />
                    {errors.state && <div style={{ color: 'red', fontSize: 13 }}>{errors.state}</div>}
                </div>
                <div style={{ marginBottom: 22 }}>
                    <label>Zip Code:</label>
                    <input type="text" name="zip" value={shippingInfo.zip} onChange={handleChange} required style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #ccc', marginTop: 4 }} />
                    {errors.zip && <div style={{ color: 'red', fontSize: 13 }}>{errors.zip}</div>}
                </div>
                <h2 style={{ color: '#4f46e5', margin: '2rem 0 1rem 0' }}>Payment Method</h2>
                <div style={{ display: 'flex', gap: 18, marginBottom: 18 }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
                        <input type="radio" name="payment" value="card" checked={paymentMethod === 'card'} onChange={handlePaymentChange} />
                        <span style={{ fontWeight: 600, color: paymentMethod === 'card' ? '#0070f3' : '#333' }}>💳 Card</span>
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
                        <input type="radio" name="payment" value="upi" checked={paymentMethod === 'upi'} onChange={handlePaymentChange} />
                        <span style={{ fontWeight: 600, color: paymentMethod === 'upi' ? '#0070f3' : '#333' }}>📱 UPI</span>
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
                        <input type="radio" name="payment" value="cod" checked={paymentMethod === 'cod'} onChange={handlePaymentChange} />
                        <span style={{ fontWeight: 600, color: paymentMethod === 'cod' ? '#0070f3' : '#333' }}>🚚 COD</span>
                    </label>
                </div>
                {/* Card Payment Fields */}
                {paymentMethod === 'card' && (
                    <div style={{ background: '#f3f4f6', borderRadius: 10, padding: 18, marginBottom: 18 }}>
                        <div style={{ marginBottom: 12 }}>
                            <label>Card Number:</label>
                            <input type="text" name="number" value={card.number} onChange={handleCardChange} maxLength={16} style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #ccc', marginTop: 4 }} />
                            {errors.cardNumber && <div style={{ color: 'red', fontSize: 13 }}>{errors.cardNumber}</div>}
                        </div>
                        <div style={{ display: 'flex', gap: 12 }}>
                            <div style={{ flex: 1 }}>
                                <label>Expiry (MM/YY):</label>
                                <input type="text" name="expiry" value={card.expiry} onChange={handleCardChange} maxLength={5} style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #ccc', marginTop: 4 }} />
                                {errors.expiry && <div style={{ color: 'red', fontSize: 13 }}>{errors.expiry}</div>}
                            </div>
                            <div style={{ flex: 1 }}>
                                <label>CVV:</label>
                                <input type="password" name="cvv" value={card.cvv} onChange={handleCardChange} maxLength={3} style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #ccc', marginTop: 4 }} />
                                {errors.cvv && <div style={{ color: 'red', fontSize: 13 }}>{errors.cvv}</div>}
                            </div>
                        </div>
                        <div style={{ marginTop: 12 }}>
                            <label>Card Holder Name:</label>
                            <input type="text" name="holder" value={card.holder} onChange={handleCardChange} style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #ccc', marginTop: 4 }} />
                            {errors.holder && <div style={{ color: 'red', fontSize: 13 }}>{errors.holder}</div>}
                        </div>
                    </div>
                )}
                {/* UPI Payment Fields */}
                {paymentMethod === 'upi' && (
                    <div style={{ background: '#f3f4f6', borderRadius: 10, padding: 18, marginBottom: 18 }}>
                        <label>UPI ID:</label>
                        <input type="text" value={upi} onChange={handleUpiChange} style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #ccc', marginTop: 4 }} />
                        {errors.upi && <div style={{ color: 'red', fontSize: 13 }}>{errors.upi}</div>}
                    </div>
                )}
                {/* COD Info */}
                {paymentMethod === 'cod' && (
                    <div style={{ background: '#f3f4f6', borderRadius: 10, padding: 18, marginBottom: 18, color: '#007a1f', fontWeight: 600 }}>
                        Pay with cash when your order is delivered!
                    </div>
                )}
                <button 
                    type="submit" 
                    disabled={loading}
                    style={{ 
                        width: '100%', 
                        background: loading ? '#9ca3af' : 'linear-gradient(90deg, #0070f3 60%, #4f46e5 100%)', 
                        color: '#fff', 
                        padding: '0.9rem 0', 
                        borderRadius: 8, 
                        fontWeight: 700, 
                        fontSize: '1.1rem', 
                        border: 'none', 
                        marginTop: 10, 
                        boxShadow: '0 2px 8px rgba(79,70,229,0.08)', 
                        cursor: loading ? 'not-allowed' : 'pointer', 
                        transition: 'background 0.2s, transform 0.15s' 
                    }}
                >
                    {loading ? 'Processing...' : 'Complete Purchase'}
                </button>
            </form>
            <Footer />
        </div>
    );
};

export default Checkout;