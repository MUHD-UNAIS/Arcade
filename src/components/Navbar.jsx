import React from 'react';
import { Sparkles, Volume2, VolumeX, Moon, Sun, LogOut, ArrowLeft, Gamepad2 } from 'lucide-react';
import { sounds } from '../SoundEffects';

export function Navbar({ 
  isAuthenticated, 
  currentView, 
  onGoToArcade, 
  onLogout, 
  isDarkMode, 
  setIsDarkMode, 
  isAudioOn, 
  setIsAudioOn, 
  user 
}) {
  const handleAudioToggle = () => {
    const nextState = !isAudioOn;
    setIsAudioOn(nextState);
    sounds.toggleAmbient(nextState);
    sounds.playToggle(nextState);
  };

  const handleThemeToggle = () => {
    setIsDarkMode(!isDarkMode);
    sounds.playToggle(!isDarkMode);
  };

  const isGamePage = isAuthenticated && currentView !== 'arcade' && currentView !== 'login';

  const getPageTitle = () => {
    if (!isAuthenticated) return 'Sign In / Register';
    if (currentView === 'arcade') return 'Arcade Collection';
    if (currentView === 'words_of_wisdom') return 'Words of Wisdom';
    if (currentView === 'little_big_feelings') return 'Little Big Feelings';
    if (currentView === 'stick_man') return 'Stick Man to the Rescue';
    if (currentView === 'mindscape_defense') return 'Mindscape Defense';
    return 'Arcade Collection';
  };

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/80 border-b border-zen-pinkAccent/30 shadow-sm transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2 sm:gap-4">
        
        {/* Brand Logo & Breadcrumb */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <div 
            onClick={() => {
              if (isAuthenticated) {
                sounds.playClick();
                onGoToArcade();
              }
            }}
            className="flex items-center gap-2 cursor-pointer group shrink-0"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-tr from-zen-pinkAccent via-zen-pinkHeader to-zen-cream flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-zen-plum animate-pulse-glow" />
            </div>
            <div>
              <h1 className="text-base sm:text-xl font-bold text-zen-plum tracking-tight flex items-center gap-1 font-display">
                Lumina Zen
              </h1>
              <p className="hidden sm:block text-[10px] uppercase font-semibold tracking-wider text-zen-mauve">Cozy Arcade & Safe Space</p>
            </div>
          </div>

          {/* Current Page Tag */}
          <div className="hidden lg:flex items-center gap-2 pl-3 border-l border-zen-pinkAccent/40">
            <span className="px-3 py-1 rounded-full bg-zen-pinkLight border border-zen-pinkAccent/40 text-xs font-bold text-zen-plum">
              {getPageTitle()}
            </span>
          </div>
        </div>

        {/* Exit Game Header Button (When inside a game) */}
        {isGamePage && (
          <button
            onClick={() => {
              sounds.playClick();
              onGoToArcade();
            }}
            className="flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-zen-pinkHeader hover:bg-zen-pinkAccent text-zen-plum font-bold text-xs shadow-sm transition-all animate-bounce-soft shrink-0"
          >
            <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-zen-plum" />
            <span className="hidden sm:inline">Exit Game to Arcade</span>
            <span className="sm:hidden">Exit</span>
          </button>
        )}

        {/* Right Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Ambient Sound Toggle */}
          <button
            onClick={handleAudioToggle}
            title={isAudioOn ? "Mute Ambient Sound" : "Play Ambient Sound"}
            className={`p-2 sm:p-2.5 rounded-full transition-all duration-200 border ${
              isAudioOn 
                ? 'bg-zen-teal text-white border-zen-teal shadow-md' 
                : 'bg-white/80 text-zen-plum border-zen-pinkAccent/50 hover:bg-zen-pinkCard'
            }`}
          >
            {isAudioOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 opacity-60" />}
          </button>

          {/* Dark Mode Toggle */}
          <button
            onClick={handleThemeToggle}
            title="Toggle Atmosphere Theme"
            className="p-2 sm:p-2.5 rounded-full bg-white/80 border border-zen-pinkAccent/50 text-zen-plum hover:bg-zen-pinkCard transition-all"
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-zen-plum" />}
          </button>

          {/* User Profile & Logout */}
          {isAuthenticated && (
            <div className="flex items-center gap-1.5 sm:gap-2 pl-1.5 sm:pl-2 border-l border-zen-pinkAccent/30">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-zen-pinkHeader border-2 border-white shadow-sm flex items-center justify-center font-bold text-xs sm:text-sm">
                {user?.avatar || '🧘'}
              </div>
              <div className="hidden md:block text-left">
                <p className="text-xs font-bold text-zen-plum leading-tight">{user?.name || 'Zen Explorer'}</p>
                <p className="text-[10px] text-zen-mauve">Logged In</p>
              </div>
              <button
                onClick={() => {
                  sounds.playClick();
                  onLogout();
                }}
                title="Log Out"
                className="p-1.5 sm:p-2 rounded-full text-zen-mauve hover:text-rose-600 hover:bg-rose-50 transition-colors ml-0.5"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

      </div>
    </header>
  );
}
