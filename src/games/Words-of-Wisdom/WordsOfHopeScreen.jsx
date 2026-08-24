import { useState, useEffect, useRef } from "react";
import { TERMINOLOGY_DATA } from "./terminologyData";
import GameBackground from "./GameBackground";

export default function WordsOfHopeScreen({
  audioManager,
  onExit,
  isPaused = false,
  playerGender = "guy",
  playerData = null,
  onOpenProfile,
  initialState = "INTRO",
}) {
  const [gameState, setGameState] = useState(initialState);
  const [score, setScore] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [harmony, setHarmony] = useState(50);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [explanation, setExplanation] = useState(null);
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [stigmaAlert, setStigmaAlert] = useState(null);
  const [isAlertVisible, setIsAlertVisible] = useState(false);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [explanationMode, setExplanationMode] = useState(false);
  const [wordHistory, setWordHistory] = useState([]);
  const [baseSpeed, setBaseSpeed] = useState(0.05);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [glossaryTab, setGlossaryTab] = useState("all"); // 'all' | 'session'
  const [glossarySearch, setGlossarySearch] = useState("");
  const [level, setLevel] = useState(1);
  const [difficulty, setDifficulty] = useState("EASY");
  const [localPaused, setLocalPaused] = useState(false);
  const [tipsRemaining, setTipsRemaining] = useState(2);
  const [isSpeedBoosted, setIsSpeedBoosted] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const isFirstSpawnRef = useRef(true);

  // Persistent Unlocked Levels (1: Breeze, 2: Mist, 3: Storm)
  const [unlockedLevel, setUnlockedLevel] = useState(() => {
    try {
      const saved = localStorage.getItem("words_of_wisdom_unlocked_level");
      return saved ? Math.max(1, parseInt(saved, 10)) : 1;
    } catch {
      return 1;
    }
  });

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const scoreRef = useRef(0);
  const currentIndexRef = useRef(0);
  const mistakesRef = useRef(0);
  const sidebarTimerRef = useRef(null);
  const alertTimerRef = useRef(null);
  const isProcessingSetRef = useRef(false);
  const requestRef = useRef();
  const pausedRef = useRef(false);
  const speedBoostRef = useRef(false);
  const baseSpeedRef = useRef(0.05);
  const lastSpawnedYRef = useRef(100);
  const fallingItemsRef = useRef([]);
  const playerRef = useRef(50);
  const [playerX, setPlayerX] = useState(50);
  const gameContainerRef = useRef(null);
  const [fallingItems, setFallingItems] = useState([]);
  const [shuffledQuestions, setShuffledQuestions] = useState([]);
  const keysPressedRef = useRef(new Set());

  // Save unlocked level to localStorage
  const updateUnlockedLevel = (newLevel) => {
    setUnlockedLevel((prev) => {
      const highest = Math.max(prev, newLevel);
      try {
        localStorage.setItem("words_of_wisdom_unlocked_level", highest.toString());
      } catch (e) {
        console.error("Failed to save level progress:", e);
      }
      return highest;
    });
  };

  useEffect(() => {
    setShuffledQuestions(
      [...TERMINOLOGY_DATA.questions].sort(() => Math.random() - 0.5),
    );
    if (audioManager) {
      audioManager.init();
      audioManager.startAmbient("park");
    }
    if (gameState === "INTRO") {
      const timer = setTimeout(() => {
        setGameState("LEVEL_SELECT");
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [gameState]);

  const toggleMute = () => {
    if (!audioManager) return;
    const next = !isMuted;
    setIsMuted(next);
    audioManager.setVolume(next ? 0 : 0.5);
  };

  const startGame = (diff = difficulty) => {
    const isMob = window.innerWidth < 768;
    const speedMultiplier = isMob ? 2.0 : 1;
    let initialSpeed = 0.05;
    if (diff === "EASY") initialSpeed = 0.035;
    if (diff === "NORMAL") initialSpeed = 0.055;
    if (diff === "HARD") initialSpeed = 0.08;
    initialSpeed *= speedMultiplier;

    const reshuffled = [...TERMINOLOGY_DATA.questions].sort(
      () => Math.random() - 0.5,
    );
    setShuffledQuestions(reshuffled);
    setDifficulty(diff);

    setGameState("PLAYING");
    setHarmony(50);
    setScore(0);
    scoreRef.current = 0;
    setMistakes(0);
    mistakesRef.current = 0;
    setCurrentIndex(0);
    currentIndexRef.current = 0;
    setFallingItems([]);
    setExplanation(null);
    setIsSidebarVisible(false);
    setStigmaAlert(null);
    setIsAlertVisible(false);
    isProcessingSetRef.current = false;

    setStreak(0);
    setWordHistory([]);
    setBaseSpeed(initialSpeed);
    baseSpeedRef.current = initialSpeed;
    setIsHistoryOpen(false);
    setExplanationMode(false);
    setLevel(1);
    setTipsRemaining(2);
    isFirstSpawnRef.current = true;
    keysPressedRef.current.clear();

    if (audioManager) {
      audioManager.playPop();
      audioManager.startAmbient("park");
    }

    spawnSet(45);
    spawnSet(5);
    spawnSet(-35);
    spawnSet(-75);
  };

  useEffect(() => {
    if (explanation) {
      setIsSidebarVisible(true);
      if (sidebarTimerRef.current) clearTimeout(sidebarTimerRef.current);
      sidebarTimerRef.current = setTimeout(() => {
        setIsSidebarVisible(false);
      }, 6000);
    }
    return () => {
      if (sidebarTimerRef.current) clearTimeout(sidebarTimerRef.current);
    };
  }, [explanation]);

  useEffect(() => {
    if (stigmaAlert) {
      setIsAlertVisible(true);
      if (alertTimerRef.current) clearTimeout(alertTimerRef.current);
      alertTimerRef.current = setTimeout(() => {
        setIsAlertVisible(false);
      }, 5000);
    }
    return () => {
      if (alertTimerRef.current) clearTimeout(alertTimerRef.current);
    };
  }, [stigmaAlert]);

  const togglePause = () => {
    if (gameState !== "PLAYING") return;
    setLocalPaused((prev) => {
      const next = !prev;
      pausedRef.current = next;
      if (audioManager) {
        if (next) {
          audioManager.pauseAll();
        } else {
          audioManager.resumeAll();
        }
      }
      return next;
    });
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "p" || e.key === "P" || e.key === "Escape") {
        togglePause();
      }
      if (e.key === "Shift" || e.key === " ") {
        setIsSpeedBoosted(true);
        speedBoostRef.current = true;
      }
      if (
        e.key === "ArrowLeft" ||
        e.key === "a" ||
        e.key === "A" ||
        e.key === "ArrowRight" ||
        e.key === "d" ||
        e.key === "D"
      ) {
        keysPressedRef.current.add(e.key.toLowerCase());
      }
    };

    const handleKeyUp = (e) => {
      if (e.key === "Shift" || e.key === " ") {
        setIsSpeedBoosted(false);
        speedBoostRef.current = false;
      }
      keysPressedRef.current.delete(e.key.toLowerCase());
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [gameState]);

  const handlePointerMove = (e) => {
    if (gameState !== "PLAYING" || isPaused || !gameContainerRef.current)
      return;
    if (isMobile) return;

    let clientX;
    if (e.touches && e.touches.length > 0) {
      clientX = e.touches[0].clientX;
    } else {
      clientX = e.clientX;
    }
    if (clientX === undefined || clientX === null) return;

    const rect = gameContainerRef.current.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * 100;
    const clampedX = Math.max(8, Math.min(92, x));
    setPlayerX(clampedX);
    playerRef.current = clampedX;
  };

  const update = () => {
    if (
      gameState !== "PLAYING" ||
      isPaused ||
      localPaused ||
      pausedRef.current
    ) {
      requestRef.current = requestAnimationFrame(update);
      return;
    }

    // Process keyboard movement
    if (keysPressedRef.current.size > 0) {
      const keys = keysPressedRef.current;
      const step = isSpeedBoosted ? 1.4 : 0.9;
      let newX = playerRef.current;

      if (keys.has("arrowleft") || keys.has("a")) {
        newX = Math.max(8, newX - step);
      }
      if (keys.has("arrowright") || keys.has("d")) {
        newX = Math.min(92, newX + step);
      }

      if (newX !== playerRef.current) {
        playerRef.current = newX;
        setPlayerX(newX);
      }
    }

    const currentItems = fallingItemsRef.current;
    const nextItems = [];
    let collisionOccurred = false;
    const handledQuestionIds = new Set();
    const effectiveSpeed = speedBoostRef.current
      ? baseSpeedRef.current * 2.8
      : baseSpeedRef.current;
    lastSpawnedYRef.current += effectiveSpeed;

    for (const item of currentItems) {
      const newItem = { ...item, y: item.y + effectiveSpeed };
      const distanceX = Math.abs(newItem.x - playerRef.current);
      const isYAligned = newItem.y > 75 && newItem.y < 95;

      if (isYAligned && distanceX < 15 && !collisionOccurred) {
        collisionOccurred = true;
        processCollision(newItem);
        handledQuestionIds.add(item.questionId);
        continue;
      }

      if (newItem.y >= 105) {
        if (item.isCorrect) applyMistake();
        handledQuestionIds.add(item.questionId);
        continue;
      }

      nextItems.push(newItem);
    }

    fallingItemsRef.current = nextItems.filter(
      (item) => !handledQuestionIds.has(item.questionId),
    );
    setFallingItems([...fallingItemsRef.current]);

    if (
      gameState === "PLAYING" &&
      currentIndexRef.current < shuffledQuestions.length
    ) {
      if (lastSpawnedYRef.current > -5) {
        spawnSet(-45);
      }
    } else if (
      gameState === "PLAYING" &&
      currentIndexRef.current >= shuffledQuestions.length &&
      fallingItemsRef.current.length === 0
    ) {
      checkFinalOutcome();
    }

    requestRef.current = requestAnimationFrame(update);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(update);
    return () => cancelAnimationFrame(requestRef.current);
  }, [gameState, isSpeedBoosted]);

  const spawnSet = (forcedY = null) => {
    if (currentIndexRef.current >= shuffledQuestions.length) return;

    const q = shuffledQuestions[currentIndexRef.current];
    currentIndexRef.current += 1;
    setCurrentIndex(currentIndexRef.current);

    const spawnY = forcedY !== null ? forcedY : -20;

    const items = [
      {
        id: `correct-${q.id}-${Date.now()}`,
        x: 25,
        y: spawnY,
        speed: baseSpeed,
        text: q.correct,
        isCorrect: true,
        questionId: q.id,
      },
      {
        id: `stigma-${q.id}-${Date.now()}`,
        x: 75,
        y: spawnY,
        speed: baseSpeed,
        text: q.stigma,
        isCorrect: false,
        questionId: q.id,
      },
    ];

    if (Math.random() > 0.5) {
      items[0].x = 75;
      items[1].x = 25;
    }

    fallingItemsRef.current = [...fallingItemsRef.current, ...items];
    setFallingItems([...fallingItemsRef.current]);
    lastSpawnedYRef.current = spawnY;
  };

  const processCollision = (item) => {
    setExplanationMode(false);

    const q = shuffledQuestions.find((sq) => sq.id === item.questionId);
    if (!q) return;

    setWordHistory((prev) => {
      const exists = prev.find((w) => w.id === q.id);
      if (!exists) {
        return [
          ...prev,
          { ...q, timestamp: Date.now(), wasCorrect: item.isCorrect },
        ];
      }
      return prev;
    });

    if (item.isCorrect) {
      setScore((s) => s + 1);
      scoreRef.current += 1;
      setHarmony((h) => Math.min(100, h + 15));

      setStreak((prev) => {
        const newStreak = prev + 1;
        setMaxStreak((max) => Math.max(max, newStreak));
        return newStreak;
      });

      if (scoreRef.current % 4 === 0) {
        setLevel((prev) => {
          const nextLevel = prev + 1;
          const isMob = window.innerWidth < 768;
          const speedMultiplier = isMob ? 2.0 : 1;
          const newSpeed = baseSpeedRef.current + 0.035 * speedMultiplier;
          setBaseSpeed(newSpeed);
          baseSpeedRef.current = newSpeed;
          return nextLevel;
        });
        setTipsRemaining((prev) => prev + 1);
        if (audioManager) audioManager.playInvestigate();
      }

      if (audioManager) {
        audioManager.playDing();
        audioManager.playCoachTip();
      }
      setExplanation({ correct: q.correct, why: q.why, stigma: q.stigma });
    } else {
      setHarmony((h) => Math.max(0, h - 25));
      setStreak(0);
      if (audioManager) {
        audioManager.playSad();
        audioManager.playCoachTip();
      }
      setStigmaAlert({ stigma: q.stigma, correct: q.correct, why: q.why });
      applyMistake();
    }

    if (scoreRef.current >= 12) {
      // Unlock next difficulty upon victory
      if (difficulty === "EASY") {
        updateUnlockedLevel(2);
      } else if (difficulty === "NORMAL") {
        updateUnlockedLevel(3);
      }
      triggerEndGame("RESULTS");
    }
  };

  const checkFinalOutcome = () => {
    if (gameState !== "PLAYING") return;
    setGameState("TRANSITIONING");
    setTimeout(() => {
      const won = scoreRef.current >= 12;
      if (won) {
        if (difficulty === "EASY") updateUnlockedLevel(2);
        else if (difficulty === "NORMAL") updateUnlockedLevel(3);
      }
      setGameState(won ? "RESULTS" : "GAME_OVER");
      if (audioManager) audioManager.stopMusic();
    }, 1000);
  };

  const triggerEndGame = (finalState) => {
    setGameState("TRANSITIONING");
    fallingItemsRef.current = [];
    setFallingItems([]);
    isProcessingSetRef.current = false;
    setTimeout(() => {
      setGameState(finalState);
      if (audioManager) audioManager.stopMusic();
    }, 1200);
  };

  const applyMistake = () => {
    setMistakes((m) => {
      const newM = m + 1;
      mistakesRef.current = newM;
      if (newM >= 3) triggerEndGame("GAME_OVER");
      return newM;
    });
  };

  const bgStyle = {
    background: `linear-gradient(135deg, 
            hsl(${200 + harmony * 0.4}, ${20 + harmony * 0.6}%, ${10 + harmony * 0.4}%) 0%, 
            hsl(${220 + harmony * 0.4}, ${30 + harmony * 0.5}%, ${15 + harmony * 0.4}%) 100%)`,
    transition: "all 2s ease-in-out",
  };

  const filteredGlossary = (glossaryTab === "session" ? wordHistory : TERMINOLOGY_DATA.questions).filter(
    (item) =>
      item.correct.toLowerCase().includes(glossarySearch.toLowerCase()) ||
      item.stigma.toLowerCase().includes(glossarySearch.toLowerCase()) ||
      item.why.toLowerCase().includes(glossarySearch.toLowerCase())
  );

  return (
    <div
      ref={gameContainerRef}
      className="fixed inset-0 z-[1000] flex flex-col items-center justify-center overflow-hidden font-sans select-none touch-none stickman-rescue-container"
      style={bgStyle}
      onPointerDown={handlePointerMove}
      onPointerMove={handlePointerMove}
      onTouchStart={handlePointerMove}
      onTouchMove={handlePointerMove}
    >
      <GameBackground harmony={harmony} />

      {/* TOP HEADER HUD (During Game) */}
      {!["INTRO", "LEVEL_SELECT", "TUTORIAL"].includes(gameState) && (
        <div className="absolute top-4 md:top-6 left-0 right-0 px-4 md:px-8 flex justify-between items-center z-50 stickman-rescue-hdr">
          <div className="hidden md:flex flex-col stickman-rescue-hdr-title">
            <h1 className="text-white font-black uppercase tracking-[0.25em] text-base md:text-lg drop-shadow-lg leading-tight flex items-center gap-2">
              <span className="text-teal-400">📖</span> {TERMINOLOGY_DATA.title}
            </h1>
            <div className="h-0.5 w-full bg-gradient-to-r from-teal-400 to-transparent rounded-full mt-1" />
          </div>

          <div className="flex items-center gap-2 md:gap-3 stickman-rescue-hdr-actions w-full md:w-auto justify-between md:justify-end">
            {gameState === "PLAYING" && (
              <div className="flex flex-col items-center bg-white/10 backdrop-blur-md border border-white/20 px-3 md:px-4 py-1 rounded-xl">
                <span className="text-[7px] md:text-[8px] font-black text-orange-400 uppercase tracking-widest leading-none mb-0.5">
                  🔥 Streak
                </span>
                <span className="text-white font-black text-base md:text-xl leading-none">
                  {streak}
                </span>
                {maxStreak > 0 && (
                  <span className="hidden md:block text-[7px] text-white/50 mt-0.5">
                    Best: {maxStreak}
                  </span>
                )}
              </div>
            )}

            <div className="flex flex-col items-end bg-white/5 backdrop-blur-md border border-white/10 px-3 py-1 rounded-xl">
              <span className="text-[7px] md:text-[8px] font-black text-teal-400 uppercase tracking-widest leading-none mb-0.5">
                {difficulty} • Lvl {level}
              </span>
              <span className="text-white font-black text-sm md:text-lg leading-none">
                {score}
                <span className="text-white/40 text-[10px] md:text-xs font-medium ml-1">
                  / 12
                </span>
              </span>
            </div>

            {gameState === "PLAYING" && (
              <button
                onClick={() => {
                  if (explanationMode) {
                    setExplanationMode(false);
                  } else if (tipsRemaining > 0) {
                    setExplanationMode(true);
                    setTipsRemaining((prev) => prev - 1);
                    if (audioManager) audioManager.playPop();
                  }
                }}
                disabled={!explanationMode && tipsRemaining === 0}
                className={`px-3 py-2 rounded-full text-[9px] font-black uppercase tracking-widest transition-all ${
                  explanationMode
                    ? "bg-teal-500 border-teal-400 text-white hover:scale-105 active:scale-95 border shadow-[0_0_15px_rgba(20,184,166,0.5)]"
                    : tipsRemaining > 0
                      ? "bg-white/10 border-white/20 text-white hover:bg-white/20 hover:scale-105 active:scale-95 border"
                      : "bg-white/5 border-white/5 text-white/30 cursor-not-allowed border"
                }`}
              >
                💡 Tips ({tipsRemaining})
              </button>
            )}

            <button
              onClick={() => {
                setGlossaryTab("all");
                setIsHistoryOpen(!isHistoryOpen);
              }}
              className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white px-2.5 md:px-3 py-2 rounded-full text-[9px] font-black uppercase tracking-widest transition-all hover:scale-105 active:scale-95 flex items-center gap-1.5"
              title="Open Word Glossary"
            >
              <span>📚</span>
              <span className="hidden md:inline">Glossary</span>
            </button>

            <button
              onClick={toggleMute}
              className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white p-2 rounded-full transition-all hover:scale-105 active:scale-95"
              title={isMuted ? "Unmute Audio" : "Mute Audio"}
            >
              <span className="text-xs">{isMuted ? "🔇" : "🔊"}</span>
            </button>

            {gameState === "PLAYING" && (
              <button
                onClick={togglePause}
                className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white p-2 rounded-full transition-all hover:scale-105 active:scale-95"
                title="Pause Game"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  {localPaused ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  )}
                </svg>
              </button>
            )}

            <button
              onClick={onExit}
              className="bg-white/10 hover:bg-rose-500/80 backdrop-blur-md border border-white/20 text-white px-3 md:px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest transition-all hover:scale-105 active:scale-95"
              title="Exit to Arcade"
            >
              Exit
            </button>
          </div>
        </div>
      )}

      {/* PAUSE MODAL */}
      {localPaused && (
        <div className="fixed inset-0 z-[2000] bg-slate-950/70 backdrop-blur-md flex items-center justify-center animate-fade-in p-4">
          <div className="bg-slate-900 border border-white/20 rounded-3xl p-8 max-w-sm w-full shadow-4xl text-center animate-scale-in text-white">
            <div className="w-16 h-16 bg-teal-500/20 rounded-2xl mx-auto mb-4 flex items-center justify-center border border-teal-400/30">
              <span className="text-3xl">⏸️</span>
            </div>
            <h2 className="text-2xl font-black text-white mb-2 uppercase tracking-tight">
              Mission Paused
            </h2>
            <p className="text-slate-400 text-xs font-medium mb-6 leading-relaxed">
              Take a breath. Mindful terminology awaits your return.
            </p>
            <div className="space-y-3">
              <button
                onClick={togglePause}
                className="w-full py-3.5 bg-teal-500 hover:bg-teal-400 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl transition-all"
              >
                Resume Mission
              </button>
              <button
                onClick={() => {
                  togglePause();
                  setGameState("LEVEL_SELECT");
                }}
                className="w-full py-3 bg-white/10 hover:bg-white/20 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all"
              >
                Change Mission
              </button>
              <button
                onClick={onExit}
                className="w-full py-3 bg-red-500/20 hover:bg-red-500 text-red-300 hover:text-white rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all"
              >
                Exit to Arcade
              </button>
            </div>
          </div>
        </div>
      )}

      {/* LEVEL SELECT SCREEN */}
      {gameState === "LEVEL_SELECT" && (
        <div className="relative z-10 w-full max-w-6xl p-6 md:p-8 text-center animate-fade-in flex flex-col items-center justify-center stickman-rescue-level-select">
          
          {/* Top Bar on Level Select */}
          <div className="fixed top-4 md:top-6 left-4 right-4 md:left-8 md:right-8 flex justify-between items-center z-[2000] pointer-events-auto">
            <button
              onClick={() => {
                if (audioManager) audioManager.playPop();
                onExit();
              }}
              className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
            >
              <svg
                className="w-3 h-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Arcade
            </button>

            <div className="flex items-center gap-2 md:gap-3">
              {/* Profile button */}
              <button
                onClick={() => {
                  if (audioManager) audioManager.playPop();
                  onOpenProfile?.();
                }}
                className="bg-white/10 hover:bg-teal-500/20 backdrop-blur-md border border-white/20 hover:border-teal-400/40 text-white px-3.5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
                title="View & Edit Player Profile"
              >
                <img
                  src={
                    playerGender === "girl"
                      ? "/stickman_assets/girl_idle.svg"
                      : "/stickman_assets/guy_idle.svg"
                  }
                  alt="Avatar"
                  className="w-5 h-5 object-contain"
                />
                <span className="hidden sm:inline">
                  {playerData?.name || "Player Profile"}
                </span>
                <span className="text-teal-400 text-xs">✎</span>
              </button>

              {/* Glossary Button */}
              <button
                onClick={() => {
                  if (audioManager) audioManager.playPop();
                  setGlossaryTab("all");
                  setIsHistoryOpen(true);
                }}
                className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white px-3.5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all hover:scale-105 active:scale-95 flex items-center gap-1.5"
              >
                <span>📚</span>
                <span className="hidden sm:inline">Glossary</span>
              </button>

              {/* Audio Toggle */}
              <button
                onClick={toggleMute}
                className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white p-2 rounded-full transition-all hover:scale-105 active:scale-95"
                title={isMuted ? "Unmute Sound" : "Mute Sound"}
              >
                <span className="text-xs">{isMuted ? "🔇" : "🔊"}</span>
              </button>
            </div>
          </div>

          <div className="mb-8 mt-12 md:mt-8">
            <h2 className="text-3xl md:text-6xl font-black text-white uppercase tracking-tighter mb-2 drop-shadow-2xl">
              Choose Your Mission
            </h2>
            <p className="text-teal-200 text-xs md:text-sm font-bold uppercase tracking-[0.2em]">
              Master Mindful Language & End Stigma
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-8 w-full max-w-5xl px-2 md:px-0 pb-6">
            {/* Level 1: Breeze */}
            <div
              onClick={() => {
                setDifficulty("EASY");
                setGameState("TUTORIAL");
                if (audioManager) audioManager.playPop();
              }}
              className="w-full min-h-[260px] bg-white/95 border-2 border-white hover:border-teal-400 p-6 md:p-8 rounded-3xl backdrop-blur-xl transition-all hover:scale-[1.03] active:scale-95 cursor-pointer flex flex-col items-center group shadow-2xl relative overflow-hidden text-slate-800"
            >
              <div className="w-16 h-16 md:w-20 md:h-20 bg-teal-500/15 rounded-2xl mb-4 flex items-center justify-center group-hover:bg-teal-500/30 transition-colors">
                <span className="text-3xl md:text-4xl">🍃</span>
              </div>
              <h3 className="text-xl md:text-2xl font-black text-slate-800 mb-2 uppercase">
                Breeze
              </h3>
              <p className="text-slate-600 text-xs font-medium leading-relaxed mb-4">
                Slower speed. Ideal for learning people-first terminology comfortably.
              </p>
              <div className="mt-auto px-5 py-2 bg-teal-500 rounded-full text-[9px] md:text-[10px] font-black text-white uppercase tracking-widest shadow-md">
                Focus: Learning • Unlocked
              </div>
            </div>

            {/* Level 2: Mist */}
            <div
              onClick={() => {
                if (unlockedLevel >= 2) {
                  setDifficulty("NORMAL");
                  setGameState("TUTORIAL");
                  if (audioManager) audioManager.playPop();
                } else {
                  if (audioManager) audioManager.playSad();
                }
              }}
              className={`w-full min-h-[260px] p-6 md:p-8 rounded-3xl backdrop-blur-xl transition-all flex flex-col items-center group shadow-2xl relative overflow-hidden ${
                unlockedLevel >= 2
                  ? "bg-white/95 border-2 border-teal-500 hover:scale-[1.03] active:scale-95 cursor-pointer text-slate-800"
                  : "bg-slate-900/70 border-2 border-white/20 grayscale opacity-75 cursor-not-allowed text-slate-300"
              }`}
            >
              {unlockedLevel >= 2 && (
                <div className="absolute top-0 right-0 px-3 py-1 bg-teal-500 text-white text-[7px] md:text-[8px] font-black uppercase tracking-widest rounded-bl-xl shadow-lg">
                  Recommended
                </div>
              )}
              <div
                className={`w-16 h-16 md:w-20 md:h-20 rounded-2xl mb-4 flex items-center justify-center transition-colors ${
                  unlockedLevel >= 2 ? "bg-teal-500/15 group-hover:bg-teal-500/30" : "bg-slate-800"
                }`}
              >
                <span className="text-3xl md:text-4xl">
                  {unlockedLevel >= 2 ? "🌿" : "🔒"}
                </span>
              </div>
              <h3 className={`text-xl md:text-2xl font-black mb-2 uppercase ${unlockedLevel >= 2 ? "text-slate-800" : "text-white"}`}>
                Mist
              </h3>
              <p className={`text-xs font-medium leading-relaxed mb-4 ${unlockedLevel >= 2 ? "text-slate-600" : "text-slate-400"}`}>
                Balanced speed. Test your understanding and solidify language mastery.
              </p>
              <div className="mt-auto">
                {unlockedLevel >= 2 ? (
                  <div className="px-5 py-2 bg-teal-500 rounded-full text-[9px] md:text-[10px] font-black text-white uppercase tracking-widest shadow-md">
                    Focus: Mastery • Unlocked
                  </div>
                ) : (
                  <div className="px-4 py-2 bg-white/10 rounded-full text-[8px] md:text-[9px] font-black text-slate-400 uppercase tracking-widest text-center">
                    Complete Breeze to Unlock
                  </div>
                )}
              </div>
            </div>

            {/* Level 3: Storm */}
            <div
              onClick={() => {
                if (unlockedLevel >= 3) {
                  setDifficulty("HARD");
                  setGameState("TUTORIAL");
                  if (audioManager) audioManager.playPop();
                } else {
                  if (audioManager) audioManager.playSad();
                }
              }}
              className={`w-full min-h-[260px] p-6 md:p-8 rounded-3xl backdrop-blur-xl transition-all flex flex-col items-center group shadow-2xl relative overflow-hidden ${
                unlockedLevel >= 3
                  ? "bg-white/95 border-2 border-orange-400 hover:scale-[1.03] active:scale-95 cursor-pointer text-slate-800"
                  : "bg-slate-900/70 border-2 border-white/20 grayscale opacity-75 cursor-not-allowed text-slate-300"
              }`}
            >
              <div
                className={`w-16 h-16 md:w-20 md:h-20 rounded-2xl mb-4 flex items-center justify-center transition-colors ${
                  unlockedLevel >= 3 ? "bg-orange-500/20 group-hover:bg-orange-500/40" : "bg-slate-800"
                }`}
              >
                <span className="text-3xl md:text-4xl">
                  {unlockedLevel >= 3 ? "⛈️" : "🔒"}
                </span>
              </div>
              <h3 className={`text-xl md:text-2xl font-black mb-2 uppercase ${unlockedLevel >= 3 ? "text-slate-800" : "text-white"}`}>
                Storm
              </h3>
              <p className={`text-xs font-medium leading-relaxed mb-4 ${unlockedLevel >= 3 ? "text-slate-600" : "text-slate-400"}`}>
                Rapid words. Reflex challenge with fast-paced decision making.
              </p>
              <div className="mt-auto">
                {unlockedLevel >= 3 ? (
                  <div className="px-5 py-2 bg-orange-500 rounded-full text-[9px] md:text-[10px] font-black text-white uppercase tracking-widest shadow-md">
                    Focus: Reflexes • Unlocked
                  </div>
                ) : (
                  <div className="px-4 py-2 bg-white/10 rounded-full text-[8px] md:text-[9px] font-black text-slate-400 uppercase tracking-widest text-center">
                    Complete Mist to Unlock
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* INTRO SPLASH */}
      {gameState === "INTRO" && (
        <div className="relative z-10 max-w-4xl w-full h-full p-8 text-center animate-fade-in flex flex-col items-center justify-center stickman-rescue-hero overflow-hidden">
          <div className="flex flex-col items-center animate-scale-in">
            <div className="w-36 h-36 bg-white/5 backdrop-blur-3xl rounded-[2.5rem] mb-8 flex items-center justify-center border border-white/20 shadow-[0_30px_60px_rgba(0,0,0,0.5)] -rotate-6 transform hover:rotate-0 transition-all duration-700">
              <img
                src="/stickman_assets/hope_stickman.svg"
                alt="Hope"
                className="w-24 h-24 animate-pulse drop-shadow-[0_0_20px_rgba(45,212,191,0.5)]"
              />
            </div>
            <h2 className="text-5xl md:text-8xl font-black text-white mb-2 leading-none uppercase tracking-tighter drop-shadow-2xl">
              Words of <span className="text-teal-400">Wisdom.</span>
            </h2>
            {playerData && (
              <div className="mt-3 animate-fade-in">
                <p className="text-teal-300 font-bold uppercase tracking-[0.2em] text-xs">
                  Welcome, {playerData.name} {playerData.college ? `• ${playerData.college}` : ""}
                </p>
              </div>
            )}
            <div className="h-1.5 w-full max-w-[280px] bg-white/10 rounded-full mt-6 overflow-hidden border border-white/5">
              <div
                className="h-full bg-teal-400 w-full animate-splash-loader origin-left"
                style={{ animationDuration: "3500ms" }}
              />
            </div>
          </div>
        </div>
      )}

      {/* TUTORIAL SCREEN */}
      {gameState === "TUTORIAL" && (
        <div className="relative z-10 max-w-2xl w-full p-6 md:p-8 text-center animate-fade-in flex flex-col items-center stickman-rescue-tutorial my-auto">
          <button
            onClick={() => {
              if (audioManager) audioManager.playPop();
              setGameState("LEVEL_SELECT");
            }}
            className="fixed top-6 left-6 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all hover:scale-105 active:scale-95 flex items-center gap-2 z-[2000]"
          >
            <svg
              className="w-3 h-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Missions
          </button>

          <div className="w-16 h-16 md:w-20 md:h-20 bg-teal-500/20 backdrop-blur-xl rounded-2xl mb-4 flex items-center justify-center border border-teal-400/30">
            <img
              src="/stickman_assets/hope_stickman.svg"
              alt="Tutor"
              className="w-12 h-12 md:w-14 md:h-14 animate-bounce-subtle"
            />
          </div>
          <h2 className="text-2xl md:text-4xl font-black text-white mb-2 uppercase tracking-tight">
            Mission Briefing: {difficulty}
          </h2>
          <p className="text-teal-200 text-xs font-bold uppercase tracking-widest mb-6">
            Empower with Compassionate Language
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 mb-6 w-full text-left max-h-[45vh] md:max-h-none overflow-y-auto pr-1 custom-scrollbar">
            {[
              {
                num: 1,
                badgeBg: "bg-teal-500",
                badgeText: "text-teal-300",
                label: "Movement",
                text: "Move your mouse, touch slider, or use [← / → / A / D] keys to guide your character.",
              },
              {
                num: 2,
                badgeBg: "bg-amber-500",
                badgeText: "text-amber-300",
                label: "Objective",
                text: (
                  <span>
                    Catch the{" "}
                    <span className="text-white font-bold underline decoration-teal-400">
                      Seeds of Hope
                    </span>{" "}
                    (people-first words). Let harmful language fall past.
                  </span>
                ),
              },
              {
                num: 3,
                badgeBg: "bg-rose-500",
                badgeText: "text-rose-300",
                label: "Lives & Warnings",
                text: "You have 3 lives. Catching stigmatizing language or letting Seeds of Hope fall costs 1 life.",
              },
              {
                num: 4,
                badgeBg: "bg-indigo-500",
                badgeText: "text-indigo-300",
                label: "Victory Goal",
                text: "Catch 12 Seeds of Hope to complete the mission, advance level mastery, and unlock next tiers.",
              },
            ].map(({ num, badgeBg, badgeText, label, text }) => (
              <div
                key={num}
                className="bg-white/10 border border-white/15 p-4 rounded-2xl backdrop-blur-md"
              >
                <div className="flex items-center gap-2.5 mb-2">
                  <div
                    className={`w-7 h-7 ${badgeBg} rounded-lg flex items-center justify-center font-black text-white text-xs shadow-md`}
                  >
                    {num}
                  </div>
                  <span
                    className={`${badgeText} font-black uppercase tracking-widest text-[9px]`}
                  >
                    {label}
                  </span>
                </div>
                <p className="text-slate-200 text-xs leading-relaxed">
                  {text}
                </p>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full justify-center">
            <button
              onClick={() => startGame(difficulty)}
              className="px-10 py-4 bg-teal-500 text-white rounded-2xl font-black uppercase tracking-widest text-sm shadow-2xl hover:bg-teal-400 transition-all hover:-translate-y-0.5 active:scale-95 border-b-4 border-teal-700"
            >
              Start Mission
            </button>
            <button
              onClick={() => {
                setGlossaryTab("all");
                setIsHistoryOpen(true);
              }}
              className="px-6 py-4 bg-white/10 hover:bg-white/20 text-white rounded-2xl font-black uppercase tracking-widest text-xs transition-all border border-white/20"
            >
              📚 Preview Glossary
            </button>
          </div>
        </div>
      )}

      {/* GAMEPLAY SCREEN */}
      {gameState === "PLAYING" && (
        <>
          {/* Falling Word Chips */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {fallingItems.map((item) => {
              const q = shuffledQuestions.find(
                (sq) => sq.id === item.questionId,
              );
              return (
                <div
                  key={item.id}
                  className={`absolute transition-transform duration-100 flex flex-col items-center justify-center p-3 md:p-4 rounded-3xl border-2 shadow-2xl text-white group gameplay-word-chip ${item.isCorrect ? "gameplay-word-chip-correct" : "gameplay-word-chip-harmful"}`}
                  style={{
                    left: `${item.x}%`,
                    top: `${item.y}%`,
                    transform: "translate(-50%, -50%)",
                    maxWidth: "min(260px, 45vw)",
                    textAlign: "center",
                    backdropFilter: "blur(12px)",
                    WebkitBackdropFilter: "blur(12px)",
                  }}
                >
                  <span className="text-[11px] md:text-sm font-black leading-tight uppercase tracking-wider">
                    {item.text}
                  </span>
                  {explanationMode && q && (
                    <div
                      className={`mt-1.5 text-[8px] font-bold leading-snug px-2 py-0.5 rounded-lg ${item.isCorrect ? "bg-teal-500/90 text-white" : "bg-red-500/90 text-white"}`}
                    >
                      {item.isCorrect ? "✓ People-First" : "✗ Stigmatizing"}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Growth Log Sidebar (Right) */}
          <div
            className={`absolute right-4 top-20 md:top-24 z-40 transition-all duration-500 stickman-rescue-sidebar-right ${isSidebarVisible ? "translate-x-0 opacity-100" : "translate-x-[120%] opacity-0"}`}
          >
            <div
              className="max-w-[220px] md:max-w-[300px] bg-slate-900/90 rounded-2xl border border-teal-500/40 p-4 shadow-4xl flex flex-col text-white"
              style={{
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
              }}
            >
              <div className="flex items-center gap-2 mb-2.5">
                <div className="w-6 h-6 bg-teal-500/20 rounded-lg flex items-center justify-center text-teal-300 text-xs">
                  🌱
                </div>
                <span className="text-teal-300 font-black uppercase text-[9px] tracking-widest">
                  Growth Insight
                </span>
              </div>
              {explanation && (
                <div className="space-y-2 animate-fade-in" key={explanation.correct}>
                  <div>
                    <span className="text-[7px] font-black text-teal-400 uppercase tracking-widest">
                      Empowering Language
                    </span>
                    <p className="text-white font-bold text-xs italic">
                      "{explanation.correct}"
                    </p>
                  </div>
                  <div className="pt-2 border-t border-white/10">
                    <p className="text-slate-300 text-[10px] leading-relaxed">
                      {explanation.why}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Stigma Alert Sidebar (Left) */}
          <div
            className={`absolute left-4 top-24 md:top-28 z-40 transition-all duration-500 stickman-rescue-sidebar-left ${isAlertVisible ? "translate-x-0 opacity-100" : "translate-x-[-120%] opacity-0"}`}
          >
            <div
              className="max-w-[220px] md:max-w-[300px] bg-slate-900/95 rounded-2xl border border-red-500/40 p-4 shadow-[0_0_30px_rgba(239,68,68,0.3)] flex flex-col text-white"
              style={{
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
              }}
            >
              <div className="flex items-center gap-2 mb-2.5">
                <div className="w-6 h-6 bg-red-500/20 rounded-lg flex items-center justify-center text-red-400 text-xs">
                  ⚠️
                </div>
                <span className="text-red-400 font-black uppercase text-[9px] tracking-[0.2em]">
                  Stigma Alert
                </span>
              </div>
              {stigmaAlert && (
                <div className="space-y-2 animate-shake" key={stigmaAlert.stigma}>
                  <div className="p-2 bg-red-500/15 rounded-xl border border-red-500/30">
                    <span className="text-[7px] font-black text-red-400 uppercase tracking-widest block mb-1">
                      Harmful Terminology
                    </span>
                    <p className="text-white font-bold text-[10px] leading-tight italic line-through">
                      "{stigmaAlert.stigma}"
                    </p>
                  </div>
                  <p className="text-slate-300 text-[10px] leading-relaxed">
                    Prefer: <span className="text-teal-300 font-bold">"{stigmaAlert.correct}"</span>
                  </p>
                  <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden mt-1">
                    <div
                      className="h-full bg-red-500 animate-shrink-timer"
                      style={{ animationDuration: "5s" }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Hearts / Lives indicator */}
          <div className="absolute top-16 md:top-20 left-4 md:left-8 flex gap-1.5 z-40">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className={`w-7 h-7 md:w-8 md:h-8 rounded-lg border-2 flex items-center justify-center shadow-lg transition-all duration-300 ${
                  i < 3 - mistakes
                    ? "bg-teal-500 text-white border-teal-400 shadow-teal-500/30 scale-100"
                    : "bg-slate-900/60 text-slate-700 border-slate-800 scale-90 opacity-30"
                }`}
              >
                <span className="text-xs">❤️</span>
              </div>
            ))}
          </div>

          {/* Player Character */}
          <div
            className="absolute z-[100] pointer-events-none transition-transform duration-75"
            style={{
              left: `${playerX}%`,
              bottom: isMobile ? "120px" : "10%",
              transform: "translateX(-50%)",
            }}
          >
            <div className="relative">
              <div
                className={`absolute inset-0 bg-teal-400/20 blur-2xl rounded-full transition-all duration-500 ${harmony > 60 ? "scale-150" : "scale-75"}`}
              />
              <img
                src={
                  harmony > 30
                    ? "/stickman_assets/hope_stickman.svg"
                    : `/stickman_assets/${playerGender}_distressed.svg`
                }
                alt="Player"
                className="w-20 h-20 md:w-28 md:h-28 drop-shadow-2xl"
              />
            </div>
          </div>

          {/* Desktop Controls Helper Badge */}
          {!isMobile && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-md border border-white/15 px-4 py-1.5 rounded-full z-40 text-white/60 text-[9px] font-bold tracking-wider flex items-center gap-3">
              <span>⌨️ <strong className="text-teal-300">[← / → / A / D]</strong> or Mouse Move</span>
              <span>•</span>
              <span><strong className="text-orange-300">[Space / Shift]</strong> 2X Speed</span>
              <span>•</span>
              <span><strong className="text-slate-200">[P]</strong> Pause</span>
            </div>
          )}

          {/* Mobile Controls */}
          {isMobile && (
            <>
              {/* 2X Speed Boost button */}
              <button
                onPointerDown={() => {
                  setIsSpeedBoosted(true);
                  speedBoostRef.current = true;
                }}
                onPointerUp={() => {
                  setIsSpeedBoosted(false);
                  speedBoostRef.current = false;
                }}
                onPointerCancel={() => {
                  setIsSpeedBoosted(false);
                  speedBoostRef.current = false;
                }}
                className={`absolute bottom-36 right-6 w-12 h-12 rounded-full flex items-center justify-center transition-all border-2 z-[300] active:scale-90 shadow-2xl ${
                  isSpeedBoosted
                    ? "bg-orange-500 border-orange-400 shadow-[0_0_20px_rgba(249,115,22,0.5)] text-white scale-110"
                    : "bg-white/10 backdrop-blur-xl border-white/20 text-white/50"
                }`}
              >
                <span className="text-sm font-black italic">2X</span>
              </button>

              {/* Touch Slider */}
              <div className="absolute bottom-4 left-0 right-0 px-6 py-4 z-[200] flex flex-col items-center">
                <div
                  className="relative w-full max-w-[360px] h-16 bg-white/10 backdrop-blur-2xl rounded-2xl border border-white/20 shadow-2xl overflow-hidden touch-none"
                  onPointerDown={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const x = ((e.clientX - rect.left) / rect.width) * 100;
                    const clampedX = Math.max(8, Math.min(92, x));
                    setPlayerX(clampedX);
                    playerRef.current = clampedX;
                  }}
                  onPointerMove={(e) => {
                    if (e.buttons > 0) {
                      const rect = e.currentTarget.getBoundingClientRect();
                      const x = ((e.clientX - rect.left) / rect.width) * 100;
                      const clampedX = Math.max(8, Math.min(92, x));
                      setPlayerX(clampedX);
                      playerRef.current = clampedX;
                    }
                  }}
                  onTouchMove={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const touch = e.touches[0];
                    const x = ((touch.clientX - rect.left) / rect.width) * 100;
                    const clampedX = Math.max(8, Math.min(92, x));
                    setPlayerX(clampedX);
                    playerRef.current = clampedX;
                  }}
                >
                  <div
                    className="absolute inset-y-0 left-0 bg-teal-400/20 blur-md pointer-events-none"
                    style={{ width: `${playerX}%` }}
                  />
                  <div
                    className="absolute w-16 h-12 bg-teal-500/80 backdrop-blur-md rounded-xl border border-white/50 shadow-lg flex flex-col items-center justify-center transition-all duration-75"
                    style={{
                      left: `${playerX}%`,
                      top: "50%",
                      transform: "translate(-50%, -50%)",
                    }}
                  >
                    <span className="text-[7px] font-black text-white uppercase tracking-widest">
                      Slide ↔
                    </span>
                  </div>
                </div>
              </div>
            </>
          )}
        </>
      )}

      {/* WORD GLOSSARY MODAL */}
      {isHistoryOpen && (
        <div className="fixed inset-0 z-[2500] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-slate-900/95 backdrop-blur-2xl rounded-3xl border border-white/20 shadow-4xl p-5 md:p-6 w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col text-white animate-scale-in">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-teal-500/20 rounded-xl flex items-center justify-center border border-teal-400/30 text-teal-300">
                  <span className="text-xl">📚</span>
                </div>
                <div>
                  <h3 className="text-base md:text-lg font-black uppercase text-white tracking-wide">
                    Mindful Terminology Glossary
                  </h3>
                  <p className="text-[10px] text-teal-300/80 font-medium">
                    Language to End Stigma & Promote Hope
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsHistoryOpen(false)}
                className="w-8 h-8 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-all hover:scale-105 active:scale-95"
              >
                ✕
              </button>
            </div>

            {/* Tabs and Search */}
            <div className="flex flex-col sm:flex-row gap-2.5 my-3.5">
              <div className="flex gap-2">
                <button
                  onClick={() => setGlossaryTab("all")}
                  className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-wider transition-all ${
                    glossaryTab === "all"
                      ? "bg-teal-500 text-white shadow-md"
                      : "bg-white/5 text-white/60 hover:bg-white/10"
                  }`}
                >
                  All Words ({TERMINOLOGY_DATA.questions.length})
                </button>
                <button
                  onClick={() => setGlossaryTab("session")}
                  className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-wider transition-all ${
                    glossaryTab === "session"
                      ? "bg-teal-500 text-white shadow-md"
                      : "bg-white/5 text-white/60 hover:bg-white/10"
                  }`}
                >
                  Session History ({wordHistory.length})
                </button>
              </div>

              <div className="flex-1">
                <input
                  type="text"
                  value={glossarySearch}
                  onChange={(e) => setGlossarySearch(e.target.value)}
                  placeholder="Search terminology..."
                  className="w-full bg-white/5 border border-white/10 hover:border-teal-400/40 focus:border-teal-400 focus:outline-none px-3 py-1.5 rounded-xl text-xs text-white placeholder:text-white/30"
                />
              </div>
            </div>

            {/* Words List */}
            <div className="overflow-y-auto flex-1 space-y-3 pr-1.5 custom-scrollbar">
              {filteredGlossary.length === 0 ? (
                <div className="py-12 text-center text-slate-400 text-xs">
                  {glossaryTab === "session"
                    ? "No words encountered in this session yet. Catch seeds during gameplay!"
                    : "No matching terms found."}
                </div>
              ) : (
                filteredGlossary.map((word) => (
                  <div
                    key={word.id}
                    className="bg-white/5 rounded-2xl p-4 border border-white/10 hover:border-teal-400/30 transition-all"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-lg bg-teal-500/20 text-teal-300 flex items-center justify-center shrink-0 text-xs mt-0.5">
                        ✓
                      </div>
                      <div className="flex-1 space-y-1.5">
                        <div>
                          <span className="text-[8px] font-black text-teal-400 uppercase tracking-widest block">
                            Better Choice (People-First)
                          </span>
                          <p className="text-xs md:text-sm font-bold text-white leading-tight">
                            "{word.correct}"
                          </p>
                        </div>
                        <div>
                          <span className="text-[8px] font-black text-rose-400 uppercase tracking-widest block">
                            Avoid (Stigmatizing)
                          </span>
                          <p className="text-[11px] font-medium text-slate-400 line-through leading-tight">
                            "{word.stigma}"
                          </p>
                        </div>
                        <div className="pt-2 border-t border-white/10">
                          <p className="text-[10px] text-slate-300 leading-relaxed">
                            {word.why}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Modal Footer */}
            <div className="mt-3 pt-3 border-t border-white/10 flex justify-between items-center text-[10px] text-slate-400">
              <span>Showing {filteredGlossary.length} terminology pairs</span>
              <button
                onClick={() => setIsHistoryOpen(false)}
                className="px-4 py-1.5 bg-teal-500 hover:bg-teal-400 text-white rounded-xl font-bold uppercase tracking-wider transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* GAME OVER SCREEN */}
      {gameState === "GAME_OVER" && (
        <div className="relative z-10 max-w-lg w-full p-6 md:p-8 text-center animate-pop-in flex flex-col items-center stickman-rescue-results my-auto">
          <div className="w-20 h-20 md:w-24 md:h-24 bg-rose-500/20 rounded-3xl mb-4 flex items-center justify-center p-4 shadow-2xl border-2 border-rose-400/50">
            <span className="text-4xl">💔</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-white mb-2 uppercase tracking-tight">
            Keep Practicing!
          </h2>
          <p className="text-teal-200 text-xs md:text-sm font-bold mb-4 uppercase tracking-widest">
            Mistakes are stepping stones to mindful language.
          </p>

          <div className="flex gap-6 mb-6 bg-white/10 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/15">
            <div className="flex flex-col items-center">
              <p className="text-white/60 text-[9px] font-black uppercase tracking-widest">
                Seeds Caught
              </p>
              <p className="text-white text-lg md:text-xl font-black">
                {score}/12
              </p>
            </div>
            {maxStreak > 0 && (
              <div className="flex flex-col items-center">
                <p className="text-white/60 text-[9px] font-black uppercase tracking-widest">
                  Best Streak
                </p>
                <p className="text-orange-400 text-lg md:text-xl font-black">
                  🔥 {maxStreak}
                </p>
              </div>
            )}
            <div className="flex flex-col items-center">
              <p className="text-white/60 text-[9px] font-black uppercase tracking-widest">
                Difficulty
              </p>
              <p className="text-teal-300 text-lg md:text-xl font-black">
                {difficulty}
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-2.5 w-full max-w-xs">
            <button
              onClick={() => startGame(difficulty)}
              className="w-full py-3.5 bg-teal-500 hover:bg-teal-400 text-white rounded-xl font-black uppercase tracking-widest text-xs shadow-xl transition-all hover:scale-[1.02] active:scale-95"
            >
              Try Again
            </button>
            <button
              onClick={() => {
                setGlossaryTab("all");
                setIsHistoryOpen(true);
              }}
              className="w-full py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-black uppercase tracking-widest text-xs transition-all border border-white/20 flex items-center justify-center gap-2"
            >
              <span>📚</span> Review Word Glossary
            </button>
            <button
              onClick={() => setGameState("LEVEL_SELECT")}
              className="w-full py-2.5 bg-white/5 hover:bg-white/15 text-white/80 rounded-xl font-black uppercase tracking-widest text-[10px] transition-all"
            >
              Choose Mission
            </button>
            <button
              onClick={onExit}
              className="w-full py-2 text-white/40 hover:text-white font-black uppercase tracking-widest text-[9px] transition-all"
            >
              Exit to Arcade
            </button>
          </div>
        </div>
      )}

      {/* RESULTS / VICTORY SCREEN */}
      {gameState === "RESULTS" && (
        <div className="relative z-10 max-w-lg w-full p-6 md:p-8 text-center animate-pop-in flex flex-col items-center stickman-rescue-results my-auto">
          <div className="w-20 h-20 md:w-24 md:h-24 bg-teal-500 rounded-3xl mb-4 flex items-center justify-center shadow-2xl border-2 border-white overflow-hidden">
            <img
              src="/stickman_assets/hope_stickman.svg"
              alt="Success"
              className="w-14 h-14 md:w-16 md:h-16 drop-shadow-lg"
            />
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-white mb-1 uppercase tracking-tight">
            Mission Mastered!
          </h2>
          <p className="text-teal-300 text-xs font-bold uppercase tracking-widest mb-4">
            {difficulty} Tier Complete
          </p>

          <div className="flex gap-6 mb-4 bg-white/10 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/15">
            <div className="flex flex-col items-center">
              <p className="text-teal-200 text-[9px] font-bold uppercase tracking-widest">
                Final Score
              </p>
              <p className="text-white text-xl md:text-2xl font-black">
                {score}/12
              </p>
            </div>
            {maxStreak > 0 && (
              <div className="flex flex-col items-center">
                <p className="text-orange-200 text-[9px] font-bold uppercase tracking-widest">
                  Max Streak
                </p>
                <p className="text-orange-400 text-xl md:text-2xl font-black">
                  🔥 {maxStreak}
                </p>
              </div>
            )}
            <div className="flex flex-col items-center">
              <p className="text-white/60 text-[9px] font-bold uppercase tracking-widest">
                Harmony
              </p>
              <p className="text-teal-300 text-xl md:text-2xl font-black">
                {harmony}%
              </p>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 mb-6 border border-white/20 text-white/90">
            <p className="text-xs md:text-sm font-medium leading-relaxed italic">
              "You have demonstrated the power of people-first language. Choosing the right words ends stigma and saves lives."
            </p>
          </div>

          <div className="flex flex-col gap-2.5 w-full max-w-xs">
            {/* Next mission shortcut if available */}
            {difficulty === "EASY" && (
              <button
                onClick={() => {
                  setDifficulty("NORMAL");
                  startGame("NORMAL");
                }}
                className="w-full py-3.5 bg-teal-500 hover:bg-teal-400 text-white rounded-xl font-black uppercase tracking-widest text-xs shadow-xl transition-all hover:scale-[1.02] active:scale-95"
              >
                Next Mission: Mist (🌿)
              </button>
            )}

            {difficulty === "NORMAL" && (
              <button
                onClick={() => {
                  setDifficulty("HARD");
                  startGame("HARD");
                }}
                className="w-full py-3.5 bg-orange-500 hover:bg-orange-400 text-white rounded-xl font-black uppercase tracking-widest text-xs shadow-xl transition-all hover:scale-[1.02] active:scale-95"
              >
                Next Mission: Storm (⛈️)
              </button>
            )}

            <button
              onClick={() => startGame(difficulty)}
              className="w-full py-3 bg-white/15 hover:bg-white/25 text-white rounded-xl font-black uppercase tracking-widest text-xs transition-all"
            >
              Replay Mission
            </button>

            <button
              onClick={() => {
                setGlossaryTab("all");
                setIsHistoryOpen(true);
              }}
              className="w-full py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl font-black uppercase tracking-widest text-[10px] transition-all border border-white/15 flex items-center justify-center gap-2"
            >
              <span>📚</span> Review Word Glossary
            </button>

            <button
              onClick={() => setGameState("LEVEL_SELECT")}
              className="w-full py-2.5 bg-white/5 hover:bg-white/15 text-white/80 rounded-xl font-black uppercase tracking-widest text-[10px] transition-all"
            >
              Mission Select
            </button>

            <button
              onClick={onExit}
              className="w-full py-2 text-white/40 hover:text-white font-black uppercase tracking-widest text-[9px] transition-all"
            >
              Exit to Arcade
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

