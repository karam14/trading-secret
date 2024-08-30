import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';

const supabase = createClient();

export const useChatMessages = (sessionId: string) => {
  const [messages, setMessages] = useState<
    {
      id: string;
      session_id: string;
      user_id: string;
      message: string;
      created_at: string;
      userName: string;
    }[]
  >([]);

  useEffect(() => {
    const fetchMessagesWithUsernames = async () => {
      const { data, error } = await supabase
        .from('stream_interactions')
        .select('*')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: true });

      if (data) {
        const messagesWithUsernames = await Promise.all(
          data.map(async (msg) => {
            const { data: profileData } = await supabase
              .from('profiles')
              .select('name')
              .eq('id', msg.user_id)
              .single();

            return { ...msg, userName: profileData?.name || 'Unknown' };
          })
        );

        setMessages(messagesWithUsernames);
      }

      if (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchMessagesWithUsernames();

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
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('name')
            .eq('id', payload.new.user_id)
            .single();
          const userName = profileError ? 'Unknown' : profileData?.name || 'Unknown';
          const newMessage = { ...payload.new, id: payload.new.id, session_id: payload.new.session_id, user_id: payload.new.user_id, message: payload.new.message, created_at: payload.new.created_at };
          setMessages((prevMessages) => [...prevMessages, { ...newMessage, userName: userName || 'Unknown' }]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [sessionId]);

  return messages;
};
