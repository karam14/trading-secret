import { BarChart, Compass, Layout, List, Lock, Podcast, Crown } from "lucide-react";
import SidebarItem from "./sidebar-item";
import { usePathname } from "next/navigation";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { useState, useEffect } from "react";
import { checkVip } from "@/actions/fetch-vip-section-data"; // Import the checkVip function
import getUser from "@/actions/get-user-client"; // Import the getUser function to fetch user details

const guestRoutes = (isVipEnabled: boolean) => [
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
    icon: isVipEnabled ? Crown : Lock,
    label: "VIP Section",
    href: "/vip-section",
    disabled: !isVipEnabled,
    tooltip: isVipEnabled ? "" : "قريباً",
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

  const [isVipEnabled, setIsVipEnabled] = useState(false);

  useEffect(() => {
    const fetchUserAndVipStatus = async () => {
      const { user, error } = await getUser(); // Fetch user data
      if (error || !user) {
        console.error("Error fetching user:", error);
        return;
      }

      const userId = user.id;
      const isVip = await checkVip(userId); // Check VIP status based on the user ID
      setIsVipEnabled(isVip);
    };

    fetchUserAndVipStatus(); // Call the function to fetch user and check VIP status
  }, []);

  const routes = isTeacherPage ? teacherRoutes : guestRoutes(isVipEnabled);

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
