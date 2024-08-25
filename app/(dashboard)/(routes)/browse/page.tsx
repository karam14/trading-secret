import { createClient } from "@/utils/supabase/server"; // Adjust the path to your Supabase client utility
import { redirect } from "next/navigation";

import { SearchInput } from "@/components/search-input";
import { getCourses } from "@/actions/get-courses";
import { CoursesList } from "@/components/courses-list";
import { Categories } from "./_components/categories";

interface SearchPageProps {
  searchParams: {
    title: string;
    categoryId: string;
  }
};

const SearchPage = async ({ searchParams }: SearchPageProps) => {
  const supabase = createClient();
  const { data: session } = await supabase.auth.getUser();


  const userId = session.user?.id;

  const { data: categories, error: categoriesError } = await supabase
    .from('categories')
    .select('id, name')
    .order('name', { ascending: true });

  if (categoriesError) {
    console.error("Error fetching categories:", categoriesError.message);
    return redirect("/");
  }

  const courses = await getCourses({
    userId,
    ...searchParams,
  });

  return (
    <>
      <div className="px-6 pt-6 md:hidden md:mb-0 block">
        <SearchInput />
      </div>
      <div className="p-6 space-y-4">
        <Categories items={categories || []} />
        <CoursesList items={courses} />
      </div>
    </>
  );
}

export default SearchPage;
