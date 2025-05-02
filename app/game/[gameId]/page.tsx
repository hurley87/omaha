import { getMyHand } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import { PlayButton } from '@/app/components/play-button';
import FoldButton from '@/app/components/fold-button';

interface GamePageProps {
  params: {
    gameId: string;
  };
  searchParams: {
    wallet?: string;
  };
}

export default async function GamePage({ params, searchParams }: GamePageProps) {
  const gameId = parseInt(params.gameId);
  const wallet = searchParams.wallet as `0x${string}`;

  if (!wallet || isNaN(gameId)) {
    notFound();
  }

  const hand = await getMyHand(gameId, wallet);

  console.log('hand', hand);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Game #{gameId}</h1>
            <p className="text-gray-600 mt-2">Your wallet: {wallet}</p>
          </div>

          {!hand ? (
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <h2 className="text-2xl font-bold mb-4">No Hand Found</h2>
              <p className="text-gray-600">{`You don't have a hand in this game yet.`}</p>
            </div>
          ) : (
            <div>
              <h2 className="text-2xl font-bold mb-4 text-blue-500">Token ID: {hand.token_id}</h2>
              <p className="text-gray-600">{hand.cards.join(', ')}</p>
              <p className="text-gray-600">Decision: {hand.decision}</p>
              {
                hand.decision && (
                  <div>
                    {hand.decision === 'fold' && (
                      <p className="text-gray-600">You folded.</p>
                    )}
                    {hand.decision === 'play' && (
                      <p className="text-gray-600">You played.</p>
                    )}
                    {hand.decision === 'pending' && (
                      <div className="space-y-4">
                        <PlayButton tokenId={hand.token_id} />
                        <FoldButton 
                          tokenId={hand.token_id} 
                          gameId={gameId.toString()}
                        />
                      </div>
                    )}
                  </div>
                )
              }
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 