import React, { useState } from 'react';
import { Search, Sparkles, Play, Rocket } from 'lucide-react';
import { sounds } from '../SoundEffects';

export function Screen2_ArcadeCollection({ onSelectGame }) {
  const [searchQuery, setSearchQuery] = useState('');

  const games = [
    {
      id: 'words_of_wisdom',
      title: 'Words of Wisdom',
      category: 'Mindful Puzzles',
      tag: 'CALMING',
      badgeColor: 'bg-zen-pinkAccent text-zen-plum',
      description: 'A calming puzzle & quote builder to inspire mindfulness.',
      bgGradient: 'from-[#FFF3F5] to-[#FCEBEF]',
      borderColor: 'border-zen-pinkAccent',
      imageSvg: (
        <svg className="w-full h-32 object-contain" viewBox="0 0 200 120" fill="none">
          <rect width="200" height="120" rx="16" fill="#FCEBEF" />
          <ellipse cx="100" cy="80" rx="40" ry="25" fill="#FFFFFF" />
          <ellipse cx="80" cy="70" rx="20" ry="20" fill="#FFFFFF" />
          <ellipse cx="120" cy="70" rx="20" ry="20" fill="#FFFFFF" />
          <path d="M94 65C95 67 97 67 98 65" stroke="#4A353B" strokeWidth="2" strokeLinecap="round" />
          <path d="M102 65C103 67 105 67 106 65" stroke="#4A353B" strokeWidth="2" strokeLinecap="round" />
          <path d="M85 75L100 80L115 75V88L100 92L85 88V75Z" fill="#F7C5D1" stroke="#A86B79" strokeWidth="1.5" />
          <path d="M100 80V92" stroke="#A86B79" strokeWidth="1.5" />
          <polygon points="100,20 103,28 111,31 103,34 100,42 97,34 89,31 97,28" fill="#EADF9E" />
          <circle cx="50" cy="30" r="3" fill="#A86B79" />
          <circle cx="155" cy="40" r="4" fill="#7A8450" />
        </svg>
      )
    },
    {
      id: 'stick_man',
      title: 'Stick Man to the Rescue',
      category: 'Physics & Play',
      tag: 'LIGHTHEARTED',
      badgeColor: 'bg-zen-creamBg text-zen-plum',
      description: 'A lighthearted physics puzzle to guide your stick figure home.',
      bgGradient: 'from-[#FAF7F2] to-[#E8E3C5]/40',
      borderColor: 'border-zen-creamBg',
      imageSvg: (
        <svg className="w-full h-32 object-contain" viewBox="0 0 200 120" fill="none">
          <rect width="200" height="120" rx="16" fill="#FAF7F2" />
          <path d="M30 90 Q 100 80 170 90 L 160 105 H 40 Z" fill="#7A8450" opacity="0.8" />
          <circle cx="100" cy="40" r="10" stroke="#4A353B" strokeWidth="3" fill="#FFF" />
          <path d="M100 50 V 70 M100 58 L 85 65 M100 58 L 115 50 M100 70 L 90 85 M100 70 L 110 85" stroke="#4A353B" strokeWidth="3" strokeLinecap="round" />
          <polygon points="150,35 153,42 160,43 155,48 156,55 150,51 144,55 145,48 140,43 147,42" fill="#EADF9E" stroke="#7A8450" strokeWidth="1" />
        </svg>
      )
    },
    {
      id: 'little_big_feelings',
      title: 'Little Big Feelings',
      category: 'Mood & Feelings',
      tag: 'EMOTIONAL',
      badgeColor: 'bg-zen-oliveBg text-zen-olive',
      description: 'Explore and process your emotions with interactive blob friends.',
      bgGradient: 'from-[#EFF2E1] to-[#E3E8CE]',
      borderColor: 'border-zen-olive/40',
      imageSvg: (
        <svg className="w-full h-32 object-contain" viewBox="0 0 200 120" fill="none">
          <rect width="200" height="120" rx="16" fill="#EFF2E1" />
          <ellipse cx="60" cy="70" rx="18" ry="22" fill="#F7C5D1" />
          <circle cx="55" cy="65" r="2.5" fill="#4A353B" />
          <circle cx="65" cy="65" r="2.5" fill="#4A353B" />

          <ellipse cx="100" cy="65" rx="24" ry="28" fill="#EADF9E" />
          <circle cx="93" cy="60" r="3" fill="#4A353B" />
          <circle cx="107" cy="60" r="3" fill="#4A353B" />
          <path d="M96 68 Q 100 73 104 68" stroke="#4A353B" strokeWidth="2" strokeLinecap="round" />

          <ellipse cx="140" cy="72" rx="16" ry="20" fill="#76C4C6" />
          <circle cx="135" cy="68" r="2" fill="#4A353B" />
          <circle cx="145" cy="68" r="2" fill="#4A353B" />
        </svg>
      )
    },
    {
      id: 'mindscape_defense',
      title: 'Mindscape Defense',
      category: 'Relaxed Strategy',
      tag: 'PROTECT PEACE',
      badgeColor: 'bg-zen-pinkHeader text-zen-plum',
      description: 'Protect your inner peace in a relaxed strategy experience.',
      bgGradient: 'from-[#FAF2F4] to-[#FCEBEF]',
      borderColor: 'border-zen-mauve/30',
      imageSvg: (
        <svg className="w-full h-32 object-contain" viewBox="0 0 200 120" fill="none">
          <rect width="200" height="120" rx="16" fill="#FAF2F4" />
          <polygon points="100,25 125,55 75,55" fill="#A86B79" />
          <rect x="85" y="55" width="30" height="35" fill="#FCEBEF" stroke="#A86B79" strokeWidth="2" />
          <circle cx="100" cy="70" r="6" fill="#EADF9E" />
          <circle cx="100" cy="60" r="45" stroke="#F7C5D1" strokeWidth="2" strokeDasharray="4 4" />
        </svg>
      )
    },
    {
      id: 'feeling_fusion',
      title: 'Feeling Fusion',
      category: 'Mood & Feelings',
      tag: 'DISCOVER',
      badgeColor: 'bg-zen-yellow text-zen-plum',
      description: 'Blend emotions together and discover what your feelings are trying to say.',
      bgGradient: 'from-[#FFF7D6] to-[#FDECC8]',
      borderColor: 'border-zen-yellow',
      imageSvg: (
        <div className="flex h-32 items-center justify-center bg-[#FFF7D6] text-5xl">✨💛✨</div>
      )
    },
    {
      id: 'myth_vs_fact',
      title: 'Myth vs Fact',
      category: 'Mindful Puzzles',
      tag: 'LEARN',
      badgeColor: 'bg-zen-tealBg text-zen-teal',
      description: 'Sort mental-health statements into myths and facts through a calm card challenge.',
      bgGradient: 'from-[#E8F7F5] to-[#D9EEEC]',
      borderColor: 'border-zen-teal/40',
      imageSvg: (
        <div className="flex h-32 items-center justify-center gap-3 bg-[#E8F7F5] text-4xl">🧠⚖️</div>
      )
    },
    {
      id: 'signal_scout',
      title: 'Signal Scout',
      category: 'Pathway Flow',
      tag: 'NOTICE',
      badgeColor: 'bg-zen-pinkAccent text-zen-plum',
      description: 'Learn to notice signals of distress and choose compassionate ways to respond.',
      bgGradient: 'from-[#F3F0FF] to-[#E7E0FA]',
      borderColor: 'border-indigo-200',
      imageSvg: (
        <div className="flex h-32 items-center justify-center bg-[#F3F0FF] text-5xl">📡💬</div>
      )
    }
  ];

  const visibleGames = games.filter(game =>
    game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    game.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-[calc(100vh-4rem)] p-4 sm:p-6 lg:p-10 max-w-7xl mx-auto">

      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zen-pinkAccent/40 text-zen-plum text-xs font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Cozy Game Suite</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-zen-plum font-display">
            Arcade Collection
          </h2>
          <p className="text-sm text-zen-mauve mt-1">
            Choose a game to enter its dedicated hub. You can exit back to the arcade at any time.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-zen-mauve absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search cozy games..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white/80 border border-zen-pinkAccent/50 rounded-full text-xs font-medium text-zen-plum placeholder-zen-mauve/60 focus:outline-none focus:border-zen-plum shadow-sm"
          />
        </div>
      </div>

      {/* Game Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {visibleGames.map((game) => (
          <div
            key={game.id}
            onClick={() => {
              sounds.playLaunch();
              onSelectGame(game.id);
            }}
            className={`bg-gradient-to-b ${game.bgGradient} rounded-3xl p-5 border ${game.borderColor} shadow-zen hover:shadow-zen-lg transition-all duration-300 flex flex-col justify-between group cursor-pointer hover:-translate-y-1`}
          >
            <div>
              {/* Card Illustration */}
              <div className="relative rounded-2xl overflow-hidden mb-4 shadow-sm group-hover:scale-102 transition-transform duration-300">
                {game.imageSvg}
                <span className={`absolute top-3 left-3 text-[10px] font-extrabold tracking-wider uppercase px-2.5 py-1 rounded-full shadow-sm ${game.badgeColor}`}>
                  {game.tag}
                </span>
              </div>

              {/* Title & Category */}
              <h3 className="text-xl font-extrabold text-zen-plum font-display group-hover:text-zen-mauve transition-colors">
                {game.title}
              </h3>
              <p className="text-xs font-semibold text-zen-mauve mt-0.5 mb-2">
                {game.category}
              </p>

              {/* Description */}
              <p className="text-xs text-zen-plum/80 leading-relaxed mb-6">
                {game.description}
              </p>
            </div>

            {/* Action Button: Enter Game */}
            <div className="pt-2 border-t border-black/5">
              <button
                type="button"
                className="w-full py-3 px-4 rounded-xl bg-zen-plum hover:bg-zen-plumHover text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 group-hover:scale-102"
              >
                <Play className="w-3.5 h-3.5 fill-current text-zen-pinkAccent" />
                <span>Enter {game.title}</span>
              </button>
            </div>

          </div>
        ))}
      </div>

      {/* Footer Banner */}
      <div className="mt-12 p-6 rounded-3xl bg-zen-yellow/50 border border-zen-yellow flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-zen-plum text-white flex items-center justify-center font-display font-bold">
            LZ
          </div>
          <div>
            <h4 className="font-extrabold text-zen-plum font-display">Lumina Zen Arcade</h4>

          </div>
        </div>
      </div>

    </div>
  );
}
