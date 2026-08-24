import React from 'react';

const SuccessScreen = ({ score, totalQuestions, onRestart, onExit }) => {
    const percentage = Math.round((score / totalQuestions) * 100) || 0;

    return (
        <div className="min-h-screen w-full bg-slate-900 flex flex-col items-center justify-center font-sans p-6 relative overflow-hidden">
            {/* Celebration Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[20%] left-[20%] w-[50%] h-[50%] bg-teal-500/20 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-[20%] right-[20%] w-[50%] h-[50%] bg-emerald-500/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
            </div>

            <div className="relative z-10 max-w-lg w-full bg-white rounded-[3rem] p-10 text-center shadow-[0_30px_100px_rgba(0,0,0,0.5)] animate-pop-in">
                {/* Trophy/Success Icon */}
                <div className="mb-8 relative inline-block">
                    <div className="absolute inset-0 bg-teal-400/20 rounded-full blur-2xl animate-pulse" />
                    <div className="w-24 h-24 bg-teal-50 rounded-full flex items-center justify-center border-4 border-white shadow-xl relative z-10">
                        <img src="/stickman_assets/happy_stickman.svg" className="w-16 h-16" alt="Success" />
                    </div>
                </div>

                <h2 className="text-4xl font-black text-slate-800 uppercase tracking-tight mb-2">Excellent Work!</h2>
                <p className="text-teal-600 font-bold uppercase tracking-widest text-xs mb-8">You've Mastered the Facts</p>

                <div className="bg-slate-50 rounded-3xl p-8 mb-10 border border-slate-100">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="text-left">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Score</span>
                            <span className="text-3xl font-black text-slate-800">{score} / {totalQuestions}</span>
                        </div>
                        <div className="text-right">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Accuracy</span>
                            <span className="text-3xl font-black text-teal-500">{percentage}%</span>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-4">
                    <button
                        onClick={onRestart}
                        className="w-full py-5 bg-teal-500 text-white font-black uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-teal-500/30 hover:bg-teal-400 transition-all hover:-translate-y-1 active:scale-95"
                    >
                        Try Again
                    </button>
                    <button
                        onClick={onExit}
                        className="w-full py-4 text-slate-400 font-black uppercase tracking-widest text-xs hover:text-slate-600 transition-colors"
                    >
                        Return to Menu
                    </button>
                </div>
            </div>

            {/* Fact Tip Footer */}
            <div className="mt-12 max-w-md text-center opacity-60">
                <p className="text-slate-400 text-sm leading-relaxed">
                    Knowing the facts is the first step in being a bridge to help. Share what you've learned!
                </p>
            </div>
        </div>
    );
};

export default SuccessScreen;
