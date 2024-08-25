import { createClient } from "@/utils/supabase/server";
import { jwtDecode } from "jwt-decode";

export default async function getSafeProfile() {
  const supabase = createClient();
  const { data: session } = await supabase.auth.getSession();

  if (!session || !session.session?.user) {
    return null;
  }

  const userId = session.session?.user.id;
  const email = session.session.user.email || ""; // Provide a fallback here
  const token = session.session.access_token;

  interface DecodedToken {
    user_role: string;
    [key: string]: any;
  }

  const roleClaim = token ? (jwtDecode(token) as DecodedToken).user_role : null;

  // Attempt to fetch the profile
  let { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('name, image_url, created_at, updated_at')
    .eq('id', userId)
    .single();

  // If no profile exists, insert a new one
  if (profileError && profileError.code === 'PGRST116') { // PGRST116 corresponds to "No data found"
    const { error: insertError } = await supabase
      .from('profiles')
      .insert({
        id: userId,
        name: email, // Use email as a placeholder for name
        image_url: null, // Default value, can be updated later
      });

    if (insertError) {
      console.error("[getSafeProfile] Error inserting new profile:", insertError);
      return null;
    }

    // Fetch the newly created profile
    ({ data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('name, image_url, created_at, updated_at')
      .eq('id', userId)
      .single());
  }

  if (profileError) {
    console.error("[getSafeProfile] Error fetching profile:", profileError);
    return null;
  }

  const safeProfile = {
    id: userId,
    email,  // Use the non-undefined email here
    role: roleClaim,
    name: profile?.name || email,  // Use email as fallback for name
    image_url: profile?.image_url || null,
    created_at: profile?.created_at ? new Date(profile.created_at).toISOString() : null,
    updated_at: profile?.updated_at ? new Date(profile.updated_at).toISOString() : null,
  };

  return safeProfile;
}
