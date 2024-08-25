import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function PUT(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const supabase = createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    const { list } = await req.json();

    if (userError || !user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }



    const updates = list.map((item: { id: string; position: number }) =>
      supabase
        .from('chapters')
        .update({ position: item.position })
        .eq('id', item.id)
        .eq('course_id', params.courseId)
    );

    const results = await Promise.all(updates);
    const errors = results.filter(result => result.error);

    if (errors.length) {
      return new NextResponse("Error reordering chapters", { status: 500 });
    }

    return new NextResponse("Success", { status: 200 });
  } catch (error: any) {
    ////console.log("[REORDER_CHAPTERS]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
