

import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { IconBadge } from "@/components/icon-badge";
import { CircleDollarSign, File, Layout, LayoutDashboard, ListChecks } from "lucide-react";
import { TitleForm } from "./_components/title-form";
import { DescriptionForm } from "./_components/description-form";
import { ImageForm } from "./_components/image-form"
  ;
import { CategoryForm } from "./_components/category-form";
import { AttachmentForm } from "./_components/attachment-form";
import ChaptersForm from "./_components/chapter-form";
import { Banner } from "@/components/banner";
import { Actions } from "./_components/actions";
const CourseIdPage = async ({
  params
}: {
  params: {
    courseId: string;
  };
}) => {
  "use server";
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return redirect("/");
  }

  const { courseId } = params;
  const { data: course, error } = await supabase
    .from('courses')
    .select(`
      *,
      attachments (
        id,
        name,
        url,
        created_at
      ),
      chapters (
        id,
        title,
        position,
        is_published,
        is_free,
        video_url
      )
    `)
    .eq('id', courseId)
    .single();

  // Ensure chapters are sorted by position after fetching
  // Ensure chapters are sorted by position after fetching
  if (course && course.chapters) {
    course.chapters.sort((a: { position: number }, b: { position: number }) => a.position - b.position);
  }


  if (error) {
    console.error('Error fetching course:', error);
  }

  if (error) {
    console.error('Error fetching course:', error);
    // Handle the error as needed
  } else {
    // Ensure attachments is always an array
    course.attachments = course.attachments ?? [];

  }

  if (!course) {
    return redirect("/");
  }
  if (course.user_id !== user.id) {
    return new NextResponse("Unauthorized", { status: 401 });
  }
  const { data: categories } = await supabase
    .from('categories')
    .select()
    .order('name', { ascending: true });

  if (error) {
    console.error('Error fetching categories:', error);
  }




  const requiredFields = [
    course.title,
    course.description,
    course.imageUrl,
    course.categoryId
  ];

  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;

  const completionText = `${completedFields}/${totalFields} fields completed`;
  const isComplete = requiredFields.every(Boolean);

  return (
    <>
      {!course.is_published && (
        <Banner
          label="This course is unpublished. It won't be available to students until you publish it." />
      )}
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-y-2">
            <h1 className="text-2xl font-medium">Course Setup</h1>
            <span className="text-sm text-slate-700">{completionText}</span>

          </div>
          {/* Add Action Buttons */}
          <Actions
            disabled={!isComplete}
            courseId={course.id}
            isPublished={course.is_published}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={LayoutDashboard} />
              <h2 className="text-xl">Customize your course</h2>
            </div>
            <TitleForm initialData={course} courseId={course.id} />
            <DescriptionForm initialData={course} courseId={course.id} />
            <ImageForm initialData={course} courseId={course.id} />
            <CategoryForm
              initialData={course}
              courseId={course.id}
              options={categories?.map((category) => ({
                label: category.name as string,
                value: category.id as string,
              })) || []}
            />
          </div>
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={ListChecks} />
                <h2 className="text-xl">Course chapters</h2>
              </div>
              <ChaptersForm initialData={course} courseId={course.id} />
            </div>
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={File} />
                <h2 className="text-xl">Resources & Attachments</h2>
              </div>
              <AttachmentForm initialData={course} courseId={course.id} />
            </div>
          </div>



        </div>
      </div>
    </>
  );
}

export default CourseIdPage;