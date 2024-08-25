"use client";
import { BarChart, Compass, Layout, List, LogOutIcon } from "lucide-react";
import SidebarItem from "./sidebar-item";
import { usePathname } from "next/navigation";
const guestRotues = [
    {
        icon: Layout,
        label: "Dashboard",
        href: "/"
    },
    {
        icon: Compass,
        label: "Browse Courses",
        href: "/browse"
    },
    {
        icon: LogOutIcon,
        label: "Logout",
        href: "/logout"
    }
];
const teacherRoutes = [
    {
        icon: List,
        label: "Courses",
        href: "/teacher/courses"
    },
    {
        icon: BarChart,
        label: "Analytics",
        href: "/teacher/analytics"
    },
    {
        icon: LogOutIcon,
        label: "Logout",
        href: "/logout"
    }
];
export const SidebarRoutes = () => {
    const pathname = usePathname();
    const isTeacherPage = pathname?.includes("/teacher");
    const routes = isTeacherPage ? teacherRoutes : guestRotues;
    
    return (
        <div className="flex flex-col w-full">
            {routes.map((route) => (
             
             <SidebarItem
                key={route.href}
                icon={route.icon}
                label={route.label}
                href={route.href}
                />
            ))}
        </div>
    )
}