// actions/fetchUserStreams.ts

import { createClient } from "@/utils/supabase/server";

export async function fetchUserStreams(userId: string) {
  const supabase = createClient();

  const { data: streams, error } = await supabase
    .from('streams')
    .select('*')
    .eq('creator_id', userId)
    .order('date', { ascending: true });

  if (error) {
    throw new Error(`Failed to fetch streams: ${error.message}`);
  }

  return streams || []; // Return an empty array if no streams are found
}
