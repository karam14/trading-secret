"use server";
import { createClient } from '@/utils/supabase/server'


export default async function getUser() {
    const supabase = createClient();
    const { data: { user }, error } = await supabase.auth.getUser();


  return { user, error }
}

