import { createClient } from "@/utils/supabase/server";
import { jwtDecode } from "jwt-decode";

export default async function getSafeProfile() {
  const supabase = createClient();
  const { data: session } = await supabase.auth.getSession();

  if (!session || !session.session?.user) {
    return null;
  }

  const userId = session.session?.user.id;

  // Extract role directly from the JWT
  const token = session.session.access_token;
  const roleClaim = token ? jwtDecode(token).user_role : null
  //console.log("[getSafeProfile] Role claim:", roleClaim);


  // Fetch additional profile data from the custom profiles table
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('name, image_url, created_at, updated_at')
    .eq('id', userId)
    .single();

  if (profileError) {
    console.error("[getSafeProfile] Error fetching profile:", profileError);
    return null;
  }

  // Combine data from auth.users and profiles tables, and role from JWT
  const safeProfile = {
    id: userId,
    email: session.session.user.email,
    role: roleClaim ,
    name: profile?.name || session.user.email,  // Use email as fallback for name
    image_url: profile?.image_url || null,
    created_at: profile?.created_at ? new Date(profile.created_at).toISOString() : null,
    updated_at: profile?.updated_at ? new Date(profile.updated_at).toISOString() : null,
  };

  return safeProfile;
}
