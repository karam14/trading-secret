import { Database } from "@/types/supabase";
import { createClient } from "@/utils/supabase/client";

// Fetch leaderboard data (top 10 providers) from the 'providers' table in Supabase
export async function getLeaderboardData() {
  const supabase = createClient();

  // Fetch top 10 providers based on their score from the 'providers' table
  const { data, error } = await supabase
    .from('providers')
    .select(`
      id, 
      win_ratio, 
      score, 
      profiles (
        name, 
        image_url
      )
    `)
    .order('score', { ascending: false }) // Order by score in descending order
    .limit(10); // Limit the results to the top 10

  if (error) {
    console.error('Error fetching leaderboard data:', error);
    return [];
  }

  // Map the data to the expected format
  return data.map(entry => ({
    id: entry.id,
    name: entry.profiles?.name || 'Unknown Provider', // Fallback if no name
    avatar: entry.profiles?.image_url || '/default-avatar.png', // Fallback if no avatar
    winRatio: entry.win_ratio,
    score: entry.score
  }));
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
        closing_price,
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
        closing_price: signal.closing_price,
        provider_id: signal.providers?.id || null,  // Add provider_id as expected by Signal type
        provider: {
          id : signal.providers?.id || null,
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
      closing_price: signal.closing_price,
      provider_id: signal.providers?.id || null,  // Add provider_id as expected by Signal type
      provider: {
        id : signal.providers?.id || null,
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


// Fetch provider data based on provider_id
export async function fetchProviderData(providerId: string) {
  const supabase = createClient();

  try {
    // Fetch provider details
    const { data: providerData, error: providerError } = await supabase
      .from("providers")
      .select("win_ratio, score, is_super, profile_view(name, image_url)")
      .eq("id", providerId)
      .single();
    console.log(providerData);
    if (providerError || !providerData) {
      console.error("Error fetching provider data:", providerError);
      return null;
    }

    // Fetch recent live signals (as a substitute for trades)
    const { data: recentSignals, error: signalsError } = await supabase
      .from("live_signals")
      .select("id, pair, type, status, entry_price, timestamp, closing_price, tp1, tp2, tp3")
      .eq("provider_id", providerId)
      .order("timestamp", { ascending: false })
      .limit(5);  // Limit to the 5 most recent signals

    if (signalsError) {
      console.error("Error fetching recent signals:", signalsError);
      return null;
    }

    return {
      provider: providerData,
      recentSignals: recentSignals || [],
    };
  } catch (error) {
    console.error("Error fetching provider data:", error);
    return null;
  }
}
