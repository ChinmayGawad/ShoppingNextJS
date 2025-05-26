import Header from '../components/Header';
import Footer from '../components/Footer';
import Link from 'next/link';

export default function About() {
  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f8fafc 0%, #e0e7ff 100%)' }}>
      <Header />
      <main style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '70vh' }}>
        <h1 style={{ fontSize: '2.2rem', color: '#4f46e5', fontWeight: 800 }}>About Us</h1>
        <p style={{ fontSize: '1.15rem', color: '#333', margin: '1.5rem 0' }}>This is a placeholder for the About page.</p>
        <Link href="/" style={{ color: '#0070f3', fontWeight: 600 }}>Back to Home</Link>
      </main>
      <Footer />
    </div>
  );
} 