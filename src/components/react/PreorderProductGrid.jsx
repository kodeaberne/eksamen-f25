import React, { useState, useEffect } from 'react';
import ProductCard from './ProductCard';

export default function PreorderProductGrid() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchPreorderProducts();
    }, []);

    const fetchPreorderProducts = async () => {
        try {
            setLoading(true);
            
            // Fetch all products and filter for preorders
            const response = await fetch('/api/fetch/products');
            
            if (!response.ok) {
                throw new Error('Failed to fetch preorder products');
            }
            
            const data = await response.json();
            
            // Filter products that are preorders
            const preorderProducts = data.filter(product => 
                product.preorder === true
            );
            
            // Sort by release date, soonest first
            const sortedPreorders = preorderProducts.sort((a, b) => {
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

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-text-body font-pill text-xl">Henter preorders...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-red-400 font-pill text-xl">Error: {error}</div>
            </div>
        );
    }

    if (products.length === 0) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-text-body font-pill text-xl">Ingen preorders fundet</div>
            </div>
        );
    }

    return (
        <section id="preorder-section" className="w-full">
            <h2 className="text-text-body font-heading text-4xl text-center mb-4 mt-12">
                🎮 Kommende Spil 🎮
            </h2> 
            {/* Mobile: Horizontal scroll, Desktop: Grid */}
            <div className="md:hidden overflow-x-auto px-4 pb-4">
                <div className="flex gap-4 w-max">
                    {products.map((product) => (
                        <div key={product.id} className="flex-shrink-0">
                            <ProductCard product={product} />
                        </div>
                    ))}
                </div>
            </div>
            
            {/* Desktop: Grid layout */}
            <div className="hidden md:grid grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6 p-6 justify-items-center">
                {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </section>
    );
}
