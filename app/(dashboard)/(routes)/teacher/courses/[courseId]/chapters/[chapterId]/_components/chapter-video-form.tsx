"use client";

import * as z from "zod";
import axios from "axios";
import { Pencil, PlusCircle, Video } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CldUploadWidget, CldVideoPlayer } from "next-cloudinary";
import 'next-cloudinary/dist/cld-video-player.css';

interface ChapterVideoFormProps {
  initialData: any;
  courseId: string;
  chapterId: string;
}

const formSchema = z.object({
  video_url: z.string().min(1),
  video_name: z.string().min(1),
});

export const ChapterVideoForm = ({
  initialData,
  courseId,
  chapterId,
}: ChapterVideoFormProps) => {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);

  const toggleEdit = () => setIsEditing((current) => !current);

  const onSubmit = async (video_url: string, video_name: string) => {
    try {
      console.log("Sending video data:", { video_url, video_name });

      await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}`, {
        video_url,
        video_name,
      });
      toast.success("Chapter updated");
      toggleEdit();
      router.refresh();
    } catch (error) {
      console.error("Error updating chapter:", error);
      toast.error("Something went wrong");
    }
  };
  const handleUpload = (result: any) => {
    if (result.event === "success") {
      const videoUrl = result.info.secure_url;
      const videoName = result.info.public_id;

      // Adding a small delay to ensure the upload completes processing
      setTimeout(() => {
        console.log("Video uploaded:", videoUrl);
        onSubmit(videoUrl,videoName);  // Trigger the submission after the delay
      }, 1000); // 1 second delay, adjust as needed
    }
  };

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4 dark:bg-gray-800 dark:text-slate-300">
      <div className="font-medium flex items-center justify-between">
        Chapter video
        <Button onClick={toggleEdit} variant="ghost">
          {isEditing ? "Cancel" : initialData.video_url ? "Edit video" : "Add a video"}
          {!isEditing && !initialData.video_url && (
            <PlusCircle className="h-4 w-4 ml-2" />
          )}
          {!isEditing && initialData.video_url && (
            <Pencil className="h-4 w-4 ml-2" />
          )}
        </Button>
      </div>
      {!isEditing && (
        !initialData.video_url ? (
          <div className="flex items-center justify-center h-60 bg-slate-200 rounded-md dark:bg-gray-800 dark:text-slate-300">
            <Video className="h-10 w-10 text-slate-500" />
          </div>
        ) : (
          <div className="relative aspect-video mt-2">
            <CldVideoPlayer
              id="uploaded-video"
              src={initialData.video_url}
            />
          </div>
        )
      )}
      {isEditing && (
        <CldUploadWidget
          uploadPreset="secrect_video"
          onSuccess={handleUpload}
          onError={() => toast.error("Upload failed. Please try again.")}
        >
          {({ open }) => (
            <Button variant="outline" onClick={() => open()}>
              Upload Video
            </Button>
          )}
        </CldUploadWidget>
      )}
      {initialData.video_url && !isEditing && (
        <div className="text-xs text-muted-foreground mt-2">
          Videos can take a few minutes to process. Refresh the page if the video does not appear.
        </div>
      )}
    </div>
  );
};
