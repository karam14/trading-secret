import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

const CourseIdPage = async ({
  params
}: {
  params: { courseId: string; }
}) => {
  const supabase = createClient();

  // Step 1: Fetch the course with its published chapters ordered by position
  const { data: course, error: courseError } = await supabase
    .from('courses')
    .select(`
      id,
      chapters(id, is_published, position)
    `)
    .eq('id', params.courseId)
    .single();

  if (courseError || !course) {
    console.error("[CourseIdPage] Error fetching course:", courseError);
    return redirect("/");
  }

  // Step 2: Filter out unpublished chapters and sort by position
  const publishedChapters = course.chapters
    .filter((chapter: { is_published: boolean }) => chapter.is_published)
    .sort((a: { position: number }, b: { position: number }) => a.position - b.position);



  // Step 3: Redirect to the first published chapter
  const firstChapterId = publishedChapters[0].id;
  //console.log("[CourseIdPage] Redirecting to first chapter:", firstChapterId);
  
  return redirect(`/courses/${course.id}/chapters/${firstChapterId}`);
}

export default CourseIdPage;
