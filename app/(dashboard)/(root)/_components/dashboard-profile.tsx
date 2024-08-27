// src/app/dashboardProfile.tsx
import { User, Edit, FileBadge } from "lucide-react";
import Link from "next/link";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import Image from "next/image";
import { fetchBadges, fetchProfile } from "@/actions/get-dashboard-profile";

interface DashboardProfileProps {
  userId: string;
}

export default async function DashboardProfile({ userId }: DashboardProfileProps) {
  // Fetch profile and badges data using server actions
  const profile = await fetchProfile(userId);
  const badges = await fetchBadges(userId);

  return (
    <div className="border flex flex-row-reverse items-center gap-4 p-4 md:p-6 shadow dark:shadow-md dark:shadow-black rounded-md text-right">
      <div className="relative w-40 h-40 md:w-40 md:h-40 rounded-full overflow-hidden group">
        {profile?.image_url ? (
          <Image
            src={profile.image_url}
            alt={`الصورة الشخصية لـ ${profile.name}`}
            className="object-cover w-full h-full"
            width="1000"
            height="1000"
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full">
            <User className="w-40 h-40 text-gray-400 dark:text-gray-500" />
          </div>
        )}
      </div>
      <div className="flex flex-col overflow-hidden flex-grow">
        <h1 className="text-lg md:text-2xl font-bold break-words sm:whitespace-nowrap sm:tracking-tight sm:max-w-full">
          {profile?.name || "اسمك"}
        </h1>
        <Link href="/edit-profile" className="mt-1 md:mt-2 self-end inline-flex items-center text-sm text-gray-500 hover:text-gray-700" passHref>
            <Edit className="w-4 h-4 ml-2" />
            تعديل الملف الشخصي
        </Link>
        <div className="flex flex-wrap mt-4 space-x-2">
          {badges.length > 0 ? (
            badges.map((badge, index) => (
              <div key={index}>
                {/* Tooltip for large screens */}
                <div className="hidden sm:block">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button className="w-15 h-15 ml-2 flex justify-center">
                          <FileBadge color={badge.color} className={`text-${badge.color} w-full h-full cursor-pointer`} />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent side="top">
                        <p>تم اكتساب الشارة لإكمال دورة: {badge.courseTitle}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>

                {/* Popover for small screens */}
                <div className="block sm:hidden">
                  <Popover>
                    <PopoverTrigger asChild>
                      <button className="w-15 h-15 ml-2 flex justify-center">
                        <FileBadge color={badge.color} className={`text-${badge.color} w-full h-full cursor-pointer`} />
                      </button>
                    </PopoverTrigger>
                    <PopoverContent side="top">
                      <p>تم اكتساب الشارة لإكمال دورة: {badge.courseTitle}</p>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500">لم يتم اكتساب أي شارة حتى الآن.</p>
          )}
        </div>
      </div>
    </div>
  );
}
