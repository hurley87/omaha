import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';

if (!process.env.SUPABASE_URL) {
  throw new Error('Missing environment variable: SUPABASE_URL');
}

if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error('Missing environment variable: SUPABASE_SERVICE_ROLE_KEY');
}

/**
 * Creates a Supabase client with service role key.
 * This should only be used in server-side code.
 * 
 * @returns {SupabaseClient} A Supabase client instance with service role permissions
 */
export const supabase = createClient<Database>(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
); 

/**
 * Get a player's hand for a given game.
 * 
 * @param gameId - The ID of the game
 * @param wallet - The wallet address of the player
 * @returns The player's hand or null if not found
 */
export async function getMyHand(gameId: number, wallet: `0x${string}`) {
  const { data, error } = await supabase
    .from('hands')
    .select('token_id, cards, decision')
    .eq('game_id', gameId)
    .eq('player_address', wallet.toLowerCase())
    .maybeSingle();          // returns null if not found

  if (error) throw error;
  return data;               // { token_id, cards: ["Ks","7d",…], decision } | null
}

/**
 * Set a player's decision for their hand.
 * 
 * @param tokenId - The token ID of the hand
 * @param choice - The decision to make ('play', 'fold')
 * @returns The result of the RPC call
 */
export async function setDecision(tokenId: number, choice: 'play' | 'fold' ) {
  const { data, error } = await supabase.rpc('set_decision', {
    _token_id: tokenId,
    _choice: choice
  });

  if (error) throw error;
  return data;
}

/**
 * Get the most recent pending hand for a user.
 * 
 * @param wallet - The wallet address of the player
 * @returns The most recent pending hand or null if not found
 */
export async function getMostRecentPendingHand(wallet: `0x${string}`) {
  const { data, error } = await supabase
    .from('hands')
    .select('token_id, cards, decision, game_id')
    .eq('player_address', wallet.toLowerCase())
    .eq('decision', 'pending')
    .order('game_id', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  return data;
}
