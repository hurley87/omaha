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

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header Section */}
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              Game #{gameId}
            </h1>
            <p className="text-gray-600 mt-2 font-mono text-sm">
              {wallet.slice(0, 6)}...{wallet.slice(-4)}
            </p>
          </div>

          {/* Main Content */}
          {!hand ? (
            <div className="bg-white rounded-2xl shadow-sm p-8 text-center border border-gray-100">
              <div className="max-w-md mx-auto">
                <h2 className="text-2xl font-bold mb-4 text-gray-900">No Hand Found</h2>
                <p className="text-gray-600">
                  {`You don't have a hand in this game yet. Mint a new hand to get started!`}
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-100">
              <div className="space-y-6">
                {/* Token ID Section */}
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900">Your Hand</h2>
                  <span className="px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
                    Token #{hand.token_id}
                  </span>
                </div>

                {/* Cards Display */}
                <div className="grid grid-cols-5 gap-4">
                  {hand.cards.map((card: string, index: number) => (
                    <div
                      key={index}
                      className="aspect-[2.5/3.5] bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 flex items-center justify-center border border-blue-200 shadow-sm"
                    >
                      <span className="text-xl font-bold text-blue-900">{card}</span>
                    </div>
                  ))}
                </div>

                {/* Decision Section */}
                <div className="pt-6 border-t border-gray-100">
                  {hand.decision ? (
                    <div className="space-y-4">
                      {hand.decision === 'fold' && (
                        <div className="bg-red-50 text-red-700 p-4 rounded-xl text-center">
                          <p className="font-medium">You folded this hand</p>
                        </div>
                      )}
                      {hand.decision === 'play' && (
                        <div className="bg-green-50 text-green-700 p-4 rounded-xl text-center">
                          <p className="font-medium">You played this hand</p>
                        </div>
                      )}
                      {hand.decision === 'pending' && (
                        <div className="space-y-4">
                          <p className="text-gray-600 text-center mb-4">
                            Make your decision:
                          </p>
                          <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <PlayButton tokenId={hand.token_id} />
                            <FoldButton 
                              tokenId={hand.token_id} 
                              gameId={gameId.toString()}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 