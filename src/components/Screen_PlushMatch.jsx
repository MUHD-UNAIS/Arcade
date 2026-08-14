import React, { useState } from 'react';
import { Gamepad2, Settings, Play, ArrowLeft, Heart, RotateCcw, Volume2, Check } from 'lucide-react';
import { sounds } from '../SoundEffects';

export function Screen_PlushMatch({ onBackToArcade, onPlayMiniGame }) {
  const [activeTab, setActiveTab] = useState('arcade');
  const [sfxEnabled, setSfxEnabled] = useState(true);

  return (
    <div className="min-h-[calc(100vh-4rem)] p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto flex flex-col justify-center">
      
      {/* Main Content */}
      <main className="w-full bg-white/80 backdrop-blur-md rounded-3xl p-6 sm:p-8 lg:p-10 border border-zen-pinkAccent/40 shadow-zen flex flex-col justify-between">
        <div>
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-20 h-20 rounded-full bg-zen-tealBg border-4 border-white shadow-md flex items-center justify-center mb-4 relative">
              <span className="text-3xl animate-bounce-soft">🧸</span>
              <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-zen-teal text-white flex items-center justify-center text-xs">
                ✨
              </div>
            </div>

            <h2 className="text-3xl font-extrabold text-zen-plum font-display">
              Plush Match
            </h2>
            <p className="text-xs sm:text-sm text-zen-mauve mt-1.5 max-w-md">
              Match soothing pairs & unbind your mind with gentle tactile cards.
            </p>
          </div>

          <div className="max-w-md mx-auto mb-8">
            <button
              onClick={() => {
                sounds.playLaunch();
                onPlayMiniGame({
                  id: 'plush_match',
                  title: 'Plush Match',
                  description: 'Match pairs of plushie friends!'
                });
              }}
              className="w-full py-4 px-6 rounded-2xl bg-zen-teal hover:bg-zen-teal/90 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-3 group"
            >
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Play className="w-4 h-4 fill-current text-white" />
              </div>
              <span className="font-display tracking-wide uppercase">Start Matching Pairs</span>
            </button>
          </div>

          <div className="max-w-md mx-auto bg-zen-tealBg/40 rounded-2xl p-5 border border-zen-teal/30">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-zen-plum mb-4 font-display">
              Game Preferences
            </h4>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Volume2 className="w-4 h-4 text-zen-teal" />
                <span className="text-xs font-bold text-zen-plum">Soft Card Flip Audio</span>
              </div>
              <button
                onClick={() => setSfxEnabled(!sfxEnabled)}
                className={`w-11 h-5 rounded-full transition-colors p-0.5 flex items-center ${
                  sfxEnabled ? 'bg-zen-teal justify-end' : 'bg-zen-pinkAccent/60 justify-start'
                }`}
              >
                <div className="w-4 h-4 rounded-full bg-white shadow-sm flex items-center justify-center">
                  {sfxEnabled && <Check className="w-2.5 h-2.5 text-zen-teal" />}
                </div>
              </button>
            </div>
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
