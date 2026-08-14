import React, { useState } from 'react';
import { Gamepad2, Settings, Play, ArrowLeft, Cloud, Volume2, Check } from 'lucide-react';
import { sounds } from '../SoundEffects';

export function Screen_SignalCloud({ onBackToArcade, onPlayMiniGame }) {
  const [activeTab, setActiveTab] = useState('arcade');
  const [sfxEnabled, setSfxEnabled] = useState(true);

  return (
    <div className="min-h-[calc(100vh-4rem)] p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto flex flex-col justify-center">
      
      {/* Main Content */}
      <main className="w-full bg-white/80 backdrop-blur-md rounded-3xl p-6 sm:p-8 lg:p-10 border border-zen-pinkAccent/40 shadow-zen flex flex-col justify-between">
        <div>
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-20 h-20 rounded-full bg-zen-pinkCard border-4 border-white shadow-md flex items-center justify-center mb-4 relative">
              <span className="text-3xl animate-bounce-soft">☁️</span>
            </div>

            <h2 className="text-3xl font-extrabold text-zen-plum font-display">
              Signal Cloud
            </h2>
            <p className="text-xs sm:text-sm text-zen-mauve mt-1.5 max-w-md">
              Guide signals through soft cloud routes and serene pathways.
            </p>
          </div>

          <div className="max-w-md mx-auto mb-8">
            <button
              onClick={() => {
                sounds.playLaunch();
                onPlayMiniGame({
                  id: 'signal_cloud',
                  title: 'Signal Cloud',
                  description: 'Guide calm signal pathways across the sky!'
                });
              }}
              className="w-full py-4 px-6 rounded-2xl bg-zen-mauve hover:bg-zen-mauve/90 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-3 group"
            >
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Play className="w-4 h-4 fill-current text-white" />
              </div>
              <span className="font-display tracking-wide uppercase">Connect Cloud Routes</span>
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
