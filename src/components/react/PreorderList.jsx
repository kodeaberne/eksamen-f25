import React, { useState, useEffect } from 'react';

export default function PreorderList() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchPreorderProducts();
    }, []);

    const fetchPreorderProducts = async () => {
        try {
            setLoading(true);
            
            // Fetch preorder products
            const response = await fetch('/api/fetch/products?preorder=true');
            
            if (!response.ok) {
                throw new Error('Failed to fetch preorder products');
            }
            
            const data = await response.json();
            
            // Sort by release date, soonest first
            const sortedPreorders = data.sort((a, b) => {
                // Handle cases where releasedate might be null/undefined
                if (!a.releasedate && !b.releasedate) return 0;
                if (!a.releasedate) return 1; // Put items without date at the end
                if (!b.releasedate) return -1;
                
                return new Date(a.releasedate) - new Date(b.releasedate);
            });
            
            setProducts(sortedPreorders);
        } catch (err) {
            setError(err.message);
            console.error('Error fetching preorder products:', err);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'TBA';
        
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('da-DK', {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
            });
        } catch (error) {
            return 'TBA';
        }
    };

    const formatPrice = (price) => {
        return `${price} kr.`;
    };

    const handleProductClick = (productId) => {
        window.location.href = `/single?id=${productId}`;
    };

    if (loading) {
        return (
            <section className="w-full preorder-section py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-6xl mx-auto">
                    <div className="bg-section-bg-yellow border-2 border-black-700 shadow-product-card p-6 sm:p-8">
                        <div className="flex justify-center items-center h-32">
                            <div className="text-black-700 font-pill text-base">Henter kommende spil...</div>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section className="w-full preorder-section py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-6xl mx-auto">
                    <div className="bg-section-bg-yellow border-2 border-black-700 shadow-product-card p-6 sm:p-8">
                        <div className="flex justify-center items-center h-32">
                            <div className="text-red-600 font-pill text-base">Fejl: {error}</div>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    if (products.length === 0) {
        return (
            <section className="w-full preorder-section py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-6xl mx-auto">
                    <div className="bg-section-bg-yellow border-2 border-black-700 shadow-product-card p-6 sm:p-8">
                        <div className="flex justify-center items-center h-32">
                            <div className="text-black-700 font-pill text-base">Ingen kommende spil fundet</div>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="w-full preorder-section py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                <div className="bg-section-bg-yellow border-2 border-black-700 shadow-product-card p-6 sm:p-8">
                    {/* Header */}
                    <div className="mb-6">
                        <h2 className="font-heading text-xl sm:text-2xl font-bold text-black-700 text-center mb-4">
                            🎮 Kommende Spil 🎮
                        </h2>
                    </div>

                    {/* Mobile: Stack layout */}
                    <div className="block md:hidden space-y-4">
                        {products.map((product) => (
                            <div 
                                key={product.id} 
                                className="bg-section-bg-white border-2 border-black-700 p-4 flex items-center space-x-4 cursor-pointer hover:bg-grey-100 transition-colors duration-200"
                                onClick={() => handleProductClick(product.id)}
                            >
                                {/* Small Image */}
                                <div className="flex-shrink-0 w-16 h-20">
                                    <img 
                                        src={product.imglink} 
                                        alt={product.title}
                                        className="w-full h-full object-cover border-2 border-black-700"
                                        loading="lazy"
                                    />
                                </div>
                                
                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-body text-text-body text-base font-medium">
                                        {product.title}
                                    </h3>
                                    <p className="font-body text-text-body text-base mt-1">
                                        Udkommer: {formatDate(product.releasedate)}
                                    </p>
                                    <p className="font-body text-text-body text-base font-bold mt-1">
                                        {formatPrice(product.price)}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Desktop: Table layout */}
                    <div className="hidden md:block">
                        <div className="bg-section-bg-white border-2 border-black-700 overflow-hidden">
                            {/* Header */}
                            <div className="bg-black-400 text-grey-100 px-6 py-3 grid grid-cols-12 gap-4 font-heading text-base font-bold">
                                <div className="col-span-1"></div>
                                <div className="col-span-5">Titel</div>
                                <div className="col-span-3">Udkommer</div>
                                <div className="col-span-3">Pris</div>
                            </div>
                            
                            {/* Rows */}
                            {products.map((product, index) => (
                                <div 
                                    key={product.id}
                                    className={`px-6 py-4 grid grid-cols-12 gap-4 items-center border-b border-black-300 hover:bg-grey-200 transition-colors duration-200 cursor-pointer ${
                                        index === products.length - 1 ? 'border-b-0' : ''
                                    }`}
                                    onClick={() => handleProductClick(product.id)}
                                >
                                    {/* Small Image */}
                                    <div className="col-span-1">
                                        <img 
                                            src={product.imglink} 
                                            alt={product.title}
                                            className="w-12 h-16 object-cover border-2 border-black-700"
                                            loading="lazy"
                                        />
                                    </div>
                                    
                                    {/* Title */}
                                    <div className="col-span-5">
                                        <h3 className="font-body text-text-body text-base font-medium">
                                            {product.title}
                                        </h3>
                                    </div>
                                    
                                    {/* Release Date */}
                                    <div className="col-span-3">
                                        <p className="font-body text-text-body text-base">
                                            {formatDate(product.releasedate)}
                                        </p>
                                    </div>
                                    
                                    {/* Price */}
                                    <div className="col-span-3">
                                        <p className="font-body text-text-body text-base font-bold">
                                            {formatPrice(product.price)}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    
                    {/* View All Button - Visible on both mobile and desktop */}
                    <div className="mt-6">
                        <div className="text-center">
                            <a 
                                href="/products?preorder=true"
                                className="font-heading text-base px-6 py-3 bg-black-400 text-grey-100 border-2 border-black-700 shadow-product-card hover:shadow-none hover:translate-y-1 hover:translate-x-1 transition-all duration-300 cursor-pointer inline-block"
                            >
                                Se alle kommende spil
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

// Add CSS for CatMenu width adjustment
if (typeof document !== 'undefined') {
    const style = document.createElement('style');
    style.textContent = `
        /* When CatMenu is visible on desktop, adjust width to fit remaining viewport */
        .preorder-section.lg\\:ml-64 {
            width: calc(100vw - 16rem);
        }
    `;
    document.head.appendChild(style);
}