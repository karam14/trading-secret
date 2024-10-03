import getSafeProfile from "@/actions/get-safe-profile";
import { fetchUserCourseData } from "@/actions/load-course";
import { redirect } from "next/navigation";
import { CourseSidebar } from "./_components/course-sidebar";
import { CourseNavbar } from "./_components/course-navbar";
import { Skeleton } from "@/components/ui/skeleton"; // Assume this is a skeleton component

const CourseLayout = async ({
  children,
  params
}: {
  children: React.ReactNode;
  params: { courseId: string };
}) => {
  const safeProfile = await getSafeProfile();

  if (!safeProfile) {
    return redirect("/");
  }

  const userId = safeProfile.id;
  const courseData = await fetchUserCourseData(params.courseId, userId);

  if (!courseData) {
    return redirect("/");
  }

  const { course, progressCount } = courseData;

  // If data is still loading, show skeletons
  if (!course || !safeProfile) {
    return (
      <div className="h-full">
        <div className="h-[80px] md:pl-80 fixed inset-y-0 w-full z-50">
          <Skeleton className="w-full h-12" /> {/* Navbar Skeleton */}
        </div>
        <div className="hidden md:flex h-full w-80 flex-col fixed inset-y-0 z-50">
          <Skeleton className="w-full h-full" /> {/* Sidebar Skeleton */}
        </div>
        <main className="md:pl-80 pt-[80px] h-full">
          <Skeleton className="w-full h-96" /> {/* Main content skeleton */}
        </main>
      </div>
    );
  }

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
        <CourseSidebar course={course as any} />
      </div>
      <main className="md:pl-80 pt-[80px] h-full">
        {children}
      </main>
    </div>
  );
};

export default CourseLayout;
