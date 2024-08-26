import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function PUT(
  req: Request,
  { params }: { params: { courseId: string; chapterId: string } }
) {
  try {
    const supabase = createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    const { isCompleted } = await req.json();

    if (userError || !user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { data: userProgress, error: progressError } = await supabase
      .from('user_progress')
      .upsert(
        {
          user_id: user.id,
          chapter_id: params.chapterId,
          is_completed: isCompleted,
        },
        {
          onConflict: 'user_id,chapter_id' // Use a comma-separated string for multiple columns
        }
      )
      .single();

    if (progressError) throw new Error(progressError.message);

    return NextResponse.json(userProgress);
  } catch (error: any) {

    return new NextResponse("Internal Error", { status: 500 });
  }
}
