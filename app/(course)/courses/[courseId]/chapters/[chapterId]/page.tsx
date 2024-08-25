import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { File } from "lucide-react";

import { getChapter } from "@/actions/get-chapter";
import { Banner } from "@/components/banner";
import { Separator } from "@/components/ui/separator";
import { Preview } from "@/components/preview";

import { VideoPlayer } from "./_components/video-player";
import { CourseEnrollButton } from "./_components/course-enroll-button";
import { CourseProgressButton } from "./_components/course-progress-button";

const ChapterIdPage = async ({
  params
}: {
  params: { courseId: string; chapterId: string }
}) => {
  const supabase = createClient();
  
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    console.error("[ChapterIdPage] User not authenticated or error occurred:", userError);
    return redirect("/");
  }

  const userId = user.id;
  //console.log("[ChapterIdPage] Authenticated user ID:", userId);

  // Fetch chapter, course, and related data
  const chapterData = await getChapter({
    userId,
    chapterId: params.chapterId,
    courseId: params.courseId,
  });

  // Log the full chapter data object to inspect the returned data
  //console.log("[ChapterIdPage] getChapter response:", chapterData);

  const { chapter, course, muxData, attachments, nextChapter, userProgress, purchase } = chapterData;

  // Temporarily comment out the redirect logic to inspect the data without redirection
  // if (!chapter || !course) {
  //   console.error("[ChapterIdPage] No chapter or course data found, redirecting...");
  //   return redirect("/");
  // }

  const isLocked = !chapter?.is_free && !purchase;
  const completeOnEnd = !!purchase && !userProgress?.is_completed;

  //console.log("[ChapterIdPage] isLocked:", isLocked);
  //console.log("[ChapterIdPage] completeOnEnd:", completeOnEnd);

  return (
    <div>
      {userProgress?.is_completed && (
        <Banner
          variant="success"
          label="You already completed this chapter."
        />
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
            chapterId={params.chapterId}
            title={chapter?.title || "Untitled Chapter"}
            courseId={params.courseId}
            nextChapterId={nextChapter?.id}
            playbackId={muxData?.playback_id || ""}
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
                chapterId={params.chapterId}
                courseId={params.courseId}
                nextChapterId={nextChapter?.id}
                isCompleted={!!userProgress?.is_completed}
              />
            ) : (
              <CourseEnrollButton
                courseId={params.courseId}
                price={course?.price || 0}
              />
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
                    className='flex items-center p-3 w-full bg-sky-200 dark:bg-sky-800 text-sky-700 dark:text-sky-300 hover:underline'
                  >
                    <File className="mr-2" />
                    <p className="line-clamp-1">
                      {attachment.name}
                    </p>
                  </a>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default ChapterIdPage;
