// ============================================================
//  main.js — App Orchestrator  (v2)
//
//  Responsibilities:
//    1. Import every screen module
//    2. Inject each screen's HTML into #app
//    3. Own the navigate() function + onShow hook pattern
//    4. Wire every screen's init() with the deps it needs
//    5. Boot: splash screen
// ============================================================

import * as Splash from './screens/Splash.js';
import { sounds } from './utils/sounds.js';
import './style.css';

// ── 0. Screen registry ────────────────────────────────────────
const SCREENS = [
    { id: 'splash', mod: Splash },
    { id: 'nameEntry', mod: NameEntry },
    { id: 'emotionSelect', mod: EmotionSelect },
    { id: 'levelSelect', mod: LevelSelect },
    { id: 'tutorial', mod: Tutorial },
    { id: 'game', mod: Game },
    { id: 'settings', mod: Settings },
    { id: 'journal', mod: Journal },
    { id: 'victory', mod: Victory },
    { id: 'moodAnimo', mod: MoodAnimo },
    { id: 'alphabetGame', mod: CopingAlphabet },
    { id: 'moodMixer', mod: MoodMixer },
    { id: 'breathingBuddy', mod: BreathingBuddy },
    { id: 'match', mod: OverlayMatch },
    { id: 'wrong', mod: OverlayWrong },
];
import * as NameEntry from './screens/NameEntry.js';
import * as EmotionSelect from './screens/EmotionSelect.js';
import * as LevelSelect from './screens/LevelSelect.js';
import * as Tutorial from './screens/Tutorial.js';
import * as Game from './screens/Game.js';
import * as OverlayMatch from './screens/OverlayMatch.js';
import * as BreathingBuddy from './screens/BreathingBuddy.js';
import * as Victory from './screens/Victory.js';
import * as Settings from './screens/Settings.js';
import * as OverlayWrong from './screens/OverlayWrong.js';
import * as Journal from './screens/Journal.js';
import * as MoodAnimo from './screens/MoodAnimo.js';
import * as CopingAlphabet from './screens/CopingAlphabet.js';
import * as MoodMixer from './screens/MoodMixer.js';
import { 
    loadSettings, 
    loadUnlockedInsights, 
    loadDiscoveredMixes,
    loadPlayer
} from './utils/storage.js';
import { applyAccessibilitySettings } from './utils/accessibility.js';
import { state } from './gameState.js';
import { ANIMO_MAP } from './gameData.js';

// ── 0. Initial Settings & Profile Load ────────────────────────
const savedSettings = loadSettings();
Object.assign(state, savedSettings);

const player = loadPlayer();
if (player) {
    state.playerName = player.name;
    state.playerAvatar = player.avatar;
    const fname = player.avatar.split('/').pop();
    state.animoId = ANIMO_MAP[fname] || 'dog';
}

state.unlockedInsights = loadUnlockedInsights();
state.discoveredMixes = loadDiscoveredMixes();
applyAccessibilitySettings(state);

// ── 1. Mount all templates into #app ─────────────────────────
const app = document.getElementById('app');

app.insertAdjacentHTML('beforeend', /* html */`
    <div class="game-background">
        <img src="/assets/background/game_bg.svg" alt="" aria-hidden="true">
    </div>
`);

SCREENS.forEach(s => app.insertAdjacentHTML('beforeend', s.mod.template()));

// ── 3. navigate() ─────────────────────────────────────────────
/**
 * Deactivates all screens, activates the target, and runs its onShow() hook.
 * Overlays (OverlayMatch, BreathingBuddy) manage themselves separately.
 * @param {string} key - must be a key in SCREEN_MAP
 */
function navigate(key) {
    if (state.currentScreen === key) return;
    
    state.previousScreen = state.currentScreen;
    state.currentScreen = key;

    const target = SCREENS.find(s => s.id === key);
    if (!target) return;

    // Deactivate all screens
    SCREENS.forEach(s => {
        const templateId = s.mod.template().match(/id="([^"]+)"/)?.[1];
        if (templateId) {
            const el = document.getElementById(templateId);
            if (el) el.classList.remove('active');
        }
    });

    // Activate target
    const targetId = target.mod.template().match(/id="([^"]+)"/)?.[1];
    if (targetId) {
        const targetEl = document.getElementById(targetId);
        if (targetEl) targetEl.classList.add('active');
    }

    target.mod.onShow?.();

    if (window.lucide) {
        window.lucide.createIcons();
    }
}

// ── 4. Shared callbacks ───────────────────────────────────────
function startGame() {
    Game.startGame();
}

/** Called by OverlayMatch "Keep Going!" — triggers victory if all pairs done */
function onMatchContinue() {
    if (Game.isComplete()) {
        const stars = Game.calcStars();
        Victory.populate({ stars });
        navigate('victory');
    }
}

// ── 5. Wire every screen ─────────────────────────────────────
Splash.init({ navigate });
NameEntry.init({ navigate });
EmotionSelect.init({ navigate });
LevelSelect.init({ navigate, startGame });
Tutorial.init({ navigate, startGame });
Game.init({
    navigate,
    onVictory: () => {
        const stars = Game.calcStars();
        Victory.populate({ stars });
        navigate('victory');
    },
});
Settings.init({ navigate });
Journal.init({ navigate });
OverlayMatch.init({ onContinue: onMatchContinue });
OverlayWrong.init();
BreathingBuddy.init();
Victory.init({ navigate, startGame });
MoodAnimo.init({ navigate });
CopingAlphabet.init({ navigate });
MoodMixer.init({ navigate });

// ── 6. Orientation Lock ─────────────────────────────────────────
async function lockPortrait() {
    try {
        if (screen.orientation && screen.orientation.lock) {
            await screen.orientation.lock('portrait').catch(() => {});
        }
    } catch (e) {
        console.error("Orientation lock error:", e);
    }
}
lockPortrait();
window.addEventListener('click', lockPortrait, { once: true });

// ── 7. Global Visibility Handling ──────────────────────────────
document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
        sounds.pauseBackgroundMusic();
    } else {
        sounds.resumeBackgroundMusic();
    }
});

navigate('splash');
