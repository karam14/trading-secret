import React from 'react';
import { ControlBarProps, ControlBar as LiveKitControlBar } from '@livekit/components-react';
import CustomDisconnectButton from './disconnectButton'; // Import your custom button
import { MessageSquareMore } from 'lucide-react';
import CustomUserDisconnectButton from './userDisconnetButton';


interface CustomControlBarProps extends ControlBarProps {
  onChatToggle: () => void; // Add the chat toggle prop
  onDisconnect: () => void; // Add the disconnect prop
  onUserDisconnect: () => void;
  isOwner: boolean;
}

export const CustomControlBar: React.FC<CustomControlBarProps> = ({ onChatToggle,onDisconnect,isOwner,onUserDisconnect, ...props }) => {
  return (
    <div className="flex justify-center">
      <div className="w-auto">
        <LiveKitControlBar
          {...props}
          controls={{
            ...props.controls,
         
          }}
        >
          {props.children}
        </LiveKitControlBar>
      </div>
      <div className="w-auto p-3">
        {isOwner ? (
          <CustomDisconnectButton onDisconnect={onDisconnect} />
        ) : (
          <>
          <CustomUserDisconnectButton onUserDisconnect={onUserDisconnect}/>
          <CustomDisconnectButton onDisconnect={onDisconnect} />
          </>
        )}
        
      </div>
      <button onClick={onChatToggle} className="chat-toggle-button">
        <MessageSquareMore />
      </button>
    </div>
  );
};
