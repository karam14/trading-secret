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

const AudioLive = () => {
    const [token, setToken] = useState<string | null>(null);
    const [user, setUser] = useState<any>(null);
    const [error, setError] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const wsUrl = process.env.NEXT_PUBLIC_LIVEKIT_URL || '';
    const router = useRouter();

    useEffect(() => {
        (async () => {
            const cookie = await fetchTokenCookie('livekit_token');
            const { user, error } = await getUser();

            if (cookie) {
                setToken(cookie);
            }
            if (user) {
                setUser(user);
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
        generateToken(roomName,user.id, 'audio').then((data) => {
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
            <MyAudioConference />
        </LiveKitRoom>
    );
};

function MyAudioConference() {
    const tracks = useTracks([{ source: Track.Source.Microphone, withPlaceholder: true}], {
        onlySubscribed: false,
    });

    return (
      <AudioConference >
        </AudioConference>
    );
}

export default AudioLive;
