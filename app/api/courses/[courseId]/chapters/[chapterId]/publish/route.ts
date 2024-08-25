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



    const { data: chapter, error: chapterError } = await supabase
      .from('chapters')
      .select('title, description, video_url')
      .eq('id', params.chapterId)
      .eq('course_id', params.courseId)
      .single();

    if (chapterError || !chapter.title || !chapter.description || !chapter.video_url) {
      ////console.log("[CHAPTER_PUBLISH]", chapterError);
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const { data: publishedChapter, error: publishError } = await supabase
      .from('chapters')
      .update({ is_published: true })
      .eq('id', params.chapterId)
      .single();

    if (publishError) throw new Error(publishError.message);

    return NextResponse.json(publishedChapter);
  } catch (error: any) {
    ////console.log("[CHAPTER_PUBLISH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
