// Import Supabase client instance for database operations
// This connects to the configured Supabase project for product data insertion
import { supabase } from "../../../lib/supabase";

// Import Astro's APIRoute type for proper TypeScript typing of API endpoints
// This provides type safety and IntelliSense for request/response handling
import type { APIRoute } from "astro";

// Astro configuration directive: Disable prerendering for this API route
// This ensures the insert endpoint is always dynamic and can handle real-time form submissions
// Required because data insertion involves server-side processing and cannot be pre-built
export const prerender = false;

// Export POST method handler for the /api/insert/insert endpoint
// APIRoute type ensures proper typing of request and redirect parameters
// async function allows for asynchronous database operations and redirects
export const POST: APIRoute = async ({ request, redirect }) => {
    // Extract form data from the HTTP request body
    // formData() parses the request body as FormData (typically from HTML forms)
    // This handles both application/x-www-form-urlencoded and multipart/form-data
    const formData = await request.formData();
    
    // Extract individual form fields for product creation
    // get() method retrieves values by field name from the submitted form
    // All values are initially strings or FormDataValue types from HTML form submission
    const title = formData.get('title');
    const platform = formData.get('platform');
    const price = formData.get('price');
    const prevprice = formData.get('prevprice');
    const sale = formData.get('sale');
    const preorder = formData.get('preorder');
    const releasedate = formData.get('releasedate');
    const description = formData.get('description');
    const imglink = formData.get('imglink');
    
    // Convert price strings to numbers with null handling for empty values
    // Number() function converts string to number, but returns NaN for empty strings
    // Ternary operator provides null fallback when price field is empty or undefined
    // This ensures database compatibility and prevents NaN values in price fields
    const priceNumber = price ? Number(price) : null;
    const prevpriceNumber = prevprice ? Number(prevprice) : null;
    
    // Convert HTML checkbox values to proper boolean types
    // HTML checkboxes send 'on' when checked, undefined when unchecked
    // sale === 'on' evaluates to true/false for proper boolean storage
    // This handles the difference between HTML form submission and database boolean fields
    const saleBoolean = sale === 'on';
    const preorderBoolean = preorder === 'on';
    
    // Handle empty date field with proper null conversion
    // releasedate && releasedate.toString().trim() !== '' checks for non-empty, non-whitespace values
    // toString() ensures we're working with a string, trim() removes leading/trailing whitespace
    // Returns null for empty dates, which is the proper database representation for "no date"
    const releasedateValue = releasedate && releasedate.toString().trim() !== '' ? releasedate : null;
    
    // Insert new product into the products table with processed form data
    // from('products'): Specifies the target database table
    // insert([...]): Inserts an array of product objects (single product in this case)
    // select(): Returns the inserted data for confirmation (useful for debugging)
    // Destructuring assignment extracts error from the response for error handling
    const { error } = await supabase.from('products').insert([
        {
            title: title,
            platform: platform,
            price: priceNumber,
            prevprice: prevpriceNumber,
            sale: saleBoolean,
            preorder: preorderBoolean,
            releasedate: releasedateValue,
            description: description,
            imglink: imglink,
         },
    ]).select();
    
    // Error handling: Check if database insertion failed
    // If error exists, return 500 Internal Server Error with error message
    // This provides feedback when database constraints are violated or connection fails
    if (error) {
        return new Response(error.message, { status: 500 });
    }
    
    // Redirect to dashboard on successful product insertion
    // redirect() is an Astro helper that handles HTTP redirects
    // This provides user feedback and maintains good UX flow after form submission
    // User is taken to dashboard where they can see the newly created product
    return redirect('/dashboard');
};