import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { CourseProgress } from "@/components/course-progress";
import { CourseSidebarItem } from "./course-sidebar-item";
import { CourseWithProgressWithCategory } from "@/types/types";
import { getProgress } from "@/actions/get-progress"; // Server-side function to get progress

interface CourseSidebarProps {
  course: CourseWithProgressWithCategory;
  progressCount: number;
}

export const CourseSidebar = async ({ course }: CourseSidebarProps) => {
  const supabase = createClient();
  const { data: session } = await supabase.auth.getSession();

  if (!session || !session.session?.user) {
    return redirect("/");
  }

  const userId = session.session?.user.id;

  // Check if the user has purchased the course
  const { data: purchase, error: purchaseError } = await supabase
    .from("purchases")
    .select("id")
    .eq("user_id", userId)
    .eq("course_id", course.id)
    .single();

  if (purchaseError) {
    console.error("[CourseSidebar] Error fetching purchase:", purchaseError);
  }

  // Fetch progress
  const progressCount: number = (await getProgress(userId, course.id)) ?? 0;

  return (
    <div className="h-full border-r flex flex-col overflow-y-auto shadow-sm">
      <div className="p-8 flex flex-col border-b">
        <h1 className="font-semibold">{course.title}</h1>
        {purchase && (
          <div className="mt-10">
            <CourseProgress variant="success" value={progressCount} />
          </div>
        )}
      </div>
      <div className="flex flex-col w-full">
        {course.chapters.map((chapter) => (
          <CourseSidebarItem
            key={chapter.id}
            id={chapter.id}
            label={chapter.title}
            isCompleted={!!chapter.userProgress?.[0]?.is_completed}
            courseId={course.id}
            isLocked={!chapter.is_free && !purchase} // Unlock if free or purchased
          />
        ))}
      </div>
    </div>
  );
};
