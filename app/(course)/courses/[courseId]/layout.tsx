import getSafeProfile from "@/actions/get-safe-profile";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { CourseSidebar } from "./_components/course-sidebar";
import { CourseNavbar } from "./_components/course-navbar";
import { getProgress } from "@/actions/get-progress";

const CourseLayout = async ({
  children,
  params
}: {
  children: React.ReactNode;
  params: { courseId: string };
}) => {
  const supabase = createClient();
  const { data: session } = await supabase.auth.getSession();

  //console.log("[CourseLayout] Session data:", session);

  if (!session || !session.session?.user) {
    console.error("[CourseLayout] No session or user found, redirecting...");
    return redirect("/");
  }

  const userId = session.session.user.id;

  // Fetch the user's safe profile
  const safeProfile = await getSafeProfile();
  //console.log("[CourseLayout] SafeProfile:", safeProfile);

  if (!safeProfile) {
    console.error("[CourseLayout] No safe profile found, redirecting...");
    return redirect("/");
  }

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
        userProgress:user_progress(
          id,
          user_id,
          chapter_id,
          is_completed
        )
      )
    `)
    .eq('id', params.courseId)
    .single();

  if (courseError) {
    console.error("[CourseLayout] Error fetching course:", courseError);
    return redirect("/");
  }

  if (!course) {
    console.error("[CourseLayout] No course found");
    return redirect("/");
  }

  //console.log("[CourseLayout] Fetched course data:", course);

  // Placeholder for progress count (you can reintroduce getProgress logic)
  

  const progressCount = await getProgress(userId, params.courseId);

  return (
    <div className="h-full">
      <div className="h-[80px] md:pl-80 fixed inset-y-0 w-full z-50">
        <CourseNavbar
          course={course as any}
          progressCount={progressCount || 0}
          currentUser={safeProfile}
        />
      </div>
      <div className="hidden md:flex h-full w-80 flex-col fixed inset-y-0 z-50">
        <CourseSidebar
          course={course as any}
          progressCount={progressCount || 0}
        />
      </div>
      <main className="md:pl-80 pt-[80px] h-full">
        {children}
      </main>
    </div>
  );
};

export default CourseLayout;
