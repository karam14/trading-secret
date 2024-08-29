// actions/updateSettings.ts

import { createClient } from "@/utils/supabase/client";
import { get } from "http";
import getUser from "./get-user";

export async function updateStreamSettings( settings: { stream_display_name: string; bio: string; stream_key?: string; stream_url?: string }) {
  const supabase = createClient();
    const { user, error : userError } = await getUser();
    const userId = user?.id as string;

  // Update the user's profile settings in the database
  const { error } = await supabase
    .from('profiles')
    .update({
      stream_display_name: settings.stream_display_name,
      bio: settings.bio,
      stream_key: settings.stream_key, // Stream key is optional
      stream_url: settings.stream_url, // Stream URL is optional
    })
    .eq('id', userId);

  if (error) {
    throw new Error(`Failed to update settings: ${error.message}`);
  }

  return { success: true };
}
