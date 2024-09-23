"use server";
import { createClient } from '@/utils/supabase/server'


export default async function getUser() {
    const supabase = createClient();
    const { data: { user }, error } = await supabase.auth.getUser();


  return { user, error }
}


export async function getUserById(id: string){

    const supabase = createClient();
    const { data, error } = await supabase
    .from('profile_view')
    .select('*')
    .eq('id', id)
    .single();
    return data;
}

export async function getProfile(id : string){
    const supabase = createClient();
    const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', id)
    return data;
}