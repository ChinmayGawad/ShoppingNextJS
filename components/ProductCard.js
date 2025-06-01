import React from 'react';

const ProductCard = ({ product, onAddToCart }) => {
    return (
        <div className="product-card">
            <div className="image-container">
                <img
                    src={product.image}
                    alt={product.title}
                    onError={(e) => {
                        console.error(`Failed to load image: ${product.image}`);
                        e.target.src = '/images/placeholder.png';
                    }}
                />
            </div>
            <h2>{product.title}</h2>
            <p>₹{product.price.toLocaleString('en-IN')}</p>
            <button onClick={() => onAddToCart(product)}>Add to Cart</button>
            <style jsx>{`
                .product-card {
                    width: 100%;
                    padding: 1rem;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 1rem;
                }
                .image-container {
                    width: 100%;
                    height: 200px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: #f3f4f6;
                    border-radius: 8px;
                    padding: 1rem;
                }
                .image-container img {
                    max-width: 100%;
                    max-height: 100%;
                    object-fit: contain;
                }
                h2 {
                    font-size: 1.2rem;
                    text-align: center;
                    margin: 0.5rem 0;
                }
                p {
                    font-size: 1.1rem;
                    color: #4f46e5;
                    font-weight: 600;
                }
                button {
                    padding: 0.5rem 1rem;
                    background: linear-gradient(90deg, #0070f3 60%, #4f46e5 100%);
                    color: white;
                    border: none;
                    border-radius: 8px;
                    cursor: pointer;
                    font-weight: 600;
                    transition: transform 0.2s;
                }
                button:hover {
                    transform: scale(1.05);
                }
            `}</style>
        </div>
    );
};

export default ProductCard;