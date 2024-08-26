"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export const signIn = async (formData: FormData) => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const supabase = createClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.log(error);
    return redirect("/login?message=Could not authenticate user");
  }

  if (data.session) {
    supabase.auth.setSession(data.session);
  }

  return redirect("/");
};

export const signUp = async (formData: FormData) => {
  const origin = process.env.NEXT_PUBLIC_APP_URL;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const firstName = formData.get("firstName") as string;
  const lastName = formData.get("lastName") as string;
  const supabase = createClient();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
      data: {
        firstName,
        lastName,
      },
    },
  });

  if (error) {
    console.log(error);
    return redirect("/login?message=Could not authenticate user");
  }

  return redirect("/login?message=Check your email to continue");
};
