import { CourseWithProgressWithCategory } from "@/types/types";
import { NavbarRoutes } from "@/components/navbar-routes";
import { CourseMobileSidebar } from "./course-mobile-sidebar";

interface CourseNavbarProps {
  course: CourseWithProgressWithCategory;
  progressCount: number;
  currentUser?: any;  // Use 'any' or a more specific type if you have one for Supabase Auth user
}

export const CourseNavbar = ({
  course,
  progressCount,
  currentUser,
}: CourseNavbarProps) => {
  return (
    <div className="p-4 border-b h-full flex items-center shadow-sm">
      <CourseMobileSidebar
        course={course}
        progressCount={progressCount}
      />
      <NavbarRoutes  currentProfile={currentUser}/>      
    </div>
  );
};
