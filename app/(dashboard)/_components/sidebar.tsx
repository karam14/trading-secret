// Sidebar.tsx
import { DarkModeToggle } from "./DarkModeToggle";
import { Logo } from "./logo";
import { SidebarRoutes } from "./sidebar-routes";

export const Sidebar = () => {
  return (
    <div className="h-full">
      <div className="h-full border-l flex flex-col overflow-y-auto bg-white dark:bg-gray-800 shadow-sm">
        <div className="p-6">
          <Logo />
        </div>
        <div className="flex flex-col w-full">
          <SidebarRoutes />
          <DarkModeToggle /> {/* Add the dark mode toggle */}

        </div>
      </div>
    </div>
  );
}
