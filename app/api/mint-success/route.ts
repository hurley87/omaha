import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

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