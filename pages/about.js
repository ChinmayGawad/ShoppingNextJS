import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const About = () => {
    return (
        <>
            <Header />
            <div className="about-container">
                <h1>About Us</h1>
                <div className="content">
                    <p>Welcome to our e-commerce platform! We are dedicated to providing the best shopping experience for our customers.</p>
                    <p>Our mission is to deliver high-quality products at competitive prices while ensuring excellent customer service.</p>
                </div>
            </div>
            <Footer />

            <style jsx>{`
                .about-container {
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
                .content {
                    max-width: 800px;
                    margin: 0 auto;
                    background: white;
                    padding: 2rem;
                    border-radius: 12px;
                    box-shadow: 0 4px 24px rgba(0,0,0,0.1);
                }
                p {
                    margin-bottom: 1rem;
                    line-height: 1.6;
                    color: #4a5568;
                }
                p:last-child {
                    margin-bottom: 0;
                }
            `}</style>
        </>
    );
};

export default About; 