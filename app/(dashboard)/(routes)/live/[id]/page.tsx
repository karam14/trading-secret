'use client';
import { fetchCreatorId, fetchRoomName } from '@/actions/stream-page.actions';
import { StreamPlayer } from '@/components/streaming/stream-player';
import { getUserById } from '@/actions/get-user';
import { useEffect, useState } from 'react';
import getUser from '@/actions/get-user-client';
import { fetchSessionId } from '@/actions/fetch-session-id';
import { set } from 'date-fns';

function LivePage() {
  const [user, setUser] = useState(null);
  const [roomName, setRoomName] = useState<string | null>(null);
  const [isValidId, setIsValidId] = useState<boolean>(true);
  const [ownId, setOwnId] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      // Get the full URL and extract the last part as the ID
      const url = window.location.href;
      const pathSegments = url.split('/');
      const id = pathSegments[pathSegments.length - 1];

    //   // Check if the id seems valid (you can use a regex or simply check length, etc.)
    //   if (!id || !/^[\da-f]{8}-([\da-f]{4}-){3}[\da-f]{12}$/i.test(id)) {
    //     setIsValidId(false);
    //     window.location.href = '/404'; // Redirect to 404 if the ID is invalid
    //     return;
    //   }

      try {
        const userId = await fetchCreatorId(id);
        if (!userId) {
            console.log('Error fetching creator ID:');
        //   window.location.href = '/404';
          return;
        }

        const fetchedRoomName = await fetchRoomName(id);
        if (!fetchedRoomName) {
            console.log('Error fetching room name:');
        //   window.location.href = '/404';
          return;
        }

        const fetchedUser = await getUserById(userId);
        if (!fetchedUser) {
            console.log('Error fetching user:');
        //   window.location.href = '/404';
          return;
        }
        const {user: self , error} = await getUser();
        
        const sessionId = await fetchSessionId(fetchedRoomName) as string;
        if (!sessionId) {
            console.log('Error fetching session ID:');
        //   window.location.href = '/404';
          return;
        }
        if (!self) {
            console.log('Error fetching user:');  
          return;
        }
      

        setUser(fetchedUser);
        setRoomName(fetchedRoomName);
        setOwnId(self?.id);
        setSessionId(sessionId);
      } catch (error) {
        console.error('Error fetching data:', error);
        // window.location.href = '/404';
      }
    };

    fetchData();
  }, []);

  if (!isValidId) {
    return <div>Invalid stream ID. Redirecting...</div>;
  }

  if (!user || !roomName) {
    return <div>Loading...</div>; // Loading state while data is being fetched
  }

  return (
    <StreamPlayer user={user} roomName={roomName} ownId={ownId || ''} sessionId={sessionId || ''} />
    
  );
}

export default LivePage;
