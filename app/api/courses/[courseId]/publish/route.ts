import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function PATCH(req: Request, { params }: { params: { courseId: string } }) {
  try {
    // Initialize Supabase client
    const supabase = createClient();

    // Authenticate the user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { courseId } = params;

    // Fetch the course along with its chapters and mux_data
    const { data: course, error: courseError } = await supabase
      .from('courses')
      .select(`
        id,
        title,
        description,
        imageUrl,
        categoryId,
        chapters (
          id,
          is_published,
          mux_data (
            id
          )
        )
      `)
      .eq('id', courseId)
      .eq('user_id', user.id)
      .single();

    if (courseError || !course) {
        ////console.log("[COURSE_ID_PUBLISH]", courseError);
      return new NextResponse("Not found", { status: 404 });
    }

    // Check if the course has at least one published chapter
    const hasPublishedChapter = course.chapters.some((chapter: any) => chapter.is_published);

    // Validate required fields
    if (!course.title || !course.description || !course.imageUrl || !course.categoryId || !hasPublishedChapter) {
        ////console.log("[COURSE_ID_PUBLISH]", "Missing required fields");
      return new NextResponse("Missing required fields", { status: 401 });
    }

    // Publish the course
    const { error: publishError } = await supabase
      .from('courses')
      .update({ is_published: true })
      .eq('id', courseId)
      .eq('user_id', user.id);

    if (publishError) {
      ////console.log("[COURSE_ID_PUBLISH]", publishError);
      throw new Error(publishError.message);
    }

    return new NextResponse(null, { status: 204 });

  } catch (error: any) {
    ////console.log("[COURSE_ID_PUBLISH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  } 
}
