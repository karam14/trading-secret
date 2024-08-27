// src/app/actions/fetchCategories.ts
import { createClient } from "@/utils/supabase/server"; // Server-side Supabase client

export async function fetchCategories() {
  const supabase = createClient();

  const { data: categories, error: categoriesError } = await supabase
    .from('categories')
    .select('id, name')
    .order('name', { ascending: true });

  if (categoriesError) {
    console.error("Error fetching categories:", categoriesError.message);
    return null;
  }

  return categories;
}
