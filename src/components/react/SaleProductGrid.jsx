import React, { useState, useEffect } from 'react';
import ProductCard from './ProductCard';

export default function SaleProductGrid() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchSaleProducts();
    }, []);

    const fetchSaleProducts = async () => {
        try {
            setLoading(true);
            
            // Fetch products on sale
            const response = await fetch('/api/fetch/products?sale=true');
            
            if (!response.ok) {
                throw new Error('Failed to fetch sale products');
            }
            
            const data = await response.json();
            
            // Products are already filtered by sale=true from the API
            setProducts(data);
        } catch (err) {
            setError(err.message);
            console.error('Error fetching sale products:', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-text-body font-pill text-xl">Henter tilbud...</div>
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
                <div className="text-text-body font-pill text-xl">Ingen tilbud fundet </div>
            </div>
        );
    }

    return (
        <section id="sale-section" className="w-full">
            <h2 className="text-text-body font-heading text-4xl text-center mb-4 mt-12">
                🔥 Tilbud 🔥
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
