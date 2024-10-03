// actions/scheduleStream.ts

import { createClient } from "@/utils/supabase/client";
import getUser from "./get-user";
import { UUID } from "crypto";

export async function scheduleStream(stream: { title: string; description: string; date: string; type: string; }) {
  const supabase = createClient();

  const {user,error: userError} = await getUser(); // Retrieve the current user
  if (!user || userError) {
    throw new Error("User not authenticated");
  }
  const streamKey = (await supabase.from('profiles').select('stream_key').eq('id', user.id).single()).data?.stream_key ?? '';
  const { error } = await supabase.from('streams').insert({
    creator_id: user.id,
    title: stream.title,
    description: stream.description,
    date: new Date(stream.date).toISOString(),
    type: stream.type,
    stream_key: streamKey,
  });

  if (error) {
    throw new Error(`Failed to schedule stream: ${error.message}`);
  }

  return { success: true };
}
export async function deleteStream(streamId: UUID) {
    const supabase = createClient();
  
    const { user, error: userError } = await getUser(); // Retrieve the current user
    if (!user || userError) {
      throw new Error("User not authenticated");
    }
  
    const { error } = await supabase
      .from('streams')
      .delete()
      .eq('id', streamId)
      .eq('creator_id', user.id); // Ensure that the user can only delete their own streams
  
    if (error) {
      throw new Error(`Failed to delete stream: ${error.message}`);
    }
  
    return { success: true };
  }
  export async function modifyStream( updatedStream: { id: UUID, title: string; description: string; date: string; type: string; }) {
    const supabase = createClient();
    console.log(updatedStream);
    const { user, error: userError } = await getUser(); // Retrieve the current user
    if (!user || userError) {
      throw new Error("User not authenticated");
    }
    // const streamId = await supabase.from('streams').select('id').eq('creator_id', user.id).eq('title', updatedStream.title).single().then((data) => data.data!.id);
    const streamId = updatedStream.id;
    const { error } = await supabase
      .from('streams')
      .update({
        title: updatedStream.title,
        description: updatedStream.description,
        date: new Date(updatedStream.date).toISOString(),
        type: updatedStream.type,
      })
      .eq('id', streamId)
      .eq('creator_id', user.id); // Ensure that the user can only modify their own streams

    if (error) {
      throw new Error(`Failed to modify stream: ${error.message}`);
    }
  
    return { success: true };
  }