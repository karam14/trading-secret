
import React from 'react';
import { useRoomContext } from '@livekit/components-react';
import { Button } from '@/components/ui/button';
import { deleteRoom } from '@/utils/livekit/roomService';

interface CustomDisconnectButtonProps  {
  onUserDisconnect: () => void; // Add the disconnect prop
}


const CustomUserDisconnectButton: React.FC<CustomDisconnectButtonProps> = ({ onUserDisconnect }) => {
  const room = useRoomContext();

  const handleDisconnect = async () => {
    try {
      room.disconnect();
      onUserDisconnect();

    } catch (error) {
      console.error('Failed to remove the room and disconnect:', error);
    }
  };

  return (
    <div className='z-50'>
    <Button variant="destructive" onClick={handleDisconnect} className="pt-6 pb-6 pl-4 pr-4">
      Leave Stream
    </Button>
    </div>
  );
};

export default CustomUserDisconnectButton;
