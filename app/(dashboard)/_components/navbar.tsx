// Navbar.tsx
import { NavbarRoutes } from "@/components/navbar-routes";
import { MobileSidebar } from "./mobile-sidebar";
import getSafeProfile from "@/actions/get-safe-profile";

export const Navbar = async () => {
    // Fetch the user's profile
    const currentProfile = await getSafeProfile();

    return (
        <div className="p-4 border-b h-full flex items-center bg-white dark:bg-gray-800 shadow-sm z-50">
            <MobileSidebar />
            <NavbarRoutes currentProfile={currentProfile} />
        </div>
    );
};
