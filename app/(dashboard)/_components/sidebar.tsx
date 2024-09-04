"use client";

import dynamic from "next/dynamic";
import { Logo } from "./logo";
import { SidebarRoutes } from "./sidebar-routes";
import { useState } from "react";
import { useMediaQuery } from "react-responsive";

// Dynamically import DarkModeToggle with ssr: false
const DynamicDarkModeToggle = dynamic(() => import("./DarkModeToggle"), {
  ssr: false,
});

export const Sidebar = () => {
  const isLargeScreen = useMediaQuery({ minWidth: 1024 });
  const [isCollapsed, setIsCollapsed] = useState(true);

  const handleMouseEnter = () => {
    if (isLargeScreen) {
      setIsCollapsed(false);
    }
  };

  const handleMouseLeave = () => {
    if (isLargeScreen) {
      setIsCollapsed(true);
    }
  };

  return (
    <div
      className={`h-full bg-white dark:bg-gray-800 shadow-sm transition-all duration-300
        ${isCollapsed && isLargeScreen ? "w-12" : "w-56"} ${!isLargeScreen && "w-full"}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="flex flex-col h-full border-r w-full overflow-y-auto">
        <div className="p-4">
          <Logo collapsed={isCollapsed && isLargeScreen} />
        </div>
        <div className="flex flex-col w-full">
          <SidebarRoutes collapsed={isCollapsed && isLargeScreen} />
          <div
            className={`transition-opacity w-full ${
              isCollapsed && isLargeScreen ? "opacity-0" : "opacity-100"
            }`}
          >
            <DynamicDarkModeToggle />
          </div>
        </div>
      </div>
    </div>
  );
};
