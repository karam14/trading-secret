"use client";

import { useEffect, useRef, useState } from "react";
import { Participant, Track } from "livekit-client";

interface AudioVisualizerProps {
  participant: Participant;
  volume: number;
}

export const AudioVisualizer = ({ participant, volume }: AudioVisualizerProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);

  const startAudioContext = () => {
    if (!audioContext) {
      const newAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      setAudioContext(newAudioContext);

      const analyser = newAudioContext.createAnalyser();
      analyser.fftSize = 256;
      analyserRef.current = analyser;

      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      dataArrayRef.current = dataArray;

      const track = participant.audioTrackPublications.values().next().value?.track;
      if (track) {
        const source = newAudioContext.createMediaStreamSource(new MediaStream([track.mediaStreamTrack]));
        source.connect(analyser);
      }
    }
  };

  useEffect(() => {
    if (audioContext) {
      const draw = () => {
        const canvas = canvasRef.current;
        const analyser = analyserRef.current;
        const dataArray = dataArrayRef.current;

        if (canvas && analyser && dataArray) {
          const ctx = canvas.getContext("2d");
          if (ctx) {
            analyser.getByteFrequencyData(dataArray);

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            ctx.fillStyle = "rgb(0, 0, 0)";
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            const barWidth = (canvas.width / dataArray.length) * 2.5;
            let barHeight;
            let x = 0;

            for (let i = 0; i < dataArray.length; i++) {
              barHeight = dataArray[i];

              ctx.fillStyle = `rgb(${barHeight + 100},50,50)`;
              ctx.fillRect(x, canvas.height - barHeight / 2, barWidth, barHeight / 2);

              x += barWidth + 1;
            }
          }
        }
        requestAnimationFrame(draw);
      };

      draw();
    }
  }, [audioContext, participant]);

  return (
    <div>
      {!audioContext ? (
        <button onClick={startAudioContext} className="p-2 bg-gray-700 text-white rounded">
          Start Audio Visualizer
        </button>
      ) : (
        <canvas ref={canvasRef} width="300" height="100" />
      )}
    </div>
  );
};
