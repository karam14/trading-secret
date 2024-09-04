'use client';
import { fetchTokenCookie } from '@/actions/fetch-cookie';
import { LiveKitRoom, useTracks } from '@livekit/components-react';
import { Track } from 'livekit-client';
import '@livekit/components-styles';
import { useEffect, useState } from 'react';
import getUser from '@/actions/get-user-client';
// @ts-expect-error - no types
import { useRouter } from 'nextjs-toploader/app';
import { generateToken } from '@/utils/livekit/generateToken';
import { VideoConference } from './_components/videoConference';
import { fetchSessionId } from '@/actions/fetch-session-id';
import { useStreamStatus } from '@/hooks/use-stream';
import { Button } from '@/components/ui/button';

const VideoLive = () => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [error, setError] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [roomName, setRoomName] = useState<string>('');
  const [sessionId, setSessionId] = useState<string>('');
  const wsUrl = process.env.NEXT_PUBLIC_LIVEKIT_URL || '';
  const router = useRouter();

  const streamStatus = useStreamStatus(roomName);

  useEffect(() => {
    const initialize = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const roomName = urlParams.get('room');
        if (!roomName) {
          throw new Error('Room name is required');
        }
        setRoomName(roomName);

        const { user, error } = await getUser();
        if (user) {
          setUser(user);
        } else {
          throw new Error(error?.message);
        }

        const token = await fetchTokenCookie('livekit_token');
        if (token) {
          setToken(token);
        } else {
          const generatedToken = await generateToken(roomName, user.id, 'audio');
          setToken(generatedToken);
        }

        const session = await fetchSessionId(roomName);
        if (session) {
          setSessionId(session);
        }

        setIsLoading(false);
      } catch (err) {
        console.error('Error during initialization:', err);
        setError(err);
        setIsLoading(false);
      }
    };

    initialize();
  }, []);

  useEffect(() => {
    if (roomName && streamStatus !== 'active') {
      return;
    }
  }, [roomName, streamStatus]);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return (
      <div>
        <h1>Error</h1>
        <p>{error.message}</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div>
        <h1>Unauthorized</h1>
        <p>You are not authorized to view this page</p>
      </div>
    );
  }

  if (!token) {
    return <p>Loading...</p>;
  }

  if (streamStatus !== 'active') {
    return (
      <div className="h-screen">
        <div className="flex justify-center items-center h-full w-full bg-gray-900">
          <div className="bg-gray-800 text-gray-300 p-8 rounded-xl shadow-xl text-center">
            <h1 className="text-3xl font-bold mb-4">Stream Ended</h1>
            <p className="text-lg mb-6">The stream has ended. Thank you for joining us!</p>
            <Button onClick={() => router.push('/teacher/creator')} variant="subtleGradient">
              Go to Creator Dashboard
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <LiveKitRoom
      audio={true}
      video={false}
      token={token}
      
      serverUrl={wsUrl}
      data-lk-theme="default"
      style={{ height: '80vh' }}
    >
      <MyVideoConference sessionId={sessionId} userId={user.id} />
    </LiveKitRoom>
  );
};

function MyVideoConference({ sessionId, userId }: { sessionId: string; userId?: string }) {
  const tracks = useTracks([{ source: Track.Source.Microphone, withPlaceholder: true }], {
    onlySubscribed: false,
  });

  return sessionId && userId ? (
    <VideoConference sessionId={sessionId} userId={userId} />
  ) : (
    <p>Loading...</p>
  );
}

export default VideoLive;
