import { useEffect, useState } from 'react';
import { Track, RoomEvent } from 'livekit-client';
import {
  CarouselLayout,
  ConnectionStateToast,
  FocusLayout,
  FocusLayoutContainer,
  GridLayout,
  LayoutContextProvider,
  ParticipantTile,
  RoomAudioRenderer,
  useCreateLayoutContext,
  usePinnedTracks,
  useTracks,
  WidgetState,
} from '@livekit/components-react';
import { CustomControlBar } from '@/components/streaming/ControlBar';
import Chat from '@/components/streaming/chat';
import { Button } from '@/components/ui/button';
import { checkSessionOwner } from '@/actions/check-session';
import { useSearchParams } from 'next/navigation';
import { useStreamStatus } from '@/hooks/use-stream';
import { updateSession } from '@/utils/livekit/roomService';
// @ts-expect-error - no types
import { useRouter } from 'nextjs-toploader/app';

export function VideoConference({ sessionId, userId = '' }: { sessionId: string; userId?: string }, ...props: any) {
  const [widgetState, setWidgetState] = useState<WidgetState>({
    showChat: false,
    unreadMessages: 0,
    showSettings: false,
  });
  const [isOwner, setIsOwner] = useState<boolean>(false);
  const [userDisconnected, setUserDisconnected] = useState<boolean>(false);
  const router = useRouter();

  const searchParams = useSearchParams();
  const roomName = searchParams.get('room');

  const tracks = useTracks(
    [
      { source: Track.Source.Camera, withPlaceholder: true },
      { source: Track.Source.ScreenShare, withPlaceholder: false },
    ],
  );
  
  const layoutContext = useCreateLayoutContext();
  const focusTrack = usePinnedTracks(layoutContext)?.[0];

  useEffect(() => {
    const fetchSessionOwner = async () => {
      if (roomName ) {
        const owner = await checkSessionOwner(roomName, userId);
        //  setIsOwner(owner);
      }
    };
    fetchSessionOwner();
  }, [roomName, userId]);



  const handleChatToggle = () => {
    setWidgetState((prevState) => ({
      ...prevState,
      showChat: !prevState.showChat,
    }));
  };

  const handleDisconnect = async () => {
    if (!roomName) {
      return;
    }
  };
const handleUserDisconnect = () => {
  setUserDisconnected(true);
}
    

  if (!roomName) {
    return (
      <div className="flex justify-center items-center h-full w-full bg-gray-900">
        <div className="bg-gray-800 text-gray-300 p-8 rounded-xl shadow-xl text-center">
          <h1 className="text-3xl font-bold mb-4">No Room Specified</h1>
          <p className="text-lg mb-6">
            You are accessing the live page without specifying a room name. Please check the URL or
            contact support.
          </p>
          <Button
            onClick={() => (window.location.href = '/')}
            variant="subtleGradient"
          >
            Go to Homepage
          </Button>
        </div>
      </div>
    );
  }


  function isWeb(): boolean {
    return typeof document !== 'undefined';
  }


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
      <div className="lk-video-conference flex h-full w-full" {...props}>
        {isWeb() && (
          <LayoutContextProvider value={layoutContext} onWidgetChange={setWidgetState}>
            <div className="lk-video-conference-inner flex-grow w-full">
              {!focusTrack ? (
                <div className="lk-grid-layout-wrapper flex-grow">
                  <GridLayout tracks={tracks}>
                    <ParticipantTile />
                  </GridLayout>
                </div>
              ) : (
                <div className="lk-focus-layout-wrapper flex-grow">
                  <FocusLayoutContainer>
                    <CarouselLayout tracks={tracks}>
                      <ParticipantTile />
                    </CarouselLayout>
                    {focusTrack && <FocusLayout trackRef={focusTrack} />}
                  </FocusLayoutContainer>
                </div>
              )}
              {isOwner ? (
                <CustomControlBar
                  controls={{ chat: true,leave: false,  settings: !!widgetState.showSettings }}
                  onChatToggle={handleChatToggle}
                  onDisconnect={handleDisconnect}
                  onUserDisconnect={handleUserDisconnect}
                  isOwner={isOwner}
                />
              ) : (
                <CustomControlBar
                  controls={{ chat: false, leave: false, settings: !!widgetState.showSettings }}
                  onChatToggle={handleChatToggle}
                  onDisconnect={handleDisconnect}
                  onUserDisconnect={handleUserDisconnect}

                  isOwner={isOwner}

                />
              )}

            </div>
          </LayoutContextProvider>
        )}
        <RoomAudioRenderer />
        <ConnectionStateToast />
      </div>

      {isWeb() && widgetState.showChat && sessionId && userId && (
        <div className="w-full min-[1280px]:w-1/4 h-full md:h-auto transition-all duration-300 ease-in-out bg-white dark:bg-gray-800 border-t md:border-t-0 md:border-l dark:border-gray-700 shadow-md flex-shrink-0 mt-4 md:mt-0">
          <Chat sessionId={sessionId} userId={userId} onMinimize={handleChatToggle} />
        </div>
      )}
    </div>
      )}
    </>
  );


}

