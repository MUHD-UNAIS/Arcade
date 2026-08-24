import React from 'react';

const FailureScreen = ({ score, totalQuestions, onRestart, onExit }) => {
    return (
        <div className="min-h-screen w-full bg-slate-900 flex flex-col items-center justify-center font-sans p-6 relative overflow-hidden">
            {/* Dark/Moody Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[30%] left-[30%] w-[40%] h-[40%] bg-indigo-900/40 rounded-full blur-[120px]" />
                <div className="absolute bottom-[30%] right-[30%] w-[40%] h-[40%] bg-slate-800/40 rounded-full blur-[120px]" />
            </div>

            <div className="relative z-10 max-w-lg w-full bg-white rounded-[3rem] p-10 text-center shadow-2xl animate-shake">
                {/* Failure Icon */}
                <div className="mb-8 relative inline-block">
                    <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center border-4 border-white shadow-lg relative z-10">
                        <img src="/stickman_assets/guy_distressed.svg" className="w-16 h-16" alt="Time's Up" />
                    </div>
                </div>

                <h2 className="text-4xl font-black text-slate-800 uppercase tracking-tight mb-2">Time's Up!</h2>
                <p className="text-slate-400 font-bold uppercase tracking-widest text-xs mb-8">Let's Refresh the Knowledge</p>

                <div className="bg-slate-50 rounded-3xl p-8 mb-10 border border-slate-100">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Final Score</span>
                    <span className="text-4xl font-black text-slate-800">{score}</span>
                    <p className="text-slate-400 text-xs mt-2 italic">You sorted {score} statements correctly.</p>
                </div>

                <div className="flex flex-col gap-4">
                    <button
                        onClick={onRestart}
                        className="w-full py-5 bg-indigo-600 text-white font-black uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-indigo-600/30 hover:bg-indigo-500 transition-all hover:-translate-y-1 active:scale-95"
                    >
                        Try Once More
                    </button>
                    <button
                        onClick={onExit}
                        className="w-full py-4 text-slate-400 font-black uppercase tracking-widest text-xs hover:text-slate-600 transition-colors"
                    >
                        Back to Menu
                    </button>
                </div>
            </div>

            {/* Motivational Footer */}
            <div className="mt-12 max-w-sm text-center opacity-60">
                <p className="text-slate-400 text-sm leading-relaxed">
                    It's okay to make mistakes. The goal is to learn the truth so you can help others effectively.
                </p>
            </div>
        </div>
    );
};

export default FailureScreen;
