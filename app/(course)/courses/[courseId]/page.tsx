// src/app/[courseId]/page.tsx
import { fetchCourseWithPublishedChapters } from "@/actions/load-course";
import { redirect } from "next/navigation";

const CourseIdPage = async ({
  params
}: {
  params: { courseId: string; }
}) => {

  // Fetch course and chapters using the server action
  const courseData = await fetchCourseWithPublishedChapters(params.courseId);

  if (!courseData || !courseData.firstChapterId) {
    return redirect("/");
  }

  // Redirect to the first published chapter
  return redirect(`/courses/${courseData.courseId}/chapters/${courseData.firstChapterId}`);
}

export default CourseIdPage;
