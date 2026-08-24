# 🎮 Lumina Zen Arcade

A cozy, immersive mental well-being and mindfulness game suite crafted to promote emotional intelligence, resilience, empathy, and mental health education through interactive gameplay.

---

## 🌟 Overview

**Lumina Zen Arcade** brings together a curated collection of standalone mindful mini-games and educational experiences into a unified, beautifully styled web hub. Each game addresses key aspects of mental wellness—from recognizing distress signals and emotional regulation to dismantling mental health stigma and finding inner calm.

---

## 🕹️ The Game Suite

### 1. 📖 Words of Wisdom
- **Category:** Mindful Puzzles & Quotes
- **Tagline:** Calming puzzle & quote builder to inspire mindfulness.
- **Description:** An empowering word puzzle where players unscramble affirming quotes, discover supportive terminology, and reinforce positive thinking patterns.

### 2. 🏃 Stick Man to the Rescue
- **Category:** Physics & Play
- **Tagline:** A lighthearted physics puzzle to guide your stick figure home.
- **Description:** An interactive physics-based journey navigating real-world stressors, obstacles, and coping decisions with empathy and lighthearted charm.

### 3. 🫧 Little Big Feelings
- **Category:** Mood & Emotions
- **Tagline:** Explore and process your emotions with interactive blob friends.
- **Description:** A vibrant memory and matching card game helping players identify emotional states, triggers, and healthy coping mechanisms.

### 4. 🛡️ Mindscape Defense
- **Category:** Relaxed 3D Strategy & Focus
- **Tagline:** Protect your inner peace in a relaxed strategy experience.
- **Description:** An interactive survival game where players defend their symbolic "Mindscape" against negative thoughts, burnout, loneliness, and academic pressure by selecting effective coping actions.

### 5. ✨ Feeling Fusion
- **Category:** Mood & Emotional Nuance
- **Tagline:** Blend emotions together and discover what your feelings are saying.
- **Description:** Combine foundational emotions to discover nuanced feelings and develop emotional vocabulary in a playful, experimental format.

### 6. 🧠 Myth vs Fact
- **Category:** Educational Mindful Cards
- **Tagline:** Sort mental health statements into myths and facts.
- **Description:** An interactive card-sorting game challenging misconceptions, breaking down stigma, and reinforcing evidence-based mental health facts.

### 7. 📡 Signal Scout
- **Category:** Pathway Flow & Compassion
- **Tagline:** Notice signals of distress and choose compassionate responses.
- **Description:** Learn to identify subtle cues of emotional distress in others and practice choosing supportive, constructive paths of communication.

---

## 🚀 Key Features

- **Unified Game Hub:** Single-page seamless launcher with responsive grid layout and search filtering.
- **User Authentication & Guest Access:** Powered by Supabase for user profiles, progress tracking, and effortless guest access.
- **Full Immersion & Embedding:** Isolated iframe-based modular game execution with bidirectional message communication (`EXIT_TO_ARCADE`).
- **Sound & Audio Architecture:** Integrated sound effects for interactions, background music, and audio synthesis.
- **Cozy Design System:** Warm pastel palettes, glassmorphism cards, micro-animations, and full mobile & desktop responsiveness.

---

## 🛠️ Technology Stack

- **Core:** [React 18](https://react.dev/), [Vite 5](https://vitejs.dev/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/), Custom Design Tokens, CSS Animations
- **Icons & UI:** [Lucide React](https://lucide.dev/), [Framer Motion](https://www.framer.com/motion/)
- **3D & Canvas:** [Three.js](https://threejs.org/), [@react-three/fiber](https://r3f.docs.pmnd.rs/), [@react-three/drei](https://github.com/pmndrs/drei)
- **Backend & Auth:** [Supabase](https://supabase.com/)
- **Build System:** Multi-page Rollup bundle configured for sub-game HTML entrypoints.

---

## 📂 Project Structure

```
Arcade/
├── public/                     # Static assets, models (Man.glb), audio, icons
├── src/
│   ├── components/             # Hub UI components
│   │   ├── Navbar.jsx          # Top navigation & user profile
│   │   ├── Screen1_Login.jsx   # Login, registration & guest mode
│   │   ├── Screen2_ArcadeCollection.jsx # Arcade catalogue grid & search
│   │   ├── EmbeddedGame.jsx    # Fullscreen game viewport & exit bridge
│   │   └── MiniGameModal.jsx   # Quick play modal overlay
│   ├── games/                  # Standalone game modules
│   │   ├── Feeling-Fusion/
│   │   ├── Little-Big-Feelings/
│   │   ├── Myth-vs-Fact/
│   │   ├── Signal-Scout/
│   │   ├── Words-of-Wisdom/
│   │   ├── mindscape-defence/
│   │   └── stickman/
│   ├── lib/
│   │   └── supabase.js         # Supabase client initialization
│   ├── SoundEffects.js         # Audio helper utilities
│   ├── App.jsx                 # Main application router & state
│   ├── main.jsx                # Arcade React entry point
│   └── index.css               # Global styles & design tokens
├── index.html                  # Main Arcade HTML entry
├── vite.config.js              # Multi-page Vite configuration
├── tailwind.config.js          # Tailwind theme & token definitions
└── package.json                # Project dependencies and scripts
```

---

## 💻 Getting Started

### Prerequisites
- Node.js (v18.0.0 or higher)
- npm or yarn

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd Arcade
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env` file in the root directory:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Run development server:**
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173` in your browser.

5. **Build for production:**
   ```bash
   npm run build
   ```

---

## 🛡️ License

This project is developed for educational and mental wellness awareness. All rights reserved.
