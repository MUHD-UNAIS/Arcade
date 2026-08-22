import React from 'react';

const GAME_PATHS = {
  stick_man: '/src/games/stickman/index.html',
  words_of_wisdom: '/src/games/Words-of-Wisdom/index.html',
  little_big_feelings: '/src/games/Little-Big-Feelings/index.html',
  mindscape_defense: '/src/games/mindscape-defence/index.html',
  feeling_fusion: '/src/games/Feeling-Fusion/index.html',
  myth_vs_fact: '/src/games/Myth-vs-Fact/index.html',
  signal_scout: '/src/games/Signal-Scout/index.html',
};

export function EmbeddedGame({ gameId, title, onBackToArcade }) {
  const gamePath = GAME_PATHS[gameId];

  if (!gamePath) return null;

  return (
    <div className="fixed inset-0 z-20 bg-slate-950">
      <iframe
        title={title}
        src={gamePath}
        className="block h-[100dvh] min-h-full w-full border-0"
        allow="autoplay; fullscreen"
      />
    </div>
  );
}
