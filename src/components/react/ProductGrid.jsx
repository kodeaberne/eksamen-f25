import React, { useState, useEffect } from 'react';
import ProductCard from './ProductCard';

// Main component for displaying a grid of products with dynamic filtering and search capabilities
export default function ProductGrid() {
    // State management for products data, loading states, and error handling
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [heading, setHeading] = useState('Alle produkter');

    // useEffect hook runs on component mount to fetch products and update heading
    // Empty dependency array ensures this only runs once when component is first rendered
    useEffect(() => {
        fetchProducts();
        updateHeadingFromURL();
    }, []);

    // Function to dynamically update the page heading based on URL parameters
    // This allows for contextual headings based on category, search, or preorder filters
    const updateHeadingFromURL = () => {
        // Extract query parameters from the current URL
        const urlParams = new URLSearchParams(window.location.search);
        const category = urlParams.get('cat');
        const search = urlParams.get('search');
        const preorder = urlParams.get('preorder');
        
        // Conditional logic to set appropriate heading based on URL parameters
        // Priority order: preorder > category > search > default
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

    // Async function to fetch products from the API with dynamic filtering
    // Handles multiple query parameters and constructs the appropriate API endpoint
    const fetchProducts = async () => {
        try {
            setLoading(true);
            // Extract all relevant URL parameters for API filtering
            const urlParams = new URLSearchParams(window.location.search);
            const category = urlParams.get('cat');
            const search = urlParams.get('search');
            const preorder = urlParams.get('preorder');
            
            // Build the base API URL
            let url = '/api/fetch/products';
            const params = new URLSearchParams();
            
            // Conditionally append query parameters only if they exist
            // This prevents unnecessary empty parameters in the API call
            if (category) {
                params.append('platform', category);
            }
            if (search) {
                params.append('search', search);
            }
            if (preorder) {
                params.append('preorder', preorder);
            }
            
            // Append query string to URL if any parameters exist
            if (params.toString()) {
                url += `?${params.toString()}`;
            }
            
            // Make the API request and handle the response
            const response = await fetch(url);
            
            // Check if the response was successful (status 200-299)
            if (!response.ok) {
                throw new Error('Failed to fetch products');
            }
            
            // Parse JSON response and update products state
            const data = await response.json();
            setProducts(data);
        } catch (err) {
            // Error handling: set error state and log to console for debugging
            setError(err.message);
            console.error('Error fetching products:', err);
        } finally {
            // Always set loading to false, regardless of success or failure
            setLoading(false);
        }
    };

    // Loading state: display loading message while fetching data
    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-text-body font-pill text-xl">Loading products...</div>
            </div>
        );
    }

    // Error state: display error message if API call failed
    if (error) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-red-400 font-pill text-xl">Error: {error}</div>
            </div>
        );
    }

    // Empty state: display message when no products are found
    if (products.length === 0) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-text-body font-pill text-xl">No products found</div>
            </div>
        );
    }

    // Main render: display heading and responsive product grid
    // Grid uses Tailwind CSS responsive classes for different screen sizes
    return (
        <>
        <h1 className="text-text-body font-heading text-4xl text-center mb-4 mt-12">{heading}</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6 p-6 justify-items-center">
            {/* Map through products array to render individual ProductCard components */}
            {/* Each product gets a unique key prop for React's reconciliation algorithm */}
            {products.map((product) => (
                <ProductCard key={product.id} product={product} />
            ))}
        </div>
            </>
    );
}
