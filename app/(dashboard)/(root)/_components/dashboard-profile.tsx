"use client";

import { useEffect, useState } from "react";
import { User, Edit, FileBadge } from "lucide-react";
import { createClient } from "@/utils/supabase/client"; // Client-side Supabase
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip"; // Import Tooltip components
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"; // Import Popover components
import Image from "next/image";

const supabase = createClient();

interface DashboardProfileProps {
  userId: string;
}

export default function DashboardProfile({ userId }: DashboardProfileProps) {
  const router = useRouter();
  const [profile, setProfile] = useState<{ name: string; image_url: string | null } | null>(null);
  const [badges, setBadges] = useState<{ color: string; courseTitle: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfileAndBadges = async () => {
      try {
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("name, image_url")
          .eq("id", userId)
          .single();

        if (profileError) throw profileError;

        setProfile(profileData);

        // Fetch the completed courses for the user
        const { data: completedCourses, error: completedCoursesError } = await supabase
          .from("user_course_progress")
          .select("course_id")
          .eq("user_id", userId);

        if (completedCoursesError) throw completedCoursesError;

        if (completedCourses) {
          // Fetch badges for completed courses
          const badgesData = await Promise.all(
            completedCourses.map(async (progress) => {
              const { data: course, error: courseError } = await supabase
                .from("courses")
                .select("badge, title")
                .eq("id", progress.course_id)
                .single();

              if (courseError) {
                console.error("Error fetching course badge:", courseError);
                return null;
              }

              return { color: course.badge, courseTitle: course.title };
            })
          );

          setBadges(badgesData.filter(Boolean) as { color: string; courseTitle: string }[]);
        }
      } catch (error) {
        console.error("Error fetching profile or badges data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileAndBadges();
  }, [userId]);

  if (loading) {
    return <Skeleton className="h-16 w-full rounded-md" />;
  }

  function handleEdit(): void {
    router.push("/edit-profile");
  }

  return (
    <div className="border  flex flex-row-reverse items-center gap-4 p-4 md:p-6  shadow dark:shadow-md dark:shadow-black  rounded-md text-right">
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
          <div className="flex items-center justify-center w-full h-full ">
            <User className="w-40 h-40 text-gray-400 dark:text-gray-500" />
          </div>
        )}
      </div>
      <div className="flex flex-col overflow-hidden flex-grow">
        <h1 className="text-lg md:text-2xl font-bold break-words sm:whitespace-nowrap sm:tracking-tight sm:max-w-full">
          {profile?.name || "اسمك"}
        </h1>
        <Button variant="ghost" className="mt-1 md:mt-2 self-end" size="sm" onClick={handleEdit}>
          <Edit className="w-4 h-4 ml-2" />
          تعديل الملف الشخصي
        </Button>
        <div className="flex flex-wrap mt-4 space-x-2">
          {badges.length > 0 ? (
            badges.map((badge, index) => (
              <div key={index}>
                {/* Tooltip for large screens */}
                <div className="hidden sm:block">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" className="w-15 h-15 ml-2 flex justify-center">
                          <FileBadge color={badge.color} className={`text-${badge.color} w-full h-full cursor-pointer`} />
                        </Button>
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
                      <Button variant="ghost" className="w-15 h-15 ml-2 flex justify-center">
                        <FileBadge color={badge.color} className={`text-${badge.color} w-full h-full cursor-pointer`} />
                      </Button>
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
