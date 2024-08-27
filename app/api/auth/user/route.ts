// app/api/auth/user/route.ts
"use server";

import getUser from "@/actions/get-user";
import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = createClient();

  const {  user , error: userError } = await getUser();


  return NextResponse.json({ user });
}
