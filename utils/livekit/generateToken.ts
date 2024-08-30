// utils/livekit/generateToken.ts
"use server";
import { AccessToken, RoomServiceClient } from 'livekit-server-sdk';
import { createClient } from '../supabase/server';
import getUser from '@/actions/get-user';
import { cookies } from 'next/headers';

export async function createLiveRoom(userId: string, roomType: string) {
  const supabase = createClient();

  const userName = await supabase.from('profiles').select('name').eq('id', userId).single().then((data) => {
    return data.data?.name;
  });	
  const apiKey = process.env.LIVEKIT_API_KEY;
  const apiSecret = process.env.LIVEKIT_API_SECRET;
  const url = process.env.NEXT_PUBLIC_LIVEKIT_URL as string;
  const roomName = `room_${userName}_${roomType}_${Date.now()}`;

  const client = new RoomServiceClient(url, apiKey, apiSecret);
  
  // Adjust room settings based on roomType
  await client.createRoom({
    name: roomName,
    emptyTimeout: 2 * 60, // Room will be destroyed after 2 minutes of being empty
    
  });

  await generateToken(roomName, userId, roomType);

  return roomName;
}

export async function generateToken(roomName: string, userId: string, roomType: string) {
  const supabase = createClient();
  const apiKey = process.env.LIVEKIT_API_KEY;
  const apiSecret = process.env.LIVEKIT_API_SECRET;

  const userName = await supabase.from('profiles').select('name').eq('id', userId).single().then((data) => {
    return data.data?.name;
  });	

  const token = new AccessToken(apiKey, apiSecret, {
    identity: userName,
    ttl: '2h', // Token valid for 2 hours
  });

  token.addGrant({
    roomJoin: true,
    room: roomName,
    canPublish: true,
    canSubscribe: true,
    canPublishData: roomType === 'voice-video', // Only allow video publishing for voice-video rooms
  });

  const { user, error } = await getUser();
  if (!user || error) {
    throw new Error("User not authenticated");
  }
  const generatedToken = await token.toJwt();
  if (!generatedToken) {
    throw new Error("Failed to generate token");
  }
  console.log(generatedToken);
  const cookie = cookies();
  cookie.set('livekit_token', generatedToken, {
      expires: new Date(Date.now() + 2 * 60 * 60 * 1000), // Expires in 2 hours
      httpOnly: true, // Optional: Make the cookie HTTP-only for security
      secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
      path: '/', // Set the cookie path
  });
  console.log(cookie);
  
  
  return token.toJwt();
}
