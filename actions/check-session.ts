// utils/streamService.ts


// Define the structure of the data returned by the query
type StreamData = {
    streams: {
        creator_id: string;
    };
};

// Define the structure of the data returned by the `stream_sessions` table
type StreamSessionData = {
    is_active: boolean;
};
import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';



// Function to check if the user is the owner of the session
export async function checkSessionOwner(roomName: string, userId: string): Promise<boolean> {
    const supabase = createClient();

    try {
        const { data, error } = await supabase
            .from('stream_sessions')
            .select(`
                streams (
                    creator_id
                )
            `)
            .eq('room_name', roomName)
            .single<StreamData>();

        if (error) {
            console.error('Error fetching session owner:', error);
            return false;
        }

        // Checking if the creator_id in the related streams table matches the provided userId
        const isOwner = data?.streams?.creator_id === userId;

        return isOwner;
    } catch (error) {
        console.error('Error checking session owner:', error);
        return false;
    }
}
