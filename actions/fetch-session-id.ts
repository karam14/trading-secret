"use server";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

export const fetchSessionId = async (roomName: string) => {
    const supabase = createClient();
    console.log('ROOMI:', roomName);
    const { data, error } = await supabase
        .from('stream_sessions')
        .select('id')
        .eq('room_name', roomName)
        .single();
        if (error) {
            console.error('Failed to fetch session id:', error);
            return null;
        }
        return data?.id;
        
}
