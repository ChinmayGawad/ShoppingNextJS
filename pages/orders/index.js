import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { supabase } from '../../utils/supabase';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const router = useRouter();

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession();
                
                if (!session) {
                    router.push('/login');
                    return;
                }

                const { data: orders, error } = await supabase
                    .from('orders')
                    .select('*')
                    .eq('user_id', session.user.id)
                    .order('created_at', { ascending: false });

                if (error) throw error;
                setOrders(orders || []);
            } catch (err) {
                console.error('Error fetching orders:', err);
                setError('Failed to load orders. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    if (loading) {
        return (
            <>
                <Header />
                <div className="orders-container">
                    <div className="loading">Loading your orders...</div>
                </div>
                <Footer />
                <style jsx>{styles}</style>
            </>
        );
    }

    return (
        <>
            <Header />
            <div className="orders-container">
                <h1>Your Orders</h1>
                
                {error && <div className="error-message">{error}</div>}
                
                {orders.length === 0 ? (
                    <div className="no-orders">
                        <p>You haven't placed any orders yet.</p>
                        <button onClick={() => router.push('/')} className="shop-now-btn">
                            Shop Now
                        </button>
                    </div>
                ) : (
                    <div className="orders-list">
                        {orders.map((order) => (
                            <div key={order.id} className="order-card">
                                <div className="order-header">
                                    <div>
                                        <h3>Order #{order.id}</h3>
                                        <p className="order-date">
                                            {new Date(order.created_at).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </p>
                                    </div>
                                    <div className="order-status">
                                        {order.status}
                                    </div>
                                </div>
                                <div className="order-items">
                                    {order.items?.map((item, index) => (
                                        <div key={index} className="order-item">
                                            <img src={item.image} alt={item.title} />
                                            <div className="item-details">
                                                <h4>{item.title}</h4>
                                                <p>Quantity: {item.quantity}</p>
                                                <p className="item-price">
                                                    ₹{(item.price * 83).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="order-footer">
                                    <div className="order-total">
                                        Total: ₹{(order.total_amount * 83).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <Footer />
            <style jsx>{styles}</style>
        </>
    );
};

const styles = `
    .orders-container {
        min-height: 80vh;
        padding: 2rem;
        background: linear-gradient(135deg, #f8fafc 0%, #e0e7ff 100%);
    }

    .loading, .error-message {
        text-align: center;
        padding: 2rem;
        background: white;
        border-radius: 12px;
        box-shadow: 0 4px 24px rgba(0,0,0,0.1);
        max-width: 800px;
        margin: 2rem auto;
    }

    .error-message {
        color: #ef4444;
        background: #fee2e2;
    }

    h1 {
        text-align: center;
        color: #2d2d2d;
        margin-bottom: 2rem;
        font-size: 2rem;
    }

    .no-orders {
        text-align: center;
        padding: 3rem;
        background: white;
        border-radius: 12px;
        box-shadow: 0 4px 24px rgba(0,0,0,0.1);
        max-width: 800px;
        margin: 0 auto;
    }

    .shop-now-btn {
        background: linear-gradient(90deg, #0070f3 60%, #4f46e5 100%);
        color: white;
        border: none;
        padding: 0.8rem 2rem;
        border-radius: 8px;
        font-size: 1rem;
        cursor: pointer;
        margin-top: 1rem;
        font-weight: 600;
    }

    .orders-list {
        max-width: 800px;
        margin: 0 auto;
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
    }

    .order-card {
        background: white;
        border-radius: 12px;
        box-shadow: 0 4px 24px rgba(0,0,0,0.1);
        overflow: hidden;
    }

    .order-header {
        padding: 1.5rem;
        border-bottom: 1px solid #e5e7eb;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .order-header h3 {
        margin: 0;
        color: #2d2d2d;
    }

    .order-date {
        color: #6b7280;
        margin: 0.5rem 0 0 0;
        font-size: 0.9rem;
    }

    .order-status {
        background: #f3f4f6;
        padding: 0.5rem 1rem;
        border-radius: 20px;
        font-size: 0.9rem;
        font-weight: 600;
        color: #4f46e5;
    }

    .order-items {
        padding: 1.5rem;
    }

    .order-item {
        display: flex;
        gap: 1rem;
        padding: 1rem 0;
        border-bottom: 1px solid #e5e7eb;
    }

    .order-item:last-child {
        border-bottom: none;
    }

    .order-item img {
        width: 80px;
        height: 80px;
        object-fit: contain;
        background: #f3f4f6;
        border-radius: 8px;
    }

    .item-details {
        flex: 1;
    }

    .item-details h4 {
        margin: 0 0 0.5rem 0;
        color: #2d2d2d;
    }

    .item-details p {
        margin: 0.25rem 0;
        color: #6b7280;
    }

    .item-price {
        color: #4f46e5 !important;
        font-weight: 600;
    }

    .order-footer {
        padding: 1.5rem;
        background: #f8fafc;
        border-top: 1px solid #e5e7eb;
    }

    .order-total {
        text-align: right;
        font-weight: 700;
        color: #4f46e5;
        font-size: 1.1rem;
    }
`;

export default Orders; 