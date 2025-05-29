import React, { useContext, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { CartContext } from '../context/CartContext';
import { supabase } from '../utils/supabase';
import styles from '../styles/Home.module.css';

const Header = () => {
    const router = useRouter();
    const { cartItems } = useContext(CartContext);
    const [user, setUser] = useState(null);
    const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    useEffect(() => {
        // Check for user session
        const getSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setUser(session?.user || null);
        };
        getSession();

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user || null);
        });

        return () => subscription?.unsubscribe();
    }, []);

    const handleSignOut = async () => {
        try {
            await supabase.auth.signOut();
            router.push('/');
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

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
                    {user ? (
                        <>
                            <li>
                                <Link href="/orders">
                                    <span style={{ display: 'flex', alignItems: 'center', padding: '6px 16px', borderRadius: '20px', fontWeight: 600 }}>
                                        <span style={{ fontSize: '1.2rem', marginRight: 6 }}>📦</span>
                                        Orders
                                    </span>
                                </Link>
                            </li>
                            <li>
                                <button 
                                    onClick={handleSignOut}
                                    style={{ 
                                        background: 'transparent',
                                        border: 'none',
                                        color: '#4f46e5',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        padding: '6px 16px',
                                        borderRadius: '20px',
                                        fontWeight: 600
                                    }}
                                >
                                    <span style={{ fontSize: '1.2rem', marginRight: 6 }}>👋</span>
                                    Sign Out
                                </button>
                            </li>
                        </>
                    ) : (
                        <>
                            <li>
                                <Link href="/login">
                                    <span style={{ display: 'flex', alignItems: 'center', padding: '6px 16px', borderRadius: '20px', fontWeight: 600 }}>
                                        <span style={{ fontSize: '1.2rem', marginRight: 6 }}>🔑</span>
                                        Login
                                    </span>
                                </Link>
                            </li>
                            <li>
                                <Link href="/signup">
                                    <span style={{ 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        background: 'linear-gradient(90deg, #0070f3 60%, #4f46e5 100%)', 
                                        color: '#fff', 
                                        padding: '6px 18px', 
                                        borderRadius: '20px', 
                                        fontWeight: 600, 
                                        boxShadow: '0 2px 8px rgba(79,70,229,0.08)'
                                    }}>
                                        <span style={{ fontSize: '1.2rem', marginRight: 6 }}>✨</span>
                                        Sign Up
                                    </span>
                                </Link>
                            </li>
                        </>
                    )}
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