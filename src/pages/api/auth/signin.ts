// Astro configuration directive: Disable prerendering for this API route
// This ensures the authentication endpoint is always dynamic and can handle real-time requests
// Required because authentication involves server-side processing and cannot be pre-built
export const prerender = false;

// Import Astro's APIRoute type for proper TypeScript typing of API endpoints
// This provides type safety and IntelliSense for request/response handling
import type { APIRoute } from "astro";

// Import Supabase client instance for authentication operations
// This connects to the configured Supabase project for user management
import { supabase } from "../../../lib/supabase";

// Export POST method handler for the /api/auth/signin endpoint
// APIRoute type ensures proper typing of request, cookies, and redirect parameters
// async function allows for asynchronous operations like database calls and redirects
export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  // Extract form data from the HTTP request body
  // formData() parses the request body as FormData (typically from HTML forms)
  // This handles both application/x-www-form-urlencoded and multipart/form-data
  const formData = await request.formData();
  
  // Extract email and password from form data with type safety
  // get() method retrieves values by field name
  // toString() converts the FormDataValue to string, with optional chaining for safety
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();

  // Input validation: Check if both email and password are provided
  // Early return with 400 Bad Request if either field is missing
  // This prevents unnecessary database calls and provides clear error feedback
  if (!email || !password) {
    return new Response("Email and password are required", { status: 400 });
  }

  // Authenticate user with Supabase using email and password
  // signInWithPassword() handles the OAuth flow and returns user session data
  // Destructuring assignment extracts data and error from the response
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  // Error handling: Check if authentication failed
  // If error exists, return 500 Internal Server Error with error message
  // This provides detailed feedback for debugging authentication issues
  if (error) {
    return new Response(error.message, { status: 500 });
  }

  // Extract authentication tokens from successful login response
  // access_token: Short-lived token for API requests (typically 1 hour)
  // refresh_token: Long-lived token for obtaining new access tokens
  // Destructuring from data.session where Supabase stores the tokens
  const { access_token, refresh_token } = data.session;
  
  // Set HTTP-only cookies for secure token storage
  // sb-access-token: Stores the access token for authenticated requests
  // path: "/" makes the cookie available across the entire domain
  // HTTP-only prevents JavaScript access (XSS protection)
  cookies.set("sb-access-token", access_token, {
    path: "/",
  });
  
  // Set refresh token cookie for automatic token renewal
  // sb-refresh-token: Stores the refresh token for obtaining new access tokens
  // Same security settings as access token cookie
  cookies.set("sb-refresh-token", refresh_token, {
    path: "/",
  });
  
  // Redirect user to home page with success indicator
  // redirect() is an Astro helper that handles HTTP redirects
  // Query parameter "?login=success" allows frontend to show success message
  // This provides user feedback and maintains good UX flow
  return redirect("/?login=success");
};