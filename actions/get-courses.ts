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
    //console.log("[GET_COURSES] Starting fetch process...");
    //console.log("[GET_COURSES] userId:", userId);
    //console.log("[GET_COURSES] title:", title);
    //console.log("[GET_COURSES] categoryId:", categoryId);

    // Step 1: Fetch Courses
    let courseQuery = supabase
      .from('courses')
      .select(`
        id,
        title,
        description,
        categoryId,
        imageUrl,
        created_at,
        updated_at,
        is_published
      `)
      .eq('is_published', true)
      .order('created_at', { ascending: false });

    if (title) {
      //console.log("[GET_COURSES] Applying title filter:", title);
      courseQuery = courseQuery.ilike('title', `%${title}%`);
    }

    if (categoryId) {
      //console.log("[GET_COURSES] Applying category filter:", categoryId);
      courseQuery = courseQuery.eq('categoryId', categoryId);
    }

    const { data: courses, error: courseError } = await courseQuery;

    if (courseError) {
      console.error("[GET_COURSES] Error fetching courses:", courseError);
      return [];
    }

    //console.log("[GET_COURSES] Fetched courses:", courses);

    // Step 2: Fetch related categories
    const categoryIds = courses.map(course => course.categoryId);
    const { data: categories, error: categoryError } = await supabase
      .from('categories')
      .select('id, name, created_at, updated_at')
      .in('id', categoryIds);

    if (categoryError) {
      console.error("[GET_COURSES] Error fetching categories:", categoryError);
      return [];
    }

    //console.log("[GET_COURSES] Fetched categories:", categories);

    // Step 3: Fetch related chapters for each course
    const courseIds = courses.map(course => course.id);
    const { data: chapters, error: chaptersError } = await supabase
      .from('chapters')
      .select('id, title, description, is_free, is_published, video_url, course_id, created_at, updated_at')
      .in('course_id', courseIds);

    if (chaptersError) {
      console.error("[GET_COURSES] Error fetching chapters:", chaptersError);
      return [];
    }

    //console.log("[GET_COURSES] Fetched chapters:", chapters);

    // Step 4: Fetch related purchases for the user
    const { data: purchases, error: purchasesError } = await supabase
      .from('purchases')
      .select('user_id, course_id')
      .eq('user_id', userId)
      .in('course_id', courseIds);

    if (purchasesError) {
      console.error("[GET_COURSES] Error fetching purchases:", purchasesError);
      return [];
    }

    //console.log("[GET_COURSES] Fetched purchases:", purchases);

    // Step 5: Map the fetched data to build the final result
    const coursesWithProgress: CourseWithProgressWithCategory[] = await Promise.all(
      courses.map(async (course) => {
        //console.log("[GET_COURSES] Processing course:", course.id);

        // Find the related category
        const category = categories.find(cat => cat.id === course.categoryId) || null;

        // Find the related chapters
        const relatedChapters = chapters.filter(chapter => chapter.course_id === course.id);

        // Check if the user has purchased this course
        const userHasPurchased = purchases.some(purchase => purchase.course_id === course.id);

        //console.log("[GET_COURSES] User has purchased:", userHasPurchased);

        // Calculate progress if the user has purchased the course
        const progressPercentage = userHasPurchased
          ? await getProgress(userId, course.id)
          : null;

        //console.log("[GET_COURSES] Course progress:", progressPercentage);

        const courseWithProgress: CourseWithProgressWithCategory = {
          ...course,
          progress: progressPercentage,
          category: category as Category,
          chapters: relatedChapters as Chapter[], // Ensure chapters have the correct type
        };

        //console.log("[GET_COURSES] Processed course with progress:", courseWithProgress);

        return courseWithProgress;
      })
    );

    //console.log("[GET_COURSES] Completed processing all courses.");

    return coursesWithProgress;
  } catch (error) {
    console.error("[GET_COURSES] Unexpected error:", error);
    return [];
  }
};
