import React, { useState, useEffect, useRef } from 'react';
import { toggleFullscreen } from './utils/fullscreen';

const QuizGameScreen = ({ audioManager, onExit, levelData, playerGender = 'guy', globalCorrectIds = new Set(), onMarkCorrect }) => {
    const [isPausedInternal, setIsPausedInternal] = useState(false);
    const [quizTimer, setQuizTimer] = useState(levelData.timeLimit || 60);
    const [quizCards, setQuizCards] = useState({ deck: [], myth: [], fact: [] });
    const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 });
    const dragPositionRef = useRef({ x: 0, y: 0 }); // Ref for synchronous access
    const [isDragging, setIsDragging] = useState(false);
    const [isThrowing, setIsThrowing] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const [activeDragCard, setActiveDragCard] = useState(null);
    const [showResults, setShowResults] = useState(false);
    const [missedPage, setMissedPage] = useState(0);
    const [mythPage, setMythPage] = useState(0);
    const [factPage, setFactPage] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState({ piles: 4, missed: 6 });
    const dragStartTime = useRef(0);
    const lastHapticTarget = useRef(null);

    useEffect(() => {
        const updateLayout = () => {
            if (window.innerWidth < 768) {
                setItemsPerPage({ piles: 2, missed: 2 });
            } else {
                setItemsPerPage({ piles: 4, missed: 6 });
            }
        };
        updateLayout();
        window.addEventListener('resize', updateLayout);
        return () => window.removeEventListener('resize', updateLayout);
    }, []);

    useEffect(() => {
        // Filter out questions that have already been correctly answered
        const remainingQuestions = levelData.questions.filter(q => !globalCorrectIds.has(q.id));
        
        const shuffledDeck = [...remainingQuestions].sort(() => Math.random() - 0.5);
        
        setQuizCards({
            deck: shuffledDeck,
            myth: [],
            fact: []
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [levelData]);

    useEffect(() => {
        const targetGoal = levelData.id === 1 ? 13 : levelData.id === 2 ? 26 : 36;
        if (globalCorrectIds.size >= targetGoal) {
            setShowResults(true);
        }
    }, [globalCorrectIds.size, levelData.id]);

    useEffect(() => {
        if (showResults || isPausedInternal) return;

        const timer = setInterval(() => {
            setQuizTimer(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    setShowResults(true);
                    return 0;
                }
                // Play tick sound every second
                if (audioManager && typeof audioManager.playTick === 'function') {
                    audioManager.playTick();
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [showResults, audioManager, isPausedInternal]);

    const handleCardDragStart = (e, card, source) => {
        if (isPausedInternal) return;

        // touch-none class on the element handles scroll prevention.
        // preventDefault() is removed to avoid "passive listener" errors in React.
        e.stopPropagation();

        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        setIsDragging(true);
        setDragStart({ x: clientX, y: clientY });
        setDragPosition({ x: 0, y: 0 });
        dragPositionRef.current = { x: 0, y: 0 };
        setActiveDragCard({ card, source });
        dragStartTime.current = Date.now();
    };

    const handleCardDragMove = (e) => {
        if (!isDragging) return;
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        const currentMoveX = clientX - dragStart.x;
        const currentMoveY = clientY - dragStart.y;

        const newPos = {
            x: currentMoveX,
            y: currentMoveY
        };

        setDragPosition(newPos);
        dragPositionRef.current = newPos; // Update ref synchronously

        // Zone Entry Haptics
        let currentTarget = null;
        if (activeDragCard?.source === 'deck') {
            if (currentMoveX < -100) currentTarget = 'myth';
            else if (currentMoveX > 100) currentTarget = 'fact';
        }

        if (currentTarget && currentTarget !== lastHapticTarget.current) {
            if (navigator.vibrate) navigator.vibrate(10); // Light tick on entry
            lastHapticTarget.current = currentTarget;
        } else if (!currentTarget) {
            lastHapticTarget.current = null;
        }
    };

    const handleCardDragEnd = () => {
        if ((!isDragging && !isThrowing) || !activeDragCard) return;

        const timeElapsed = Date.now() - dragStartTime.current;
        const moveX = dragPositionRef.current.x;
        const moveY = dragPositionRef.current.y;
        const velocityX = Math.abs(moveX) / (timeElapsed || 1);
        const velocityY = Math.abs(moveY) / (timeElapsed || 1);

        let target = activeDragCard.source;
        let isFlick = false;
        const isMobile = window.innerWidth < 768;

        // Logic for deck source (throwing cards from deck)
        if (activeDragCard.source === 'deck') {
            if (isMobile) {
                // Vertical sorting for mobile (Myth Top, Fact Bottom)
                if (velocityY > 0.4 && Math.abs(moveY) > 20) {
                    isFlick = true;
                    target = moveY < 0 ? 'myth' : 'fact';
                } else {
                    if (moveY < -60) target = 'myth';
                    else if (moveY > 60) target = 'fact';
                }
            } else {
                // Horizontal sorting for desktop (Myth Left, Fact Right)
                if (velocityX > 0.5 && Math.abs(moveX) > 20) {
                    isFlick = true;
                    target = moveX < 0 ? 'myth' : 'fact';
                } else {
                    if (moveX < -80) target = 'myth';
                    else if (moveX > 80) target = 'fact';
                }
            }
        } else {
            // Re-sorting from piles (simplified for now)
            if (isMobile) {
                if (moveY > 200 && activeDragCard.source === 'myth') target = 'fact';
                else if (moveY < -200 && activeDragCard.source === 'fact') target = 'myth';
                else if (Math.abs(moveY) < 100) target = 'deck';
            } else {
                if (moveX > 300 && activeDragCard.source === 'myth') target = 'fact';
                else if (moveX < -300 && activeDragCard.source === 'fact') target = 'myth';
                else if (Math.abs(moveX) < 100) target = 'deck';
            }
        }

        // Handle Flick/Throw Animation
        if (isFlick && target !== activeDragCard.source) {
            setIsDragging(false);
            setIsThrowing(true);

            const throwX = isMobile ? moveX : (moveX > 0 ? window.innerWidth : -window.innerWidth);
            const throwY = isMobile ? (moveY > 0 ? window.innerHeight : -window.innerHeight) : moveY;

            setDragPosition({ x: throwX, y: throwY });

            setTimeout(() => {
                finalizeMove(activeDragCard.card, activeDragCard.source, target);
                setIsThrowing(false);
                setDragPosition({ x: 0, y: 0 });
                dragPositionRef.current = { x: 0, y: 0 };
                setActiveDragCard(null);
            }, 300);
            return;
        }

        // Standard drop (no flick or piledrop)
        finalizeMove(activeDragCard.card, activeDragCard.source, target);
        setIsDragging(false);
        if (!isFlick) {
            setDragPosition({ x: 0, y: 0 });
            dragPositionRef.current = { x: 0, y: 0 };
            setActiveDragCard(null);
        }
    };

    const finalizeMove = (card, from, to) => {
        if (to !== from) {
            moveCard(card, from, to);

            // Result Haptics
            if (to === 'myth' || to === 'fact') {
                const isCorrect = (to === 'myth' && card.answer === 'Myth') || (to === 'fact' && card.answer === 'Fact');
                if (navigator.vibrate) {
                    if (isCorrect) navigator.vibrate(50); // Crisp success
                    else navigator.vibrate([50, 50, 50]); // Heavy failure buzz
                }
                if (isCorrect && onMarkCorrect) {
                    onMarkCorrect(card.id);
                }
            }

            // Haptic feedback for drops (generic)
            if (navigator.vibrate) navigator.vibrate(10);

            if (audioManager && typeof audioManager.playDing === 'function') {
                audioManager.playDing();
            }
        }
    };

    const moveCard = (card, from, to) => {
        setQuizCards(prev => {
            // Prevent duplicating the card in the destination
            if (prev[to].some(c => c.id === card.id)) return prev;

            const newSource = prev[from].filter(c => c.id !== card.id);
            const newDest = [...prev[to], card];
            return {
                ...prev,
                [from]: newSource,
                [to]: newDest
            };
        });
    };

    const restartQuiz = () => {
        setQuizTimer(levelData.timeLimit || 60);
        
        const remainingQuestions = levelData.questions.filter(q => !globalCorrectIds.has(q.id));
        const shuffledDeck = [...remainingQuestions].sort(() => Math.random() - 0.5);

        setQuizCards({
            deck: shuffledDeck,
            myth: [],
            fact: []
        });
        setShowResults(false);
    };

    const finishQuiz = () => {
        setShowResults(true);
    };

    const topDeckCard = quizCards.deck[0];
    const nextDeckCard = quizCards.deck[1];
    const correctMyth = quizCards.myth.filter(c => c.answer === 'Myth');
    const correctFact = quizCards.fact.filter(c => c.answer === 'Fact');
    const totalCorrect = correctMyth.length + correctFact.length;
    const totalAnswered = quizCards.myth.length + quizCards.fact.length;
    const isDeckEmpty = quizCards.deck.length === 0;

    return (
        <div
            className="game-container min-h-screen w-full bg-linear-to-br from-indigo-600 via-purple-700 to-indigo-900 flex flex-col relative overflow-hidden font-sans select-none"
            onMouseMove={handleCardDragMove}
            onTouchMove={handleCardDragMove}
            onMouseUp={handleCardDragEnd}
            onTouchEnd={handleCardDragEnd}
            onMouseLeave={handleCardDragEnd}
        >

            {/* Table Surface Texture */}
            <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMSIgZmlsbD0id2hpdGUiIGZpbGwtb3BhY2l0eT0iMC4xIi8+PC9zdmc+')]"></div>

            {/* Top Bar */}
            <div className="relative z-50 px-3 py-3 md:px-6 md:py-4 flex justify-between items-center bg-white/10 backdrop-blur-md border-b border-white/10 shadow-lg">
                <div className="flex-1 flex justify-start">
                    <button
                        onClick={onExit}
                        className="group flex items-center gap-2 px-4 py-2 md:px-6 md:py-3 min-h-10 md:min-h-11 rounded-full bg-red-500 hover:bg-red-600 transition-all border border-red-400 shadow-md transform hover:scale-105 active:scale-95"
                    >
                        <span className="text-white text-[10px] md:text-xs font-bold uppercase tracking-widest">Exit</span>
                    </button>
                </div>

                <div className="flex-none flex flex-row items-center gap-2 md:gap-4">
                    <div className="relative px-3 py-1.5 md:px-4 md:py-2 bg-black/40 rounded-2xl border border-white/10 backdrop-blur-md flex flex-col items-center shadow-2xl">
                        <span className="text-[7px] md:text-[8px] uppercase tracking-[0.2em] text-white/60 font-black mb-0.5 md:mb-1">Time Remaining</span>
                        <div className="flex items-center gap-1 md:gap-2">
                            <img src="/stickman_assets/clock_stickman.svg" className={`w-5 h-5 md:w-8 md:h-8 filter invert opacity-80 ${quizTimer < 10 ? 'animate-bounce-subtle' : ''}`} alt="Timer" />
                            <span className={`text-lg md:text-3xl font-black font-mono tracking-wider ${quizTimer < 10 ? 'text-red-400 drop-shadow-[0_0_10px_rgba(248,113,113,0.5)] animate-pulse' : 'text-white drop-shadow-md'}`}>
                                00:{quizTimer.toString().padStart(2, '0')}
                            </span>
                        </div>
                    </div>

                    <div className="relative px-3 py-1.5 md:px-4 md:py-2 bg-black/40 rounded-2xl border border-white/10 backdrop-blur-md flex flex-col items-center shadow-2xl">
                        <span className="text-[7px] md:text-[8px] uppercase tracking-[0.2em] text-white/60 font-black mb-0.5 md:mb-1">Level Progress</span>
                        <div className="flex items-center gap-1 md:gap-2">
                            <span className="text-lg md:text-3xl font-black font-mono tracking-wider text-teal-400 drop-shadow-md">
                                {levelData.id === 1 ? Math.min(globalCorrectIds.size, 13) : levelData.id === 2 ? Math.min(Math.max(globalCorrectIds.size - 13, 0), 13) : Math.min(Math.max(globalCorrectIds.size - 26, 0), 10)}
                            </span>
                            <span className="text-sm md:text-xl font-bold text-white/50">/</span>
                            <span className="text-sm md:text-xl font-bold text-white/80">
                                {levelData.id === 3 ? 10 : 13}
                            </span>
                        </div>
                    </div>
                </div>

                {/*toggle fullscreen*/}
                <div className="flex-1 flex items-center justify-end gap-2 md:gap-4">
                    <button
                        onClick={toggleFullscreen}
                        className="p-3 rounded-full transition-all duration-300 flex items-center justify-center bg-white/20 hover:bg-white/30 border border-white/20 shadow-lg"
                        title="Toggle Fullscreen"
                    >
                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z" />
                        </svg>
                    </button>

                    <button
                        onClick={() => setIsPausedInternal(!isPausedInternal)}
                        className={`p-3 rounded-full transition-all duration-300 flex items-center justify-center ${isPausedInternal
                                ? 'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/30'
                                : 'bg-white/20 hover:bg-white/30'
                            } border border-white/20 shadow-lg`}
                        title={isPausedInternal ? "Resume" : "Pause"}
                    >
                        {isPausedInternal ? (
                            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M8 5v14l11-7z" />
                            </svg>
                        ) : (
                            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                            </svg>
                        )}
                    </button>

                    {isDeckEmpty && !showResults && (
                        <button
                            onClick={finishQuiz}
                            className="bg-linear-to-r from-teal-400 to-emerald-500 text-white px-6 py-3 min-h-11 rounded-full text-xs font-bold uppercase tracking-wider hover:from-teal-300 hover:to-emerald-400 shadow-lg shadow-teal-500/30 transform hover:scale-105 active:scale-95 transition-all outline-none border border-white/20"
                        >
                            Finish
                        </button>
                    )}
                </div>
            </div>

            {!showResults ? (
                <div className="flex-1 relative flex items-center justify-center overflow-hidden">

                    {/* Top Zone: MYTH (Mobile: Top, Desktop: Left) */}
                    <div className="absolute top-4 md:top-auto md:bottom-auto md:inset-y-12 left-4 md:left-12 right-4 md:right-auto w-auto md:w-[30%] h-24 md:h-auto bg-[#3d2b1f] rounded-3xl flex flex-row md:flex-col items-center justify-center md:justify-start md:pt-16 p-2 md:p-6 z-10 overflow-visible transition-all border-b-4 md:border-b-8 border-r-4 md:border-r-8 border-[#2a1d15] shadow-[inset_0_10px_20px_rgba(0,0,0,0.5),0_20px_40px_rgba(0,0,0,0.4)] group">
                        {/* Box Inner Shadow/Depth */}
                        <div className="absolute inset-2 border-2 border-white/5 rounded-2xl pointer-events-none" />
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-20 pointer-events-none mix-blend-overlay">
                            <img src={`/stickman_assets/${playerGender}_distressed.svg`} alt="Myth" className="w-12 h-12 md:w-64 md:h-64 filter invert" />
                        </div>
                        <div className="relative md:absolute md:top-6 left-0 w-auto md:w-full text-center px-4">
                            <h2 className="text-lg md:text-3xl font-black uppercase text-transparent bg-clip-text bg-linear-to-b from-orange-300 to-orange-500 tracking-[0.2em] drop-shadow-sm">MYTH</h2>
                        </div>

                        {/* Myth Pile - Cascading */}
                        <div className="relative w-full md:max-w-55 flex md:flex-col items-center mt-0 md:mt-8 h-full justify-center md:justify-start">
                            {quizCards.myth.length === 0 && (
                                <div className="absolute top-0 w-full h-full md:h-60 border-2 md:border-3 border-dashed border-orange-400/30 rounded-2xl flex flex-col items-center justify-center opacity-70 group">
                                    <div className="w-10 h-10 md:w-20 md:h-20 rounded-full bg-orange-500/20 flex items-center justify-center mb-1 md:mb-2 group-hover:scale-110 transition-transform">
                                        <img src="/stickman_assets/pointing_stickman.svg" className="w-6 h-6 md:w-12 md:h-12 opacity-60" alt="Drop Here" />
                                    </div>
                                    <span className="text-orange-200 font-bold uppercase text-[8px] md:text-xs tracking-widest text-center">Drop<br className="md:hidden" /> Myths</span>
                                </div>
                            )}
                            {quizCards.myth.map((card, i) => (
                                <div
                                    key={card.id}
                                    className="absolute w-full h-30 md:h-55 bg-white rounded-xl md:rounded-2xl shadow-xl border-4 border-white flex flex-col items-center justify-center p-2 md:p-4 text-center cursor-grab active:cursor-grabbing hover:-translate-y-2 transition-all duration-300 transform scale-75 md:scale-100 origin-bottom overflow-hidden touch-none"
                                    style={{
                                        zIndex: i,
                                        top: `${i * 10}px`,
                                        opacity: (activeDragCard?.card.id === card.id) ? 0 : 1
                                    }}
                                    onMouseDown={(e) => handleCardDragStart(e, card, 'myth')}
                                    onTouchStart={(e) => handleCardDragStart(e, card, 'myth')}
                                >
                                    <div className="w-8 h-8 md:w-16 md:h-16 bg-indigo-50 rounded-full flex items-center justify-center mb-1 md:mb-4 border border-indigo-100 shrink-0">
                                        <img src="/stickman_assets/thinking_stickman.svg" className="w-6 h-6 md:w-12 md:h-12" alt="" />
                                    </div>
                                    <p className="text-[7px] md:text-xs font-black text-slate-800 leading-tight pointer-events-none line-clamp-3 md:line-clamp-4 px-1">{card.question}</p>

                                    {/* Small Marker for Myth */}
                                    <div className="absolute top-1 right-1 md:top-2 md:right-2 w-3 h-3 md:w-5 md:h-5 bg-orange-500 rounded-full flex items-center justify-center shadow-sm">
                                        <img src="/stickman_assets/sad_stickman.svg" className="w-2 h-2 md:w-3 md:h-3 filter invert" alt="" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Bottom Zone: FACT (Mobile: Bottom, Desktop: Right) */}
                    <div className="absolute bottom-4 md:inset-y-12 right-4 md:right-12 left-4 md:left-auto w-auto md:w-[30%] h-24 md:h-auto bg-[#3d2b1f] rounded-3xl flex flex-row md:flex-col items-center justify-center md:justify-start md:pt-16 p-2 md:p-6 z-10 overflow-visible transition-all border-b-4 md:border-b-8 border-l-4 md:border-l-8 border-[#2a1d15] shadow-[inset_0_10px_20px_rgba(0,0,0,0.5),0_20px_40px_rgba(0,0,0,0.4)] group">
                        {/* Box Inner Shadow/Depth */}
                        <div className="absolute inset-2 border-2 border-white/5 rounded-2xl pointer-events-none" />
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-20 pointer-events-none mix-blend-overlay">
                            <img src="/stickman_assets/thinking_stickman.svg" alt="Fact" className="w-12 h-12 md:w-64 md:h-64 filter invert" />
                        </div>
                        <div className="relative md:absolute md:top-6 left-0 w-auto md:w-full text-center px-4">
                            <h2 className="text-lg md:text-3xl font-black uppercase text-transparent bg-clip-text bg-linear-to-b from-teal-300 to-teal-500 tracking-[0.2em] drop-shadow-sm">FACT</h2>
                        </div>

                        {/* Fact Pile - Cascading */}
                        <div className="relative w-full md:max-w-55 flex md:flex-col items-center mt-0 md:mt-8 h-full justify-center md:justify-start">
                            {quizCards.fact.length === 0 && (
                                <div className="absolute top-0 w-full h-full md:h-60 border-2 md:border-3 border-dashed border-teal-400/30 rounded-2xl flex flex-col items-center justify-center opacity-70 group">
                                    <div className="w-10 h-10 md:w-20 md:h-20 rounded-full bg-teal-500/20 flex items-center justify-center mb-1 md:mb-2 group-hover:scale-110 transition-transform">
                                        <img src="/stickman_assets/pointing_stickman.svg" className="w-6 h-6 md:w-12 md:h-12 opacity-60" alt="Drop Here" />
                                    </div>
                                    <span className="text-teal-200 font-bold uppercase text-[8px] md:text-xs tracking-widest text-center">Drop<br className="md:hidden" /> Facts</span>
                                </div>
                            )}
                            {quizCards.fact.map((card, i) => (
                                <div
                                    key={card.id}
                                    className="absolute w-full h-30 md:h-55 bg-white rounded-xl md:rounded-2xl shadow-xl border-4 border-white flex flex-col items-center justify-center p-2 md:p-4 text-center cursor-grab active:cursor-grabbing hover:-translate-y-2 transition-all duration-300 transform scale-75 md:scale-100 origin-bottom overflow-hidden touch-none"
                                    style={{
                                        zIndex: i,
                                        top: `${i * 10}px`,
                                        opacity: (activeDragCard?.card.id === card.id) ? 0 : 1
                                    }}
                                    onMouseDown={(e) => handleCardDragStart(e, card, 'fact')}
                                    onTouchStart={(e) => handleCardDragStart(e, card, 'fact')}
                                >
                                    <div className="w-8 h-8 md:w-16 md:h-16 bg-indigo-50 rounded-full flex items-center justify-center mb-1 md:mb-4 border border-indigo-100 shrink-0">
                                        <img src="/stickman_assets/thinking_stickman.svg" className="w-6 h-6 md:w-12 md:h-12" alt="" />
                                    </div>
                                    <p className="text-[7px] md:text-xs font-black text-slate-800 leading-tight pointer-events-none line-clamp-3 md:line-clamp-4 px-1">{card.question}</p>

                                    {/* Small Marker for Fact */}
                                    <div className="absolute top-1 right-1 md:top-2 md:right-2 w-3 h-3 md:w-5 md:h-5 bg-teal-500 rounded-full flex items-center justify-center shadow-sm">
                                        <img src="/stickman_assets/happy_stickman.svg" className="w-2 h-2 md:w-3 md:h-3 filter invert" alt="" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Center Deck Area */}
                    <div className="relative z-20 pointer-events-auto flex flex-col items-center justify-center h-full">

                        {/* Next Card Preview (Underneath) */}
                        {nextDeckCard && (
                            <div
                                className="absolute w-55 h-75 md:w-70 md:h-95 bg-white/10 backdrop-blur-md rounded-3xl shadow-2xl border border-white/20 flex flex-col items-center justify-center p-8 text-center transform scale-90 translate-y-4 opacity-60 transition-all duration-500"
                                style={{ zIndex: -1 }}
                            >
                                <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mb-6 shadow-inner blur-sm"></div>
                                <div className="h-4 w-3/4 bg-white/20 rounded mb-4 blur-sm"></div>
                                <div className="h-4 w-1/2 bg-white/20 rounded blur-sm"></div>
                            </div>
                        )}

                        {/* Active Deck Card (Top) */}
                        {topDeckCard && (
                            <div
                                className={`w-60 h-85 md:w-[320px] md:h-112.5 bg-white rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.4)] border-4 md:border-8 border-white flex flex-col items-center justify-center p-4 md:p-8 text-center cursor-grab active:cursor-grabbing transition-all duration-200 relative z-20 overflow-hidden group quiz-card-container touch-none
                                ${((isDragging || isThrowing) && activeDragCard?.card.id === topDeckCard.id) ? 'scale-105 opacity-0 pointer-events-none' : 'scale-100 hover:scale-[1.02] hover:-translate-y-4 hover:shadow-[0_40px_70px_rgba(0,0,0,0.5)]'}
                                `}
                                onMouseDown={(e) => handleCardDragStart(e, topDeckCard, 'deck')}
                                onTouchStart={(e) => handleCardDragStart(e, topDeckCard, 'deck')}
                            >
                                {/* Card Decorations */}
                                <div className="absolute top-0 w-full h-32 bg-linear-to-b from-indigo-50 to-transparent pointer-events-none" />
                                <div className="absolute bottom-0 w-full h-32 bg-linear-to-t from-purple-50 to-transparent pointer-events-none" />

                                <div className="relative z-10 w-32 h-32 bg-indigo-50 rounded-full flex items-center justify-center mb-6 shadow-inner border border-indigo-100 group-hover:bg-indigo-100 transition-colors quiz-card-icon pointer-events-none">
                                    <img src="/stickman_assets/thinking_stickman.svg" className="w-24 h-24 drop-shadow-sm pointer-events-none" draggable="false" alt="Thinking" />
                                </div>
                                <h3 className="relative z-10 text-xl md:text-2xl font-black text-slate-800 leading-tight pointer-events-none select-none px-2 quiz-card-text">
                                    {topDeckCard.question}
                                </h3>

                                <div className="absolute bottom-6 left-0 w-full flex justify-center gap-2 pointer-events-none opacity-50">
                                    <span className="text-[10px] uppercase font-bold text-orange-400 flex items-center">← Myth</span>
                                    <span className="text-slate-300">|</span>
                                    <span className="text-[10px] uppercase font-bold text-teal-400 flex items-center">Fact →</span>
                                </div>
                            </div>
                        )}

                        {quizCards.deck.length === 0 && (
                            <div className="flex flex-col items-center justify-center animate-fade-in scale-110">
                                <div className="bg-white/90 backdrop-blur-md p-8 rounded-4xl shadow-2xl border border-white/50 flex flex-col items-center text-center">
                                    <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-4 p-4 border-2 border-slate-200 animate-pulse-slow">
                                        <img src="/stickman_assets/empty_stickman.svg" className="w-16 h-16 opacity-80" alt="Empty" />
                                    </div>
                                    <span className="text-xl uppercase font-black tracking-[0.2em] mb-2 text-slate-900 drop-shadow-none">Deck Empty</span>
                                    <p className="text-sm max-w-55 text-slate-600 font-bold leading-relaxed">
                                        Review your choices in the piles or click <span className="text-teal-600">Finish</span>.
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Dragging Ghost/Cursor Follower */}
                    {(isDragging || isThrowing) && activeDragCard && (
                        <div
                            className={`fixed z-9999 pointer-events-none w-[320px] h-112.5 bg-white rounded-2xl shadow-[0_30px_70px_rgba(0,0,0,0.5)] border-8 border-white flex flex-col items-center justify-center p-8 text-center transform -translate-x-1/2 -translate-y-1/2 rotate-3 ${isThrowing ? 'transition-all duration-300 ease-out' : ''}`}
                            style={{
                                left: dragStart.x + dragPosition.x,
                                top: dragStart.y + dragPosition.y,
                            }}
                        >
                            <div className="w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center mb-6 shadow-inner border border-indigo-100">
                                <img src="/stickman_assets/thinking_stickman.svg" className="w-20 h-20" alt="" />
                            </div>
                            <p className="text-xl font-black text-slate-800 leading-tight">{activeDragCard.card.question}</p>
                        </div>
                    )}

                    {/* Global Drag Overlay */}
                    {isDragging && (
                        <div
                            className="fixed inset-0 z-100 cursor-grabbing"
                            onMouseMove={handleCardDragMove}
                            onTouchMove={handleCardDragMove}
                            onMouseUp={handleCardDragEnd}
                            onTouchEnd={handleCardDragEnd}
                        />
                    )}
                </div>
            ) : (
                // Results Screen
                <div className="fixed inset-0 z-50 bg-slate-50 flex flex-col font-sans animate-fade-in text-slate-800 quiz-end-screen">
                    {/* Header */}
                    <div className="shrink-0 py-4 px-6 md:px-8 bg-white shadow-sm flex flex-col md:flex-row items-center justify-between border-b border-slate-200 z-10 gap-4 md:gap-0 quiz-end-header">
                        <div className="text-center md:text-left">
                            <h2 className={`text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-linear-to-r ${
                                (() => {
                                    const targetGoal = levelData.id === 1 ? 13 : levelData.id === 2 ? 26 : 36;
                                    const hasPassed = globalCorrectIds.size >= targetGoal;
                                    return hasPassed ? 'from-emerald-500 to-teal-500' : 'from-indigo-600 to-purple-600';
                                })()
                            } quiz-end-title`}>
                                {(() => {
                                    const targetGoal = levelData.id === 1 ? 13 : levelData.id === 2 ? 26 : 36;
                                    if (globalCorrectIds.size >= targetGoal) return "Level Passed!";
                                    if (totalAnswered === 0) return "Time's Up!";
                                    return "Keep Going!";
                                })()}
                            </h2>
                            <p className="text-slate-600 font-medium text-sm md:text-base quiz-end-stats mt-2">
                                You sorted <span className="text-indigo-600 font-black text-lg">{totalCorrect}</span> correctly this round.<br />
                                Level Progress: <span className="text-indigo-600 font-black text-lg">
                                    {levelData.id === 1 ? Math.min(globalCorrectIds.size, 13) : levelData.id === 2 ? Math.min(Math.max(globalCorrectIds.size - 13, 0), 13) : Math.min(Math.max(globalCorrectIds.size - 26, 0), 10)}
                                </span> / {levelData.id === 3 ? 10 : 13}
                            </p>
                        </div>
                        <div className="flex gap-3 quiz-end-actions">
                            {(() => {
                                const targetGoal = levelData.id === 1 ? 13 : levelData.id === 2 ? 26 : 36;
                                return globalCorrectIds.size < targetGoal;
                            })() && (
                                <button
                                    onClick={restartQuiz}
                                    className="px-5 py-3 min-h-11 bg-white text-indigo-600 border-2 border-indigo-100 rounded-full font-bold uppercase tracking-widest hover:bg-indigo-50 transition-all active:scale-95 flex items-center gap-2 text-[10px] md:text-xs shadow-sm"
                                >
                                    <span className="text-base">↺</span> Restart
                                </button>
                            )}
                            <button
                                onClick={onExit}
                                className="px-6 py-3 min-h-11 bg-slate-900 text-white rounded-full font-bold uppercase tracking-widest hover:bg-slate-800 transition-all active:scale-95 flex items-center gap-2 text-[10px] md:text-xs shadow-md hover:shadow-lg"
                            >
                                Menu <span className="text-base">→</span>
                            </button>
                        </div>
                    </div>

                    {/* Main Content Containers */}
                    <div className="flex-1 overflow-y-auto md:overflow-hidden p-4 flex flex-col gap-4 w-full h-full max-w-7xl mx-auto quiz-end-content">

                        {/* Top half: Piles */}
                        <div className="flex-none md:flex-1 md:min-h-0 flex flex-col md:flex-row gap-4">
                            {/* Myth Column */}
                            <div className="flex-none md:flex-1 flex flex-col bg-white rounded-2xl border border-orange-200 shadow-sm overflow-hidden h-auto md:h-full">
                                <div className="shrink-0 p-3 bg-orange-50 border-b border-orange-100 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-white text-orange-600 flex items-center justify-center shadow-sm border border-orange-100">
                                            <img src="/stickman_assets/sad_stickman.svg" className="w-5 h-5" alt="Myth" />
                                        </div>
                                        <h3 className="font-black uppercase text-orange-600 tracking-widest text-xs md:text-sm">Myth Pile</h3>
                                    </div>
                                    {Math.ceil(quizCards.myth.length / itemsPerPage.piles) > 1 && (
                                        <div className="flex gap-1 md:gap-2 items-center">
                                            <button
                                                onClick={() => setMythPage(Math.max(0, mythPage - 1))}
                                                disabled={mythPage === 0}
                                                className="w-5 h-5 md:w-6 md:h-6 rounded bg-white border border-orange-200 flex items-center justify-center text-orange-500 disabled:opacity-50 hover:bg-orange-100 font-bold text-xs"
                                            >
                                                &lt;
                                            </button>
                                            <span className="text-[10px] font-bold text-orange-400">
                                                {mythPage + 1} / {Math.ceil(quizCards.myth.length / itemsPerPage.piles)}
                                            </span>
                                            <button
                                                onClick={() => setMythPage(Math.min(Math.ceil(quizCards.myth.length / itemsPerPage.piles) - 1, mythPage + 1))}
                                                disabled={mythPage === Math.ceil(quizCards.myth.length / itemsPerPage.piles) - 1}
                                                className="w-5 h-5 md:w-6 md:h-6 rounded bg-white border border-orange-200 flex items-center justify-center text-orange-500 disabled:opacity-50 hover:bg-orange-100 font-bold text-xs"
                                            >
                                                &gt;
                                            </button>
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1 overflow-hidden p-3 space-y-2">
                                    {quizCards.myth.length === 0 && <div className="h-full flex items-center justify-center text-slate-400 italic text-sm">No cards in this pile</div>}
                                    {quizCards.myth.slice(mythPage * itemsPerPage.piles, (mythPage + 1) * itemsPerPage.piles).map((c, i) => (
                                        <div key={i} className={`p-3 rounded-xl border-l-4 bg-slate-50 transition-all hover:bg-white hover:shadow-sm ${c.answer === 'Myth' ? 'border-teal-400 bg-teal-50/20' : 'border-red-400 bg-red-50/20'}`}>
                                            <div className="flex justify-between items-start gap-2">
                                                <span className="text-xs md:text-sm font-bold text-slate-700 leading-snug">{c.question}</span>
                                                {c.answer === 'Myth' ?
                                                    <span className="shrink-0 bg-teal-100 text-teal-700 text-[10px] font-black px-2 py-0.5 rounded flex items-center gap-1">OK <img src="/stickman_assets/happy_stickman.svg" className="w-3 h-3" alt="" /></span>
                                                    :
                                                    <span className="shrink-0 bg-red-100 text-red-700 text-[10px] font-black px-2 py-0.5 rounded flex items-center gap-1">NO <img src="/stickman_assets/sad_stickman.svg" className="w-3 h-3" alt="" /></span>
                                                }
                                            </div>
                                            <p className="text-[10px] text-slate-500 mt-2 pl-2 border-l border-slate-200 leading-relaxed">{c.explanation}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Fact Column */}
                            <div className="flex-none md:flex-1 flex flex-col bg-white rounded-2xl border border-teal-200 shadow-sm overflow-hidden h-auto md:h-full">
                                <div className="shrink-0 p-3 bg-teal-50 border-b border-teal-100 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-white text-teal-600 flex items-center justify-center shadow-sm border border-teal-100">
                                            <img src="/stickman_assets/happy_stickman.svg" className="w-5 h-5" alt="Fact" />
                                        </div>
                                        <h3 className="font-black uppercase text-teal-600 tracking-widest text-xs md:text-sm">Fact Pile</h3>
                                    </div>
                                    {Math.ceil(quizCards.fact.length / itemsPerPage.piles) > 1 && (
                                        <div className="flex gap-1 md:gap-2 items-center">
                                            <button
                                                onClick={() => setFactPage(Math.max(0, factPage - 1))}
                                                disabled={factPage === 0}
                                                className="w-5 h-5 md:w-6 md:h-6 rounded bg-white border border-teal-200 flex items-center justify-center text-teal-500 disabled:opacity-50 hover:bg-teal-100 font-bold text-xs"
                                            >
                                                &lt;
                                            </button>
                                            <span className="text-[10px] font-bold text-teal-400">
                                                {factPage + 1} / {Math.ceil(quizCards.fact.length / itemsPerPage.piles)}
                                            </span>
                                            <button
                                                onClick={() => setFactPage(Math.min(Math.ceil(quizCards.fact.length / itemsPerPage.piles) - 1, factPage + 1))}
                                                disabled={factPage === Math.ceil(quizCards.fact.length / itemsPerPage.piles) - 1}
                                                className="w-5 h-5 md:w-6 md:h-6 rounded bg-white border border-teal-200 flex items-center justify-center text-teal-500 disabled:opacity-50 hover:bg-teal-100 font-bold text-xs"
                                            >
                                                &gt;
                                            </button>
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1 overflow-hidden p-3 space-y-2">
                                    {quizCards.fact.length === 0 && <div className="h-full flex items-center justify-center text-slate-400 italic text-sm">No cards in this pile</div>}
                                    {quizCards.fact.slice(factPage * itemsPerPage.piles, (factPage + 1) * itemsPerPage.piles).map((c, i) => (
                                        <div key={i} className={`p-3 rounded-xl border-l-4 bg-slate-50 transition-all hover:bg-white hover:shadow-sm ${c.answer === 'Fact' ? 'border-teal-400 bg-teal-50/20' : 'border-red-400 bg-red-50/20'}`}>
                                            <div className="flex justify-between items-start gap-2">
                                                <span className="text-xs md:text-sm font-bold text-slate-700 leading-snug">{c.question}</span>
                                                {c.answer === 'Fact' ?
                                                    <span className="shrink-0 bg-teal-100 text-teal-700 text-[10px] font-black px-2 py-0.5 rounded flex items-center gap-1">OK <img src="/stickman_assets/happy_stickman.svg" className="w-3 h-3" alt="" /></span>
                                                    :
                                                    <span className="shrink-0 bg-red-100 text-red-700 text-[10px] font-black px-2 py-0.5 rounded flex items-center gap-1">NO <img src="/stickman_assets/sad_stickman.svg" className="w-3 h-3" alt="" /></span>
                                                }
                                            </div>
                                            <p className="text-[10px] text-slate-500 mt-2 pl-2 border-l border-slate-200 leading-relaxed">{c.explanation}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Missed Questions */}
                        {quizCards.deck.length > 0 && (
                            <div className="shrink-0 bg-slate-100 rounded-xl p-4 border border-slate-200 flex flex-col">
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="font-black uppercase text-slate-400 text-[10px] tracking-widest">
                                        Missed Questions ({quizCards.deck.length})
                                    </h3>

                                    {Math.ceil(quizCards.deck.length / itemsPerPage.missed) > 1 && (
                                        <div className="flex gap-2 items-center">
                                            <button
                                                onClick={() => setMissedPage(Math.max(0, missedPage - 1))}
                                                disabled={missedPage === 0}
                                                className="w-6 h-6 rounded bg-white border border-slate-200 flex items-center justify-center text-slate-500 disabled:opacity-50 hover:bg-slate-50 font-bold"
                                            >
                                                &lt;
                                            </button>
                                            <span className="text-[10px] font-bold text-slate-400">
                                                {missedPage + 1} / {Math.ceil(quizCards.deck.length / itemsPerPage.missed)}
                                            </span>
                                            <button
                                                onClick={() => setMissedPage(Math.min(Math.ceil(quizCards.deck.length / itemsPerPage.missed) - 1, missedPage + 1))}
                                                disabled={missedPage === Math.ceil(quizCards.deck.length / itemsPerPage.missed) - 1}
                                                className="w-6 h-6 rounded bg-white border border-slate-200 flex items-center justify-center text-slate-500 disabled:opacity-50 hover:bg-slate-50 font-bold"
                                            >
                                                &gt;
                                            </button>
                                        </div>
                                    )}
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                                    {quizCards.deck.slice(missedPage * itemsPerPage.missed, (missedPage + 1) * itemsPerPage.missed).map((c, i) => (
                                        <div key={i} className="bg-white p-2 rounded border border-slate-200 text-[10px] text-slate-500 truncate flex justify-between items-center transition-all hover:border-indigo-300">
                                            <span className="truncate mr-2 flex-1" title={c.question}>{c.question}</span>
                                            <span className={`shrink-0 font-bold px-2 py-0.5 rounded text-[8px] uppercase tracking-wider ${c.answer === 'Fact' ? 'bg-teal-100 text-teal-700' : 'bg-orange-100 text-orange-700'}`}>{c.answer}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Pause Overlay */}
            {isPausedInternal && (
                <div className="absolute inset-0 z-100 bg-slate-900/60 backdrop-blur-md flex flex-col items-center justify-center p-6 animate-fade-in">
                    <div className="bg-white rounded-[3rem] p-8 md:p-12 max-w-sm w-full text-center shadow-2xl transform animate-scale-up">
                        <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-10 h-10 text-indigo-600 ml-1" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M8 5v14l11-7z" />
                            </svg>
                        </div>
                        <h2 className="text-3xl font-black text-slate-800 uppercase tracking-tight mb-2">Game Paused</h2>
                        <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mb-8">Take a breath, then jump back in!</p>

                        <button
                            onClick={() => setIsPausedInternal(false)}
                            className="w-full py-5 bg-indigo-600 text-white font-black uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-indigo-600/30 hover:bg-indigo-500 transition-all hover:-translate-y-1 active:scale-95"
                        >
                            Resume Game
                        </button>

                        <button
                            onClick={onExit}
                            className="mt-4 w-full py-4 text-slate-400 font-black uppercase tracking-widest text-[10px] hover:text-slate-600 transition-colors"
                        >
                            Quit Session
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default QuizGameScreen;
