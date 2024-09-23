
import React from 'react';
import { useRoomContext } from '@livekit/components-react';
import { Button } from '@/components/ui/button';
import { deleteRoom, updateSession } from '@/utils/livekit/roomService';
interface CustomDisconnectButtonProps  {
  onDisconnect: () => void; // Add the disconnect prop
}


const CustomDisconnectButton: React.FC<CustomDisconnectButtonProps> = ({onDisconnect}) => {
  const room = useRoomContext();

  const handleDisconnect = async () => {
    try {
    

    await deleteRoom(room.name);
    console.log(room.metadata);
    

      room.disconnect();
      onDisconnect();

    } catch (error) {
      console.error('Failed to remove the room and disconnect:', error);
    }
  };

  return (
    <div className='z-40'>
    <Button variant="destructive" onClick={handleDisconnect} className="pt-6 pb-6 pl-4 pr-4">
      End Session
    </Button>
    </div>
  );
};

export default CustomDisconnectButton;
