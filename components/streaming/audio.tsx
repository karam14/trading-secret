"use client";

import { useRef, useState } from "react";
import { ConnectionState, Track } from "livekit-client";
import { useConnectionState, useTracks } from "@livekit/components-react";
import { useEventListener } from "usehooks-ts";

import { VolumeControl } from "./volume-control";
import { FullscreenControl } from "./fullscreen-control";
import { LiveAudio } from "./live-audio";

interface AudioProps {
  hostName: string;
  hostIdentity: string;
  onChatToggle: () => void;
}

export const Audio = ({ hostName, hostIdentity, onChatToggle }: AudioProps) => {
  const connectionState = useConnectionState();
  const wrapperRef = useRef<HTMLDivElement>(null);

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [volume, setVolume] = useState(50);

  const onVolumeChange = (value: number) => {
    setVolume(+value);
  };

  const toggleMute = () => {
    setVolume(volume === 0 ? 50 : 0);
  };

  const toggleFullscreen = () => {
    if (isFullscreen) {
      document.exitFullscreen();
    } else if (wrapperRef?.current) {
      wrapperRef.current.requestFullscreen();
    }
  };

  const handleFullscreenChange = () => {
    const isCurrentlyFullscreen = document.fullscreenElement !== null;
    setIsFullscreen(isCurrentlyFullscreen);
  };

  useEventListener("fullscreenchange", handleFullscreenChange, wrapperRef);

  const tracks = useTracks([Track.Source.Microphone]);

  let content;

  if (connectionState === ConnectionState.Connected && tracks.length === 0) {
    content = <p>{hostName} is offline.</p>;
  } else if (tracks.length === 0) {
    content = <p>Loading audio...</p>;
  } else {
    content = (
      <div className="flex items-center justify-center h-full w-full">
        {tracks.map((trackRef, index) => (
          <div key={index} className="relative w-full h-full flex items-center justify-center overflow-hidden">
            <LiveAudio participant={trackRef.participant} volume={volume} />
            <div className="absolute top-2 left-2 text-white text-xs bg-black bg-opacity-50 px-2 py-1 rounded">
              {trackRef.participant.name || "Unnamed Participant"}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div ref={wrapperRef} className="h-full w-full border-b group relative bg-gray-900">
      {content}
      <div className="flex h-14 items-center justify-between bg-gradient-to-r from-neutral-900 to-gray-800 px-2 sm:px-4">
        {/* <VolumeControl onChange={onVolumeChange} value={volume} onToggle={toggleMute} /> */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          <button
            onClick={onChatToggle}
            className="chat-toggle-button p-2 sm:p-3 rounded-full border border-gray-300 bg-gray-700 text-white"
          >
            Chat
          </button>
          {/* <FullscreenControl isFullscreen={isFullscreen} onToggle={toggleFullscreen} /> */}
        </div>
      </div>
    </div>
  );
};
