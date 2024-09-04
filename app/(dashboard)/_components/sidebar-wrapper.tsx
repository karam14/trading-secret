"use client";

import { useState } from "react";
import { Sidebar } from "./sidebar";

const SidebarWrapper = ({ children }: { children: React.ReactNode }) => {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);

  return (
    <div className="h-full flex flex-row-reverse">
      <div
        className={`hidden lg:flex flex-col fixed inset-y-0 right-0 z-20 transition-all duration-300
          ${isSidebarExpanded ? "w-56 shadow-2xl transform " : "w-12"} bg-white dark:bg-gray-800`}
        onMouseEnter={() => setIsSidebarExpanded(true)}
        onMouseLeave={() => setIsSidebarExpanded(false)}
        style={{
          boxShadow: isSidebarExpanded
            ? "0px 0px 15px rgba(0, 0, 0, 0.3)"
            : "none",
        }}
      >
        <Sidebar />
      </div>
      <main
        className={` h-full transition-all w-full duration-300 ${
          isSidebarExpanded ? "lg:pr-56" : "lg:pr-16"
        }`}
      >
        {children}
      </main>
    </div>
  );
};

export default SidebarWrapper;
