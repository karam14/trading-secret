// /actions/goLive.ts

import { createClient } from "@/utils/supabase/client";
import { createLiveRoom } from "@/utils/livekit/generateToken";
import getUser from "./get-user";

export async function goLive({ title, description, type }: { title: string; description: string; type: string; }) {
  const supabase = createClient();
  const { user, error: UserError } = await getUser();

  if (!user) {
    throw new Error("User not authenticated");
  }

  try {
    // Create the LiveKit room with the correct type
    const roomName = await createLiveRoom(user.id, type);
    const streamKey = `stream_${roomName}_${user.id}`;

    // Insert the stream into the streams table
    const { data: stream, error: streamError } = await supabase
      .from('streams')
      .insert({
        creator_id: user.id,
        title,
        description,
        date: new Date().toISOString(),
        type,
        stream_key: streamKey,
        is_live: true,
      })
      .select()
      .single();

    if (streamError) throw new Error(`Failed to create stream: ${streamError.message}`);

    // Insert the session into the stream_sessions table
    const { error: sessionError } = await supabase
      .from('stream_sessions')
      .insert({
        stream_id: stream.id,
        session_start: new Date().toISOString(),
        is_active: true,
        room_name: roomName,
      });

    if (sessionError) throw new Error(`Failed to create session: ${sessionError.message}`);

    return roomName;
  } catch (error: any) {
    throw new Error(error.message);
  }
}
