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

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('name, image_url, created_at, updated_at')
    .eq('id', userId)
    .single();

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
