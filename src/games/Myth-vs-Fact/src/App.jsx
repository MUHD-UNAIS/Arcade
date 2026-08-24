import React, { useState } from 'react';
import SplashScreen from './pages/SplashScreen.jsx';
import TutorialScreen from './pages/TutorialScreen.jsx';
import LevelSelectScreen from './pages/LevelSelectScreen.jsx';
import QuizGame from './QuizGame.jsx';
import { audioManager } from './utils/audio.js';

const App = () => {
  const [gameState, setGameState] = useState('SPLASH');
  const [activeLevel, setActiveLevel] = useState(null);
  const [globalCorrectIds, setGlobalCorrectIds] = useState(new Set());

  // Navigation handlers
  const handleStartTutorial = () => {
    audioManager.init();
    setGameState('TUTORIAL');
  };

  const handleStartGame = () => {
    setGameState('LEVEL_SELECT');
  };

  const handleLevelSelected = (level) => {
    setActiveLevel(level);
    setGameState('PLAYING');
  };

  const handleBackToSplash = () => {
    setGameState('SPLASH');
  };

  const handleExitGame = () => {
    setActiveLevel(null);
    setGameState('LEVEL_SELECT');
  };

  const handleMarkCorrect = (questionId) => {
    setGlobalCorrectIds(prev => {
      const newSet = new Set(prev);
      newSet.add(questionId);
      return newSet;
    });
  };

  const handleResetGame = () => {
    setGlobalCorrectIds(new Set());
  };

  return (
    <div className="game-wrapper min-h-screen w-full bg-slate-900">
      {gameState === 'SPLASH' && (
        <SplashScreen onStart={handleStartTutorial} />
      )}

      {gameState === 'TUTORIAL' && (
        <TutorialScreen 
          onStartGame={handleStartGame} 
          onBack={handleBackToSplash} 
        />
      )}

      {gameState === 'LEVEL_SELECT' && (
        <LevelSelectScreen
          onSelectLevel={handleLevelSelected}
          onBack={handleBackToSplash}
          globalCorrectIds={globalCorrectIds}
          onResetGame={handleResetGame}
        />
      )}

      {gameState === 'PLAYING' && activeLevel && (
        <QuizGame
          audioManager={audioManager}
          levelData={activeLevel}
          onExit={handleExitGame}
          globalCorrectIds={globalCorrectIds}
          onMarkCorrect={handleMarkCorrect}
        />
      )}
    </div>
  );
};

export default App;
