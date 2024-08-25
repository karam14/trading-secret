import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const supabase = createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    const { title } = await req.json();

    if (userError || !user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }



    const { data: lastChapter, error: lastChapterError } = await supabase
      .from('chapters')
      .select('position')
      .eq('course_id', params.courseId)
      .order('position', { ascending: false })
      .limit(1)
      .single();

    const newPosition = lastChapter ? lastChapter.position + 1 : 1;

    const { data: chapter, error: chapterError } = await supabase
      .from('chapters')
      .insert({
        title,
        course_id: params.courseId,
        position: newPosition,
      })
      .single();

    if (chapterError) throw new Error(chapterError.message);

    return NextResponse.json(chapter);
  } catch (error: any) {
    ////console.log("[CHAPTERS]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
