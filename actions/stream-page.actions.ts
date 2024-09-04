// actions/stream-page.actions.tsx

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';

const supabase = createClient();

// Fetch live streams based on active sessions
export const useLiveStreams = () => {
  const [liveStreams, setLiveStreams] = useState<{ id: any; title: any; description: any; is_live: any; stream_sessions: { is_active: any; }[];profile_view: { name: any; image_url: any }[] }[]>([]);

  const fetchLiveStreams = async () => {
    const { data, error } = await supabase
      .from('streams')
      .select(`
        id, 
        title, 
        description, 
        is_live,
        stream_sessions (is_active),
        profile_view!streams_creator_id_fkey (name, image_url)

      `)
      .filter('stream_sessions.is_active', 'eq', true);

    if (error) {
      console.error('Error fetching live streams:', error);
      return [];
    }

    const activeStreams = data.filter(stream => stream.stream_sessions.some(session => session.is_active));
    console.log("fetched the following:",activeStreams);
    setLiveStreams(activeStreams);
  };

  useEffect(() => {
    fetchLiveStreams();

    const subscription = supabase
      .channel('realtime-live-streams')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'stream_sessions',
        },
        async (payload) => {
          console.log('Realtime update received:', payload);
          await fetchLiveStreams();  // Refetch live streams when a session changes
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'streams',
        },
        async (payload) => {
          console.log('Realtime update received:', payload);
          await fetchLiveStreams();  // Refetch live streams when a stream changes
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  return liveStreams;
};

// Fetch scheduled streams (non-live data)
export const useScheduledStreams = () => {
    const [scheduledStreams, setScheduledStreams] = useState<{ id: any; title: any; description: any; date: any; profile_view: { name: any; }[] }[]>([]);

    const fetchScheduledStreams = async () => {
        const { data, error } = await supabase
        .from('streams')
        .select(`
          id, 
          title, 
          description, 
          date,
          profile_view!streams_creator_id_fkey (name)
        `)
            
        console.log(data);
        if (error) {
            console.error('Error fetching scheduled streams:', error);
            return [];
        }

        

        
        setScheduledStreams(data);
    };

    useEffect(() => {
        fetchScheduledStreams();
        const subscription = supabase
        .channel('realtime-scheduled-streams')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'stream_sessions',
          },
          async (payload) => {
            console.log('Realtime update received:', payload);
            await fetchScheduledStreams();  // Refetch live streams when a session changes
          }
        )
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'streams',
          },
          async (payload) => {
            console.log('Realtime update received:', payload);
            await fetchScheduledStreams();  // Refetch live streams when a stream changes
          }
        )
        .subscribe();
  
      return () => {
        supabase.removeChannel(subscription);
      };
    }, []);

    return scheduledStreams;
};


export const fetchCreatorId = async (id: string) => {
  const { data, error } = await supabase
    .from('streams')
    .select('creator_id')
    .eq('id', id)
    .single();
    const userId = data?.creator_id as string;

  if (error) {
    console.error('Error fetching creator ID:', error);
    return null;
  }

  return userId;
}

export const fetchRoomName = async (id: string) => {
  const { data, error } = await supabase
    .from('stream_sessions')
    .select('room_name')
    .eq('stream_id', id)
    .single();
    const roomName = data?.room_name as string;

  if (error) {
    console.error('Error fetching room name:', error);
    return null;
  }

  return roomName;
}