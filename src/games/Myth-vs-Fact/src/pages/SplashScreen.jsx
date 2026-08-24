import React from 'react';
import { requestFullscreen } from '../utils/fullscreen';

const SplashScreen = ({ onStart }) => {
    const handleStartClick = () => {
        // Must be called directly within the synchronous user event handler 
        // to comply with modern browser security policies for fullscreen requests.
        requestFullscreen();
        onStart();
    };

    return (
        <div className="game-container min-h-screen w-full flex flex-col items-center justify-center font-sans relative overflow-hidden">
            {/* Table Surface Texture Overlay */}
            <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMSIgZmlsbD0id2hpdGUiIGZpbGwtb3BhY2l0eT0iMC4xIi8+PC9zdmc+')]"></div>

            <div className="relative z-10 text-center px-6 max-w-2xl animate-fade-in">
                {/* Logo Card Container */}
                <div className="mb-8 md:mb-12 relative inline-block">
                    <div className="absolute inset-0 bg-white/20 rounded-3xl blur-2xl animate-pulse" />
                    <div className="w-24 h-32 md:w-32 md:h-44 bg-white rounded-2xl border-4 md:border-8 border-white shadow-[0_20px_50px_rgba(0,0,0,0.4)] flex flex-col items-center justify-center rotate-3 hover:rotate-0 transition-transform duration-500">
                        <img src="/stickman_assets/thinking_stickman.svg" alt="Logo" className="w-12 h-12 md:w-20 md:h-20 mb-2" />
                        <div className="h-1 w-8 md:h-1.5 md:w-12 bg-slate-100 rounded-full mb-1" />
                        <div className="h-1 w-6 md:h-1.5 md:w-8 bg-slate-50 rounded-full" />
                    </div>
                </div>

                <h1 className="text-5xl md:text-8xl font-black text-white uppercase tracking-tighter mb-4 drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)] leading-none">
                    Myth or <span className="text-transparent bg-clip-text bg-linear-to-r from-teal-300 to-emerald-400">Fact?</span>
                </h1>

                <div className="h-1 w-16 md:w-24 bg-linear-to-r from-teal-500 to-indigo-500 mx-auto mb-6 md:mb-8 rounded-full shadow-[0_0_20px_rgba(20,184,166,0.6)]" />

                <p className="text-teal-50 text-base md:text-xl mb-8 md:mb-12 max-w-md mx-auto leading-relaxed font-bold opacity-90 drop-shadow-md px-4">
                    Master the truth about mental health in this premium tabletop card sorting experience.
                </p>

                <button
                    onClick={handleStartClick}
                    className="group relative px-8 py-4 md:px-12 md:py-5 bg-[#3d2b1f] text-white font-black uppercase tracking-[0.2em] rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.4)] border-b-8 border-[#2a1d15] hover:border-b-4 hover:translate-y-1 transition-all active:scale-95 overflow-hidden text-sm md:text-base"
                >
                    <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <span className="relative flex items-center gap-3">
                        Enter Training
                        <span className="text-xl group-hover:translate-x-2 transition-transform">→</span>
                    </span>
                </button>

                {/* Footer Info */}
                <div className="mt-16 flex items-center justify-center gap-8 opacity-60">
                    <div className="flex flex-col items-center">
                        <span className="text-[10px] font-black uppercase tracking-widest text-white">Edition</span>
                        <span className="text-xs font-bold text-teal-400">Standard 1.0</span>
                    </div>
                    <div className="w-px h-8 bg-white/20" />
                    <div className="flex flex-col items-center">
                        <span className="text-[10px] font-black uppercase tracking-widest text-white">Method</span>
                        <span className="text-xs font-bold text-teal-400">QPR Certified</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SplashScreen;
