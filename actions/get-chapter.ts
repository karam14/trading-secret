import { createClient } from "@/utils/supabase/client";

interface GetChapterProps {
  userId: string;
  courseId: string;
  chapterId: string;
}

export const getChapter = async ({ 
  userId, 
  courseId, 
  chapterId 
}: GetChapterProps) => {
  const supabase = createClient();

  try {
    // Step 1: Check if the user has purchased the course
    const { data: purchase, error: purchaseError } = await supabase
      .from('purchases')
      .select('*')
      .eq('user_id', userId)
      .eq('course_id', courseId)
      .maybeSingle();  // Use maybeSingle() to handle no rows

    if (purchaseError) {
      console.error("[getChapter] Error fetching purchase:", purchaseError);
    }

    // Step 2: Fetch the course details
    const { data: course, error: courseError } = await supabase
      .from('courses')
      .select('price')
      .eq('id', courseId)
      .eq('is_published', true)
      .maybeSingle();

    if (courseError || !course) {
      throw new Error(`Course not found or is not published: ${courseError?.code + " " + courseError?.message + " " + courseError?.details + " " + courseError?.hint}`);
    }

    // Step 3: Fetch the chapter details
    const { data: chapter, error: chapterError } = await supabase
      .from('chapters')
      .select(`
        id, 
        title, 
        course_id, 
        is_free, 
        is_published, 
        position, 
        description, 
        video_url, 
        video_name, 
        created_at, 
        updated_at
      `)
      .eq('id', chapterId)
      .eq('is_published', true)
      .single();

    if (chapterError || !chapter) {
      throw new Error("Chapter not found or is not published");
    }

    let cloudinaryData = null;
    let attachments: { id: string; url: string; name: string }[] = [];
    let nextChapter = null;

    // Step 4: Fetch attachments if the user has purchased the course
    if (purchase) {
      const { data: fetchedAttachments, error: attachmentsError } = await supabase
        .from('attachments')
        .select('id, url, name')
        .eq('course_id', courseId);

      if (attachmentsError) {
        console.error("[getChapter] Error fetching attachments:", attachmentsError);
      } else {
        attachments = fetchedAttachments || [];
      }
    }

    // Step 5: Fetch Cloudinary data and next chapter if the chapter is free or purchased
    if (chapter.is_free || purchase) {
      const { data: fetchedCloudinaryData, error: cloudinaryDataError } = await supabase
        .from('cloudinary_data')
        .select('public_id')
        .eq('chapter_id', chapterId)
        .maybeSingle();

      if (cloudinaryDataError) {
        console.error("[getChapter] Error fetching Cloudinary data:", cloudinaryDataError);
      } else {
        cloudinaryData = fetchedCloudinaryData;
      }

      const { data: fetchedNextChapter, error: nextChapterError } = await supabase
        .from('chapters')
        .select('id')
        .eq('course_id', courseId)
        .eq('is_published', true)
        .gt('position', chapter.position)
        .order('position', { ascending: true })
        .maybeSingle();

      if (nextChapterError) {
        console.error("[getChapter] Error fetching next chapter:", nextChapterError);
      } else {
        nextChapter = fetchedNextChapter;
      }
    }

    // Step 6: Fetch user progress for the chapter
    const { data: userProgress, error: userProgressError } = await supabase
      .from('user_progress')
      .select('is_completed')
      .eq('user_id', userId)
      .eq('chapter_id', chapterId)
      .maybeSingle();

    if (userProgressError) {
      console.error("[getChapter] Error fetching user progress:", userProgressError);
    }
    return {
      chapter: {
        id: chapter.id,
        title: chapter.title,
        course_id: chapter.course_id,
        is_free: chapter.is_free,
        is_published: chapter.is_published,
        position: chapter.position,
        description: chapter.description,
        video_url: chapter.video_url,
        video_name: chapter.video_name,
        created_at: chapter.created_at,
        updated_at: chapter.updated_at,
      },
      course: { price: course.price },
      cloudinaryData: cloudinaryData ? { public_id: cloudinaryData.public_id } : null, // Ensure cloudinaryData is either the expected object or null
      attachments: attachments.map(attachment => ({
        id: attachment.id,
        url: attachment.url,
        name: attachment.name,
      })),
      nextChapter: nextChapter ? { id: nextChapter.id } : null, // Ensure nextChapter is either the expected object or null
      userProgress: userProgress ? { is_completed: userProgress.is_completed } : null, // Ensure userProgress is either the expected object or null
      purchase: !!purchase,
    };
    
  } catch (error) {
    console.error("[getChapter] Unexpected error:", error);
    return {
      chapter: null,
      course: null,
      cloudinaryData: null ,
      attachments: [],
      nextChapter: null,
      userProgress: null,
      purchase: null,
    };
  }
};
