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

export const CustomControlBar: React.FC<CustomControlBarProps> = ({
  onChatToggle,
  onDisconnect,
  isOwner,
  onUserDisconnect,
  ...props
}) => {
  return (
    <div className="flex justify-center">
      <div className="w-full max-w-screen-sm flex flex-col items-center p-3">
        <LiveKitControlBar 
          {...props}
          controls={{
            ...props.controls,
          }}
          className="w-full" // Ensure the control bar takes up full width
        >
          {props.children}
        </LiveKitControlBar>
        <div className="flex gap-3 mt-3 w-full justify-center">
          {isOwner ? (
            <CustomDisconnectButton onDisconnect={onDisconnect} />
          ) : (
            <>
              <CustomUserDisconnectButton onUserDisconnect={onUserDisconnect} />
              <CustomDisconnectButton onDisconnect={onDisconnect} />
            </>
          )}
          <button
            onClick={onChatToggle}
            className="chat-toggle-button p-2 rounded-full border border-gray-300"
          >
            <MessageSquareMore />
          </button>
        </div>
      </div>
    </div>
  );
};
