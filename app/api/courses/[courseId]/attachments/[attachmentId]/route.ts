import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";
import { UTApi } from "uploadthing/server";
 
const utapi = new UTApi();
export async function DELETE(
  req: Request,
  { params }: { params: { courseId: string, attachmentId: string } }
) {
  try {
    const supabase = createClient();

    // Get the headers to authenticate the user
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }



    // Get the attachment to retrieve the file name before deletion
    const { data: attachment, error: attachmentError } = await supabase
      .from('attachments')
      .select('name')
      .eq('id', params.attachmentId)
      .eq('course_id', params.courseId)
      .single();

    if (attachmentError || !attachment) {
      throw new Error(attachmentError?.message || "Attachment not found");
    }

    // Delete the attachment from the database
    const { error: deleteError } = await supabase
      .from('attachments')
      .delete()
      .eq('id', params.attachmentId)
      .eq('course_id', params.courseId);



    // Delete the file from UploadThing
    await utapi.deleteFiles([attachment.name]);

    if (deleteError) {
      throw new Error(deleteError.message);
    }


    return new NextResponse("Attachment deleted successfully", { status: 200 });
  } catch (error: any) {
    ////console.log("DELETE_ATTACHMENT_ERROR", error);
    return new NextResponse(error.message, { status: 500 });
  }
}
