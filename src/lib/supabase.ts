import { createClient } from "@supabase/supabase-js";

// Note: It is not recommended to share a single Supabase client instance across the application
// in a Next.js App Router environment, as it can lead to issues with environment variable loading
// during the build process for different parts of the app (server components, actions, etc.).
// Instead, create a new client where needed.

// We will leave this function here as a utility to easily create a client.
export const createSupabaseClient = () => {
    return createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
}
