"use server";


import getUser from "@/actions/get-user";
import { createClient } from "@/utils/supabase/server";
import { jwtDecode } from "jwt-decode";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const supabase = createClient();
        const { user, error} = await getUser();
        if (error || !user) {
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
