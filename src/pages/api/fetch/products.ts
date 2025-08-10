// Import Astro's APIRoute type for proper TypeScript typing of API endpoints
// This provides type safety and IntelliSense for request/response handling
import type { APIRoute } from 'astro';

// Import Supabase client instance for database operations
// This connects to the configured Supabase project for product data retrieval
import { supabase } from '../../../lib/supabase';

// Astro configuration directive: Disable prerendering for this API route
// This ensures the products endpoint is always dynamic and can handle real-time filtering
// Required because product queries involve dynamic parameters and database calls
export const prerender = false;

// Export GET method handler for the /api/fetch/products endpoint
// APIRoute type ensures proper typing of request parameters
// async function allows for asynchronous database operations
export const GET: APIRoute = async ({ request }) => {
    try {
        // Parse the request URL to extract query parameters
        // URL constructor parses the full request URL including query string
        const url = new URL(request.url);
        
        // Extract individual query parameters for dynamic filtering
        // searchParams.get() returns null if parameter doesn't exist
        // platform: Filters products by gaming platform (e.g., Nintendo Switch, PS5)
        // search: Text search within product titles (case-insensitive)
        // sale: Boolean filter for products on sale
        // preorder: Boolean filter for pre-order products
        const platform = url.searchParams.get('platform');
        const search = url.searchParams.get('search');
        const sale = url.searchParams.get('sale');
        const preorder = url.searchParams.get('preorder');
        
        // Initialize base Supabase query with table selection and ordering
        // from('products'): Specifies the database table to query
        // select('*'): Retrieves all columns from the products table
        // order('dateadded', { ascending: false }): Sorts by newest products first
        let query = supabase
            .from('products')
            .select('*')
            .order('dateadded', { ascending: false });
            
        // Apply platform filter if specified in query parameters
        // eq() method creates an equality filter (platform = 'Nintendo Switch')
        // Only applies filter if platform parameter exists to avoid unnecessary constraints
        if (platform) {
            query = query.eq('platform', platform);
        }
        
        // Apply text search filter if search parameter is provided
        // ilike() method performs case-insensitive pattern matching
        // %${search}% creates a wildcard search (matches anywhere in title)
        // This allows users to find products by partial title matches
        if (search) {
            query = query.ilike('title', `%${search}%`);
        }
        
        // Apply sale filter for products currently on sale
        // sale === 'true' checks for exact string match (query parameters are strings)
        // eq('sale', true) filters for products where sale field is true
        if (sale === 'true') {
            query = query.eq('sale', true);
        }
        
        // Apply preorder filter for upcoming products
        // preorder === 'true' checks for exact string match
        // eq('preorder', true) filters for products where preorder field is true
        if (preorder === 'true') {
            query = query.eq('preorder', true);
        }

        // Execute the built query and await the result
        // Supabase returns an object with data and error properties
        // Destructuring assignment extracts both values for error handling
        const { data, error } = await query;

        // Check for database query errors
        // If error exists, return 500 Internal Server Error with detailed error information
        // JSON.stringify() converts error object to JSON for client consumption
        if (error) {
            return new Response(JSON.stringify({ 
                error: 'Database query failed',
                details: error.message 
            }), {
                status: 500,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }

        // Return successful response with product data
        // data || [] ensures empty array is returned if no products found
        // JSON.stringify() converts product array to JSON string
        // 200 status indicates successful operation
        // Content-Type header specifies JSON response format
        return new Response(JSON.stringify(data || []), {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    } catch (error) {
        // Catch any unexpected errors that weren't handled by Supabase
        // This provides a safety net for runtime errors, network issues, etc.
        // instanceof Error check ensures proper error message extraction
        // Returns 500 Internal Server Error with error details for debugging
        return new Response(JSON.stringify({ 
            error: 'Internal server error',
            details: error instanceof Error ? error.message : 'Unknown error'
        }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
};
