"use client";

import { useEffect, useState } from "react";
import { User, Edit } from "lucide-react";
import { createClient } from "@/utils/supabase/client"; // Client-side Supabase
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const supabase = createClient();

interface DashboardProfileProps {
  userId: string;
}

export default function DashboardProfile({ userId }: DashboardProfileProps) {
  const router = useRouter();
  const [profile, setProfile] = useState<{ name: string; image_url: string | null } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("name, image_url")
        .eq("id", userId)
        .single();

      if (profileError) {
        console.error("خطأ في جلب بيانات الملف الشخصي:", profileError);
      } else {
        setProfile(profileData);
      }

      setLoading(false);
    };

    fetchProfile();
  }, [userId]);

  if (loading) {
    return <Skeleton className="h-16 w-full rounded-md" />;
  }

  function handleEdit(): void {
    router.push("/edit-profile");
  }

  return (
    <div className="flex flex-row-reverse items-center gap-4 p-4 md:p-6 bg-white dark:bg-gray-800 shadow rounded-md text-right">
      <div className="relative w-40 h-40 md:w-40 md:h-40 rounded-full overflow-hidden group">
        {profile?.image_url ? (
          <img
            src={profile.image_url}
            alt={`الصورة الشخصية لـ ${profile.name}`}
            className="object-cover w-full h-full"
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full bg-gray-200 dark:bg-gray-700">
            <User className="w-40 h-40 text-gray-400 dark:text-gray-500" />
          </div>
        )}

      </div>
      <div className="flex flex-col overflow-hidden">
        <h1 className="text-lg md:text-2xl font-bold break-words sm:whitespace-nowrap sm:tracking-tight sm:max-w-full">
          {profile?.name || "اسمك"}
        </h1>
        <Button variant="ghost" className="mt-1 md:mt-2" size="sm" onClick={handleEdit}>
          <Edit className="w-4 h-4 ml-2" />
          تعديل الملف الشخصي
        </Button>
      </div>
    </div>
  );
}
