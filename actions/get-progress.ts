import { createClient } from "@/utils/supabase/server"; // Adjust the path to your Supabase client utility

export const getProgress = async (
  userId: string,
  courseId: string
): Promise<number | null> => {
  const supabase = createClient();

  try {
    // Fetch published chapters for the course
    const { data: publishedChapters, error: chaptersError } = await supabase
      .from('chapters')
      .select('id')
      .eq('course_id', courseId)
      .eq('is_published', true);

    if (chaptersError) {
      console.error("[GET_PROGRESS] Error fetching chapters:", chaptersError);
      return null;
    }

    if (!publishedChapters || publishedChapters.length === 0) {
      return null; // No published chapters found
    }

    // Extract chapter IDs
    const publishedChapterIds = publishedChapters.map((chapter) => chapter.id);

    // Count completed chapters by the user
    const { count: validCompletedChapters, error: progressError } = await supabase
      .from('user_progress')
      .select('id', { count: 'exact' })
      .eq('user_id', userId)
      .in('chapter_id', publishedChapterIds)
      .eq('is_completed', true);

    if (progressError) {
      console.error("[GET_PROGRESS] Error fetching user progress:", progressError);
      return null;
    }

    // Calculate progress percentage
    const progressPercentage =
      validCompletedChapters !== null ? (validCompletedChapters / publishedChapters.length) * 100 : 0;
    return progressPercentage;
  } catch (error) {
    console.error("[GET_PROGRESS] Unexpected error:", error);
    return null;
  }
};
