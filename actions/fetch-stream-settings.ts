// actions/fetchStreamSettings.ts

import { createClient } from "@/utils/supabase/server";
import { v4 as uuidv4 } from 'uuid'; // Use uuid to generate a placeholder stream key

export async function fetchStreamSettings(userId: string) {
  const supabase = createClient();

  // Fetch the user's profile settings
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('stream_display_name, bio, stream_key, stream_url')
    .eq('id', userId)
    .single();

  if (error) {
    throw new Error(`Failed to fetch user settings: ${error.message}`);
  }

  // If the user doesn't have a stream key, generate a placeholder one
  if (!profile.stream_key) {
    const placeholderStreamKey = "You Don't Have Stream Key Yet"; // Generate a unique placeholder key
    const placeholderStreamUrl = "You Don't Have Stream URL Yet"; // Generate a unique placeholder URL
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ stream_key: placeholderStreamKey, stream_url: placeholderStreamUrl })
      .eq('id', userId);

    if (updateError) {
      throw new Error(`Failed to set placeholder stream key: ${updateError.message}`);
    }
    

    profile.stream_key = placeholderStreamKey; // Update the profile object
  }

  return profile;
}
