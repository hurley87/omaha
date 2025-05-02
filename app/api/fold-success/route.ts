import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { gameId, tokenId, txHash, player, refundAmount } = await request.json();

    const supabase = createClient();

    // Update the hand's decision to 'fold'
    const { error } = await supabase
      .from('hands')
      .update({ 
        decision: 'fold',
        tx_hash: txHash,
        refund_amount: refundAmount
      })
      .eq('game_id', gameId)
      .eq('token_id', tokenId)
      .eq('player', player);

    if (error) {
      console.error('Error updating hand:', error);
      return NextResponse.json({ error: 'Failed to update hand' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in fold-success:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 