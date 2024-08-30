import {
  CarouselLayout,
  ConnectionStateToast,
  FocusLayout,
  FocusLayoutContainer,
  GridLayout,
  LayoutContextProvider,
  ParticipantTile,
  RoomAudioRenderer,
  ControlBar,
  useParticipants,
  WidgetState,
} from '@livekit/components-react';
import type { Participant } from 'livekit-client';
import { useEffect, useRef, useState } from 'react';
import { Track, RoomEvent } from 'livekit-client';
import { useCreateLayoutContext, usePinnedTracks, useTracks, useRoomContext } from '@livekit/components-react';
import { CustomControlBar } from './ControlBar';
import { client, getParticipant, listParticipants } from '@/utils/livekit/roomService';
import Chat from './chat'; // Import the Chat component

export function VideoConference({ sessionId, userId }: { sessionId: string, userId?: string }, ...props: any) {
  const [widgetState, setWidgetState] = useState<WidgetState>({
    showChat: false,
    unreadMessages: 0,
    showSettings: false,
  });
  type WidgetState = {
    showChat: boolean;
    unreadMessages: number;
    showSettings?: boolean | undefined;
  };
  const lastAutoFocusedScreenShareTrack = useRef(null);
  const layoutContext = useCreateLayoutContext();
  const room = useRoomContext();
  const hostIdentity = "host-username"; // Set the host's identity here

  const tracks = useTracks(
    [
      { source: Track.Source.Camera, withPlaceholder: true },
      { source: Track.Source.ScreenShare, withPlaceholder: false },
    ],
    { updateOnlyOn: [RoomEvent.ActiveSpeakersChanged], onlySubscribed: false },
  );

  const screenShareTracks = tracks.filter(
    (track) => track.publication && track.publication.source === Track.Source.ScreenShare
  );

  const focusTrack = usePinnedTracks(layoutContext)?.[0];

  async function fetchParticipants() {
    try {
      const participantsData = await listParticipants(room.name);
      console.log('Participants:', participantsData);
    } catch (error) {
      console.error('Failed to fetch participants:', error);
    }
  }

  useEffect(() => {
    if (room) {
      const handleParticipantDisconnected = (participant: { identity: string }) => {
        if (participant.identity === hostIdentity) {
          room.disconnect(); // End the session if the host leaves
        }
      };
      room.on(RoomEvent.ParticipantConnected, fetchParticipants);
      room.on(RoomEvent.ParticipantDisconnected, handleParticipantDisconnected);
      return () => {
        room.off(RoomEvent.ParticipantDisconnected, handleParticipantDisconnected);
      };
    }
  }, [room]);

  const handleChatToggle = () => {
    setWidgetState((prevState: WidgetState) => ({
      ...prevState,
      showChat: !prevState.showChat,
    }));
  };

  const handleMute = async (participantId: string) => {
    try {
      await fetch(`/api/mute-participant`, {
        method: 'POST',
        body: JSON.stringify({ roomName: 'your-room-name', participantId }),
      });
      // Optionally update UI or state
    } catch (error) {
      console.error('Failed to mute participant:', error);
    }
  };

  const handleKick = async (participantId: string) => {
    try {
      await fetch(`/api/kick-participant`, {
        method: 'POST',
        body: JSON.stringify({ roomName: 'your-room-name', participantId }),
      });
      // Optionally update UI or state
    } catch (error) {
      console.error('Failed to kick participant:', error);
    }
  };
  function isWeb(): boolean {
    return typeof document !== 'undefined';
  }

  return (
    <div className=' min-[1280px]:flex h-full w-full'>
      <div className="lk-video-conference flex h-full w-full " {...props}>
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
              <CustomControlBar
                controls={{ chat: false, leave: false, settings: !!widgetState.showSettings }}
                onChatToggle={handleChatToggle}
              />
            </div>
          </LayoutContextProvider>
        )}
        <RoomAudioRenderer />
        <ConnectionStateToast />
      </div>
  
      {isWeb() && widgetState.showChat && sessionId && userId && (
        <div className="w-full min-[1280px]:w-1/4 h-full md:h-auto transition-all duration-300 ease-in-out bg-white dark:bg-gray-800 border-t md:border-t-0 md:border-l dark:border-gray-700 shadow-md flex-shrink-0 mt-4 md:mt-0">
          <Chat sessionId={sessionId} userId={userId} onMinimize={handleChatToggle}/>
        </div>
      )}
    </div>
  );
  
}  