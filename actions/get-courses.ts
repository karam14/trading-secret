import { createClient } from "@/utils/supabase/server";
import { getProgress } from "@/actions/get-progress";
import { CourseWithProgressWithCategory, Chapter, Category } from "@/types/types";

type GetCourses = {
  userId: string;
  title?: string;
  categoryId?: string;
};

export const getCourses = async ({
  userId,
  title,
  categoryId
}: GetCourses): Promise<CourseWithProgressWithCategory[]> => {
  const supabase = createClient();

  try {
    // Step 1: Fetch Courses with the related category and chapters in a single query
    let courseQuery = supabase
      .from('courses')
      .select(`
        id,
        title,
        description,
        categoryId,
        price,
        badge,
        imageUrl,
        created_at,
        updated_at,
        is_published,
        category:categories(id, name, created_at, updated_at),
        chapters(id, position, title, description, is_free, is_published, video_url, course_id, created_at, updated_at)
      `)
      .eq('is_published', true)
      ;

    if (title) {
      courseQuery = courseQuery.ilike('title', `%${title}%`);
    }

    if (categoryId) {
      courseQuery = courseQuery.eq('categoryId', categoryId);
    }

    const { data: courses, error: courseError } = await courseQuery;

    if (courseError) {
      console.error("[GET_COURSES] Error fetching courses:", courseError);
      return [];
    }

    if (!courses || courses.length === 0) {
      return [];
    }

    // Step 2: Fetch related purchases for the user in a single query
    const courseIds = courses.map(course => course.id);
    const { data: purchases, error: purchasesError } = await supabase
      .from('purchases')
      .select('course_id')
      .eq('user_id', userId)
      .in('course_id', courseIds);

    if (purchasesError) {
      console.error("[GET_COURSES] Error fetching purchases:", purchasesError);
      return [];
    }

    // Step 3: Build the final result by mapping courses with progress and other details
    const coursesWithProgress: CourseWithProgressWithCategory[] = await Promise.all(
      courses.map(async (course) => {
        const userHasPurchased = purchases.some(purchase => purchase.course_id === course.id);

        const progressPercentage = userHasPurchased
          ? await getProgress(userId, course.id)
          : null;

        const courseWithProgress: CourseWithProgressWithCategory = {
          ...course,
          progress: progressPercentage,
          category: course.category as unknown as Category, // category should now correctly be a single Category object
          chapters: course.chapters as Chapter[], // Ensure chapters have the correct type
        };

        return courseWithProgress;
      })
    );

    return coursesWithProgress;
  } catch (error) {
    console.error("[GET_COURSES] Unexpected error:", error);
    return [];
  }
};
