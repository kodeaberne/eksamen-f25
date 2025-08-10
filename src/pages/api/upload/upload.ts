// Import Supabase client instance for storage operations
// This connects to the configured Supabase project for file upload and storage management
import { supabase } from "../../../lib/supabase";

// Import Astro's APIRoute type for proper TypeScript typing of API endpoints
// This provides type safety and IntelliSense for request/response handling
import type { APIRoute } from "astro";

// Astro configuration directive: Disable prerendering for this API route
// This ensures the upload endpoint is always dynamic and can handle real-time file uploads
// Required because file uploads involve server-side processing and cannot be pre-built
export const prerender = false;

// Export POST method handler for the /api/upload/upload endpoint
// APIRoute type ensures proper typing of request parameters
// async function allows for asynchronous file upload operations
export const POST: APIRoute = async ({ request }) => {
    try {
        // Extract form data from the HTTP request body
        // formData() parses the request body as FormData (typically from HTML file input forms)
        // This handles multipart/form-data which is required for file uploads
        const formData = await request.formData();
        
        // Extract the uploaded file from form data with type assertion
        // get('image') retrieves the file by the input field name
        // as File type assertion ensures TypeScript knows this is a File object
        // This provides access to File properties like type, size, and name
        const file = formData.get('image') as File;
        
        // Input validation: Check if a file was actually provided
        // Early return with 400 Bad Request if no file is present
        // This prevents unnecessary processing and provides clear error feedback
        if (!file) {
            return new Response('No file provided', { status: 400 });
        }

        // File type validation: Ensure uploaded file is an image
        // file.type.startsWith('image/') checks MIME type for image formats
        // This prevents users from uploading non-image files (e.g., PDFs, documents)
        // Common valid types: image/jpeg, image/png, image/webp, image/gif
        if (!file.type.startsWith('image/')) {
            return new Response('File must be an image', { status: 400 });
        }

        // File size validation: Enforce maximum file size limit
        // 5MB limit prevents excessively large files that could impact performance
        // 5 * 1024 * 1024 converts 5MB to bytes (5 * 1024 KB * 1024 B)
        // This protects against storage abuse and ensures reasonable upload times
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSize) {
            return new Response('File size must be less than 5MB', { status: 400 });
        }

        // Generate unique filename to prevent conflicts and ensure security
        // Date.now() provides timestamp-based uniqueness
        // Math.random().toString(36).substring(2) adds random string for additional uniqueness
        // file.name.split('.').pop() extracts the original file extension
        // This prevents filename collisions and maintains file type information
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

        // Upload file to Supabase Storage bucket
        // from('product-images'): Specifies the storage bucket (must be created in Supabase dashboard)
        // upload(fileName, file, options): Uploads file with specified name and options
        // cacheControl: '3600': Sets 1-hour cache for CDN optimization
        // upsert: false: Prevents overwriting existing files with same name
        const { data, error } = await supabase.storage
            .from('product-images') // You'll need to create this bucket in Supabase
            .upload(fileName, file, {
                cacheControl: '3600',
                upsert: false
            });

        // Check for upload errors from Supabase Storage
        // If error exists, return 500 Internal Server Error with error message
        // This handles storage quota exceeded, network issues, or bucket configuration problems
        if (error) {
            return new Response(error.message, { status: 500 });
        }

        // Generate public URL for the uploaded image
        // getPublicUrl(fileName) creates a publicly accessible URL for the file
        // This URL can be used in img tags or stored in the database
        // Destructuring assignment extracts publicUrl from the nested data object
        const { data: { publicUrl } } = supabase.storage
            .from('product-images')
            .getPublicUrl(fileName);

        // Return successful response with file information
        // JSON.stringify() converts response object to JSON string
        // success: true indicates successful upload operation
        // url provides the public URL for immediate use
        // fileName returns the generated filename for database storage
        // 200 status indicates successful operation
        // Content-Type header specifies JSON response format
        return new Response(JSON.stringify({ 
            success: true, 
            url: publicUrl,
            fileName: fileName 
        }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            }
        });

    } catch (error) {
        // Catch any unexpected errors that weren't handled by Supabase
        // This provides a safety net for runtime errors, network issues, etc.
        // Returns 500 Internal Server Error for debugging and user feedback
        return new Response('Internal server error', { status: 500 });
    }
};
