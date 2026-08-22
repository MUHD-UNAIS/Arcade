import React, { useEffect, useState } from 'react';
import { Navbar } from './components/Navbar';
import { Screen1_Login } from './components/Screen1_Login';
import { Screen2_ArcadeCollection } from './components/Screen2_ArcadeCollection';
import { MiniGameModal } from './components/MiniGameModal';
import { EmbeddedGame } from './components/EmbeddedGame';
import { supabase } from './lib/supabase';

export function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authReady, setAuthReady] = useState(false);
  const [currentView, setCurrentView] = useState('login'); // 'login', 'arcade', or game IDs
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isAudioOn, setIsAudioOn] = useState(false);
  const [isParticlesOn, setIsParticlesOn] = useState(true);
  const [activeMiniGame, setActiveMiniGame] = useState(null);

  const [user, setUser] = useState({
    name: 'Anushka',
    email: 'anushka@luminazen.app',
    avatar: '🧘'
  });

  useEffect(() => {
    let mounted = true;

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!mounted) return;
      if (session?.user) {
        setUser({
          name: session.user.user_metadata?.display_name || session.user.email?.split('@')[0] || 'Zen Explorer',
          email: session.user.email || '',
          avatar: '🧘',
        });
        setIsAuthenticated(true);
        setCurrentView('arcade');
      }
      setAuthReady(true);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return;
      setIsAuthenticated(Boolean(session));
      if (!session) {
        setCurrentView('login');
        return;
      }
      setUser({
        name: session.user.user_metadata?.display_name || session.user.email?.split('@')[0] || 'Zen Explorer',
        email: session.user.email || '',
        avatar: '🧘',
      });
      setCurrentView('arcade');
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const handleLogin = async ({ email, password }) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error?.message || null };
  };

  const handleRegister = async ({ name, email, password }) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { display_name: name } },
    });
    if (error) return { error: error.message };
    if (!data.session) return { message: 'Account created. Check your email to confirm your account, then log in.' };
    return { error: null };
  };

  const handleGuestAccess = () => {
    setUser({
      name: 'Cozy Guest',
      email: 'guest@luminazen.app',
      avatar: '✨'
    });
    setIsAuthenticated(true);
    setCurrentView('arcade');
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setActiveMiniGame(null);
  };

  const handleSelectGame = (gameId) => {
    setCurrentView(gameId);
  };

  const handleGoToArcade = () => {
    setCurrentView('arcade');
    setActiveMiniGame(null);
  };

  const handlePlayMiniGame = (game) => {
    setActiveMiniGame(game);
  };

  const isGameView = isAuthenticated && currentView !== 'arcade' && currentView !== 'login';

  if (!authReady) {
    return <div className="min-h-screen bg-[#FDF2F4]" />;
  }

  return (
    <div className={`min-h-screen transition-colors duration-500 relative ${
      isDarkMode 
        ? 'bg-[#2A1D22] text-[#F3EFEF]' 
        : 'bg-[#FDF2F4] text-[#4A353B]'
    }`}>
      
      {/* Floating Particles Background */}
      {isParticlesOn && (
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
          <div className="absolute top-1/4 left-10 w-2 h-2 rounded-full bg-zen-pinkAccent opacity-60 animate-ping" />
          <div className="absolute top-2/3 right-12 w-3 h-3 rounded-full bg-zen-teal opacity-50 animate-bounce-soft" />
          <div className="absolute bottom-1/4 left-1/3 w-2 h-2 rounded-full bg-zen-yellow opacity-70 animate-pulse-glow" />
        </div>
      )}

      {/* Keep game pages fully immersive; each game owns its own controls. */}
      {!isGameView && (
        <Navbar
          isAuthenticated={isAuthenticated}
          currentView={currentView}
          onGoToArcade={handleGoToArcade}
          onLogout={handleLogout}
          isDarkMode={isDarkMode}
          setIsDarkMode={setIsDarkMode}
          isAudioOn={isAudioOn}
          setIsAudioOn={setIsAudioOn}
          user={user}
        />
      )}

      {/* View Router */}
      <div className="relative z-10">
        {!isAuthenticated || currentView === 'login' ? (
          <Screen1_Login
            onLogin={handleLogin}
            onRegister={handleRegister}
            onGuestAccess={handleGuestAccess}
          />
        ) : currentView === 'arcade' ? (
          <Screen2_ArcadeCollection
            onSelectGame={handleSelectGame}
          />
        ) : currentView === 'words_of_wisdom' ? (
          <EmbeddedGame gameId="words_of_wisdom" title="Words of Wisdom" onBackToArcade={handleGoToArcade} />
        ) : currentView === 'little_big_feelings' ? (
          <EmbeddedGame gameId="little_big_feelings" title="Little Big Feelings" onBackToArcade={handleGoToArcade} />
        ) : currentView === 'stick_man' ? (
          <EmbeddedGame gameId="stick_man" title="Stick Man to the Rescue" onBackToArcade={handleGoToArcade} />
        ) : currentView === 'mindscape_defense' ? (
          <EmbeddedGame gameId="mindscape_defense" title="Mindscape Defense" onBackToArcade={handleGoToArcade} />
        ) : currentView === 'feeling_fusion' ? (
          <EmbeddedGame gameId="feeling_fusion" title="Feeling Fusion" onBackToArcade={handleGoToArcade} />
        ) : currentView === 'myth_vs_fact' ? (
          <EmbeddedGame gameId="myth_vs_fact" title="Myth vs Fact" onBackToArcade={handleGoToArcade} />
        ) : currentView === 'signal_scout' ? (
          <EmbeddedGame gameId="signal_scout" title="Signal Scout" onBackToArcade={handleGoToArcade} />
        ) : (
          <Screen2_ArcadeCollection
            onSelectGame={handleSelectGame}
          />
        )}
      </div>

      {/* Mini Game Modal Overlay */}
      {activeMiniGame && (
        <MiniGameModal
          game={activeMiniGame}
          onClose={() => setActiveMiniGame(null)}
        />
      )}

    </div>
  );
}

export default App;
