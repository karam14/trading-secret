// src/app/actions/dashboardProfileActions.ts
import { createClient } from "@/utils/supabase/server"; // Server-side Supabase client


export async function fetchProfile(userId: string) {
  const supabase = createClient();

  const { data: profileData, error: profileError } = await supabase
    .from("profiles")
    .select("name, image_url")
    .eq("id", userId)
    .single();

  if (profileError) throw profileError;

  return profileData;
}

export async function fetchBadges(userId: string) {
  const supabase = createClient();

  const { data: completedCourses, error: completedCoursesError } = await supabase
    .from("user_course_progress")
    .select("course_id")
    .eq("user_id", userId);

  if (completedCoursesError) throw completedCoursesError;

  const badgesData = await Promise.all(
    completedCourses.map(async (progress: { course_id: any; }) => {
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

  return badgesData.filter(Boolean) as { color: string; courseTitle: string }[];
}
