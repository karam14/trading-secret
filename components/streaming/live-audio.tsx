"use client";

import { useEffect, useRef, useState } from "react";
import { Participant, Track } from "livekit-client";
import { useTracks } from "@livekit/components-react";

interface LiveAudioProps {
  participant: Participant;
  volume: number;
}

export const LiveAudio = ({ participant, volume }: LiveAudioProps) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);
  const animationIdRef = useRef<number | null>(null);
  const [currentVolume, setCurrentVolume] = useState(volume);
  const [audioAllowed, setAudioAllowed] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const tracks = useTracks([Track.Source.Microphone]).filter(
    (track) => track.participant.identity === participant.identity
  );

  useEffect(() => {


    if (tracks.length > 0 && audioRef.current && !audioRef.current.srcObject) {
      const track = tracks[0].publication.track as Track;
      const mediaStream = new MediaStream([track.mediaStreamTrack]);
      audioRef.current.srcObject = mediaStream;
      console.log("MediaStream attached to audio element:", mediaStream);

      if (!audioContextRef.current) {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        audioContextRef.current = audioContext;

        const analyser = audioContext.createAnalyser();
        analyser.fftSize = 256;
        analyser.smoothingTimeConstant = 0.8;
        analyserRef.current = analyser;

        const dataArray = new Uint8Array(analyser.frequencyBinCount);
        dataArrayRef.current = dataArray;

        if (audioContext.state === "suspended") {
          audioContext.resume().then(() => {
            console.log("AudioContext resumed");
          });
        }
      }

      if (!sourceRef.current) {
        try {
          sourceRef.current = audioContextRef.current!.createMediaStreamSource(mediaStream);
          sourceRef.current.connect(analyserRef.current!);
          analyserRef.current!.connect(audioContextRef.current!.destination);
        } catch (error) {
          console.error("Error connecting audio source:", error);
        }
      }

      const drawVisualizer = () => {
        const canvas = canvasRef.current;
        const analyser = analyserRef.current;
        const dataArray = dataArrayRef.current;

        if (canvas && analyser && dataArray) {
          const ctx = canvas.getContext("2d");
          if (ctx) {
            analyser.getByteFrequencyData(dataArray);

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const barWidth = (canvas.width / dataArray.length) * 2.5;
            let barHeight;
            let x = 0;

            // Calculate the center of the canvas
            const centerY = canvas.height / 2;

            for (let i = 0; i < dataArray.length; i++) {
              barHeight = dataArray[i] / 2;

              ctx.fillStyle = `rgb(${barHeight + 100},50,50)`;

              // Draw the bars expanding from the center
              ctx.fillRect(x, centerY - barHeight / 2, barWidth, barHeight);

              x += barWidth + 1;
            }
          }
        }

        animationIdRef.current = requestAnimationFrame(drawVisualizer);
      };

      drawVisualizer();
    }

    return () => {
      if (tracks.length > 0 && audioRef.current) {
        const track = tracks[0].publication.track as Track;
        track.detach(audioRef.current);
      }

      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }

      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
        sourceRef.current = null;
      }
    };
  }, [tracks]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : currentVolume * 0.01;
      audioRef.current.muted = isMuted || currentVolume === 0;
      console.log("Audio element volume updated:", {
        volume: audioRef.current.volume,
        muted: audioRef.current.muted,
      });
    }
  }, [currentVolume, isMuted]);

  const handleVolumeChange = (newVolume: number) => {
    setCurrentVolume(newVolume);
  };

  const handleUserInteraction = () => {

    if (audioContextRef.current && audioContextRef.current.state === "suspended") {
        setAudioAllowed(true);
      audioContextRef.current.resume();
    }
  };


  return (
    <div className="w-full h-full flex flex-col items-center justify-center" onClick={handleUserInteraction}>
      {!audioAllowed && (
        <button
  onClick={handleUserInteraction}
  className="text-xs text-blue-500 underline rounded px-2 py-1 bg-transparent"
>
  Can't hear sound? Click here.
</button>

      )}
      <audio ref={audioRef} autoPlay={audioAllowed} controls={false} className="hidden" />
      <canvas ref={canvasRef} width="700" height="500" className="bg-black rounded-lg border border-red-500" />
      <div className="absolute bottom-4 left-4 flex gap-4">

      </div>
    </div>
  );
};
