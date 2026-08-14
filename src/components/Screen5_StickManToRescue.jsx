import React, { useState } from 'react';
import { Gamepad2, Settings, Trophy, Play, Volume2, Music, Zap, X, ArrowRight, ArrowLeft, Check, SlidersHorizontal } from 'lucide-react';
import { sounds } from '../SoundEffects';

export function Screen5_StickManToRescue({ 
  onBackToArcade, 
  onPlayMiniGame 
}) {
  const [showPreferencesModal, setShowPreferencesModal] = useState(true);
  const [soundEffects, setSoundEffects] = useState(true);
  const [gentleMusic, setGentleMusic] = useState(true);
  const [vibration, setVibration] = useState(false);

  const handleSoundToggle = () => {
    const next = !soundEffects;
    setSoundEffects(next);
    sounds.playToggle(next);
  };

  const handleMusicToggle = () => {
    const next = !gentleMusic;
    setGentleMusic(next);
    sounds.toggleAmbient(next);
    sounds.playToggle(next);
  };

  const handleVibToggle = () => {
    const next = !vibration;
    setVibration(next);
    sounds.playToggle(next);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto flex flex-col justify-center relative">
      
      {/* MAIN CONTENT AREA */}
      <main className="w-full bg-white/80 backdrop-blur-md rounded-3xl p-6 sm:p-8 lg:p-10 border border-zen-pinkAccent/40 shadow-zen flex flex-col justify-between relative overflow-hidden">
        
        <div>
          {/* Header Banner with Stick Figure Vector */}
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-zen-pinkLight via-zen-pinkCard to-zen-cream border-4 border-white shadow-md flex items-center justify-center mb-4 relative">
              
              {/* Stick Figure SVG Icon */}
              <svg className="w-16 h-16" viewBox="0 0 100 100" fill="none">
                <circle cx="50" cy="30" r="10" stroke="#4A353B" strokeWidth="3" fill="#FFF" />
                <path d="M50 40 V 65 M50 48 L 35 55 M50 48 L 65 42 M50 65 L 38 82 M50 65 L 62 82" stroke="#4A353B" strokeWidth="3" strokeLinecap="round" />
                {/* Heart on chest */}
                <path d="M48 48 C48 45 52 45 52 48 C52 50 48 52 48 52 Z" fill="#F7C5D1" />
              </svg>
            </div>

            <h2 className="text-3xl font-extrabold text-zen-plum font-display">
              Stick Man to the Rescue
            </h2>
            <p className="text-xs sm:text-sm text-zen-mauve mt-1.5 max-w-md">
              Draw bridges and guide your stick figure past physics obstacles safely.
            </p>
          </div>

          {/* Action Items List */}
          <div className="max-w-md mx-auto space-y-3 mb-8">
            
            {/* 1. Resume Last Game */}
            <button
              onClick={() => {
                sounds.playLaunch();
                onPlayMiniGame({
                  id: 'stick_man',
                  title: 'Stick Man to the Rescue',
                  description: 'Draw physics lines to guide Stick Man home!'
                });
              }}
              className="w-full py-3.5 px-5 rounded-2xl bg-zen-pinkLight hover:bg-zen-pinkCard border border-zen-pinkAccent text-zen-plum font-bold text-xs shadow-sm transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-full bg-zen-plum text-white flex items-center justify-center text-xs">
                  <Play className="w-3.5 h-3.5 fill-current text-zen-pinkAccent" />
                </div>
                <span className="font-display font-extrabold text-sm">Resume Last Game</span>
              </div>
              <ArrowRight className="w-4 h-4 text-zen-mauve group-hover:translate-x-1 transition-transform" />
            </button>

            {/* 2. Start New Game */}
            <button
              onClick={() => {
                sounds.playLaunch();
                onPlayMiniGame({
                  id: 'stick_man',
                  title: 'Stick Man to the Rescue',
                  description: 'Start Level 1 Physics Bridge Challenge.'
                });
              }}
              className="w-full py-3.5 px-5 rounded-2xl bg-white hover:bg-zen-pinkLight/50 border border-zen-pinkAccent/50 text-zen-plum font-bold text-xs shadow-sm transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-full bg-zen-pinkHeader text-zen-plum flex items-center justify-center text-xs">
                  🎮
                </div>
                <span>Start New Game</span>
              </div>
              <ArrowRight className="w-4 h-4 text-zen-mauve group-hover:translate-x-1 transition-transform" />
            </button>

            {/* 3. Your Top Scores */}
            <button
              onClick={() => alert("Top Scores:\n1. 2,450 pts - Level 12 Cleared ⭐\n2. 1,890 pts - Bridge Master 🏆\n3. 1,200 pts - Perfect Save ✨")}
              className="w-full py-3.5 px-5 rounded-2xl bg-white hover:bg-zen-pinkLight/50 border border-zen-pinkAccent/50 text-zen-plum font-bold text-xs shadow-sm transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-full bg-zen-creamBg text-amber-700 flex items-center justify-center text-xs">
                  <Trophy className="w-3.5 h-3.5" />
                </div>
                <span>Your Top Scores</span>
              </div>
              <ArrowRight className="w-4 h-4 text-zen-mauve group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Toggle Preferences Button if closed */}
          {!showPreferencesModal && (
            <div className="text-center">
              <button
                onClick={() => { setShowPreferencesModal(true); sounds.playClick(); }}
                className="py-2 px-4 rounded-full bg-zen-pinkLight border border-zen-pinkAccent text-zen-plum text-xs font-bold hover:bg-zen-pinkCard transition-all inline-flex items-center gap-1.5"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Open Preferences Modal</span>
              </button>
            </div>
          )}

        </div>

        {/* INTERACTIVE PREFERENCES POPOVER MODAL (Matches Screen 5 screenshot overlay) */}
        {showPreferencesModal && (
          <div className="absolute bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:w-80 bg-white/95 backdrop-blur-xl rounded-3xl p-5 border border-zen-pinkAccent/60 shadow-zen-lg transition-all animate-bounce-soft z-30">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-zen-pinkAccent/30">
              <h4 className="text-xs font-extrabold text-zen-plum font-display uppercase tracking-wider">
                Preferences
              </h4>
              <button
                onClick={() => { setShowPreferencesModal(false); sounds.playClick(); }}
                className="w-6 h-6 rounded-full bg-zen-pinkLight flex items-center justify-center text-zen-mauve hover:text-zen-plum transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Modal Switches List */}
            <div className="space-y-3.5">
              
              {/* Sound Effects */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-xl bg-zen-pinkLight flex items-center justify-center text-zen-plum">
                    <Volume2 className="w-3.5 h-3.5 text-zen-mauve" />
                  </div>
                  <span className="text-xs font-bold text-zen-plum">Sound Effects</span>
                </div>

                <button
                  onClick={handleSoundToggle}
                  className={`w-11 h-5 rounded-full transition-colors p-0.5 flex items-center ${
                    soundEffects ? 'bg-zen-plum justify-end' : 'bg-zen-pinkAccent/60 justify-start'
                  }`}
                >
                  <div className="w-4 h-4 rounded-full bg-white shadow-sm flex items-center justify-center">
                    {soundEffects && <Check className="w-2.5 h-2.5 text-zen-plum" />}
                  </div>
                </button>
              </div>

              {/* Gentle Music Tracks */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-xl bg-zen-pinkLight flex items-center justify-center text-zen-plum">
                    <Music className="w-3.5 h-3.5 text-zen-mauve" />
                  </div>
                  <span className="text-xs font-bold text-zen-plum">Gentle Music Tracks</span>
                </div>

                <button
                  onClick={handleMusicToggle}
                  className={`w-11 h-5 rounded-full transition-colors p-0.5 flex items-center ${
                    gentleMusic ? 'bg-zen-plum justify-end' : 'bg-zen-pinkAccent/60 justify-start'
                  }`}
                >
                  <div className="w-4 h-4 rounded-full bg-white shadow-sm flex items-center justify-center">
                    {gentleMusic && <Check className="w-2.5 h-2.5 text-zen-plum" />}
                  </div>
                </button>
              </div>

              {/* Vibration */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-xl bg-zen-pinkLight flex items-center justify-center text-zen-plum">
                    <Zap className="w-3.5 h-3.5 text-zen-mauve" />
                  </div>
                  <span className="text-xs font-bold text-zen-plum">Vibration</span>
                </div>

                <button
                  onClick={handleVibToggle}
                  className={`w-11 h-5 rounded-full transition-colors p-0.5 flex items-center ${
                    vibration ? 'bg-zen-plum justify-end' : 'bg-zen-pinkAccent/60 justify-start'
                  }`}
                >
                  <div className="w-4 h-4 rounded-full bg-white shadow-sm flex items-center justify-center">
                    {vibration && <Check className="w-2.5 h-2.5 text-zen-plum" />}
                  </div>
                </button>
              </div>

            </div>

          </div>
        )}

        {/* Bottom Switch Game Button */}
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
