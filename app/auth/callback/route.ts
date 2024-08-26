import { getServiceSupabase } from "@/utils/supabase/service"; // Adjust the import path as necessary
import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  // The `/auth/callback` route is required for the server-side auth flow implemented
  // by the SSR package. It exchanges an auth code for the user's session.
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const origin = requestUrl.origin;

  if (code) {
    const supabase = createClient();
    const { data: sessionData, error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error("Error exchanging code for session:", error);
      return NextResponse.redirect(`${origin}/login?error=authentication_failed`);
    }

    const user = sessionData.user;

    if (user) {
      const serviceSupabase = getServiceSupabase();

      const firstName = user.user_metadata?.firstName || "";
      const lastName = user.user_metadata?.lastName || "";
      const fullName = `${firstName} ${lastName}`.trim();

      const { error: insertError } = await serviceSupabase
        .from("profiles")
        .insert({
          id: user.id,
          name: fullName,
          vip: false,
        });

      if (insertError) {
        console.error("Error inserting user into profiles table:", insertError);
        return NextResponse.redirect(`${origin}/login?error=profile_creation_failed`);
      }
    }

    // Refresh the session to ensure everything is up to date
    await supabase.auth.refreshSession();
  }

  // URL to redirect to after sign-up process completes
  return NextResponse.redirect(`${origin}/`);
}
