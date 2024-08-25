import { createClient } from "@/utils/supabase/server";
import { jwtDecode } from "jwt-decode";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const supabase = createClient();

        const { data: { user }, error: userError } = await supabase.auth.getUser();
        const { data, error } = await supabase.auth.getSession();
        const token = data.session!.access_token;
        const decodedToken = jwtDecode(token);
        ////console.log("Session data:", decodedToken);
        if (userError || !user) {
            return new NextResponse("Unauthorized", { status: 401 });
        }


        const { name } = await req.json();

        const { data: category, error: insertError } = await supabase
            .from('categories')
            .insert([{ name }])
            .select()
            .single();
            

        if (insertError) {
            throw new Error(insertError.message);
        }

        return NextResponse.json(category);

    } catch (error) {
        console.error("[CATEGORIES] Error:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
