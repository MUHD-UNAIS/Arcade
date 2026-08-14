import React, { useState, useRef, useEffect } from 'react';
import { X, Sparkles, Trophy, RotateCcw, Heart, Play } from 'lucide-react';
import confetti from 'canvas-confetti';
import { sounds } from '../SoundEffects';

export function MiniGameModal({ game, onClose }) {
  const [gameState, setGameState] = useState('playing'); // 'playing', 'won'
  const [score, setScore] = useState(0);

  // WORDS OF WISDOM STATE
  const [words, setWords] = useState([
    { id: 1, text: 'Peace', placed: false },
    { id: 2, text: 'begins', placed: false },
    { id: 3, text: 'within', placed: false },
    { id: 4, text: 'a quiet', placed: false },
    { id: 5, text: 'mind.', placed: false },
  ]);
  const [placedWords, setPlacedWords] = useState([]);

  // LITTLE BIG FEELINGS STATE
  const [selectedFeeling, setSelectedFeeling] = useState(null);
  const feelings = [
    { name: 'Calm', emoji: '🌿', color: 'bg-zen-oliveBg text-zen-olive border-zen-olive' },
    { name: 'Cozy', emoji: '☁️', color: 'bg-zen-pinkCard text-zen-plum border-zen-pinkAccent' },
    { name: 'Joyful', emoji: '✨', color: 'bg-zen-creamBg text-amber-800 border-zen-yellow' },
    { name: 'Peaceful', emoji: '🌊', color: 'bg-zen-tealBg text-zen-teal border-zen-teal' },
    { name: 'Loved', emoji: '💖', color: 'bg-rose-100 text-rose-700 border-rose-300' },
  ];

  // STICK MAN CANVAS REF
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [stickManPos, setStickManPos] = useState({ x: 40, y: 150 });
  const [isWalking, setIsWalking] = useState(false);

  // Confetti trigger
  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {
      console.warn("Confetti error", e);
    }
  };

  // Words of wisdom word placement
  const handlePlaceWord = (word) => {
    sounds.playClick();
    if (word.placed) return;
    const nextPlaced = [...placedWords, word.text];
    setPlacedWords(nextPlaced);
    setWords(words.map(w => w.id === word.id ? { ...w, placed: true } : w));

    if (nextPlaced.length === words.length) {
      setGameState('won');
      sounds.playLaunch();
      triggerConfetti();
    }
  };

  // Stick man canvas drawing
  useEffect(() => {
    if (game?.id !== 'stick_man' || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const drawScene = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Start Platform
      ctx.fillStyle = '#7A8450';
      ctx.fillRect(10, 160, 80, 40);

      // Goal Platform
      ctx.fillStyle = '#4A7C7D';
      ctx.fillRect(260, 160, 80, 40);

      // Star Destination
      ctx.fillStyle = '#EADF9E';
      ctx.beginPath();
      ctx.arc(300, 140, 12, 0, Math.PI * 2);
      ctx.fill();

      // Stick Man
      ctx.strokeStyle = '#4A353B';
      ctx.lineWidth = 3;

      // Head
      ctx.beginPath();
      ctx.arc(stickManPos.x, stickManPos.y - 20, 8, 0, Math.PI * 2);
      ctx.stroke();

      // Body & Legs
      ctx.beginPath();
      ctx.moveTo(stickManPos.x, stickManPos.y - 12);
      ctx.lineTo(stickManPos.x, stickManPos.y + 10);
      ctx.lineTo(stickManPos.x - 6, stickManPos.y + 25);
      ctx.moveTo(stickManPos.x, stickManPos.y + 10);
      ctx.lineTo(stickManPos.x + 6, stickManPos.y + 25);
      ctx.stroke();
    };

    drawScene();
  }, [game, stickManPos]);

  const handleStartWalk = () => {
    sounds.playLaunch();
    setIsWalking(true);
    let x = stickManPos.x;
    const interval = setInterval(() => {
      x += 5;
      setStickManPos(prev => ({ ...prev, x }));
      if (x >= 290) {
        clearInterval(interval);
        setIsWalking(false);
        setGameState('won');
        triggerConfetti();
      }
    }, 60);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
      
      <div className="w-full max-w-lg bg-white/95 backdrop-blur-xl rounded-3xl p-4 sm:p-8 border border-white shadow-zen-lg relative overflow-hidden flex flex-col justify-between max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-zen-pinkAccent/30 mb-4 sm:mb-6">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🎮</span>
            <div>
              <h3 className="font-extrabold text-zen-plum font-display text-base sm:text-lg">
                {game?.title || 'Cozy Mini-Game'}
              </h3>
              <p className="text-xs text-zen-mauve">Interactive Mindfulness Activity</p>
            </div>
          </div>
          <button
            onClick={() => { sounds.playClick(); onClose(); }}
            className="w-8 h-8 rounded-full bg-zen-pinkLight flex items-center justify-center text-zen-plum hover:bg-zen-pinkHeader transition-colors shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* GAME CONTENT TYPES */}

        {/* 1. Words of Wisdom Game */}
        {game?.id === 'words_of_wisdom' && (
          <div className="py-2 sm:py-4 text-center">
            <p className="text-xs font-semibold text-zen-plum mb-4">
              Tap the words in order to construct today's peaceful affirmation:
            </p>

            {/* Target Display Box */}
            <div className="min-h-[60px] p-3 sm:p-4 bg-zen-pinkLight/80 rounded-2xl border-2 border-dashed border-zen-pinkAccent flex flex-wrap items-center justify-center gap-2 mb-6">
              {placedWords.length === 0 ? (
                <span className="text-xs italic text-zen-mauve">Your quote will appear here...</span>
              ) : (
                placedWords.map((word, idx) => (
                  <span key={idx} className="px-3 py-1 rounded-full bg-zen-plum text-white font-bold text-xs shadow-sm animate-bounce-soft">
                    {word}
                  </span>
                ))
              )}
            </div>

            {/* Selectable Words */}
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5 mb-6">
              {words.map((word) => (
                <button
                  key={word.id}
                  disabled={word.placed}
                  onClick={() => handlePlaceWord(word)}
                  className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm ${
                    word.placed
                      ? 'opacity-30 bg-gray-200 text-gray-400 cursor-not-allowed'
                      : 'bg-zen-pinkHeader text-zen-plum hover:bg-zen-pinkAccent hover:scale-105'
                  }`}
                >
                  {word.text}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 2. Little Big Feelings Game */}
        {game?.id === 'little_big_feelings' && (
          <div className="py-2 sm:py-4 text-center">
            <p className="text-xs font-semibold text-zen-plum mb-4">
              How is your heart feeling right now? Tap a blob to check in:
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3 mb-6">
              {feelings.map((f) => (
                <button
                  key={f.name}
                  onClick={() => {
                    setSelectedFeeling(f);
                    sounds.playLaunch();
                    triggerConfetti();
                  }}
                  className={`p-3 sm:p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-1.5 sm:gap-2 ${f.color} ${
                    selectedFeeling?.name === f.name ? 'scale-105 shadow-md ring-2 ring-zen-plum' : 'hover:scale-102'
                  }`}
                >
                  <span className="text-2xl sm:text-3xl animate-bounce-soft">{f.emoji}</span>
                  <span className="text-xs font-bold">{f.name}</span>
                </button>
              ))}
            </div>

            {selectedFeeling && (
              <div className="p-3 sm:p-4 rounded-2xl bg-zen-oliveBg/60 border border-zen-olive/40 text-zen-plum text-xs">
                ✨ Checked in as <strong className="font-bold">{selectedFeeling.name}</strong>! Your mood has been saved to your Lumina Zen journal.
              </div>
            )}
          </div>
        )}

        {/* 3. Stick Man Physics Rescue Game */}
        {game?.id === 'stick_man' && (
          <div className="py-2 text-center flex flex-col items-center">
            <p className="text-xs font-semibold text-zen-plum mb-2">
              Guide Stick Man across the chasm to reach the golden star!
            </p>

            <canvas
              ref={canvasRef}
              width={350}
              height={200}
              className="w-full max-w-[340px] h-auto bg-zen-pinkLight/60 rounded-2xl border border-zen-pinkAccent shadow-inner mb-4"
            />

            <button
              disabled={isWalking}
              onClick={handleStartWalk}
              className="py-2.5 px-6 rounded-full bg-zen-plum hover:bg-zen-plumHover text-white font-bold text-xs shadow-md transition-all flex items-center gap-2"
            >
              <Play className="w-3.5 h-3.5 fill-current text-zen-pinkAccent" />
              <span>Guide Stick Man Across</span>
            </button>
          </div>
        )}

        {/* 4. Default / Generic Game */}
        {game?.id !== 'words_of_wisdom' && game?.id !== 'little_big_feelings' && game?.id !== 'stick_man' && (
          <div className="py-8 text-center">
            <div className="w-24 h-24 rounded-full bg-zen-pinkLight border-4 border-zen-pinkAccent mx-auto flex items-center justify-center text-4xl mb-4 animate-pulse-glow">
              🧘
            </div>
            <h4 className="text-base font-bold text-zen-plum">Mindful Relaxation Circle</h4>
            <p className="text-xs text-zen-mauve mt-1 max-w-xs mx-auto">
              Breathe in slowly... and release. Enjoy a peaceful moment in your cozy sanctuary.
            </p>
            <button
              onClick={() => {
                sounds.playLaunch();
                triggerConfetti();
                setGameState('won');
              }}
              className="mt-6 py-2.5 px-6 rounded-full bg-zen-plum text-white font-bold text-xs shadow-md"
            >
              Complete Session ✨
            </button>
          </div>
        )}

        {/* GAME WIN OVERLAY */}
        {gameState === 'won' && (
          <div className="mt-4 p-4 rounded-2xl bg-zen-creamBg border border-zen-yellow text-center animate-bounce-soft">
            <h4 className="text-sm font-extrabold text-zen-plum font-display flex items-center justify-center gap-1.5">
              <span>🎉</span> Wonderful job! Peaceful session complete. <span>✨</span>
            </h4>
            <p className="text-[11px] text-zen-mauve mt-1">You earned +50 Calm Points!</p>
          </div>
        )}

        {/* Close Action */}
        <div className="mt-6 pt-4 border-t border-zen-pinkAccent/30 flex justify-end">
          <button
            onClick={() => { sounds.playClick(); onClose(); }}
            className="py-2 px-5 rounded-xl bg-zen-pinkLight border border-zen-pinkAccent text-zen-plum font-bold text-xs hover:bg-zen-pinkCard transition-all"
          >
            Close Session
          </button>
        </div>

      </div>

    </div>
  );
}
