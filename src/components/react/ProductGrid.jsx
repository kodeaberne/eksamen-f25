import React, { useState, useEffect } from 'react';
import ProductCard from './ProductCard';


export default function ProductGrid() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [heading, setHeading] = useState('Alle produkter');

    useEffect(() => {
        fetchProducts();
        updateHeadingFromURL();
    }, []);

    const updateHeadingFromURL = () => {
        const urlParams = new URLSearchParams(window.location.search);
        const category = urlParams.get('cat');
        const search = urlParams.get('search');
        const preorder = urlParams.get('preorder');
        
        if (preorder === 'true') {
            setHeading('🎮 Kommende Spil 🎮');
        } else if (category) {
            setHeading(category);
        } else if (search) {
            setHeading(`Søgeresultater for "${search}"`);
        } else {
            setHeading('Alle produkter');
        }
    };

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const urlParams = new URLSearchParams(window.location.search);
            const category = urlParams.get('cat');
            const search = urlParams.get('search');
            const preorder = urlParams.get('preorder');
            
            let url = '/api/fetch/products';
            const params = new URLSearchParams();
            
            if (category) {
                params.append('platform', category);
            }
            if (search) {
                params.append('search', search);
            }
            if (preorder) {
                params.append('preorder', preorder);
            }
            
            if (params.toString()) {
                url += `?${params.toString()}`;
            }
            
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error('Failed to fetch products');
            }
            
            const data = await response.json();
            setProducts(data);
        } catch (err) {
            setError(err.message);
            console.error('Error fetching products:', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-text-body font-pill text-xl">Loading products...</div>
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
                <div className="text-text-body font-pill text-xl">No products found</div>
            </div>
        );
    }

    return (
        <>
        <h1 className="text-text-body font-heading text-4xl text-center mb-4 mt-12">{heading}</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6 p-6 justify-items-center">
            {products.map((product) => (
                <ProductCard key={product.id} product={product} />
            ))}
        </div>
            </>
    );
}
