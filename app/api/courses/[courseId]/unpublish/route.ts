import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function PATCH(req: Request, { params }: { params: { courseId: string } }) {
  try {
    const supabase = createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }




    // Update the course with the provided values
    const { data: unpublishedChapter, error: unpublishError } = await supabase
      .from('courses')
      .update({ is_published: false })
      .eq('id', params.courseId)
      .single();

    if (unpublishError) throw new Error(unpublishError.message);


    return NextResponse.json(unpublishedChapter);
  } catch (error: any) {
    ////console.log("[COURSE_UPDATE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
