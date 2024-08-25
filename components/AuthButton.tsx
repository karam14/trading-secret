import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { redirect } from "next/navigation";
import { jwtDecode } from "jwt-decode";

export default async function AuthButton() {
  const supabase = createClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return (
      <Link
        href="/login"
        className="py-2 px-3 flex rounded-md no-underline bg-btn-background hover:bg-btn-background-hover"
      >
        Login
      </Link>
    );
  }

  const { user } = session;

  // Decode the JWT token to get the role
  const token = session.access_token;
  const decodedToken: { role?: string } = jwtDecode(token); // Correctly call jwtDecode
  const role = decodedToken.role || "No role found";

  const signOut = async () => {
    await supabase.auth.signOut();
    return redirect("/login");
  };

  return (
    <div className="flex items-center gap-4">
      Hey, {user.email} ({role})!
      <form action={signOut}>
        <button className="py-2 px-4 rounded-md no-underline bg-btn-background hover:bg-btn-background-hover">
          Logout
        </button>
      </form>
    </div>
  );
}
