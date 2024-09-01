import * as React from 'react';


import type { WidgetState } from '@livekit/components-core';

import { Track } from 'livekit-client';
import { CustomControlBar } from '@/components/streaming/ControlBar';
import { on } from 'events';
import { LayoutContextProvider, ParticipantAudioTile, TrackLoop, useTracks } from '@livekit/components-react';
import Chat from '@/components/streaming/chat';
import { updateSession } from '@/utils/livekit/roomService';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
// @ts-expect-error - no types
import { useRouter } from 'nextjs-toploader/app';
import { checkSessionOwner } from '@/actions/check-session';
import { Button } from '@/components/ui/button';
/** @public */
export interface AudioConferenceProps extends React.HTMLAttributes<HTMLDivElement> {
    sessionId: string;
    userId: string;
}

/**
 * This component is the default setup of a classic LiveKit audio conferencing app.
 * It provides functionality like switching between participant grid view and focus view.
 *
 * @remarks
 * The component is implemented with other LiveKit components like `FocusContextProvider`,
 * `GridLayout`, `ControlBar`, `FocusLayoutContainer` and `FocusLayout`.
 *
 * @example
 * ```tsx
 * <LiveKitRoom>
 *   <AudioConference />
 * <LiveKitRoom>
 * ```
 * @public
 */
export function AudioConference({ sessionId,userId = '',...props }: AudioConferenceProps) {
  const [widgetState, setWidgetState] = React.useState<WidgetState>({
    showChat: false,
    unreadMessages: 0,
  });
  const [isOwner, setIsOwner] = useState<boolean>(false);
  const [userDisconnected, setUserDisconnected] = useState<boolean>(false);
  const router = useRouter();

  const searchParams = useSearchParams();
  const roomName = searchParams.get('room');
  useEffect(() => {
    const fetchSessionOwner = async () => {
      if (roomName ) {
        const owner = await checkSessionOwner(roomName, userId);
        //  setIsOwner(owner);
      }
    };
    fetchSessionOwner();
  }, [roomName, userId]);

  const audioTracks = useTracks([Track.Source.Microphone]);
  const handleDisconnect = async () => {
    if (!roomName) {
      return;
    }
    await updateSession(roomName, false); // Update stream status to inactive in the database
  };
const handleUserDisconnect = () => {
  setUserDisconnected(true);
}

const handleChatToggle = () => {
    setWidgetState((prevState) => ({
      ...prevState,
      showChat: !prevState.showChat,
    }));
  };
return (
    <>
      {userDisconnected ? (
     <div className="h-screen">
     <div className="flex justify-center items-center h-full w-full bg-gray-900">
       <div className="bg-gray-800 text-gray-300 p-8 rounded-xl shadow-xl text-center">
         <h1 className="text-3xl font-bold mb-4">Stream Ended</h1>
         <p className="text-lg mb-6">You have left the live stream. Thank you for joining us!</p>
         <Button onClick={() => router.push('/teacher/creator')} variant="subtleGradient">
           Go to Creator Dashboard
         </Button>
       </div>
     </div>
   </div>

      ) :(
        <div className="min-[1280px]:flex h-full w-full">
        <div className="lk-audio-conference  flex  h-full w-full" {...props}>
    <LayoutContextProvider onWidgetChange={setWidgetState}>
    <div className='flex flex-col w-full'>

        <div className="lk-audio-conference-stage flex-grow w-full">
        <div className="flex-grow">
          <TrackLoop tracks={audioTracks}>
            <ParticipantAudioTile />
          </TrackLoop>
        </div>
        </div>
        <CustomControlBar
          controls={{ microphone: true, screenShare: false, camera: false, chat: false, leave: false ,settings: !!widgetState.showSettings }}
            onChatToggle={() => setWidgetState({ ...widgetState, showChat: !widgetState.showChat })}
            onDisconnect={handleDisconnect}
            onUserDisconnect={handleUserDisconnect}
            isOwner={isOwner}

        />
        </div>
        {widgetState.showChat && (
                    <div className="w-full min-[1280px]:w-1/4 h-full md:h-auto transition-all duration-300 ease-in-out bg-white dark:bg-gray-800 border-t md:border-t-0 md:border-l dark:border-gray-700 shadow-md flex-shrink-0 mt-4 md:mt-0">

             <Chat sessionId={sessionId} userId={userId}   onMinimize={handleChatToggle}/>
             </div>
             )}

      
    </LayoutContextProvider>
    </div>

    </div>)}
    </>
  );
}


