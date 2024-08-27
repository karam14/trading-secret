// Sidebar.tsx
import dynamic from 'next/dynamic';
import { Logo } from "./logo";
import { SidebarRoutes } from "./sidebar-routes";

// Dynamically import DarkModeToggle with ssr: false
const DynamicDarkModeToggle = dynamic(() => import('./DarkModeToggle'), { ssr: false });

export const Sidebar = () => {
  return (
    <div className="h-full">
      <div className="h-full border-l flex flex-col overflow-y-auto bg-white dark:bg-gray-800 shadow-sm">
        <div className="p-6">
          <Logo />
        </div>
        <div className="flex flex-col w-full">
          <SidebarRoutes />
          <DynamicDarkModeToggle /> {/* Use dynamically imported component */}
        </div>
      </div>
    </div>
  );
}
