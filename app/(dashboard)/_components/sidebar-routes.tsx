"use client";

import { BarChart, Compass, Layout, List, LogOutIcon, Lock } from "lucide-react";
import SidebarItem from "./sidebar-item";
import { usePathname } from "next/navigation";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip"; // Import Tooltip components

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
        icon: Lock,
        label: "VIP Section",
        href: "#",
        disabled: true,
        tooltip: "قريباً"
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
        label: "Analytics",
        href: "/teacher/analytics",
        disabled: false,
        tooltip: "",
    },
];

export const SidebarRoutes = () => {
    const pathname = usePathname();
    const isTeacherPage = pathname?.includes("/teacher");
    const routes = isTeacherPage ? teacherRoutes : guestRoutes;

    return (
        <div className="flex flex-col w-full">
        <TooltipProvider>
            <div >
                {routes.map((route) => (
                    <Tooltip key={route.href}>
                        <TooltipTrigger asChild>
                            <div className={route.disabled ? "cursor-not-allowed opacity-50" : ""}>
                                <SidebarItem
                                    key={route.href}
                                    icon={route.icon}
                                    label={route.label}
                                    href={route.href}
                                    disabled={route.disabled} // Pass the disabled prop
                                />
                            </div>
                        </TooltipTrigger>
                        {route.disabled && (
                            <TooltipContent side="right">
                                <p>{route.tooltip}</p>
                            </TooltipContent>
                        )}
                    </Tooltip>
                ))}
            </div>
        </TooltipProvider>
        </div>
    );
}
