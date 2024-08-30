"use client";

import axios from "axios";
import { CldVideoPlayer } from "next-cloudinary";
import 'next-cloudinary/dist/cld-video-player.css';
import { useState } from "react";
import { toast } from "react-hot-toast";
// @ts-expect-error - no types
import { useRouter } from 'nextjs-toploader/app';import { Loader2, Lock } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { cn } from "@/lib/utils";
import { useConfettiStore } from "@/hooks/use-confetti-store";
const supabase = createClient();
interface VideoPlayerProps {
  publicId?: string | null; // Cloudinary publicId replaces Mux playbackId
  courseId: string;
  chapterId: string;
  nextChapterId?: string;
  isLocked: boolean;
  completeOnEnd: boolean;
  title: string;
}

export const VideoPlayer = ({
  publicId,
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
    const userId = await supabase.auth.getUser()?.then(user => user.data.user?.id);

    try {
      if (completeOnEnd) {
        // Update the progress when the video ends
        await axios.put(`/api/courses/${courseId}/chapters/${chapterId}/progress`, {
          isCompleted: true,
        });

        // Show confetti if it's the last chapter
        if (!nextChapterId) {
          toast.success("Congratulations! You completed the course.");
          confetti.onOpen();
          router.refresh();
        }
        await supabase.from("user_course_progress").upsert({
          user_id: userId,
          course_id: courseId,
          completed: true,
        });

        toast.success("Progress updated");
        router.refresh();

        // Navigate to the next chapter if it exists
        if (nextChapterId) {
          router.push(`/courses/${courseId}/chapters/${nextChapterId}`);
          router.refresh();
        }
      }
    } catch (error) {
      console.error("[VideoPlayer] Error updating progress:", error);
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="flex justify-center items-center w-full h-auto bg-black rounded-lg overflow-hidden mb-4">
      <CldVideoPlayer
        id="sea-turtle" // Unique ID for the player
        src= {publicId! || "samples/sea-turtle"}
        onEnded={onEnd} // Cloudinary publicId as the source

    
      />
    
      {isLocked && (
        <div className="absolute flex items-center justify-center w-full h-full bg-black bg-opacity-75">
          <Lock className="w-12 h-12 text-white" />
          <span className="ml-2 text-white">Content Locked</span>
        </div>
      )}
    </div>
  );
};
