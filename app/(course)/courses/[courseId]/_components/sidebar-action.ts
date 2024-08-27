// src/app/actions/fetchCourseSidebarData.ts
import { createClient } from "@/utils/supabase/server";
import { getProgress } from "@/actions/get-progress";
import getUser from "@/actions/get-user";
import { CourseWithProgressWithCategory } from "@/types/types";

export async function fetchCourseSidebarData(courseId: string) {
  const supabase = createClient();

  // Fetch the user
  const { user, error } = await getUser();
  if (error || !user) {
    console.error("[fetchCourseSidebarData] Error fetching user:", error);
    return { purchase: null, progressCount: 0 };
  }

  const userId = user.id;

  // Check if the user has purchased the course
  const { data: purchase, error: purchaseError } = await supabase
    .from("purchases")
    .select("id")
    .eq("user_id", userId)
    .eq("course_id", courseId)
    .maybeSingle();

  if (purchaseError) {
    console.error("[fetchCourseSidebarData] Error fetching purchase:", purchaseError);
    return { purchase: null, progressCount: 0 };
  }

  // Fetch progress
  const progressCount = await getProgress(userId, courseId) ?? 0;

  return { purchase, progressCount };
}
