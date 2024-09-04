"use client";

import { useRef, useEffect } from "react";
import { Participant, Track } from "livekit-client";
import { useTracks } from "@livekit/components-react";

interface LiveVideoProps {
  participant: Participant;
  volume: number;
}

export const LiveVideo = ({ participant, volume }: LiveVideoProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useTracks([Track.Source.Camera, Track.Source.Microphone, Track.Source.ScreenShare])
    .filter((track) => track.participant.identity === participant.identity)
    .forEach((track) => {
      if (videoRef.current) {
        track.publication.track?.attach(videoRef.current);
      }
    });

  useEffect(() => {
    if (videoRef?.current) {
      videoRef.current.muted = volume === 0;
      videoRef.current.volume = volume * 0.01;
    }
  }, [volume]);

  return <video ref={videoRef} className="w-full h-full" />;
};
