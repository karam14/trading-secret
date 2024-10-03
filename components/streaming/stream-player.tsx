import { useState } from "react";
import { LiveKitRoom } from "@livekit/components-react";
import { cn } from "@/lib/utils";
import { useViewerToken } from "@/hooks/use-viewer-token";
import { Video, VideoSkeleton } from "./video";
import { Audio } from "./audio"; // Import the Audio component
import Chat from "./chat";

type CustomUser = {
  id: string;
  name: string;
  image_url: string | null;
};

interface StreamPlayerProps {
  user: CustomUser;
  roomName: string;
  ownId: string;
  sessionId: string;
  streamType: string; // Add streamType prop
}

export const StreamPlayer = ({
  user,
  roomName,
  ownId,
  sessionId,
  streamType, // Use the streamType prop
}: StreamPlayerProps) => {
  const [showChat, setShowChat] = useState(false); // Control the visibility of the chat
  const { token } = useViewerToken(user, roomName);

  const handleChatToggle = () => {
    setShowChat((prevShowChat) => !prevShowChat);
  };

  if (!token) {
    console.log("Loading...");
    return <StreamPlayerSkeleton />;
  }

  const wsUrl = process.env.NEXT_PUBLIC_LIVEKIT_URL || '';

  return (
    <div className="h-full flex flex-col min-[1280px]:flex-row">
      <LiveKitRoom
        token={token}
        serverUrl={wsUrl}
        className={cn(
          "transition-all duration-300",
          showChat ? "w-full min-[1280px]:w-3/4" : "w-full",
          "flex flex-col h-full"
        )}
      >
        <div className="flex-grow space-y-4 lg:overflow-y-auto hidden-scrollbar pb-10">
          {streamType === "voice-video" ? (
            <Video hostName={user.name} hostIdentity={user.name} onChatToggle={handleChatToggle} />
          ) : (
            <Audio hostName={user.name} hostIdentity={user.name} onChatToggle={handleChatToggle} />
          )}
        </div>
      </LiveKitRoom>
  
      {showChat && (
        <div style={{ height: "calc(100vh - 64px)" }} className="no-scrollbar w-full min-[1280px]:w-1/4 h-auto transition-all duration-300 ease-in-out bg-white dark:bg-gray-800 border-t min-[1280px]:border-t-0 min-[1280px]:border-l dark:border-gray-700 shadow-md flex-shrink-0 mt-4 min-[1280px]:mt-0 min-h-[80vh] overflow-y-hidden overflow-hidden">
          <Chat sessionId={sessionId || ''} userId={ownId || ''} onMinimize={handleChatToggle} />
        </div>
      )}
    </div>
  );
};

export const StreamPlayerSkeleton = () => {
  return (
    <div className="grid grid-cols-1 lg:gap-y-0 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-6 h-full">
      <div className="space-y-4 col-span-1 lg:col-span-2 xl:col-span-2 2xl:col-span-5 lg:overflow-y-auto hidden-scrollbar pb-10">
        <VideoSkeleton />
      </div>
    </div>
  );
};
