import React, { useState } from 'react';
import { Gamepad2, Sliders, User, Play, Sparkles, Lightbulb, Volume2, Eye, ShieldAlert, ArrowLeft, Check } from 'lucide-react';
import { sounds } from '../SoundEffects';

export function Screen4_LittleBigFeelings({ 
  onBackToArcade, 
  onPlayMiniGame 
}) {
  const [activeTab, setActiveTab] = useState('settings');
  const [sfxEnabled, setSfxEnabled] = useState(true);
  const [animationsEnabled, setAnimationsEnabled] = useState(true);
  const [focusModeEnabled, setFocusModeEnabled] = useState(false);

  const handleSfxToggle = () => {
    const next = !sfxEnabled;
    setSfxEnabled(next);
    sounds.playToggle(next);
  };

  const handleAnimToggle = () => {
    const next = !animationsEnabled;
    setAnimationsEnabled(next);
    sounds.playToggle(next);
  };

  const handleFocusToggle = () => {
    const next = !focusModeEnabled;
    setFocusModeEnabled(next);
    sounds.playToggle(next);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto flex flex-col justify-center">
      
      {/* MAIN CONTENT AREA */}
      <main className="w-full bg-white/80 backdrop-blur-md rounded-3xl p-6 sm:p-8 lg:p-10 border border-zen-pinkAccent/40 shadow-zen flex flex-col justify-between">
        
        <div>
          {/* Header */}
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-20 h-20 rounded-full bg-zen-oliveBg border-4 border-white shadow-md flex items-center justify-center mb-4 relative">
              <span className="text-3xl animate-bounce-soft">🧸</span>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-zen-pinkHeader flex items-center justify-center text-xs">
                💖
              </div>
            </div>

            <h2 className="text-3xl font-extrabold text-zen-plum font-display">
              Little Big Feelings
            </h2>
            <p className="text-xs sm:text-sm text-zen-mauve mt-1.5 max-w-md">
              Interact with playful feeling blobs to reflect on your mood and emotional balance.
            </p>
          </div>

          {/* Primary Action Card: Resume Last Game Pink Card */}
          <div className="max-w-md mx-auto mb-8">
            <button
              onClick={() => {
                sounds.playLaunch();
                onPlayMiniGame({
                  id: 'little_big_feelings',
                  title: 'Little Big Feelings',
                  description: 'Select feeling blobs and log your emotional balance.'
                });
              }}
              className="w-full py-5 px-6 rounded-3xl bg-zen-pinkHeader hover:bg-zen-pinkAccent text-zen-plum font-bold text-sm shadow-md transition-all flex items-center justify-center gap-3 group border border-zen-pinkAccent"
            >
              <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                <Play className="w-4 h-4 fill-current text-zen-plum" />
              </div>
              <span className="font-display tracking-wide text-base">Resume Last Game</span>
            </button>

            {/* Dual Cards Grid: Play New Game & Mood Insights */}
            <div className="grid grid-cols-2 gap-4 mt-4">
              <button
                onClick={() => {
                  sounds.playLaunch();
                  onPlayMiniGame({
                    id: 'little_big_feelings',
                    title: 'Little Big Feelings',
                    description: 'Explore new emotion blobs.'
                  });
                }}
                className="p-4 rounded-2xl bg-zen-tealBg border border-zen-teal/30 hover:bg-zen-tealBg/80 transition-all text-center flex flex-col items-center gap-2 group"
              >
                <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-zen-teal shadow-sm group-hover:scale-105">
                  <Sparkles className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-zen-plum">Play New Game</span>
              </button>

              <button
                onClick={() => alert("Mood Insights:\n- Highest Feeling: Calm & Grateful 🌿\n- Total Check-ins: 28 sessions\n- Recommended Activity: Words of Wisdom")}
                className="p-4 rounded-2xl bg-zen-creamBg/60 border border-zen-yellow/50 hover:bg-zen-creamBg transition-all text-center flex flex-col items-center gap-2 group"
              >
                <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-amber-700 shadow-sm group-hover:scale-105">
                  <Lightbulb className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-zen-plum">Mood Insights</span>
              </button>
            </div>
          </div>

          {/* Section: Experience Settings */}
          <div className="max-w-md mx-auto bg-white/90 rounded-2xl p-5 border border-zen-pinkAccent/40 shadow-sm">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-zen-plum mb-4 flex items-center gap-1.5 font-display">
              <span>✔️</span> Experience Settings
            </h4>

            <div className="space-y-4">
              
              {/* Option 1: Sound Effects */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-zen-pinkLight flex items-center justify-center text-zen-plum">
                    <Volume2 className="w-4 h-4 text-zen-mauve" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-zen-plum">Sound Effects</p>
                    <p className="text-[10px] text-zen-mauve">Tactile squish and pop audio feedback</p>
                  </div>
                </div>

                <button
                  onClick={handleSfxToggle}
                  className={`w-12 h-6 rounded-full transition-colors p-1 flex items-center ${
                    sfxEnabled ? 'bg-zen-teal justify-end' : 'bg-zen-pinkAccent/60 justify-start'
                  }`}
                >
                  <div className="w-4 h-4 rounded-full bg-white shadow-sm flex items-center justify-center">
                    {sfxEnabled && <Check className="w-3 h-3 text-zen-teal" />}
                  </div>
                </button>
              </div>

              {/* Option 2: Visual Animations */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-zen-pinkLight flex items-center justify-center text-zen-plum">
                    <Eye className="w-4 h-4 text-zen-mauve" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-zen-plum">Visual Animations</p>
                    <p className="text-[10px] text-zen-mauve">Wobbly blob physics & floating hearts</p>
                  </div>
                </div>

                <button
                  onClick={handleAnimToggle}
                  className={`w-12 h-6 rounded-full transition-colors p-1 flex items-center ${
                    animationsEnabled ? 'bg-zen-teal justify-end' : 'bg-zen-pinkAccent/60 justify-start'
                  }`}
                >
                  <div className="w-4 h-4 rounded-full bg-white shadow-sm flex items-center justify-center">
                    {animationsEnabled && <Check className="w-3 h-3 text-zen-teal" />}
                  </div>
                </button>
              </div>

              {/* Option 3: Focus Mode */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-zen-pinkLight flex items-center justify-center text-zen-plum">
                    <ShieldAlert className="w-4 h-4 text-zen-mauve" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-zen-plum">Focus Mode</p>
                    <p className="text-[10px] text-zen-mauve">Hide non-essential UI elements</p>
                  </div>
                </div>

                <button
                  onClick={handleFocusToggle}
                  className={`w-12 h-6 rounded-full transition-colors p-1 flex items-center ${
                    focusModeEnabled ? 'bg-zen-teal justify-end' : 'bg-zen-pinkAccent/60 justify-start'
                  }`}
                >
                  <div className="w-4 h-4 rounded-full bg-white shadow-sm flex items-center justify-center">
                    {focusModeEnabled && <Check className="w-3 h-3 text-zen-teal" />}
                  </div>
                </button>
              </div>

            </div>
          </div>

        </div>

        {/* Bottom Switch Game Pink Pill Button */}
        <div className="mt-8 text-center">
          <button
            onClick={() => {
              sounds.playClick();
              onBackToArcade();
            }}
            className="py-2.5 px-6 rounded-full bg-zen-pinkHeader border border-zen-pinkAccent text-zen-plum font-bold text-xs hover:bg-zen-pinkAccent transition-all shadow-sm"
          >
            Switch Game
          </button>
        </div>

      </main>

    </div>
  );
}
