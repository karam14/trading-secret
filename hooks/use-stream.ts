import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';

const supabase = createClient();

export const useStreamStatus = (roomName: string) => {
  const [streamStatus, setStreamStatus] = useState<'loading' | 'active' | 'ended'>('loading');

  useEffect(() => {
    const fetchInitialStatus = async () => {
      if (!roomName || roomName === '') {
        setStreamStatus('loading');
      }
      else{
      const { data, error } = await supabase
        .from('stream_sessions')
        .select('is_active')
        .eq('room_name', roomName)
        .single();
        

      if (data) {
        setStreamStatus(data.is_active ? 'active' : 'ended');
      }

      if (error) {
        console.error('Error fetching stream status:', error);
        setStreamStatus('ended');
      }

      console.log('Initial stream status:', data);
    };
}

    fetchInitialStatus();

    const subscription = supabase
      .channel('realtime stream status')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'stream_sessions',
          filter: `room_name=eq.${roomName}`,
        },
        async(payload) => {
          console.log('Realtime update received:', payload);

          const newStatus = payload.new.is_active ? 'active' : 'ended';
          console.log('New stream status:', newStatus);

          setStreamStatus(newStatus);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [roomName, streamStatus, setStreamStatus]);

  return streamStatus;
};
