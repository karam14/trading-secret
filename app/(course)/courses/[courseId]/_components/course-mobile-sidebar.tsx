import { Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger
} from "@/components/ui/sheet";

import { CourseSidebar } from "./course-sidebar";
import { CourseWithProgressWithCategory } from "@/types/types";

interface CourseMobileSidebarProps {
  course: CourseWithProgressWithCategory;
  progressCount: number;
};

export const CourseMobileSidebar = ({ 
  course,
}: CourseMobileSidebarProps) => {
  return (
    <Sheet>
      <SheetTrigger className="md:hidden pr-4 hover:opacity-75 transition">
        <Menu />
      </SheetTrigger>
      <SheetContent side="left" className="p-0 w-72">
        <CourseSidebar
          course={course}
        />
      </SheetContent>
    </Sheet>
  );
};
