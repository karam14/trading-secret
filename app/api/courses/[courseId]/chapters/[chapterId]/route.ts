import { createClient } from "@/utils/supabase/server"; // Supabase client setup
import { NextResponse } from "next/server";
import Mux from '@mux/mux-node';
import { UTApi } from "uploadthing/server"; // Import UTApi from UploadThing

const mux = new Mux({
  tokenId: process.env.MUX_TOKEN_ID,
  tokenSecret: process.env.MUX_TOKEN_SECRET,
});

const utapi = new UTApi(); // Initialize UTApi

export async function DELETE(req: Request, { params }: { params: { chapterId: string } }) {
  try {
    // Initialize Supabase client
    const supabase = createClient();
    
    // Authenticate the user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { chapterId } = params;

    ////console.log("[CHAPTERS] Deleting chapter:", chapterId);

    // Fetch the chapter details including video name
    const { data: chapter, error: chapterError } = await supabase
      .from('chapters')
      .select('id, video_name')
      .eq('id', chapterId)
      .single();

    if (chapterError || !chapter) {
      ////console.log("[CHAPTERS] Error:", chapterError || "Chapter not found");
      throw new Error(chapterError?.message || "Chapter not found");
    }

    // Fetch and delete all Mux data associated with this chapter
    const { data: muxDataList, error: muxDataError } = await supabase
      .from('mux_data')
      .select('id, asset_id')
      .eq('chapter_id', chapterId);

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

    // Delete the file from UploadThing if video_name is present
    if (chapter.video_name) {
      try {
        await utapi.deleteFiles([chapter.video_name]);
        ////console.log(`[UploadThing] Deleted video: ${chapter.video_name}`);
      } catch (error) {
        ////console.log("[UploadThing] Error deleting video:", error);
      }
    }

    // Delete the chapter itself
    const { error: deleteChapterError } = await supabase
      .from('chapters')
      .delete()
      .eq('id', chapterId);

    if (deleteChapterError) {
      ////console.log("[CHAPTERS] Error:", deleteChapterError);
      throw new Error(deleteChapterError.message);
    }

    return new NextResponse(null, { status: 204 });

  } catch (error) {
    ////console.log("[CHAPTERS] Error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}


export async function PATCH(
  req: Request,
  { params }: { params: { courseId: string; chapterId: string } }
) {
  try {
    const supabase = createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    const { ...values } = await req.json();
    ////console.log(values);

    if (userError || !user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { data: courseOwner, error: courseOwnerError } = await supabase
      .from('courses')
      .select('user_id')
      .eq('id', params.courseId)
      .single();

    if (courseOwnerError || courseOwner.user_id !== user.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { data: chapter, error: chapterError } = await supabase
      .from('chapters')
      .update(values)
      .eq('id', params.chapterId)
      .eq('course_id', params.courseId)
      .maybeSingle(); // Use maybeSingle to handle cases where no rows are returned

    if (chapterError) throw new Error(chapterError.message);



    // Handle Mux or other video updates here if videoUrl is part of the update
    if (values.video_url) {
      const { data: existingMuxData, error: muxError } = await supabase
        .from('mux_data')
        .select('*')
        .eq('chapter_id', params.chapterId)
        .single();

      if (muxError){
        ////console.log("[Mux Data Error]", muxError);

      }
      if (existingMuxData) {
        ////console.log("[Existing Mux Data]", existingMuxData);
        // Delete existing Mux asset
        try {
          await mux.video.assets.delete(existingMuxData.asset_id);
        } catch (error) {
          ////console.log("[Mux Asset Delete]", error);
        }

        // Delete the old Mux data from your database
        await supabase
          .from('mux_data')
          .delete()
          .eq('id', existingMuxData.id);
        
        
      }

      // Create a new Mux asset
      try {

        const asset = await mux.video.assets.create({
          input: [{ url: 'https://muxed.s3.amazonaws.com/leds.mp4' }],
          playback_policy: ['public'],
          encoding_tier: 'baseline',
        });

        if (asset) {
          // Insert the new Mux data into your database
          await supabase
            .from('mux_data')
            .insert({
              chapter_id: params.chapterId,
              asset_id: asset.id,
              playback_id: asset.playback_ids?.[0]?.id,
            });
        }
      } catch (error) {
        ////console.log("[Mux Asset Create]", error);
      }
    }

    return NextResponse.json(chapter);
  } catch (error: any) {
    ////console.log("[CHAPTER_UPDATE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
