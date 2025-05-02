import { setDecision } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { tokenId, decision } = await request.json();

    if (!tokenId || !decision) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    await setDecision(tokenId, decision);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error setting decision:', error);
    return NextResponse.json(
      { error: 'Failed to set decision' },
      { status: 500 }
    );
  }
} 