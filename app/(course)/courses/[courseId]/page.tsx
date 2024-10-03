import { fetchCourseWithPublishedChapters } from "@/actions/load-course";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export const dynamic = 'force-dynamic';

const CourseIdPage = async ({ params }: { params: { courseId: string } }) => {
  // Fetch course and chapters in the background while skeleton is rendered
  const courseDataPromise = fetchCourseWithPublishedChapters(params.courseId);

  return (
    <Suspense fallback={<SkeletonComponent />}>
      <AwaitCourseData courseDataPromise={courseDataPromise} />
    </Suspense>
  );
};

// Skeleton component
const SkeletonComponent = () => (
  <div className="flex justify-center items-center min-h-screen">
    <Skeleton className="w-500 h-500" /> {/* Adjust skeleton as per your needs */}
  </div>
);

// A component to handle fetching the course data and redirect logic
const AwaitCourseData = async ({ courseDataPromise }: { courseDataPromise: Promise<any> }) => {
  const courseData = await courseDataPromise;

  if (!courseData || !courseData.firstChapterId) {
    return redirect("/"); // Redirect if no data is found
  }

  // Redirect directly to the first published chapter
  return redirect(`/courses/${courseData.courseId}/chapters/${courseData.firstChapterId}`);
};

export default CourseIdPage;
