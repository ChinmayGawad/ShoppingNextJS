import React, { useContext } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { CartContext } from '../context/CartContext';
import CartItem from '../components/CartItem';
import Link from 'next/link';

const Cart = () => {
    const { cartItems, removeFromCart, updateQuantity } = useContext(CartContext);

    const handleRemove = (id) => {
        removeFromCart(id);
    };

    const handleQuantityChange = (id, quantity) => {
        updateQuantity(id, parseInt(quantity));
    };

    const totalAmount = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);

    return (
        <div className="cart-bg">
            <Header />
            <main>
                <h1 className="cart-title">🛒 Your Shopping Cart</h1>
                {cartItems.length === 0 ? (
                    <p className="empty-cart">Your cart is empty. <Link href="/">Continue Shopping</Link></p>
                ) : (
                    <div style={{ maxWidth: 650, margin: '2.5rem auto', background: '#fff', borderRadius: 18, boxShadow: '0 4px 24px rgba(0,0,0,0.10)', padding: '2.5rem 2rem' }}>
                        <div style={{ minHeight: 120 }}>
                            {cartItems.map(item => (
                                <CartItem 
                                    key={item.id} 
                                    item={item} 
                                    onRemove={handleRemove} 
                                    onQuantityChange={handleQuantityChange} 
                                />
                            ))}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 32, gap: 18, flexWrap: 'wrap' }}>
                            <h2 className="cart-total" style={{ margin: 0, fontSize: '1.25rem', color: '#4f46e5', fontWeight: 800 }}>
                                Total: ₹{totalAmount.toLocaleString('en-IN')}
                            </h2>
                            <Link className="checkout-btn" href="/checkout" style={{ background: 'linear-gradient(90deg, #0070f3 60%, #4f46e5 100%)', color: '#fff', padding: '0.7rem 2.2rem', borderRadius: 8, fontSize: '1.1rem', fontWeight: 600, textAlign: 'center', textDecoration: 'none', transition: 'background 0.2s, transform 0.15s', boxShadow: '0 2px 8px rgba(79,70,229,0.08)' }}>
                                Proceed to Checkout
                            </Link>
                        </div>
                    </div>
                )}
            </main>
            <Footer />
            <style jsx>{`
                .cart-bg {
                    min-height: 100vh;
                    background: linear-gradient(135deg, #f8fafc 0%, #e0e7ff 100%);
                }
                .cart-title {
                    text-align: center;
                    margin: 2.5rem 0 2rem 0;
                    font-size: 2.2rem;
                    font-weight: 800;
                    color: #2d2d2d;
                }
                .empty-cart {
                    text-align: center;
                    font-size: 1.2rem;
                    margin-top: 2rem;
                }
                .cart-total {
                    text-align: right;
                    margin: 2rem 0 1rem 0;
                    font-size: 1.3rem;
                    font-weight: bold;
                }
                .checkout-btn {
                    display: inline-block;
                    background: linear-gradient(90deg, #0070f3 60%, #4f46e5 100%);
                    color: #fff;
                    padding: 0.7rem 2.2rem;
                    border-radius: 8px;
                    font-size: 1.1rem;
                    font-weight: 600;
                    text-align: center;
                    margin: 1rem 0 2rem 0;
                    text-decoration: none;
                    transition: background 0.2s, transform 0.15s;
                }
                .checkout-btn:hover {
                    background: linear-gradient(90deg, #005bb5 60%, #3730a3 100%);
                    transform: scale(1.04);
                }
            `}</style>
        </div>
    );
};

export default Cart;