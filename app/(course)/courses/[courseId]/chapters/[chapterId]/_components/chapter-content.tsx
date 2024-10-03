"use client";

import { useState, useEffect } from "react"; // Use client-side hooks
import { File } from "lucide-react";
import { Banner } from "@/components/banner";
import { Separator } from "@/components/ui/separator";
import { Preview } from "@/components/preview";
import { Skeleton } from "@/components/ui/skeleton";
import { VideoPlayer } from "./video-player";
import { CourseEnrollButton } from "./course-enroll-button";
import { CourseProgressButton } from "./course-progress-button";
import { Database } from '@/types/supabase'; // Replace with your actual import path

interface ChapterData {
    chapter: Database['public']['Tables']['chapters']['Row'] | null;
    course: { price: Database['public']['Tables']['courses']['Row']['price']; } | null;
    cloudinaryData: { public_id: Database['public']['Tables']['cloudinary_data']['Row']['public_id']; } | null;
    attachments: {
      id: Database['public']['Tables']['attachments']['Row']['id'];
      url: Database['public']['Tables']['attachments']['Row']['url'];
      name: Database['public']['Tables']['attachments']['Row']['name'];
    }[];
    nextChapter: { id: Database['public']['Tables']['chapters']['Row']['id']; } | null;
    userProgress: { is_completed: Database['public']['Tables']['user_progress']['Row']['is_completed']; } | null;
    purchase: boolean | null;
  }
  


const ChapterContent = ({ chapterData }: { chapterData: ChapterData }) => {
  const { chapter, course, cloudinaryData, attachments, nextChapter, userProgress, purchase } = chapterData;
  const [loading, setLoading] = useState(true);

  const isLocked = !chapter?.is_free && !purchase;
  const completeOnEnd = !!purchase && !userProgress?.is_completed;

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000); // Simulate loading time
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col max-w-4xl mx-auto pb-20">
        <Skeleton style={{ height: 400 }} /> {/* Simulated video skeleton */}
        <Skeleton className="mt-4" style={{ height: 50 }} /> {/* Title skeleton */}
        <Skeleton className="mt-2" style={{ height: 200 }} /> {/* Description skeleton */}
        <Skeleton className="mt-4" style={{ height: 100 }} /> {/* Attachments skeleton */}
      </div>
    );
  }

  return (
    <div>
      {userProgress?.is_completed && (
        <Banner variant="success" label="You already completed this chapter." />
      )}
      {isLocked && (
        <Banner
          variant="warning"
          label="You need to purchase this course to watch this chapter."
        />
      )}
      <div className="flex flex-col max-w-4xl mx-auto pb-20">
        <div className="p-4">
          <VideoPlayer
            chapterId={chapter?.id || ""}
            title={chapter?.title || "Untitled Chapter"}
            courseId={chapter?.course_id || ""}
            nextChapterId={nextChapter?.id}
            publicId={cloudinaryData?.public_id}
            isLocked={isLocked}
            completeOnEnd={completeOnEnd}
          />
        </div>
        <div>
          <div className="p-4 flex flex-col md:flex-row items-center justify-between">
            <h2 className="text-2xl font-semibold mb-2">
              {chapter?.title || "Untitled Chapter"}
            </h2>
            {purchase ? (
              <CourseProgressButton
                chapterId={chapter?.id || ""}
                courseId={chapter?.course_id || ""}
                nextChapterId={nextChapter?.id}
                isCompleted={!!userProgress?.is_completed}
              />
            ) : (
              <CourseEnrollButton courseId={chapter?.course_id || ""} price={course?.price || 0} />
            )}
          </div>
          <Separator />
          <div>
            <Preview value={chapter?.description || "No description available."} />
          </div>
          {!!attachments?.length && (
            <>
              <Separator />
              <div className="p-4">
                {attachments.map((attachment) => (
                  <a
                    href={attachment.url}
                    target="_blank"
                    key={attachment.id}
                    className="flex items-center p-3 w-full bg-sky-200 dark:bg-sky-800 text-sky-700 dark:text-sky-300 hover:underline"
                  >
                    <File className="mr-2" />
                    <p className="line-clamp-1">{attachment.name}</p>
                  </a>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChapterContent;
