
import { getDashboardCourses } from "@/actions/get-dashboard-courses";
import DashboardProfile from "./_components/dashboard-profile";
import { redirect } from "next/navigation";
import { BannerCard } from "./_components/banner-card";
import { InfoCard } from "./_components/info-card";
import { CheckCircle, Clock, Info, Lock } from "lucide-react";
import { CoursesList } from "@/components/courses-list";
import { createClient } from "@/utils/supabase/server";
import LoginButton from "./_components/login-button";

export default async function Dashboard() {
  const supabase = createClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    return (
      <div className="p-6 space-y-8 text-right">
        <div className="grid grid-cols-1 gap-4">
          <BannerCard
            icon={Info}
            label="أهلاً بك في لوحة التحكم"
            description="يرجى تسجيل الدخول لرؤية تقدمك ومتابعة دوراتك."
          />
        </div>
        <div className="flex justify-center">
          <LoginButton />
        </div>
      </div>
    );
  }

  const userId = user.id;

  const { completedCourses, coursesInProgress } = await getDashboardCourses(userId);

  return (
    <div className="p-6 space-y-8 text-right">
      <DashboardProfile userId={userId} />

      <div className="grid grid-cols-1 gap-4">
        <BannerCard
          icon={Info}
          label="مرحباً بك في لوحة التحكم"
          description={`هنا يمكنك رؤية تقدمك والاستمرار في دوراتك.`}
        />
      </div>

      {/* Course Progress Section */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">متابعة دوراتك</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InfoCard
            icon={Clock}
            label="دورات غير مكتملة"
            numberOfItems={coursesInProgress.length}
          />
          <InfoCard
            icon={CheckCircle}
            label="الدورات المكتملة"
            numberOfItems={completedCourses.length}
            variant="success"
          />
        </div>
        <CoursesList items={[...coursesInProgress, ...completedCourses]} />
      </div>

      {/* Earned Badges Section */}
      <div className="space-y-4">
      </div>

      {/* VIP Signals Section */}
      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-center">👑 إشارات VIP 👑</h2>
        <div className="relative p-8 bg-gray-800 dark:bg-gray-900 rounded-xl shadow-lg flex flex-col items-center justify-center text-gray-300">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-lg rounded-xl"></div>
          <Lock className="w-16 h-16 text-gray-400 z-10" />
          <p className="text-xl font-semibold mt-4 z-10">قريباً</p>
        </div>
      </div>
    </div>
  );
}
