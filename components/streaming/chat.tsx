import React, { useState, useEffect, useRef } from 'react';
import { useChatMessages } from '@/hooks/use-messages';
import { createClient } from '@/utils/supabase/client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { X } from 'lucide-react';

interface ChatProps {
  sessionId: string;
  userId: string;
  onMinimize?: () => void; // Add a prop for minimizing the chat
}

const Chat: React.FC<ChatProps> = ({ sessionId, userId, onMinimize }) => {
  const supabase = createClient();
  const [newMessage, setNewMessage] = useState('');
  const [isAtBottom, setIsAtBottom] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const { messages, loading } = useChatMessages(sessionId); // Use loading from the hook
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const sendMessage = async () => {
    if (newMessage.trim()) {
      await supabase
        .from('stream_interactions')
        .insert([{ session_id: sessionId, user_id: userId, message: newMessage }]);
      setNewMessage(''); // Clear input field after sending the message
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      sendMessage();
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    setIsAtBottom(true);
    setUnreadCount(0);
  };

  const handleScroll = () => {
    if (chatContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
      const isUserAtBottom = scrollTop + clientHeight >= scrollHeight - 5;
      setIsAtBottom(isUserAtBottom);

      if (isUserAtBottom) {
        setUnreadCount(0);
      }
    }
  };

  useEffect(() => {
    if (isAtBottom) {
      scrollToBottom();
    } else {
      setUnreadCount((prev) => prev + 1);
    }
  }, [messages]);

  return (
    <div className="flex flex-col h-full p-4 border rounded-lg shadow-md bg-white dark:bg-gray-800 dark:border-gray-700">
      {/* Top bar with minimize button */}
      <div className="flex items-center justify-between p-2 bg-gray-200 dark:bg-gray-700 rounded-t-md">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Chat</h2>
        <Button
          variant="softDark"
          size="sm"
          onClick={onMinimize}
          aria-label="Minimize chat"
        >
          <X className="w-5 h-5 text-gray-600 dark:text-gray-300" />
        </Button>
      </div>

      <div
        className="flex-grow overflow-y-auto mb-4"
        onScroll={handleScroll}
        ref={chatContainerRef}
      >
        {loading ? (
          <div className="space-y-2">
            <Skeleton className="p-3 mb-2 bg-gray-100 dark:bg-gray-700 break-words h-28 w-full rounded-xl" />
            <Skeleton className="p-3 mb-2  bg-gray-100 dark:bg-gray-700 break-words h-28 w-full rounded-xl" />
            <Skeleton className="p-3 mb-2  bg-gray-100 dark:bg-gray-700 break-words h-28 w-full rounded-xl" />
            <Skeleton className="p-3 mb-2  bg-gray-100 dark:bg-gray-700 break-words h-28 w-full rounded-xl" />
            <Skeleton className="p-3 mb-2 bg-gray-100 dark:bg-gray-700 break-words h-28 w-full rounded-xl" />
            <Skeleton className="p-3 mb-2  bg-gray-100 dark:bg-gray-700 break-words h-28 w-full rounded-xl" />
          </div>
        ) : (
          messages.length > 0 ? (
            messages.map((msg) => (
              <div key={msg.id} className="p-3 mb-2 rounded-md bg-gray-100 dark:bg-gray-700 break-words">
                <strong className="text-blue-600 dark:text-blue-400">{msg.userName}:</strong>
                <p className="ml-2 text-gray-800 dark:text-gray-300">{msg.message}</p>
                <span className="text-gray-500 dark:text-gray-400 text-xs">
                  {new Date(msg.created_at).toLocaleTimeString()}
                </span>
              </div>
            ))
          ) : (
            <div className="flex justify-center items-center h-full">
              <p className="text-gray-500 dark:text-gray-400">No messages yet. Start the conversation!</p>
            </div>
          )
        )}
        <div ref={messagesEndRef} />
      </div>

      {unreadCount > 0 && (
        <div className="mb-2 text-center">
          <Button onClick={scrollToBottom} variant="secondary">
            {unreadCount} new {unreadCount > 1 ? 'messages' : 'message'}
          </Button>
        </div>
      )}

      <div className="flex items-center gap-2">
        <Input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
          onKeyPress={handleKeyPress} // Add this line to handle "Enter" key press
          className="flex-grow bg-white dark:bg-gray-900 dark:text-gray-200 dark:placeholder-gray-400"
        />
        <Button
          onClick={sendMessage}
          className="bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white"
        >
          Send
        </Button>
      </div>
    </div>
  );
};

export default Chat;
