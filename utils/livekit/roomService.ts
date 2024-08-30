"use server";

import exp from "constants";
import { RoomServiceClient } from "livekit-server-sdk";

import type { ParticipantInfo, TrackInfo } from "livekit-server-sdk";

export async function client () {
    const apiKey = process.env.LIVEKIT_API_KEY as string;
const apiSecret = process.env.LIVEKIT_API_SECRET as string;
const url = process.env.NEXT_PUBLIC_LIVEKIT_URL as string;
    const ServiceClient = new RoomServiceClient(url, apiKey, apiSecret);
    console.log('client',  apiKey,url, apiSecret);
    return ServiceClient;
};

export async function deleteRoom(roomName: string) {
    const ServiceClient = await client();
    await ServiceClient.deleteRoom(roomName);
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