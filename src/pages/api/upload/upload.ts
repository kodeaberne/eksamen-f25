import { supabase } from "../../../lib/supabase";
import type { APIRoute } from "astro";

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
    try {
        const formData = await request.formData();
        const file = formData.get('image') as File;
        
        if (!file) {
            return new Response('No file provided', { status: 400 });
        }

        // Validate file type
        if (!file.type.startsWith('image/')) {
            return new Response('File must be an image', { status: 400 });
        }

        // Validate file size (e.g., 5MB limit)
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSize) {
            return new Response('File size must be less than 5MB', { status: 400 });
        }

        // Generate unique filename
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

        // Upload to Supabase Storage
        const { data, error } = await supabase.storage
            .from('product-images') // You'll need to create this bucket in Supabase
            .upload(fileName, file, {
                cacheControl: '3600',
                upsert: false
            });

        if (error) {
            console.error('Upload error:', error);
            return new Response(error.message, { status: 500 });
        }

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
            .from('product-images')
            .getPublicUrl(fileName);

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
        console.error('Upload error:', error);
        return new Response('Internal server error', { status: 500 });
    }
};
