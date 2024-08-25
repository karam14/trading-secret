import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { createClient } from "@/utils/supabase/server";
import Error from "next/error";
import { NextResponse } from "next/server";
const f = createUploadthing();

const auth = async () => {
    const supabase = createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
        throw new NextResponse("Unauthorized", { status: 401 });
    }
    return user;
}

const handleAuth = async () => {
    const user = await auth();
    const userId = user.id;
    if (!userId) {
        throw new NextResponse("Unauthorized", { status: 401 });
    }
    return { userId };
};


// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  CourseImage: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } }).middleware(() => handleAuth()).onUploadComplete(() => {}), 
  courseAttachment: f(["text", "image", "video", "audio", "pdf"]).middleware(() => handleAuth()).onUploadComplete(() => {}),
  chapterVideo: f({ video: { maxFileSize: "128MB", maxFileCount: 1 } }).middleware(() => handleAuth()).onUploadComplete(() => {}),
} satisfies FileRouter;

 
export type OurFileRouter = typeof ourFileRouter;