import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// ❶  Initialise a *SERVICE-ROLE* client (only server code should import the key)
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/**
 * Body the client sends after its mint tx is mined.
 * {
 *   tokenId:  "8421",
 *   player:   "0xA1…F3",
 *   txHash:   "0x9c…",
 *   gameId?:  number | "latest"
 * }
 */
export async function POST(req: NextRequest) {
  const body = await req.json();

  const tokenId = BigInt(body.tokenId);
  const player  = body.player.toLowerCase();
  const txHash  = body.txHash;

  if (!tokenId || !player || !txHash)
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });

  /* -------------------------------------------------------------
   * ❷  Run everything in ONE Postgres transaction to stay atomic
   *     (If you prefer, move this PL/pgSQL into a `mint_hand` RPC.)
   * ----------------------------------------------------------- */
  const { error } = await supabase.rpc('mint_hand', {
    _player_address: player,
    _token_id:       tokenId.toString(),
    _tx_hash:        txHash
  });

  if (error) {
    console.error('mint_hand RPC failed', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}