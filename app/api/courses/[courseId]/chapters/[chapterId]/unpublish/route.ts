import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { courseId: string; chapterId: string } }
) {
  try {
    const supabase = createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }


    const { data: unpublishedChapter, error: unpublishError } = await supabase
      .from('chapters')
      .update({ is_published: false })
      .eq('id', params.chapterId)
      .eq('course_id', params.courseId)
      .single();

    if (unpublishError) throw new Error(unpublishError.message);

    const { data: publishedChapters, error: publishedChaptersError } = await supabase
      .from('chapters')
      .select('id')
      .eq('course_id', params.courseId)
      .eq('is_published', true);

    if (publishedChaptersError || publishedChapters.length === 0) {
      await supabase
        .from('courses')
        .update({ is_published: false })
        .eq('id', params.courseId);
    }

    return NextResponse.json(unpublishedChapter);
  } catch (error: any) {
    ////console.log("[CHAPTER_UNPUBLISH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
