"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { LogOut, LogIn } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client"; 
import { SearchInput } from "./search-input"; 
import { SafeProfile } from "@/types/types";

const supabase = createClient();

interface NavbarRoutesProps {
  currentProfile?: SafeProfile | null;
}

export const NavbarRoutes: React.FC<NavbarRoutesProps> = ({
  currentProfile
}) => {
    console.log("[NavbarRoutes] " + currentProfile?.name);
  const [user, setUser] = useState<any>(null);
  const pathname = usePathname();
  const router = useRouter();

  const isCoachPage = pathname?.startsWith("/teacher");
  const isPlayerPage = pathname?.includes("/chapters");
  const isSearchPage = pathname === "/browse";

  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getSession();
    //console.log("[NavbarRoutes] " + currentProfile?.role);
      if (data?.session) {
        const user = data.session.user;
        setUser(user);
      } else if (error) {
        console.error("[NavbarRoutes] Error fetching session:", error);
      }
    };

    fetchUser();
  }, []);

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("[NavbarRoutes] Error signing out:", error);
    } else {
      setUser(null);
      if (pathname === "/") {
        router.refresh();
      }
      else{
      router.push("/"); 
      }

    }
  };

  return (
    <>
      {isSearchPage && (
        <div className="hidden md:block">
          <SearchInput />
        </div>
      )}

      <div className="flex gap-x-2 ml-auto items-center">
        {isPlayerPage && (
            <Link href="/browse">
                <Button size="sm" variant="ghost">
                Back to Courses
                </Button>
            </Link>
        )}
        {isCoachPage  ? (
          <Link href="/">
            <Button size="sm" variant="ghost">
              <LogOut className="h-4 w-4 mr-2" />
              Exit Coach Mode
            </Button>
          </Link>
        ) : currentProfile?.role === "admin" || currentProfile?.role === "coach" ? (
          <Link href="/teacher/courses">
            <Button size="sm" variant="ghost">
              Coach Mode
            </Button>
          </Link>
        ) : null}

        {user ? (
          <>
            <div className="text-sm font-medium">
              Welcome, {currentProfile!.name}!
            </div>
            <Button size="sm" variant="ghost" onClick={handleSignOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </>
        ) : (
          <Link href="/login">
            <Button size="sm" variant="ghost">
              <LogIn className="h-4 w-4 mr-2" />
              Login
            </Button>
          </Link>
        )}

      </div>
    </>
  );
};
