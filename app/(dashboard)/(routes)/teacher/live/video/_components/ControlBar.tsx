import React from 'react';
import { ControlBarProps, ControlBar as LiveKitControlBar } from '@livekit/components-react';
import CustomDisconnectButton from './disconnectButton'; // Import your custom button
import { MessageSquareMore } from 'lucide-react';


interface CustomControlBarProps extends ControlBarProps {
  onChatToggle: () => void; // Add the chat toggle prop
  onDisconnect: () => void; // Add the disconnect prop
}

export const CustomControlBar: React.FC<CustomControlBarProps> = ({ onChatToggle,onDisconnect, ...props }) => {
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
        <CustomDisconnectButton onDisconnect={onDisconnect} />
      </div>
      <button onClick={onChatToggle} className="chat-toggle-button">
        <MessageSquareMore />
      </button>
    </div>
  );
};
