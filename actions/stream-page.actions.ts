import { Database } from '@/types/supabase'; // Import generated types
import { createClient } from '@/utils/supabase/client';
import { useEffect, useState } from 'react';

const supabase = createClient();

type LiveStream = Database['public']['Tables']['streams']['Row'] & {
  profile_view: {
    name: string | null;
    image_url: string | null;
  };
  stream_sessions: {
    is_active: boolean | null;
  }[];
};

type ScheduledStream = Database['public']['Tables']['streams']['Row'] & {
  profile_view: {
    name: string | null;
  };
};

// Fetch live streams based on active sessions
export const useLiveStreams = () => {
  const [liveStreams, setLiveStreams] = useState<LiveStream[]>([]);

  const fetchLiveStreams = async () => {
    const { data, error } = await supabase
      .from('streams')
      .select(`
        id, 
        title, 
        description, 
        is_live,
        created_at,
        creator_id,
        date,
        stream_key,
        type,
        stream_sessions (is_active),
        profile_view!streams_creator_id_fkey (name, image_url)
      `)
      .filter('stream_sessions.is_active', 'eq', true);

    if (error) {
      console.error('Error fetching live streams:', error);
      return [];
    }

    const activeStreams = data?.filter((stream: any): stream is LiveStream => 
      stream.stream_sessions.some((session: { is_active: any; }) => session.is_active) && stream.profile_view !== null
    );
    setLiveStreams(activeStreams || []);
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
        async (payload: any) => {
          console.log('Realtime update received:', payload);
          await fetchLiveStreams();
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'streams',
        },
        async (payload: any) => {
          console.log('Realtime update received:', payload);
          await fetchLiveStreams();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  return liveStreams;
};

// Fetch scheduled streams
export const useScheduledStreams = () => {
  const [scheduledStreams, setScheduledStreams] = useState<ScheduledStream[]>([]);

  const fetchScheduledStreams = async () => {
    const { data, error } = await supabase
      .from('streams')
      .select(`
        *,
        profile_view!streams_creator_id_fkey (name)
      `);

    if (error) {
      console.error('Error fetching scheduled streams:', error);
      return [];
    }

    const validScheduledStreams = (data || []).filter((stream: any): stream is ScheduledStream => stream.profile_view !== null);
    setScheduledStreams(validScheduledStreams);
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
          table: 'streams',
        },
        async (payload: any) => {
          console.log('Realtime update received:', payload);
          await fetchScheduledStreams();
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

export const fetchStreamType = async (session_id: string) => {
  // Define the expected shape of the data
  type StreamTypeResponse = {
    stream_id: string;
    streams: {
      type: string;
    };
  };

  // Perform the query
  const { data, error } = await supabase
    .from('stream_sessions')
    .select('stream_id, streams(type)')
    .eq('id', session_id)
    .single();

  if (error) {
    console.error('Error fetching stream type:', error);
    return null;
  }

  return data?.streams?.type;
};
