import React from 'react';
import { QUIZ_LEVELS } from '../data/quizData';
import { toggleFullscreen } from '../utils/fullscreen';

const LevelSelectScreen = ({ onSelectLevel, onBack, globalCorrectIds = new Set(), onResetGame }) => {
    return (
        <div className="game-container min-h-screen w-full flex flex-col items-center justify-center font-sans p-4 md:p-6 relative overflow-hidden bg-slate-900">
             {/* Table Surface Texture Overlay */}
             <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMSIgZmlsbD0id2hpdGUiIGZpbGwtb3BhY2l0eT0iMC4xIi8+PC9zdmc+')]"></div>

            <div className="relative z-10 max-w-4xl w-full bg-[#3d2b1f] border-b-4 md:border-b-8 border-r-4 md:border-r-8 border-[#2a1d15] rounded-4xl md:rounded-[3rem] p-6 md:p-12 shadow-[inset_0_10px_20px_rgba(0,0,0,0.5),0_30px_60px_rgba(0,0,0,0.4)] animate-scale-in">
                
                <div className="absolute top-6 left-6 md:top-8 md:left-8">
                    <button 
                        onClick={onBack}
                        className="w-10 h-10 md:w-12 md:h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-all transform hover:scale-110 shadow-lg border border-white/10"
                    >
                        <span className="text-xl md:text-2xl font-bold leading-none -mt-1">←</span>
                    </button>
                </div>

                <div className="absolute top-6 right-6 md:top-8 md:right-8">
                    <button 
                        onClick={toggleFullscreen}
                        className="w-10 h-10 md:w-12 md:h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-all transform hover:scale-110 shadow-lg border border-white/10"
                        title="Toggle Fullscreen"
                    >
                        <svg className="w-5 h-5 md:w-6 md:h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z"/>
                        </svg>
                    </button>
                </div>

                <div className="text-center mb-8 md:mb-12 mt-4 md:mt-0">
                    <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tight mb-2 drop-shadow-md">Select Level</h2>
                    <p className="text-teal-400 font-bold uppercase tracking-widest text-[10px] md:text-xs">Choose Your Challenge</p>
                </div>

                <div className="flex flex-col gap-4 md:gap-6 max-w-2xl mx-auto">
                    {QUIZ_LEVELS.map((level, index) => (
                        <button
                            key={level.id}
                            onClick={() => onSelectLevel(level)}
                            className="group flex flex-col md:flex-row items-center text-left p-4 md:p-6 bg-black/30 rounded-2xl md:rounded-3xl border-2 border-white/10 hover:border-teal-400 hover:bg-black/40 transition-all transform hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(20,184,166,0.3)] gap-4 md:gap-6"
                        >
                            <div className="w-16 h-16 md:w-20 md:h-20 bg-linear-to-br from-teal-400 to-emerald-600 rounded-xl md:rounded-2xl flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform shrink-0 border-2 border-white/20">
                                <span className="text-3xl md:text-4xl font-black text-white drop-shadow-md">{level.id}</span>
                            </div>
                            <div className="flex-1 text-center md:text-left">
                                <h3 className="text-white font-black uppercase text-lg md:text-xl mb-1 md:mb-2">{level.title}</h3>
                                <p className="text-teal-100/70 text-xs md:text-sm font-medium leading-relaxed">
                                    {level.description}
                                </p>
                            </div>
                            <div className="hidden md:flex items-center justify-center w-10 h-10 rounded-full bg-white/10 group-hover:bg-teal-500 transition-colors">
                                <span className="text-white text-xl font-bold">→</span>
                            </div>
                        </button>
                    ))}
                </div>

                {globalCorrectIds.size > 0 && (
                    <div className="mt-8 md:mt-12 text-center">
                        <button
                            onClick={() => {
                                if (window.confirm("Are you sure you want to reset all your progress?")) {
                                    if (onResetGame) onResetGame();
                                }
                            }}
                            className="text-white/50 hover:text-red-400 text-[10px] md:text-xs font-bold uppercase tracking-widest transition-colors underline decoration-white/20 hover:decoration-red-400/50 underline-offset-4"
                        >
                            Reset Game Progress
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LevelSelectScreen;
