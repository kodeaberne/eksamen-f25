import type { APIRoute } from 'astro';
import { supabase } from '../../../lib/supabase';

export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
    try {
        const url = new URL(request.url);
        const platform = url.searchParams.get('platform');
        const search = url.searchParams.get('search');
        const sale = url.searchParams.get('sale');
        
        console.log('Attempting to fetch products from Supabase...');
        console.log('Platform filter:', platform);
        console.log('Search filter:', search);
        console.log('Sale filter:', sale);
        
        let query = supabase
            .from('products')
            .select('*')
            .order('dateadded', { ascending: false });
            
        if (platform) {
            query = query.eq('platform', platform);
        }
        
        if (search) {
            query = query.ilike('title', `%${search}%`);
        }
        
        if (sale === 'true') {
            query = query.eq('sale', true);
        }

        const { data, error } = await query;

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
