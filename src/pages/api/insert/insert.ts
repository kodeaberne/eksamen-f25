import { supabase } from "../../../lib/supabase";
import type { APIRoute } from "astro";

export const prerender = false;


export const POST: APIRoute = async ({ request, redirect }) => {
    const formData = await request.formData();
    const title = formData.get('title');
    const platform = formData.get('platform');
    const price = formData.get('price');
    const prevprice = formData.get('prevprice');
    const sale = formData.get('sale');
    const preorder = formData.get('preorder');
    const releasedate = formData.get('releasedate');
    const description = formData.get('description');
    const imglink = formData.get('imglink');
    
    // Convert price strings to numbers, handle empty values
    const priceNumber = price ? Number(price) : null;
    const prevpriceNumber = prevprice ? Number(prevprice) : null;
    
    // Convert checkbox values to booleans
    const saleBoolean = sale === 'on';
    const preorderBoolean = preorder === 'on';
    
    // Handle empty date field
    const releasedateValue = releasedate && releasedate.toString().trim() !== '' ? releasedate : null;
    
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
    if (error) {
        return new Response(error.message, { status: 500 });
    }
    
    return redirect('/dashboard');
};