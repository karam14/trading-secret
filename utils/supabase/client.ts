import { createBrowserClient } from "@supabase/ssr";
import { Database } from "@/types/supabase"; // Import the generated types for your database schema

export const createClient = () =>
  createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
