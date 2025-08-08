import React from 'react';

// Helper functions
const formatPrice = (price) => `${price.toFixed(2)} kr.`;

const ShoppingCartIcon = () => (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g clipPath="url(#clip0_274_30)">
            <path d="M1.33325 1.33337H6.66658L10.2399 19.1867C10.3618 19.8006 10.6958 20.352 11.1833 20.7444C11.6708 21.1369 12.2808 21.3454 12.9066 21.3334H25.8666C26.4923 21.3454 27.1023 21.1369 27.5899 20.7444C28.0774 20.352 28.4113 19.8006 28.5332 19.1867L30.6666 8.00004H7.99992M13.3333 28C13.3333 28.7364 12.7363 29.3334 11.9999 29.3334C11.2635 29.3334 10.6666 28.7364 10.6666 28C10.6666 27.2637 11.2635 26.6667 11.9999 26.6667C12.7363 26.6667 13.3333 27.2637 13.3333 28ZM27.9999 28C27.9999 28.7364 27.403 29.3334 26.6666 29.3334C25.9302 29.3334 25.3333 28.7364 25.3333 28C25.3333 27.2637 25.9302 26.6667 26.6666 26.6667C27.403 26.6667 27.9999 27.2637 27.9999 28Z" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
        </g>
        <defs>
            <clipPath id="clip0_274_30">
                <rect width="32" height="32" fill="white"/>
            </clipPath>
        </defs>
    </svg>
);

// Badge component
const Badge = ({ children, className, style }) => (
    <div 
        className={`absolute top-4 px-3 pt-1 rounded-4xl font-pill italic z-10 border-2 border-black-700 ${className}`}
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '1.5rem', ...style }}
    >
        {children}
    </div>
);

// Image component
const ProductImage = ({ src, alt, title }) => (
    <div className="w-full h-full relative">
        {src ? (
            <img 
                src={src} 
                alt={alt}
                className="w-full h-full object-cover border-2 border-black-700"
            />
        ) : (
            <div className="w-full h-full bg-grey-300 flex items-center justify-center border-2 border-black-700">
                <span className="text-grey-600 font-pill">No Image</span>
            </div>
        )}
    </div>
);

// Price display component
const PriceDisplay = ({ price, prevPrice }) => (
    <div className="flex items-center justify-between">
        <span className="text-black-700 font-body text-xl">
            {formatPrice(price)}
        </span>
        {prevPrice && prevPrice > price && (
            <span className="text-grey-600 line-through text-sm">
                {formatPrice(prevPrice)}
            </span>
        )}
    </div>
);

// Add to cart button component
const AddToCartButton = ({ onClick }) => (
    <button 
        className="w-full bg-mutedred-400 text-buy-button-text font-bold py-3 px-4 flex items-center justify-between transition-all duration-300 border-2 border-black-700 shadow-product-card hover:shadow-none hover:translate-y-1 hover:translate-x-1 cursor-pointer"
        onClick={onClick}
    >
        <span className="text-lg font-heading">TILFØJ TIL KURV</span>
        <ShoppingCartIcon />
    </button>
);

export default function ProductCard({ product }) {
    const { preorder, sale, imglink, title, price, prevprice } = product;
    
    const handleAddToCart = () => {
        console.log('Adding to cart:', product);
    };

    return (
        <div className="w-80 bg-surface-product-card border-2 border-black-700 flex flex-col shadow-product-card">
            {/* Top Section - Game Cover */}
            <div className="bg-surface-product-card relative h-[32rem] flex-shrink-0 p-2">
                {/* Pre-order Badge */}
                {preorder && (
                    <Badge className="left-4 bg-yellow-400 text-black-700">
                        Pre-order
                    </Badge>
                )}

                {/* Sale Badge */}
                {sale && (
                    <Badge className="right-4 bg-red-400 text-white text-sm">
                        SALE
                    </Badge>
                )}

                {/* Game Cover Image */}
                <ProductImage src={imglink} alt={title} title={title} />
            </div>

            {/* Bottom Section - Product Details and Buy Button */}
            <div className="bg-surface-product-card p-4 flex flex-col flex-grow">
                {/* Product Title and Price */}
                <div className="mb-4">
                    <h3 className="font-body text-black-700 text-lg mb-2 line-clamp-2">
                        {title}
                    </h3>
                    <PriceDisplay price={price} prevPrice={prevprice} />
                </div>

                {/* Add to Cart Button */}
                <div className="mt-auto">
                    <AddToCartButton onClick={handleAddToCart} />
                </div>
            </div>
        </div>
    );
}
