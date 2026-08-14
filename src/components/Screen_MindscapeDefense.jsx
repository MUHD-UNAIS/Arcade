import React, { useState } from 'react';
import { Gamepad2, Play, ArrowLeft, Shield } from 'lucide-react';
import { sounds } from '../SoundEffects';

export function Screen_MindscapeDefense({ onBackToArcade, onPlayMiniGame }) {
  return (
    <div className="min-h-[calc(100vh-4rem)] p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto flex flex-col justify-center">
      
      {/* Main Content */}
      <main className="w-full bg-white/80 backdrop-blur-md rounded-3xl p-6 sm:p-8 lg:p-10 border border-zen-pinkAccent/40 shadow-zen flex flex-col justify-between">
        <div>
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-20 h-20 rounded-full bg-zen-pinkCard border-4 border-white shadow-md flex items-center justify-center mb-4 relative">
              <span className="text-3xl animate-bounce-soft">🏰</span>
            </div>

            <h2 className="text-3xl font-extrabold text-zen-plum font-display">
              Mindscape Defense
            </h2>
            <p className="text-xs sm:text-sm text-zen-mauve mt-1.5 max-w-md">
              Protect your inner peace in a relaxed strategy experience.
            </p>
          </div>

          <div className="max-w-md mx-auto mb-8">
            <button
              onClick={() => {
                sounds.playLaunch();
                onPlayMiniGame({
                  id: 'mindscape_defense',
                  title: 'Mindscape Defense',
                  description: 'Protect your peaceful sanctuary crystals!'
                });
              }}
              className="w-full py-4 px-6 rounded-2xl bg-zen-plum hover:bg-zen-plumHover text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-3 group"
            >
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Play className="w-4 h-4 fill-current text-zen-pinkAccent" />
              </div>
              <span className="font-display tracking-wide uppercase">Defend Sanctuary</span>
            </button>
          </div>
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => {
              sounds.playClick();
              onBackToArcade();
            }}
            className="py-2.5 px-6 rounded-full bg-zen-pinkHeader border border-zen-pinkAccent text-zen-plum font-bold text-xs hover:bg-zen-pinkAccent transition-all shadow-sm"
          >
            Exit Game
          </button>
        </div>
      </main>

    </div>
  );
}
