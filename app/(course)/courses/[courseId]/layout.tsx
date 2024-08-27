// src/app/[courseId]/layout.tsx
import getSafeProfile from "@/actions/get-safe-profile";
import { fetchUserCourseData } from "@/actions/load-course";
import { redirect } from "next/navigation";
import { CourseSidebar } from "./_components/course-sidebar";
import { CourseNavbar } from "./_components/course-navbar";

const CourseLayout = async ({
  children,
  params
}: {
  children: React.ReactNode;
  params: { courseId: string };
}) => {
  // Fetch the user's safe profile
  const safeProfile = await getSafeProfile();
  //console.log("[CourseLayout] SafeProfile:", safeProfile);

  if (!safeProfile) {
    console.error("[CourseLayout] No safe profile found, redirecting...");
    return redirect("/");
  }

  const userId = safeProfile.id;

  // Fetch the course data and user's progress using the server action
  const courseData = await fetchUserCourseData(params.courseId, userId);

  if (!courseData) {
    return redirect("/");
  }

  const { course, progressCount } = courseData;

  //console.log("[CourseLayout] Fetched course data:", course);

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
        />
      </div>
      <main className="md:pl-80 pt-[80px] h-full">
        {children}
      </main>
    </div>
  );
};

export default CourseLayout;
