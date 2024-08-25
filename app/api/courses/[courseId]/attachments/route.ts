import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function POST(
    req: Request,
    { params }: { params: { courseId: string } }
)
{
    try {
        const supabase = createClient();
        
        // Get the headers to authenticate the user
        const { data: { user }, error: userError } = await supabase.auth.getUser();

        if (userError || !user) {
            return new NextResponse("Unauthorized", { status: 401 });
        }
        const { url } = await req.json();
        
        const courseOwner = await supabase.from('courses').select('user_id').eq('id', params.courseId).single();
        if (courseOwner.error) {
            throw new Error(courseOwner.error.message);
        }
        if (courseOwner.data.user_id !== user.id) {
            return new NextResponse("Unauthorized", { status: 401 });
        }
        const { data: attachment, error: attachmentError } = await supabase.from('attachments').insert({
            course_id: params.courseId,
            name: url.split('/').pop(),
            url
        }).single();
        return  NextResponse.json(attachment);
    }
    catch (error: any) {
        ////console.log("COURSE_ID_ATTACHMENTS", error)
        return new NextResponse(error.message, { status: 500 });
    }
}

