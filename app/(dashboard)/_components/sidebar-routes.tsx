import { BarChart, Compass, Layout, List, Lock, Podcast } from "lucide-react";
import SidebarItem from "./sidebar-item";
import { usePathname } from "next/navigation";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";

const guestRoutes = [
  {
    icon: Layout,
    label: "Dashboard",
    href: "/",
    disabled: false,
    tooltip: "",
  },
  {
    icon: Compass,
    label: "Browse Courses",
    href: "/browse",
    disabled: false,
    tooltip: "",
  },
  {
    icon: Podcast,
    label: "Live Streams",
    href: "/live",
    disabled: false,
    tooltip: "",
  },
  {
    icon: Lock,
    label: "VIP Section",
    href: "#",
    disabled: true,
    tooltip: "قريباً",
  },
];

const teacherRoutes = [
  {
    icon: List,
    label: "Courses",
    href: "/teacher/courses",
    disabled: false,
    tooltip: "",
  },
  {
    icon: BarChart,
    label: "Creator Dashboard",
    href: "/teacher/creator",
    disabled: false,
    tooltip: "",
  },
];

export const SidebarRoutes = ({ collapsed }: { collapsed: boolean }) => {
  const pathname = usePathname();
  const isTeacherPage = pathname?.includes("/teacher");
  const routes = isTeacherPage ? teacherRoutes : guestRoutes;

  return (
    <div className="flex flex-col w-full">
      <TooltipProvider>
        {routes.map((route) => (
          <Tooltip key={route.href}>
            <TooltipTrigger asChild>
              <div
                className={route.disabled ? "cursor-not-allowed opacity-50" : ""}
              >
                <SidebarItem
                  key={route.href}
                  icon={route.icon}
                  label={route.label}
                  href={route.href}
                  disabled={route.disabled}
                  collapsed={collapsed}
                />
              </div>
            </TooltipTrigger>
            {route.disabled && collapsed && (
              <TooltipContent side="left">
                <p>{route.tooltip}</p>
              </TooltipContent>
            )}
          </Tooltip>
        ))}
      </TooltipProvider>
    </div>
  );
};
