import { createClient } from "@/utils/supabase/server";
import { getProgress } from "./get-progress";
import { CourseWithProgressWithCategory } from "@/types/types";

type DashboardCourses = {
    completedCourses: CourseWithProgressWithCategory[];
    coursesInProgress: CourseWithProgressWithCategory[];
}

export const getDashboardCourses = async (userId: string): Promise<DashboardCourses> => {
    try {
        const supabase = createClient();

        // Fetch purchased courses
        const { data: purchasedCourses, error: purchaseError } = await supabase
            .from('purchases')
            .select(`
                course: courses (
                    id,
                    title,
                    description,
                    is_published,
                    created_at,
                    updated_at,
                    imageUrl,
                    badge,
                    category: categories (
                        id,
                        name
                    ),
                    chapters (
                        id,
                        title,
                        position,
                        is_published
                    )
                )
            `)
            .eq('user_id', userId);

        if (purchaseError) {
            console.error("[GET_DASHBOARD_COURSES] Error fetching purchased courses:", purchaseError);
            return {
                completedCourses: [],
                coursesInProgress: [],
            };
        }

        const courses = purchasedCourses.map(purchase => purchase.course) as unknown as CourseWithProgressWithCategory[];

        for (let course of courses) {
            const progress = await getProgress(userId, course.id);
            course["progress"] = progress;
        }

        // Handle completed and courses in progress
        const completedCourses = courses.filter(course => course.progress === 100);
        const coursesInProgress = courses.filter(course => course.progress && course.progress < 100);

        return {
            completedCourses,
            coursesInProgress
        };
    } catch (error) {
        console.error("[GET_DASHBOARD_COURSES]:", error);
        return {
            completedCourses: [],
            coursesInProgress: []
        };
    }
}
