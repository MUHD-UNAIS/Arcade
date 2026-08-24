import React, { useState, useEffect } from 'react';
import WordsOfHopeScreen from './WordsOfHopeScreen';
import PlayerRegistrationScreen from './PlayerRegistrationScreen';
import GameBackground from './GameBackground';
import { audioManager } from './audio';
import { supabase } from '../../lib/supabase';
import './App.css';
import './index.css';

const SplashContent = () => (
    <div className="relative z-10 flex flex-col items-center justify-center h-full animate-fade-in text-center px-6">
        <div className="w-44 h-44 bg-white/5 backdrop-blur-3xl rounded-[3rem] mb-12 flex items-center justify-center border border-white/20 shadow-2xl -rotate-6 transform hover:rotate-0 transition-transform duration-700">
            <img src="/stickman_assets/logo.svg" alt="Stickman" className="w-24 h-24 animate-pulse" />
        </div>
        <div className="flex flex-col items-center">
            <h2 className="text-4xl md:text-8xl font-black text-white leading-tight uppercase tracking-tighter drop-shadow-2xl">
                Words <span className="text-white/60">of</span>
            </h2>
            <h2 className="text-6xl md:text-9xl font-black text-teal-400 leading-[0.8] uppercase tracking-tighter drop-shadow-2xl mb-4">
                Wisdom.
            </h2>
        </div>
        <div className="h-1.5 w-64 bg-white/10 rounded-full mt-8 overflow-hidden border border-white/5 mx-auto">
            <div className="h-full bg-teal-400 animate-splash-loader origin-left" style={{ animationDuration: '2500ms' }} />
        </div>
        <p className="text-white/20 font-black uppercase tracking-[0.5em] text-[10px] mt-12 animate-pulse">A Journey of Mind Empowered</p>
    </div>
);

export default function App() {
    const [screen, setScreen] = useState('SPLASH');
    const [playerData, setPlayerData] = useState(() => {
        try {
            const saved = localStorage.getItem('words_of_wisdom_profile');
            return saved ? JSON.parse(saved) : null;
        } catch {
            return null;
        }
    });
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    // Initial splash timer
    useEffect(() => {
        if (screen === 'SPLASH') {
            const timer = setTimeout(() => {
                setScreen('GAME');
            }, 2500);
            return () => clearTimeout(timer);
        }
    }, [screen]);

    // Initialize audio
    useEffect(() => {
        const initAudio = () => {
            audioManager.init();
            document.removeEventListener('click', initAudio);
            document.removeEventListener('touchstart', initAudio);
        };
        document.addEventListener('click', initAudio);
        document.addEventListener('touchstart', initAudio);
    }, []);

    // Load auth user metadata if no local profile saved
    useEffect(() => {
        if (!playerData) {
            supabase.auth.getUser().then(({ data: { user } }) => {
                if (user) {
                    const fallback = {
                        name: user.user_metadata?.display_name || user.email?.split('@')[0] || 'Zen Explorer',
                        email: user.email || '',
                        gender: 'guy',
                        college: 'Mind Empowered Academy',
                        state: 'Karnataka',
                        field_of_study: 'Mindfulness & Wellbeing'
                    };
                    setPlayerData(fallback);
                } else {
                    const guest = {
                        name: 'Zen Explorer',
                        email: '',
                        gender: 'guy',
                        college: 'Mind Empowered Academy',
                        state: 'Kerala',
                        field_of_study: 'Mindfulness'
                    };
                    setPlayerData(guest);
                }
            }).catch(() => {
                const guest = {
                    name: 'Zen Explorer',
                    email: '',
                    gender: 'guy',
                    college: 'Mind Empowered Academy',
                    state: 'Kerala',
                    field_of_study: 'Mindfulness'
                };
                setPlayerData(guest);
            });
        }
    }, []);

    const handleSaveProfile = (newProfile) => {
        setPlayerData(newProfile);
        try {
            localStorage.setItem('words_of_wisdom_profile', JSON.stringify(newProfile));
        } catch (e) {
            console.error('Error saving profile:', e);
        }
        setIsProfileOpen(false);
    };

    const handleExit = () => {
        // Send message to parent Arcade container if embedded
        try {
            window.parent.postMessage({ type: 'EXIT_TO_ARCADE' }, '*');
        } catch (e) {
            console.warn('Could not postMessage to parent', e);
        }

        // Also if running standalone, reset to splash
        if (confirm("Return to Arcade / Reset Mission?")) {
            setScreen('SPLASH');
        }
    };

    return (
        <div className="words-of-wisdom-app">
            {screen === 'SPLASH' && (
                <div className="fixed inset-0 z-1000 flex items-center justify-center">
                    <GameBackground harmony={50} />
                    <SplashContent />
                </div>
            )}

            {screen === 'GAME' && (
                <WordsOfHopeScreen 
                    audioManager={audioManager} 
                    onExit={handleExit} 
                    isPaused={false} 
                    playerGender={playerData?.gender || "guy"} 
                    playerData={playerData}
                    onOpenProfile={() => setIsProfileOpen(true)}
                    initialState="LEVEL_SELECT"
                />
            )}

            {isProfileOpen && (
                <PlayerRegistrationScreen
                    initialData={playerData}
                    onComplete={handleSaveProfile}
                    onCancel={() => setIsProfileOpen(false)}
                />
            )}
        </div>
    );
}



