import React from 'react';

const GameScreen = ({ 
    currentQuestion, 
    score, 
    timeLeft, 
    onSwipe, 
    streak, 
    comboVisible 
}) => {
    return (
        <div className="min-h-screen w-full bg-slate-900 flex flex-col relative overflow-hidden font-sans">
            {/* Header HUD */}
            <div className="relative z-20 px-6 py-4 flex justify-between items-center bg-white/5 backdrop-blur-md border-b border-white/10">
                <div className="flex flex-col">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Live Training</span>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                        <span className="text-xl font-black text-white">Myth vs Fact</span>
                    </div>
                </div>

                <div className="flex gap-6 items-center">
                    {/* Timer */}
                    <div className={`flex flex-col items-end ${timeLeft < 10 ? 'animate-pulse' : ''}`}>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Time Remaining</span>
                        <span className={`text-2xl font-mono font-black ${timeLeft < 10 ? 'text-red-500' : 'text-white'}`}>
                            {timeLeft}s
                        </span>
                    </div>

                    {/* Score */}
                    <div className="flex flex-col items-end">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Current Score</span>
                        <span className="text-2xl font-black text-teal-400">{score}</span>
                    </div>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-1.5 bg-white/5 overflow-hidden">
                <div 
                    className={`h-full transition-all duration-300 ${timeLeft < 10 ? 'bg-red-500' : 'bg-teal-500'}`}
                    style={{ width: `${(timeLeft / 60) * 100}%` }}
                />
            </div>

            {/* Main Gameplay Area */}
            <div className="flex-1 flex flex-col items-center justify-center p-6 relative">
                {/* Background Decor */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5">
                    <img src="/stickman_assets/thinking_stickman.svg" className="w-125 h-125" alt="" />
                </div>

                {/* Combo Badge */}
                {streak >= 2 && (
                    <div className="absolute top-10 left-1/2 -translate-x-1/2 z-30 animate-bounce-subtle">
                        <div className="bg-orange-500 text-white px-6 py-2 rounded-full font-black text-sm uppercase tracking-widest shadow-2xl shadow-orange-500/50">
                            {streak}x Combo! 🔥
                        </div>
                    </div>
                )}

                {/* The Card Container */}
                <div className="relative w-full max-w-sm aspect-3/4 perspective-1000">
                    {/* Placeholder for Swipeable Card logic */}
                    <div className="w-full h-full bg-white rounded-[2.5rem] shadow-2xl p-8 flex flex-col items-center justify-center text-center relative overflow-hidden border-4 border-slate-100">
                         {/* Card Watermark */}
                         <div className="absolute top-6 left-6 opacity-5">
                             <img src="/logo.svg" className="w-12 h-12" alt="" />
                         </div>

                         <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mb-8">
                             <img src="/stickman_assets/pointing_stickman.svg" className="w-12 h-12" alt="" />
                         </div>

                         <h3 className="text-2xl md:text-3xl font-black text-slate-800 leading-tight mb-6">
                            {currentQuestion?.text || "Prepare for the next statement..."}
                         </h3>

                         <div className="mt-auto pt-8 border-t border-slate-100 w-full flex justify-between px-4">
                             <div className="flex flex-col items-center">
                                 <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Swipe Left</span>
                                 <div className="px-4 py-1 bg-red-100 text-red-600 rounded-full text-[10px] font-bold">MYTH</div>
                             </div>
                             <div className="flex flex-col items-center">
                                 <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Swipe Right</span>
                                 <div className="px-4 py-1 bg-teal-100 text-teal-600 rounded-full text-[10px] font-bold">FACT</div>
                             </div>
                         </div>
                    </div>
                </div>
            </div>

            {/* Mobile Swipe Instructions Footer */}
            <div className="p-6 bg-white/5 backdrop-blur-md border-t border-white/10 flex justify-center items-center">
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-4">
                    <span className="animate-pulse">← Swipe Left for Myth</span>
                    <span className="w-1 h-1 bg-slate-600 rounded-full" />
                    <span className="animate-pulse">Swipe Right for Fact →</span>
                </p>
            </div>
        </div>
    );
};

export default GameScreen;
