import React, { useContext, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { CartContext } from '../context/CartContext';
import { getSupabase, isSupabaseConfigured } from '../utils/supabase';
import styles from '../styles/Home.module.css';

const Header = () => {
    const router = useRouter();
    const { cartItems } = useContext(CartContext);
    const [user, setUser] = useState(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    useEffect(() => {
        // Check for user session
        const getSession = async () => {
            try {
                if (!isSupabaseConfigured()) {
                    setUser(null);
                    return;
                }
                const supabase = getSupabase();
                const { data: { session } } = await supabase.auth.getSession();
                setUser(session?.user || null);
            } catch (error) {
                console.error('Error getting session:', error);
                setUser(null);
            }
        };
        getSession();

        // Listen for auth changes
        let subscription;
        const setupAuthListener = async () => {
            try {
                if (!isSupabaseConfigured()) return;
                const supabase = getSupabase();
                const { data: { subscription: sub } } = supabase.auth.onAuthStateChange((_event, session) => {
                    setUser(session?.user || null);
                });
                subscription = sub;
            } catch (error) {
                console.error('Error setting up auth listener:', error);
            }
        };
        setupAuthListener();

        // Close menu when route changes
        const handleRouteChange = () => {
            setIsMenuOpen(false);
        };

        router.events.on('routeChangeComplete', handleRouteChange);

        return () => {
            subscription?.unsubscribe();
            router.events.off('routeChangeComplete', handleRouteChange);
        };
    }, [router.events]);

    const handleSignOut = async () => {
        try {
            if (!isSupabaseConfigured()) return;
            const supabase = getSupabase();
            await supabase.auth.signOut();
            router.push('/');
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <header className="header">
            <div className="header-content">
                <div className="logo">
                    <Link href="/">Tech Store</Link>
                </div>
                
                <button className="hamburger" onClick={toggleMenu} aria-label="Toggle menu">
                    <span className={`hamburger-line ${isMenuOpen ? 'open' : ''}`}></span>
                </button>

                <nav className={`nav ${isMenuOpen ? 'open' : ''}`}>
                    <ul className="nav-links">
                        <li>
                            <Link href="/">
                                <span className="nav-link">
                                    <span className="icon">🏠</span>
                                    Home
                                </span>
                            </Link>
                        </li>
                        <li>
                            <Link href="/cart">
                                <span className="cart-link">
                                    <span className="icon">🛒</span>
                                    Cart
                                    {cartCount > 0 && (
                                        <span className="cart-count">{cartCount}</span>
                                    )}
                                </span>
                            </Link>
                        </li>
                        {user ? (
                            <>
                                <li>
                                    <Link href="/orders">
                                        <span className="nav-link">
                                            <span className="icon">📦</span>
                                            Orders
                                        </span>
                                    </Link>
                                </li>
                                <li>
                                    <button onClick={handleSignOut} className="nav-button">
                                        <span className="icon">👋</span>
                                        Sign Out
                                    </button>
                                </li>
                            </>
                        ) : (
                            <>
                                <li>
                                    <Link href="/login">
                                        <span className="nav-link">
                                            <span className="icon">🔑</span>
                                            Login
                                        </span>
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/signup">
                                        <span className="nav-link highlight">
                                            <span className="icon">✨</span>
                                            Sign Up
                                        </span>
                                    </Link>
                                </li>
                            </>
                        )}
                        <li>
                            <Link href="/checkout">
                                <span className="nav-link highlight">
                                    <span className="icon">💳</span>
                                    Checkout
                                </span>
                            </Link>
                        </li>
                    </ul>
                </nav>
            </div>

            <style jsx>{`
                .header {
                    position: sticky;
                    top: 0;
                    background: white;
                    z-index: 1000;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                }

                .header-content {
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 1rem 2rem;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                }

                .logo {
                    font-weight: 800;
                    font-size: 1.5rem;
                    z-index: 1001;
                }

                .logo a {
                    color: #2d2d2d;
                    text-decoration: none;
                }

                .hamburger {
                    display: none;
                    background: none;
                    border: none;
                    cursor: pointer;
                    padding: 0.5rem;
                    z-index: 1001;
                }

                .hamburger-line {
                    display: block;
                    width: 24px;
                    height: 2px;
                    background: #2d2d2d;
                    position: relative;
                    transition: all 0.3s ease;
                }

                .hamburger-line::before,
                .hamburger-line::after {
                    content: '';
                    position: absolute;
                    width: 24px;
                    height: 2px;
                    background: #2d2d2d;
                    transition: all 0.3s ease;
                }

                .hamburger-line::before {
                    top: -8px;
                }

                .hamburger-line::after {
                    bottom: -8px;
                }

                .hamburger-line.open {
                    background: transparent;
                }

                .hamburger-line.open::before {
                    transform: rotate(45deg);
                    top: 0;
                }

                .hamburger-line.open::after {
                    transform: rotate(-45deg);
                    bottom: 0;
                }

                .nav-links {
                    display: flex;
                    gap: 1.5rem;
                    align-items: center;
                    list-style: none;
                    margin: 0;
                    padding: 0;
                }

                .nav-link,
                .cart-link,
                .nav-button {
                    display: flex;
                    align-items: center;
                    padding: 0.5rem 1rem;
                    border-radius: 20px;
                    font-weight: 600;
                    color: #2d2d2d;
                    text-decoration: none;
                    transition: all 0.2s ease;
                }

                .nav-button {
                    background: transparent;
                    border: none;
                    cursor: pointer;
                    color: #4f46e5;
                }

                .cart-link {
                    background: #fff;
                    color: #0070f3;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.07);
                }

                .highlight {
                    background: linear-gradient(90deg, #0070f3 60%, #4f46e5 100%);
                    color: #fff;
                    box-shadow: 0 2px 8px rgba(79,70,229,0.08);
                }

                .icon {
                    font-size: 1.2rem;
                    margin-right: 0.5rem;
                }

                .cart-count {
                    background: #ff3b3b;
                    color: #fff;
                    border-radius: 50%;
                    padding: 2px 8px;
                    font-size: 0.9rem;
                    font-weight: 700;
                    margin-left: 8px;
                    min-width: 22px;
                    text-align: center;
                    display: inline-block;
                }

                @media (max-width: 768px) {
                    .hamburger {
                        display: block;
                    }

                    .nav {
                        position: fixed;
                        top: 0;
                        right: -100%;
                        width: 80%;
                        max-width: 300px;
                        height: 100vh;
                        background: white;
                        padding: 5rem 2rem 2rem;
                        transition: all 0.3s ease;
                        box-shadow: -2px 0 8px rgba(0,0,0,0.1);
                    }

                    .nav.open {
                        right: 0;
                    }

                    .nav-links {
                        flex-direction: column;
                        align-items: stretch;
                        gap: 1rem;
                    }

                    .nav-link,
                    .cart-link,
                    .nav-button {
                        width: 100%;
                        justify-content: flex-start;
                    }

                    .cart-count {
                        margin-left: auto;
                    }
                }
            `}</style>
        </header>
    );
};

export default Header;