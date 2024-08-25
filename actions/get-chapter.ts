import { createClient } from "@/utils/supabase/server";

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
      .single();

    if (courseError || !course) {
      throw new Error("Course not found or is not published");
    }

    // Step 3: Fetch the chapter details
    const { data: chapter, error: chapterError } = await supabase
      .from('chapters')
      .select('*')
      .eq('id', chapterId)
      .eq('is_published', true)
      .single();

    if (chapterError || !chapter) {
      throw new Error("Chapter not found or is not published");
    }

    let muxData = null;
    let attachments = [];
    let nextChapter = null;

    // Step 4: Fetch attachments if the user has purchased the course
    if (purchase) {
      const { data: fetchedAttachments, error: attachmentsError } = await supabase
        .from('attachments')
        .select('*')
        .eq('course_id', courseId);

      if (attachmentsError) {
        console.error("[getChapter] Error fetching attachments:", attachmentsError);
      } else {
        attachments = fetchedAttachments;
      }
    }

    // Step 5: Fetch Mux data and next chapter if the chapter is free or purchased
    if (chapter.is_free || purchase) {
      const { data: fetchedMuxData, error: muxDataError } = await supabase
        .from('mux_data')
        .select('*')
        .eq('chapter_id', chapterId)
        .maybeSingle();  // Use maybeSingle() to handle no rows

      if (muxDataError) {
        console.error("[getChapter] Error fetching Mux data:", muxDataError);
      } else {
        muxData = fetchedMuxData;
      }

      const { data: fetchedNextChapter, error: nextChapterError } = await supabase
        .from('chapters')
        .select('*')
        .eq('course_id', courseId)
        .eq('is_published', true)
        .gt('position', chapter.position)
        .order('position', { ascending: true })
        .maybeSingle();  // Use maybeSingle() to handle no rows

      if (nextChapterError) {
        console.error("[getChapter] Error fetching next chapter:", nextChapterError);
      } else {
        nextChapter = fetchedNextChapter;
      }
    }

    // Step 6: Fetch user progress for the chapter
    const { data: userProgress, error: userProgressError } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', userId)
      .eq('chapter_id', chapterId)
      .maybeSingle();  // Use maybeSingle() to handle no rows

    if (userProgressError) {
      console.error("[getChapter] Error fetching user progress:", userProgressError);
    }

    return {
      chapter,
      course,
      muxData,
      attachments,
      nextChapter,
      userProgress,
      purchase,
    };

  } catch (error) {
    console.error("[getChapter] Unexpected error:", error);
    return {
      chapter: null,
      course: null,
      muxData: null,
      attachments: null,
      nextChapter: null,
      userProgress: null,
      purchase: null,
    };
  }
}
