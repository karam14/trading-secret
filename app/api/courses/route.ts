import { createClient } from "@/utils/supabase/server"; // Supabase client setup
import { NextResponse } from "next/server";
import { headers } from "next/headers";

export async function POST(req: Request) {
    try {
        // Initialize Supabase client
        const supabase = createClient();
        
        // Get the headers to authenticate the user
        const { data: { user }, error: userError } = await supabase.auth.getUser();

        if (userError || !user) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { title } = await req.json();

        // Insert new course into the database
        const { data: course, error: insertError } = await supabase
            .from('courses')
            .insert([{ user_id: user.id, title }])
            .select()  // Ensure to select the fields you need, including 'id'
            .single();  // `single()` ensures that we get the single inserted row back

        if (insertError) {
            throw new Error(insertError.message);
        }

        ////console.log("[COURSES] Course created:", course); // Log the created course

        return NextResponse.json(course);

    } catch (error) {
        ////console.log("[COURSES] Error:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
