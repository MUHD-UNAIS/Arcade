import React, { useState } from 'react';
import { Gamepad2, Settings, User, Play, RotateCcw, BarChart3, Volume2, Moon, Sparkles, ArrowLeft, Check } from 'lucide-react';
import { sounds } from '../SoundEffects';

export function Screen3_WordsOfWisdom({ 
  onBackToArcade, 
  onPlayMiniGame, 
  isAudioOn, 
  setIsAudioOn, 
  isDarkMode, 
  setIsDarkMode,
  isParticlesOn,
  setIsParticlesOn
}) {
  const [activeTab, setActiveTab] = useState('arcade');
  const [stats, setStats] = useState({ quotesUnlocked: 14, calmPoints: 850, streakDays: 5 });

  const handleAudioToggle = () => {
    const next = !isAudioOn;
    setIsAudioOn(next);
    sounds.toggleAmbient(next);
    sounds.playToggle(next);
  };

  const handleDarkToggle = () => {
    const next = !isDarkMode;
    setIsDarkMode(next);
    sounds.playToggle(next);
  };

  const handleParticlesToggle = () => {
    const next = !isParticlesOn;
    setIsParticlesOn(next);
    sounds.playToggle(next);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto flex flex-col justify-center">
      
      {/* MAIN CONTENT AREA */}
      <main className="w-full bg-white/80 backdrop-blur-md rounded-3xl p-6 sm:p-8 lg:p-10 border border-zen-pinkAccent/40 shadow-zen flex flex-col justify-between">
        
        <div>
          {/* Header Banner & Mascot Icon */}
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-zen-pinkCard to-zen-cream border-4 border-white shadow-md flex items-center justify-center mb-4 relative">
              <span className="text-3xl animate-bounce-soft">📜</span>
              <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-zen-pinkAccent flex items-center justify-center text-xs">
                ✨
              </div>
            </div>

            <h2 className="text-3xl font-extrabold text-zen-plum font-display flex items-center gap-2">
              <span>📖</span> Words of Wisdom <span>📖</span>
            </h2>
            <p className="text-xs sm:text-sm text-zen-mauve mt-1.5 max-w-md">
              Assemble inspirational words and uncover daily affirmations for a peaceful mind.
            </p>
          </div>

          {/* Primary Action: Resume Last Game Hero Button */}
          <div className="max-w-md mx-auto mb-8">
            <button
              onClick={() => {
                sounds.playLaunch();
                onPlayMiniGame({
                  id: 'words_of_wisdom',
                  title: 'Words of Wisdom',
                  description: 'Assemble inspirational quotes and unlock peace.'
                });
              }}
              className="w-full py-4 px-6 rounded-2xl bg-zen-plum hover:bg-zen-plumHover text-white font-bold text-sm shadow-zen-lg transition-all flex items-center justify-center gap-3 group"
            >
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Play className="w-4 h-4 fill-current text-zen-pinkAccent" />
              </div>
              <span className="font-display tracking-wide uppercase">Resume Last Game</span>
            </button>

            {/* Quick Actions Grid */}
            <div className="grid grid-cols-2 gap-3 mt-3">
              <button
                onClick={() => {
                  sounds.playLaunch();
                  onPlayMiniGame({
                    id: 'words_of_wisdom',
                    title: 'Words of Wisdom',
                    description: 'Start a fresh daily quote challenge.'
                  });
                }}
                className="py-2.5 px-4 rounded-xl bg-zen-pinkLight border border-zen-pinkAccent text-zen-plum font-bold text-xs hover:bg-zen-pinkCard transition-all flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-3.5 h-3.5 text-zen-mauve" />
                <span>New Game</span>
              </button>

              <button
                onClick={() => alert(`Your Stats:\n- Quotes Unlocked: ${stats.quotesUnlocked}\n- Calm Points: ${stats.calmPoints}\n- Daily Streak: ${stats.streakDays} days`)}
                className="py-2.5 px-4 rounded-xl bg-zen-pinkLight border border-zen-pinkAccent text-zen-plum font-bold text-xs hover:bg-zen-pinkCard transition-all flex items-center justify-center gap-2"
              >
                <BarChart3 className="w-3.5 h-3.5 text-zen-mauve" />
                <span>View Stat History</span>
              </button>
            </div>
          </div>

          {/* Section: Atmosphere Settings */}
          <div className="max-w-md mx-auto bg-zen-pinkLight/60 rounded-2xl p-5 border border-zen-pinkAccent/40">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-zen-plum mb-4 flex items-center gap-1.5 font-display">
              <span>🔊</span> Atmosphere Settings
            </h4>

            <div className="space-y-4">
              
              {/* Option 1: Ambient Audio */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center text-zen-plum shadow-sm">
                    <Volume2 className="w-4 h-4 text-zen-mauve" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-zen-plum">Ambient Audio</p>
                    <p className="text-[10px] text-zen-mauve">Soft synthesized background chimes</p>
                  </div>
                </div>
                
                {/* Switch */}
                <button
                  onClick={handleAudioToggle}
                  className={`w-12 h-6 rounded-full transition-colors p-1 flex items-center ${
                    isAudioOn ? 'bg-zen-plum justify-end' : 'bg-zen-pinkAccent/60 justify-start'
                  }`}
                >
                  <div className="w-4 h-4 rounded-full bg-white shadow-sm flex items-center justify-center">
                    {isAudioOn && <Check className="w-3 h-3 text-zen-plum" />}
                  </div>
                </button>
              </div>

              {/* Option 2: Calming Dark Theme */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center text-zen-plum shadow-sm">
                    <Moon className="w-4 h-4 text-zen-mauve" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-zen-plum">Calming Dark Theme</p>
                    <p className="text-[10px] text-zen-mauve">Gentle dim lighting for night sessions</p>
                  </div>
                </div>

                {/* Switch */}
                <button
                  onClick={handleDarkToggle}
                  className={`w-12 h-6 rounded-full transition-colors p-1 flex items-center ${
                    isDarkMode ? 'bg-zen-plum justify-end' : 'bg-zen-pinkAccent/60 justify-start'
                  }`}
                >
                  <div className="w-4 h-4 rounded-full bg-white shadow-sm flex items-center justify-center">
                    {isDarkMode && <Check className="w-3 h-3 text-zen-plum" />}
                  </div>
                </button>
              </div>

              {/* Option 3: Soft FX & Particles */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center text-zen-plum shadow-sm">
                    <Sparkles className="w-4 h-4 text-zen-mauve" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-zen-plum">Soft FX & Particles</p>
                    <p className="text-[10px] text-zen-mauve">Floating sparkles and soft glows</p>
                  </div>
                </div>

                {/* Switch */}
                <button
                  onClick={handleParticlesToggle}
                  className={`w-12 h-6 rounded-full transition-colors p-1 flex items-center ${
                    isParticlesOn ? 'bg-zen-plum justify-end' : 'bg-zen-pinkAccent/60 justify-start'
                  }`}
                >
                  <div className="w-4 h-4 rounded-full bg-white shadow-sm flex items-center justify-center">
                    {isParticlesOn && <Check className="w-3 h-3 text-zen-plum" />}
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
