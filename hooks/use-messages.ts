import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Database } from '@/types/supabase'; // Import Supabase types

const supabase = createClient();

// Define types for the chat messages based on Supabase types
type StreamInteraction = Database['public']['Tables']['stream_interactions']['Row'];
type Profile = Database['public']['Views']['profile_view']['Row'];

export const useChatMessages = (sessionId: string) => {
  const [messages, setMessages] = useState<
    (StreamInteraction & { userName: string })[]
  >([]);
  const [loading, setLoading] = useState(true); // State to track loading

  useEffect(() => {
    const fetchMessagesWithUsernames = async () => {
      // Fetch stream interactions related to the given sessionId
      const { data, error } = await supabase
        .from('stream_interactions')
        .select('*')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: true });

      if (data) {
        // Fetch corresponding usernames for each message
        const messagesWithUsernames = await Promise.all(
          data.map(async (msg) => {
            const { data: profileData } = await supabase
              .from('profile_view')
              .select('name')
              .eq('id', msg.user_id as string)
              .single();

            return { ...msg, userName: profileData?.name || 'Unknown' };
          })
        );

        setMessages(messagesWithUsernames);
      }

      if (error) {
        console.error('Error fetching messages:', error);
      }

      setLoading(false); // Set loading to false after fetching
    };

    fetchMessagesWithUsernames();

    // Listen to new incoming messages in real-time
    const subscription = supabase
      .channel('realtime messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'stream_interactions',
          filter: `session_id=eq.${sessionId}`,
        },
        async (payload) => {
          // Fetch the profile name for the new message
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('name')
            .eq('id', payload.new.user_id)
            .single();

          const userName = profileError ? 'Unknown' : profileData?.name || 'Unknown';
          const newMessage = { ...payload.new, userName };

          // Add the new message to the existing list of messages
          setMessages((prevMessages) => [
            ...prevMessages,
            {
              ...payload.new,
              userName,
            } as StreamInteraction & { userName: string },
          ]);
        }
      )
      .subscribe();

    // Cleanup the subscription when the component unmounts
    return () => {
      supabase.removeChannel(subscription);
    };
  }, [sessionId]);

  return { messages, loading };
};
