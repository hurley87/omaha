'use client';

import { useState } from 'react';

interface PlayButtonProps {
  tokenId: number;
}

export function PlayButton({ tokenId }: PlayButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handlePlay = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/decision', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tokenId, decision: 'play' }),
      });

      if (!response.ok) {
        throw new Error('Failed to set decision');
      }

      // Refresh the page to show updated state
      window.location.reload();
    } catch (error) {
      console.error('Error setting decision:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handlePlay}
      disabled={isLoading}
      className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
    >
      {isLoading ? 'Playing...' : 'Play'}
    </button>
  );
} 