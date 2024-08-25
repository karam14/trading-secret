"use client";

import axios from "axios";
import MuxPlayer from "@mux/mux-player-react";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Loader2, Lock } from "lucide-react";

import { cn } from "@/lib/utils";
import { useConfettiStore } from "@/hooks/use-confetti-store";

interface VideoPlayerProps {
  playbackId?: string | null;
  courseId: string;
  chapterId: string;
  nextChapterId?: string;
  isLocked: boolean;
  completeOnEnd: boolean;
  title: string;
}

export const VideoPlayer = ({
  playbackId,
  courseId,
  chapterId,
  nextChapterId,
  isLocked,
  completeOnEnd,
  title,
}: VideoPlayerProps) => {
  const [isReady, setIsReady] = useState(false);
  const router = useRouter();
  const confetti = useConfettiStore();

  const onEnd = async () => {
    try {
      //console.log("[VideoPlayer] Video ended. completeOnEnd:", completeOnEnd);
  
      if (completeOnEnd) {
        //console.log("[VideoPlayer] Sending progress update request...");
  
        // Update the progress when the video ends
        const response = await axios.put(`/api/courses/${courseId}/chapters/${chapterId}/progress`, {
          isCompleted: true,
        });
  
        //console.log("[VideoPlayer] Progress update response:", response.data);
  
        // Show confetti if it's the last chapter
        if (!nextChapterId) {
          confetti.onOpen();
        }
  
        toast.success("Progress updated");
        router.refresh();
  
        // Navigate to the next chapter if it exists
        if (nextChapterId) {
          router.push(`/courses/${courseId}/chapters/${nextChapterId}`);
        }
      }
    } catch (error) {
      console.error("[VideoPlayer] Error updating progress:", error);
      toast.error("Something went wrong. Please try again.");
    }
  };
  

  return (
    <div className="relative aspect-video">
      {!isReady && !isLocked && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-800 dark:bg-slate-200">
          <Loader2 className="h-8 w-8 animate-spin text-secondary" />
        </div>
      )}
      {isLocked && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-800 dark:bg-slate-200 flex-col gap-y-2 text-secondary">
          <Lock className="h-8 w-8" />
          <p className="text-sm">This chapter is locked</p>
        </div>
      )}
      {!isLocked && playbackId && (
        <MuxPlayer
          streamType="on-demand"
          playbackId={playbackId}
          title={title}
          onCanPlay={() => setIsReady(true)} // Set isReady to true when the video is ready to play
          onEnded={onEnd}
          className={cn(!isReady && "hidden")}
          autoPlay
        />
      )}
    </div>
  );
};
