'use client';

import { fetchCreatorId, fetchRoomName } from '@/actions/stream-page.actions';
import { StreamPlayer } from '@/components/streaming/stream-player';
import { getUserById } from '@/actions/get-user';
import { useEffect, useState } from 'react';
import getUser from '@/actions/get-user-client';
import { fetchSessionId } from '@/actions/fetch-session-id';
import { useStreamStatus } from '@/hooks/use-stream';
import { Button } from '@/components/ui/button';
// @ts-expect-error - no types
import { useRouter } from 'nextjs-toploader/app';

function LivePage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [roomName, setRoomName] = useState<string | ''>(''); // The room name is the ID of the stream'');
  const [isValidId, setIsValidId] = useState<boolean>(true);
  const [ownId, setOwnId] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null); // New state for error message
  const streamStatus = useStreamStatus(roomName);

  useEffect(() => {
    const fetchData = async () => {
      const url = window.location.href;
      const pathSegments = url.split('/');
      const id = pathSegments[pathSegments.length - 1];

      try {
        const userId = await fetchCreatorId(id);
        if (!userId) {
          setErrorMessage('البث غير موجود. قد يحدث هذا عندما تحاول الانضمام إلى بث انتهى بالفعل أو لم يتم جدولته بعد.');
          return;
        }

        const fetchedRoomName = await fetchRoomName(id);
        if (!fetchedRoomName) {
          setErrorMessage('خطأ في جلب اسم الغرفة.');
          return;
        }

        const fetchedUser = await getUserById(userId);
        if (!fetchedUser) {
          setErrorMessage('خطأ في جلب بيانات المستخدم.');
          return;
        }

        const { user: self } = await getUser();
        if (!self) {
          setErrorMessage('خطأ في جلب بيانات المستخدم.');
          return;
        }

        const sessionId = await fetchSessionId(fetchedRoomName) as string;
        if (!sessionId) {
          setErrorMessage('خطأ في جلب معرف الجلسة.');
          return;
        }

        setUser(fetchedUser);
        setRoomName(fetchedRoomName);
        setOwnId(self?.id);
        setSessionId(sessionId);
      } catch (error) {
        console.error('Error fetching data:', error);
        setErrorMessage('حدث خطأ أثناء جلب البيانات.');
      }
    };

    fetchData();
  }, []);

  if (errorMessage) {
    return (
<div className="h-screen">
  <div className="flex justify-center items-center h-full w-full bg-white dark:bg-gray-900">
    <div className="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-300 p-8 rounded-xl shadow-xl text-center">
      <h1 className="text-3xl font-bold mb-4">البث غير موجود</h1>
      <p className="text-lg mb-6">{errorMessage}</p>
      <Button onClick={() => router.push('/live')} variant="subtleGradient">
        العودة إلى البثوث المباشرة
      </Button>
    </div>
  </div>
</div>

    );
  }

  if (!user || !roomName || roomName === '') {
    return <div>Loading...</div>; // Loading state while data is being fetched
  }

  if (streamStatus !== 'active') {
    return (
<div className="h-screen">
  <div className="flex justify-center items-center h-full w-full bg-white dark:bg-gray-900">
    <div className="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-300 p-8 rounded-xl shadow-xl text-center">
            <h1 className="text-3xl font-bold mb-4">البث انتهى</h1>
            <p className="text-lg mb-6">لقد انتهى البث. شكرًا لانضمامك إلينا!</p>
            <Button onClick={() => router.push('/live')} variant="subtleGradient">
              العودة إلى البثوث المباشرة
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <StreamPlayer user={user} roomName={roomName} ownId={ownId || ''} sessionId={sessionId || ''} />
  );
}

export default LivePage;
