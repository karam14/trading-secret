import { getChapter } from "@/actions/get-chapter";

import getUser from "@/actions/get-user";
import ChapterContent from "./_components/chapter-content"; // Client component

export const dynamic = 'force-dynamic';

const ChapterIdPage = async ({
  params,
}: {
  params: { courseId: string; chapterId: string };
}) => {
  const { user, error } = await getUser();

  if (error || !user) {
    console.error("[ChapterIdPage] User not authenticated:", error);
     return (<>
     
     </>);
  }
  else{
    console.log(user);
  }

  const userId = user?.id;

  const chapterData = await getChapter({
    userId,
    chapterId: params.chapterId,
    courseId: params.courseId,
  });

  if (!chapterData.chapter || !chapterData.course) {
    console.error("[ChapterIdPage] No chapter or course data found.");
    // return redirect("/");
  }

  return (
    <ChapterContent chapterData={chapterData} />  // Pass data to client component
  );
};

export default ChapterIdPage;
