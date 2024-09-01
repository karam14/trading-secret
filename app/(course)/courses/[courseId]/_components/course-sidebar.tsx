import { fetchCourseSidebarData } from "./sidebar-action";
import { CourseSidebarItem } from "./course-sidebar-item";
import { CourseWithProgressWithCategory } from "@/types/types";
import { CourseProgress } from "@/components/course-progress";

interface CourseSidebarProps {
  course: CourseWithProgressWithCategory;
}

export const CourseSidebar = async ({ course }: CourseSidebarProps) => {
  // Fetch the necessary data using the server action
  const { purchase, progressCount } = await fetchCourseSidebarData(course.id);

  return (
    <div className="h-full border-r flex flex-col overflow-y-auto shadow-sm">
      <div className="p-8 flex flex-col border-b">
        <h1 className="font-semibold">{course.title}</h1>
        {purchase && (
          <div className="mt-10">
            <CourseProgress variant="default" value={progressCount} />
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
