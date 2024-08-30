'use client';
import { fetchTokenCookie } from '@/actions/fetch-cookie';
import { 
  AudioConference,
  ControlBar, 
  GridLayout, 
  LiveKitRoom, 
  ParticipantTile, 
  RoomAudioRenderer, 
  useTracks,
  

} from '@livekit/components-react';
import { Track } from 'livekit-client';
import '@livekit/components-styles'; // Import default LiveKit styles
import { useEffect, useState } from 'react';
import getUser from '@/actions/get-user-client';
// @ts-expect-error - no types
import { useRouter } from 'nextjs-toploader/app';
import { generateToken } from '@/utils/livekit/generateToken';
import { VideoConference } from './_components/videoConference';
import { fetchSessionId } from '@/actions/fetch-session-id';
import { set } from 'zod';

const VideoLive = async () => {
    const [token, setToken] = useState<string | null>(null);
    const [user, setUser] = useState<any>(null);
    const [error, setError] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const wsUrl = process.env.NEXT_PUBLIC_LIVEKIT_URL || '';
    const router = useRouter();
    const [sessionId, setSessionId] = useState<string>('');

    useEffect(() => {
        (async () => {
          const urlParams = new URLSearchParams(window.location.search);


          const roomName = urlParams.get('room') as string;
          console.log('mazafakaa', roomName);
            const cookie = await fetchTokenCookie('livekit_token');
            const session = await fetchSessionId(roomName);
            
            const { user, error } = await getUser();

            if (cookie) {
                setToken(cookie);
            }
            if (user) {
                setUser(user);
            }
            if (session){
              setSessionId(session);
            }

            if (error) {
                setError(error);
            }

            setIsLoading(false);
        })();
    }, []);

    if (!isLoading && (!user || error)) {
        router.push('/login');
        return (
            <div>
                <h1>Unauthorized</h1>
                <p>You are not authorized to view this page</p>
            </div>
        );
    }

    if (!token && !isLoading) {
        const urlParams = new URLSearchParams(window.location.search);
        const roomName = urlParams.get('room') as string;
        console.log('roomName:', roomName);
        if (!roomName) {
            return (
                <div>
                    <h1>Invalid Room</h1>
                    <p>Room name is required</p>
                </div>
            );
        }

        await generateToken(roomName,user.id, 'audio').then((data) => {
            setToken(data);
        });
        

        return <p>Loading...</p>;
    }

    return (
        <LiveKitRoom
            audio={true}
            video={false}
            token={token || ''}
            serverUrl={wsUrl}
            data-lk-theme="default"
            style={{ height: '80vh' }}
        >
            <MyVideoConference sessionId={sessionId} userId={user?.id}/>
        </LiveKitRoom>
    );
};

function MyVideoConference({ sessionId, userId }: { sessionId: string, userId?: string | undefined }) {

  const tracks = useTracks([{ source: Track.Source.Microphone, withPlaceholder: true}], {
    onlySubscribed: false,
  });

  return (
    <>
      {sessionId && userId ? (
        <VideoConference sessionId={sessionId} userId={userId} />
      ) : (
        <p>Loading...</p>
      )}
    </>
  );
}

export default VideoLive;
