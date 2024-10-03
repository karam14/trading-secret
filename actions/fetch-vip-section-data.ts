import { Database } from "@/types/supabase";
import { createClient } from "@/utils/supabase/client";

// Fetch leaderboard data from Supabase
export async function getLeaderboardData() {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('leaderboard')
      .select('provider_id, win_ratio, score, providers!inner(id, profile_id, profiles(name, image_url))')
      .order('score', { ascending: false });
  
    if (error) {
      console.error('Error fetching leaderboard data:', error);
      return [];
    }
  
    return data.map(entry => ({
      id: entry.provider_id,
      name: entry.providers.profiles!.name,
      avatar: entry.providers.profiles!.image_url || '/default-avatar.png', // Fallback if no avatar
      winRatio: entry.win_ratio,
      score: entry.score
    }));
  }

  interface LiveSignal {
    id: string;
    pair: string;
    type: string;
    entry_price: number;
    tp1: number;
    tp2: number;
    tp3: number;
    sl: number;
    status: string;
    timestamp: string;
    description: string;
    providers: {
      id: string;
      is_super: boolean;
      profile_id: string;
      profiles: {
        name: string;
        image_url: string | null;
      };
    };
  }
  // Define explicit types for the nested relationship
  interface LiveSignal {
    id: string;
    pair: string;
    type: string;
    entry_price: number;
    tp1: number;
    tp2: number;
    tp3: number;
    sl: number;
    status: string;
    timestamp: string;
    description: string;
    providers: {
      id: string;
      is_super: boolean;
      profile_id: string;
      profiles: {
        name: string;
        image_url: string | null;
      };
    };
  }
  
  // Fetch live signals data from Supabase
// Modify getLiveSignalsData function to return data matching the Signal type
export async function getLiveSignalsData() {
    const supabase = createClient();
  
    const { data, error } = await supabase
      .from('live_signals')
      .select(`
        id, 
        pair, 
        type, 
        entry_price, 
        tp1, 
        tp2, 
        tp3, 
        sl, 
        status, 
        timestamp, 
        description, 
        providers (
            id,
          is_super, 
          profile_view (name, image_url)
        )
      `)
      .order('timestamp', { ascending: false });
  
    if (error) {
      console.error('Error fetching live signals:', error);
      return [];
    }
    console.log(data!.map(signal => ({
        id: signal.id,
        pair: signal.pair,
        type: signal.type,
        entry_price: signal.entry_price,
        tp1: signal.tp1,
        tp2: signal.tp2,
        tp3: signal.tp3,
        sl: signal.sl,
        status: signal.status,
        timestamp: signal.timestamp,
        description: signal.description,
        provider_id: signal.providers?.id || null,  // Add provider_id as expected by Signal type
        provider: {
          name: signal.providers?.profile_view?.name || 'Unknown',  // Fallback to 'Unknown' if name is not available
          avatar: signal.providers?.profile_view?.image_url || '',
          isSuper: signal.providers?.is_super || false
        },
      })));
    // Map data to the expected Signal structure
    return data!.map(signal => ({
      id: signal.id,
      pair: signal.pair,
      type: signal.type,
      entry_price: signal.entry_price,
      tp1: signal.tp1,
      tp2: signal.tp2,
      tp3: signal.tp3,
      sl: signal.sl,
      status: signal.status,
      timestamp: signal.timestamp,
      description: signal.description,
      provider_id: signal.providers?.id || null,  // Add provider_id as expected by Signal type
      provider: {
        name: signal.providers?.profile_view?.name || 'Unknown',  // Fallback to 'Unknown' if name is not available
        avatar: signal.providers?.profile_view?.image_url || '/default-avatar.png',
        isSuper: signal.providers?.is_super || false
      },
    }));
  }
  
  interface OverallStats {
    avg_win_ratio: number;
    avg_score: number;
  }
  
  
  export async function getOverallStats() {
    const supabase = createClient();
  

  // Fetch average win_ratio and score from the 'providers' table using aggregate functions
  const { data, error } = await supabase
    .from('providers')
    .select('avg_win_ratio:win_ratio.avg(), avg_score:score.avg()').single<OverallStats>();  // Use the .single() method and cast it as OverallStats


  // Error handling
  if (error) {
    console.error('Error fetching stats:', error);
    return { avgWinRatio: 0, avgScore: 0 };
  }

  // Return the results in a usable format (multiply avg_win_ratio by 100 to get percentage and round to 2 decimal places)
  return {
    avgWinRatio: (data.avg_win_ratio * 100).toFixed(2),  // Convert win ratio to a percentage and round to 2 decimals
    avgScore: data.avg_score.toFixed(2)  // Round score to 2 decimals
  };
}
  
// actions/check-vip.js
export async function checkVip(userId: string) {
    const supabase = createClient();

    try {
      const { data: profile, error } = await supabase
        .from("profile_view")
        .select("vip")
        .eq("id", userId)
        .single();
  
      if (error) {
        console.error("Error fetching VIP status:", error);
        return false;
      }
  
      console.log("Profile fetched:", profile); // Add this line to log the profile data
      return profile?.vip ?? false;
    } catch (err) {
      console.error("Error during VIP check:", err);
      return false;
    }
  }