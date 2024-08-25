import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function PATCH(req: Request, { params }: { params: { courseId: string } }) {
    try {
        // Initialize Supabase client
        const supabase = createClient();

        // Authenticate the user
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) {
            console.log("[COURSE_ID] Unauthorized");
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { courseId } = params;

        // Safely parse the JSON body, if it exists
        let values = {};
        try {
            const bodyText = await req.text(); // Read the body as text first
            if (bodyText) {
                values = JSON.parse(bodyText); // Parse only if the body is not empty
                ////console.log("[COURSE_ID] Parsed JSON body:", values);
            }
        } catch (error) {
            ////console.log("[COURSE_ID] Error parsing JSON:", error);
            return new NextResponse("Invalid JSON body", { status: 400 });
        }
        ////console.log("[COURSE_ID] Received values:", values);
        // Update the course with the provided values
        const { data: updatedCourse, error: updateError } = await supabase
            .from('courses')
            .update(values)
            .eq('id', courseId)
            .select()  // Select the updated course to return
            .single();

        if (updateError) {
            ////console.log("[COURSE_ID]", updateError);
            throw new Error(updateError.message);
        }

        return NextResponse.json(updatedCourse);

    } catch (error: any) {
        ////console.log("[COURSE_ID]", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
import Mux from "@mux/mux-node";

// Initialize Mux client with new configuration
const mux = new Mux({
    tokenId: process.env.MUX_TOKEN_ID!,
    tokenSecret: process.env.MUX_TOKEN_SECRET!,
});
export async function DELETE(req: Request, { params }: { params: { courseId: string } }) {
  try {
      // Initialize Supabase client
      const supabase = createClient();
      
      // Authenticate the user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
          return new NextResponse("Unauthorized", { status: 401 });
      }

      const { courseId } = params;
      ////console.log("[COURSES] Deleting course:", courseId);

      // Fetch all chapters associated with the course
      const { data: chapters, error: chaptersError } = await supabase
          .from('chapters')
          .select('id')
          .eq('course_id', courseId);
      ////console.log(chapters);
      if (chaptersError) {
          throw new Error(chaptersError.message);
      }

      // Fetch and delete all Mux data associated with these chapters
      for (const chapter of chapters) {
          const { data: muxDataList, error: muxDataError } = await supabase
              .from('mux_data')
              .select('id, asset_id')
              .eq('chapter_id', chapter.id);

          if (muxDataError) {
              throw new Error(muxDataError.message);
          }

          // Delete associated Mux assets and corresponding mux_data records
          for (const muxData of muxDataList) {
              try {
                  await mux.video.assets.delete(muxData.asset_id);

                  // Delete Mux data from the database
                  await supabase
                      .from('mux_data')
                      .delete()
                      .eq('id', muxData.id);
              } catch (error) {
                  ////console.log("[Mux Asset Delete]", error);
              }
          }
      }

      // Delete all chapters associated with the course
      const { error: deleteChaptersError } = await supabase
          .from('chapters')
          .delete()
          .eq('course_id', courseId);

      if (deleteChaptersError) {
          throw new Error(deleteChaptersError.message);
      }

      // Delete the course from the database
      const { data: course, error: deleteCourseError } = await supabase
          .from('courses')
          .delete()
          .match({ id: courseId })
          .select()  // Ensure to select the fields you need
          .single();  // `single()` ensures that we get the single deleted row back

      if (deleteCourseError) {
          throw new Error(deleteCourseError.message);
      }

      ////console.log("[COURSES] Course deleted:", course);

      return new NextResponse(null, { status: 204 });

  } catch (error) {
      ////console.log("[COURSES] Error:", error);
      return new NextResponse("Internal Server Error", { status: 500 });
  }
}