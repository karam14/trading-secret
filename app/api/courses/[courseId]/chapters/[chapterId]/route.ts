import { createClient } from "@/utils/supabase/server"; // Supabase client setup
import { NextResponse } from "next/server";


import cloudinary from 'cloudinary';

// Configure Cloudinary with environment variables
cloudinary.v2.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
export async function DELETE(req: Request, { params }: { params: { chapterId: string } }) {
  try {
    const supabase = createClient();
    
    // Authenticate the user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { chapterId } = params;

    // Fetch the chapter details including video name
    const { data: chapter, error: chapterError } = await supabase
      .from('chapters')
      .select('id, video_name')
      .eq('id', chapterId)
      .single();

    if (chapterError || !chapter) {
      console.error("[CHAPTERS] Error:", chapterError || "Chapter not found");
      throw new Error(chapterError?.message || "Chapter not found");
    }

    // Fetch and delete Cloudinary data associated with this chapter
    const { data: cloudinaryData, error: cloudinaryDataError } = await supabase
      .from('cloudinary_data')
      .select('public_id')
      .eq('chapter_id', chapterId)
      .single();

    if (cloudinaryDataError) {
      console.error("[Cloudinary Data Fetch Error]", cloudinaryDataError);
    }

    // Delete associated Cloudinary asset
    if (cloudinaryData) {
      try {
        // Delete the Cloudinary asset using the public_id and resource_type
        await cloudinary.v2.uploader.destroy(cloudinaryData.public_id,{resource_type: 'video'});
        
        // Delete the Cloudinary data from the database
        await supabase
          .from('cloudinary_data')
          .delete()
          .eq('chapter_id', chapterId);
      } catch (error) {
        console.error("[Cloudinary Asset Delete Error]", error);
      }
    }

    // Delete the chapter itself
    const { error: deleteChapterError } = await supabase
      .from('chapters')
      .delete()
      .eq('id', chapterId);

    if (deleteChapterError) {
      console.error("[CHAPTERS] Error:", deleteChapterError);
      throw new Error(deleteChapterError.message);
    }

    return new NextResponse(null, { status: 204 });

  } catch (error) {
    console.error("[CHAPTERS] Error:", error);
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
    const { video_url, video_name, ...values } = await req.json(); // Extract video_url and video_name from the request body

    console.log("[CHAPTER_UPDATE] Received values:", values);
    console.log("[CHAPTER_UPDATE] Received video_url:", video_url);

    if (userError || !user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Include video_url in the values object before updating the chapter
    const updateValues = {
      ...values,
      video_url: video_url || values.video_url,
      video_name: video_name || values.video_name // Ensure video_url is included in the update
    };

    // Update the chapter with the new values, including video_url
    const { data: chapter, error: chapterError } = await supabase
      .from('chapters')
      .update(updateValues)
      .eq('id', params.chapterId)
      .eq('course_id', params.courseId)
      .maybeSingle();

    if (chapterError) throw new Error(chapterError.message);

    // Prepare the Cloudinary data
    const cloudinaryData = {
      chapter_id: params.chapterId,
      public_id: video_name,
    };
    
    // Handle Cloudinary video updates
    if (video_url && video_name) {
      // Use upsert to insert or update Cloudinary data
      const { data: cloudinary_data, error: cloudinary_dataError } = await supabase
        .from('cloudinary_data')
        .upsert(cloudinaryData)
        .eq('chapter_id', params.chapterId)  // Use eq to match by chapter_id
        .maybeSingle();

      if (cloudinary_dataError) {
        console.error("[CHAPTER_UPDATE] Cloudinary data error:", cloudinary_dataError);
        throw new Error(cloudinary_dataError.message);
      }

      console.log("[CHAPTER_UPDATE] Upserted Cloudinary data:", cloudinary_data);
    }

    return NextResponse.json(chapter);
  } catch (error: any) {
    console.error("[CHAPTER_UPDATE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
