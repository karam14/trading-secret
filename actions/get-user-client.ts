"use client";
import { createClient } from '@/utils/supabase/client'


export default async function getUser() {
    const supabase = createClient();
    const { data: { user }, error } = await supabase.auth.getUser();


  return { user, error }
}

