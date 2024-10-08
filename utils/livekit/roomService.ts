"use server";

import exp from "constants";
import { RoomServiceClient } from "livekit-server-sdk";

import type { ParticipantInfo, TrackInfo } from "livekit-server-sdk";
import { createClient } from "../supabase/server";

export async function client () {
    const apiKey = process.env.LIVEKIT_API_KEY as string;
const apiSecret = process.env.LIVEKIT_API_SECRET as string;
const url = process.env.NEXT_PUBLIC_LIVEKIT_URL as string;
    const ServiceClient = new RoomServiceClient(url, apiKey, apiSecret);
    console.log('client',  apiKey,url, apiSecret);
    return ServiceClient;
};
export async function updateSession(roomName: string, status: true | false) {
  const supabase = createClient();

  try {
    console.log('updateSession', roomName, status);

    if (status) {
      // Update the session to be active
      const { error } = await supabase.from('stream_sessions').update({
        is_active: status,
      }).eq('room_name', roomName);

      if (error) {
        throw error;
      }
      console.log(`Session ${roomName} updated to active.`);
    } else {
      console.log(`Session ${roomName} updated to inactive.`);
      // fetch the stream id from sessions tabl
      const { data, error} = await supabase.from('stream_sessions').select('stream_id').eq('room_name', roomName).single();
      if (error) {
        console.error('Failed to fetch stream id:', error);
      }
      console.log('data', data);
      const streamId = data!.stream_id;
      console.log('streamId', streamId);
      await supabase.from('stream_sessions').update({
        is_active: status,
      }).eq('room_name', roomName);
      // delete the stream from the streams table
      await supabase.from('streams').delete().eq('id', streamId);

      console.log(`Session ${roomName} deleted.`);
    }
  } catch (error) {
    console.error('Failed to update session:', error);
  }
}
export async function deleteRoom(roomName: string) {
  try {
    const ServiceClient = await client();
    await updateSession(roomName, false);

    console.log('deleteRoom', roomName);
    await ServiceClient.updateRoomMetadata (roomName, 'ended');

    await ServiceClient.deleteRoom(roomName);
    

  }
  catch (error) {
    console.error('Failed to remove the room:', error);
  }
}

export async function listParticipants(roomName: string) {
    const ServiceClient = await client();
    const participants = await ServiceClient.listParticipants(roomName);
  
    // Simplify the participant objects to plain JSON-serializable objects
    const plainParticipants = participants.map(participant => ({
      sid: participant.sid,
      identity: participant.identity,
      state: participant.state,
      joinedAt: participant.joinedAt,
      metadata: participant.metadata,
      // Add any other fields you want to pass down to the client
    }));
  
    return plainParticipants;
  }
 
  export async function getParticipant(roomName: string, identity: string) {
    const ServiceClient = await client();
    const participant = await ServiceClient.getParticipant(roomName, identity);
  
    // Simplify the participant object to only include serializable properties
    const plainParticipant = {
      sid: participant.sid,
      identity: participant.identity,
      state: participant.state,
      joinedAt: participant.joinedAt,
      metadata: participant.metadata,
      tracks: participant.tracks.map(track => ({
        sid: track.sid,
        type: track.type,
        name: track.name,
        muted: track.muted,
        width: track.width,
        height: track.height,
        simulcast: track.simulcast,
        disableDtx: track.disableDtx,
        source: track.source,
        mimeType: track.mimeType,
        mid: track.mid,
        stereo: track.stereo,
        stream: track.stream,
        encryption: track.encryption,
        // Only include primitive types and simple structures
      })),
    };

    return plainParticipant;
  }  

  export async function promoteParticipant(roomName: string, identity: string) {
    const ServiceClient = await client();
    await ServiceClient.updateParticipant(roomName, identity, undefined, {
        canPublish: true,
        canSubscribe: true,
        canPublishData: true,
      })  }
  export async function demoteParticipant(roomName: string, identity: string) {
    const ServiceClient = await client();
    await ServiceClient.updateParticipant(roomName, identity, undefined, {
        canPublish: false,
        canSubscribe: true,
        canPublishData: true,
      })  }
  export async function kickParticipant(roomName: string, identity: string) {
    const ServiceClient = await client();
    await ServiceClient.removeParticipant(roomName, identity);
}