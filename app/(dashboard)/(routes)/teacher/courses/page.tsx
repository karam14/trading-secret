import { Button } from "@/components/ui/button";
import Link from "next/link";
import { DataTable } from "./_components/data-table";
import { columns } from "./_components/columns";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

const CoursesPage = async () => {
    // Initialize Supabase client
    const supabase = createClient();

    // Authenticate the user
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
        return redirect("/");
    }

    // Fetch courses for the authenticated user
    const { data: courses, error: coursesError } = await supabase
        .from('courses')
        .select('*')

        .order('created_at', { ascending: false });

    if (coursesError) {
        console.error("[COURSES_PAGE] Error fetching courses:", coursesError);
        return <p>Failed to load courses</p>;
    }

    return (
        <div className="p-6">
            <DataTable columns={columns} data={courses} />
        </div>
    );
};

export default CoursesPage;
