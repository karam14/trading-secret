// src/app/[searchParams]/page.tsx
import { fetchCategories } from "@/actions/fetch-categories";
import { getCourses } from "@/actions/get-courses";
import getUser from "@/actions/get-user";
import { redirect } from "next/navigation";

import { SearchInput } from "@/components/search-input";
import { CoursesList } from "@/components/courses-list";
import { Categories } from "./_components/categories";

interface SearchPageProps {
  searchParams: {
    title: string;
    categoryId: string;
  }
}

const SearchPage = async ({ searchParams }: SearchPageProps) => {
  const { user, error } = await getUser();

  if (error) {
    console.error("Error fetching user:", error.message);
    return redirect("/");
  }

  const userId = user?.id as string;

  // Fetch categories using the server action
  const categories = await fetchCategories();

  if (!categories) {
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
        <Categories items={categories} />
        <CoursesList items={courses} />
      </div>
    </>
  );
}

export default SearchPage;
