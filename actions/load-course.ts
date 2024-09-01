// src/app/actions/courseActions.ts
import { createClient } from "@/utils/supabase/server"; // Server-side Supabase client
import { getProgress } from "./get-progress";

export async function fetchCourseWithPublishedChapters(courseId: string) {
  const supabase = createClient();

  // Step 1: Fetch the course with its published chapters ordered by position
  const { data: course, error: courseError } = await supabase
    .from('courses')
    .select(`
      id,
      chapters(id, is_published, position)
    `)
    .eq('id', courseId)
    .single();

  if (courseError || !course) {
    console.error("[fetchCourseWithPublishedChapters] Error fetching course:", courseError);
    return null;
  }

  // Step 2: Filter out unpublished chapters and sort by position
  const publishedChapters = course.chapters
    .filter((chapter: { is_published: boolean }) => chapter.is_published)
    .sort((a: { position: number }, b: { position: number }) => a.position - b.position);

  return {
    courseId: course.id,
    firstChapterId: publishedChapters.length > 0 ? publishedChapters[0].id : null,
  };
}

export async function fetchUserCourseData(courseId: string, userId: string) {
  const supabase = createClient();

// Fetch the course with its chapters and user's progress
const { data: course, error: courseError } = await supabase
  .from('courses')
  .select(`
    id,
    title,
    description,
    is_published,
    created_at,
    updated_at,
    categoryId,
    chapters(
      id,
      title,
      position,
      is_published,
      is_free,
      userProgress:user_progress(
        id,
        user_id,
        chapter_id,
        is_completed
      )
    )
  `)
  .eq('id', courseId)
  .single();

// Ensure chapters are sorted by their position
if (course && course.chapters) {
  course.chapters.sort((a, b) => a.position - b.position);
}

  if (courseError || !course) {
    console.error("[fetchCourseData] Error fetching course:", courseError);
    return null;
  }

  // Fetch the user's progress
  const progressCount = await getProgress(userId, courseId);

  return { course, progressCount };
}
