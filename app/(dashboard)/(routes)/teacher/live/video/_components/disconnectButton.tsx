
import React from 'react';
import { useRoomContext } from '@livekit/components-react';
import { Button } from '@/components/ui/button';
import { deleteRoom } from '@/utils/livekit/roomService';

const CustomDisconnectButton = () => {
  const room = useRoomContext();

  const handleDisconnect = async () => {
    try {
    

    await deleteRoom(room.name);

      room.disconnect();
      
    } catch (error) {
      console.error('Failed to remove the room and disconnect:', error);
    }
  };

  return (
    <div className='z-50'>
    <Button variant="destructive" onClick={handleDisconnect} className="pt-6 pb-6 pl-4 pr-4">
      End Session
    </Button>
    </div>
  );
};

export default CustomDisconnectButton;
