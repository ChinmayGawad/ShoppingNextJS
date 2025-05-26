import React, { useContext } from 'react';
import Link from 'next/link';
import { CartContext } from '../context/CartContext';
import styles from '../styles/Home.module.css';

const Header = () => {
    const { cartItems } = useContext(CartContext);
    const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    return (
        <header className={styles.header} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 2vw' }}>
            <div className={styles.logo} style={{ fontWeight: 800, fontSize: '1.5rem' }}>
                <Link href="/">My E-Commerce Site</Link>
            </div>
            <nav>
                <ul className={styles.navLinks} style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', listStyle: 'none', margin: 0 }}>
                    <li>
                        <Link href="/">Home</Link>
                    </li>
                    <li style={{ position: 'relative' }}>
                        <Link href="/cart">
                            <span style={{ display: 'flex', alignItems: 'center', background: '#fff', color: '#0070f3', padding: '6px 16px', borderRadius: '20px', fontWeight: 600, boxShadow: '0 2px 8px rgba(0,0,0,0.07)' }}>
                                <span style={{ fontSize: '1.2rem', marginRight: 6 }}>🛒</span>
                                Cart
                                {cartCount > 0 && (
                                    <span style={{ background: '#ff3b3b', color: '#fff', borderRadius: '50%', padding: '2px 8px', fontSize: '0.9rem', fontWeight: 700, marginLeft: 8, minWidth: 22, textAlign: 'center', display: 'inline-block' }}>{cartCount}</span>
                                )}
                            </span>
                        </Link>
                    </li>
                    <li>
                        <Link href="/checkout">
                            <span style={{ display: 'flex', alignItems: 'center', background: 'linear-gradient(90deg, #0070f3 60%, #4f46e5 100%)', color: '#fff', padding: '6px 18px', borderRadius: '20px', fontWeight: 600, boxShadow: '0 2px 8px rgba(79,70,229,0.08)' }}>
                                <span style={{ fontSize: '1.2rem', marginRight: 6 }}>💳</span>
                                Checkout
                            </span>
                        </Link>
                    </li>
                </ul>
            </nav>
        </header>
    );
};

export default Header;