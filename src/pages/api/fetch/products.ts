import type { APIRoute } from 'astro';
import { supabase } from '../../../lib/supabase';

export const prerender = false;

export const GET: APIRoute = async () => {
    try {
        
        console.log('Attempting to fetch products from Supabase...');
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .order('dateadded', { ascending: false });

        if (error) {
            console.error('Supabase error:', error);
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

        console.log(`Successfully fetched ${data?.length || 0} products`);
        return new Response(JSON.stringify(data || []), {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    } catch (error) {
        console.error('API error:', error);
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
