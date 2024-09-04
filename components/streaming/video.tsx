"use client";

import { useRef, useState } from "react";
import { ConnectionState, Track, RemoteTrackPublication, Participant } from "livekit-client";
import {
  TrackReference,
  useConnectionState,
  useRemoteParticipant,
  useTracks,
} from "@livekit/components-react";
import { useEventListener } from "usehooks-ts";

import { VolumeControl } from "./volume-control";
import { FullscreenControl } from "./fullscreen-control";
import { MessageSquareMore } from "lucide-react";

import { Skeleton } from "@/components/ui/skeleton";
import { OfflineVideo } from "./offline-video";
import { LoadingVideo } from "./loading-video";
import { LiveVideo } from "./live-video";

interface VideoProps {
  hostName: string;
  hostIdentity: string;
  onChatToggle: () => void;
}

export const Video = ({ hostName, hostIdentity, onChatToggle }: VideoProps) => {
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

  // Fetch all participants with their tracks
  const tracks = useTracks([
    Track.Source.Camera,
    Track.Source.Microphone,
    Track.Source.ScreenShare,
  ]);

  // Deduplicate participants based on identity
  const uniqueParticipants = new Map<string, TrackReference>();
  tracks.forEach((track) => {
    const participant = track.participant as Participant;
    const identity = participant.identity;
    if (!uniqueParticipants.has(identity) && participant.name) {
      uniqueParticipants.set(identity, track);
    }
  });

  const filteredTracks = Array.from(uniqueParticipants.values());

  let content;

  if (connectionState === ConnectionState.Connected && filteredTracks.length === 0) {
    content = <OfflineVideo username={hostName} />;
  } else if (filteredTracks.length === 0) {
    content = <LoadingVideo label={connectionState} />;
  } else {
    const gridCols = filteredTracks.length === 1 ? "grid-cols-1" :
                     filteredTracks.length === 2 ? "grid-cols-2" :
                     filteredTracks.length <= 4 ? "grid-cols-2 grid-rows-2" :
                     "grid-cols-3 grid-rows-2";

    content = (
      <div className={`grid sm:grid-cols-1 md:${gridCols} gap-2 w-full`} style={{ height: "calc(100vh - 64px)" }}>
        {filteredTracks.map((track, index) => (
          <div key={index} className="relative w-full h-full flex items-center justify-center overflow-hidden">
            <LiveVideo participant={track.participant} volume={volume} />
            <div className="absolute top-2 sm:top-1 left-2 text-white text-xs sm:text-sm bg-black bg-opacity-50 px-2 py-1 rounded">
              {track.participant.name || "Unnamed Participant"}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div ref={wrapperRef} className="h-full w-full border-b group relative">
      {content}
      <div className="absolute bottom-0 left-0 right-0 flex h-14 items-center justify-between bg-gradient-to-r from-neutral-900 px-2 sm:px-4">
        <VolumeControl
          onChange={onVolumeChange}
          value={volume}
          onToggle={toggleMute}
        />
        <div className="flex items-center space-x-2 sm:space-x-4">
          <button
            onClick={onChatToggle}
            className="chat-toggle-button p-2 sm:p-3 rounded-full border border-gray-300"
          >
            <MessageSquareMore size={18} />
          </button>
          <FullscreenControl
            isFullscreen={isFullscreen}
            onToggle={toggleFullscreen}
          />
        </div>
      </div>
    </div>
  );
};

export const VideoSkeleton = () => {
  return (
    <div className="aspect-video border-x border-background">
      <Skeleton className="h-full w-full rounded-none" />
    </div>
  );
};
