// ============================================================
//  screens/Settings.js — Screen: App Settings
// ============================================================
import { loadSettings, saveSettings, loadPlayer, clearAll, resetScores } from '../utils/storage.js';
import { sounds } from '../utils/sounds.js';
import { state } from '../gameState.js';
import { applyAccessibilitySettings } from '../utils/accessibility.js';

export function template() {
    return /* html */`
    <section id="screen-settings" class="screen" aria-label="Settings">
        
        <div class="settings-container">
            <div class="settings-header">
                <div class="settings-header-left">
                    <button id="btn-settings-back" class="btn-icon settings-back-btn" aria-label="Back" type="button">
                        <i data-lucide="arrow-left"></i>
                    </button>
                    <h2>Settings</h2>
                </div>
                <div class="settings-header-right">
                    <button id="btn-about" class="btn-secondary" type="button" style="padding: 0.5rem 1rem; font-size: 0.9rem;">
                        <i data-lucide="info" style="width: 18px; height: 18px; margin-right: 6px;"></i>
                        About
                    </button>
                </div>
            </div>

            <div class="settings-grid">
                
                <!-- 1. Profile (Left) -->
                <div class="settings-card card-profile">
                    <div id="settings-avatar" class="settings-big-avatar"></div>
                    <div id="settings-name"   class="settings-player-name">Player</div>
                    <button id="btn-edit-profile" class="btn-secondary" type="button">
                        Edit Profile
                    </button>
                </div>

                <!-- 2. Main Options (Middle) -->
                <div class="settings-card card-main">
                    <div class="settings-header-small">
                        <i data-lucide="settings"></i>
                        <span>Game Preferences</span>
                    </div>

                    <div class="settings-row">
                        <div class="settings-label">
                            <span class="settings-icon">
                                <i id="sound-icon-preview" data-lucide="volume-2"></i>
                            </span>
                            <div class="settings-label-text">
                                <div class="settings-label-title">Sound Effects</div>
                                <div class="settings-label-sub">Fun noises and music</div>
                            </div>
                        </div>
                        <button id="btn-sound-toggle" class="toggle-btn" aria-label="Toggle sound" aria-checked="false">
                            <div class="toggle-thumb"></div>
                        </button>
                    </div>

                    <div class="settings-row">
                        <div class="settings-label">
                            <span class="settings-icon">
                                <i id="speech-icon-preview" data-lucide="message-square"></i>
                            </span>
                            <div class="settings-label-text">
                                <div class="settings-label-title">Voice Narration</div>
                                <div class="settings-label-sub">Read matches out loud</div>
                            </div>
                        </div>
                        <button id="btn-speech-toggle" class="toggle-btn" aria-label="Toggle narration" aria-checked="false">
                            <div class="toggle-thumb"></div>
                        </button>
                    </div>
                </div>

                <!-- 3. Accessibility (Right) -->
                <div class="settings-card card-accessibility">
                    <div class="settings-header-small">
                        <i data-lucide="accessibility"></i>
                        <span>Accessibility Suite</span>
                    </div>
                    
                    <div class="settings-row">
                        <div class="settings-label">
                            <div class="settings-label-text">
                                <div class="settings-label-title">High Contrast</div>
                                <div class="settings-label-sub">Enhanced visibility</div>
                            </div>
                        </div>
                        <button id="btn-contrast-toggle" class="toggle-btn" aria-label="Toggle high contrast" aria-checked="false">
                            <div class="toggle-thumb"></div>
                        </button>
                    </div>

                    <div class="settings-row">
                        <div class="settings-label">
                            <div class="settings-label-text">
                                <div class="settings-label-title">Dyslexic Font</div>
                                <div class="settings-label-sub">OpenDyslexic style</div>
                            </div>
                        </div>
                        <button id="btn-font-toggle" class="toggle-btn" aria-label="Toggle dyslexic font" aria-checked="false">
                            <div class="toggle-thumb"></div>
                        </button>
                    </div>

                    <div class="settings-row">
                        <div class="settings-label">
                            <div class="settings-label-text">
                                <div class="settings-label-title">Reduced Motion</div>
                                <div class="settings-label-sub">Simplify animations</div>
                            </div>
                        </div>
                        <button id="btn-motion-toggle" class="toggle-btn" aria-label="Toggle reduced motion" aria-checked="false">
                            <div class="toggle-thumb"></div>
                        </button>
                    </div>
                </div>

                <!-- 4. Danger (Bottom Span) -->
                <div class="settings-card card-danger settings-danger">
                    <div class="settings-row">
                        <div class="settings-label">
                            <span class="settings-icon">
                                <i data-lucide="alert-triangle" style="color: #FF5252;"></i>
                            </span>
                            <div class="settings-label-text">
                                <div class="settings-label-title">Reset All Progress</div>
                                <div class="settings-label-sub">This action cannot be undone.</div>
                            </div>
                        </div>
                        <button id="btn-clear-data" class="btn-danger" type="button">Reset All Data</button>
                    </div>
                </div>

            </div>
        </div>

        <!-- About Modal Overlay -->
        <div id="about-overlay" class="about-overlay hidden">
            <div class="about-modal">
                <button id="btn-close-about" class="btn-icon about-close-btn" aria-label="Close">
                    <i data-lucide="x"></i>
                </button>
                
                <div class="about-scroll">
                    <img src="/assets/brand/image.png" alt="Mind Empowered Logo" class="about-logo">
                    
                    <div class="about-section">
                        <h3>About Mind Empowered</h3>
                        <p class="about-text">
                            Mind Empowered (ME) is a charitable organization in India dedicated to mental health awareness, 
                            emotional resilience, and youth empowerment. They offer free webinars, workshops, and 
                            resources for Gen-Z to navigate life's challenges with confidence.
                        </p>
                        <p class="about-tagline">"Illuminating minds. Transforming lives."</p>
                        <a href="https://mind-empowered.org/" target="_blank" class="about-site-link">
                            Visit Website <i data-lucide="external-link"></i>
                        </a>
                    </div>

                    <div class="about-divider"></div>

                    <div class="about-section">
                        <h3>Why "Little Big Feelings"?</h3>
                        <p class="about-text">
                            We created this app to bridge the gap between complex psychological concepts and a child's 
                            everyday world. By bringing the "Recharge Without Charge" curriculum to life through 
                            interactive play, we provide children with a safe, cozy space to explore their 
                            Big Feelings and learn healthy coping skills long before they reach a crisis point.
                        </p>
                    </div>
                    
                    <div class="about-footer">
                        Made with ❤️ for children everywhere.
                    </div>
                </div>
            </div>
        </div>
    </section>`;
}

export function onShow() {
    const player = loadPlayer();

    const avatarEl = document.getElementById('settings-avatar');
    const nameEl = document.getElementById('settings-name');

    if (avatarEl) {
        const avatar = player?.avatar || '/assets/avatars/avatar_6.svg';
        avatarEl.innerHTML = `<img src="${avatar}" alt="" style="width: 100%; height: 100%;">`;
    }
    if (nameEl) nameEl.textContent = player?.name ?? 'Player';

    // Refresh UI Toggles
    _updateToggleUI('btn-sound-toggle', state.soundEnabled);
    _updateToggleUI('btn-speech-toggle', state.speechEnabled);
    _updateToggleUI('btn-contrast-toggle', state.highContrast);
    _updateToggleUI('btn-font-toggle', state.dyslexicFont);
    _updateToggleUI('btn-motion-toggle', state.reducedMotion);
    
    // Update Icons
    _updateIconUI('sound-icon-preview', state.soundEnabled ? 'volume-2' : 'volume-x');
    _updateIconUI('speech-icon-preview', state.speechEnabled ? 'message-square' : 'message-square-off');
}

/**
 * @param {{ navigate: (screen: string) => void }} deps
 */
export function init({ navigate }) {
    // Back to Previous Screen
    document.getElementById('btn-settings-back').addEventListener('click', () => {
        sounds.click();
        navigate(state.previousScreen || 'levelSelect');
    });

    // Edit profile → NameEntry
    document.getElementById('btn-edit-profile').addEventListener('click', () => {
        sounds.click();
        navigate('nameEntry');
    });

    // Sound toggle
    document.getElementById('btn-sound-toggle').addEventListener('click', () => {
        state.soundEnabled = !state.soundEnabled;
        _save();
        sounds.setEnabled(state.soundEnabled);
        if (state.soundEnabled) {
            sounds.click();
            sounds.startMusic();
        }
        _updateToggleUI('btn-sound-toggle', state.soundEnabled);
        _updateIconUI('sound-icon-preview', state.soundEnabled ? 'volume-2' : 'volume-x');
    });

    // Speech toggle
    document.getElementById('btn-speech-toggle').addEventListener('click', () => {
        state.speechEnabled = !state.speechEnabled;
        _save();
        if (state.speechEnabled) sounds.click();
        _updateToggleUI('btn-speech-toggle', state.speechEnabled);
        _updateIconUI('speech-icon-preview', state.speechEnabled ? 'message-square' : 'message-square-off');
    });

    // Accessibility Toggles
    document.getElementById('btn-contrast-toggle').addEventListener('click', () => {
        state.highContrast = !state.highContrast;
        _handleA11yUpdate('btn-contrast-toggle', state.highContrast);
    });

    document.getElementById('btn-font-toggle').addEventListener('click', () => {
        state.dyslexicFont = !state.dyslexicFont;
        _handleA11yUpdate('btn-font-toggle', state.dyslexicFont);
    });

    document.getElementById('btn-motion-toggle').addEventListener('click', () => {
        state.reducedMotion = !state.reducedMotion;
        _handleA11yUpdate('btn-motion-toggle', state.reducedMotion);
    });

    // Reset all data
    document.getElementById('btn-clear-data').addEventListener('click', () => {
        if (!confirm('This will delete your name, avatar, and all level scores. Sure?')) return;
        clearAll();
        resetScores();
        state.playerName = 'Player';
        state.playerAvatar = '/assets/avatars/avatar_6.svg';
        state.animoId = 'dog';
        sounds.setEnabled(true);
        navigate('nameEntry');
    });

    // About Modal
    const aboutBtn = document.getElementById('btn-about');
    const aboutOverlay = document.getElementById('about-overlay');
    const closeAboutBtn = document.getElementById('btn-close-about');

    if (aboutBtn && aboutOverlay) {
        aboutBtn.addEventListener('click', () => {
            sounds.click();
            aboutOverlay.classList.remove('hidden');
        });
    }

    if (closeAboutBtn) {
        closeAboutBtn.addEventListener('click', () => {
            sounds.click();
            aboutOverlay.classList.add('hidden');
        });
    }

    // Close on outside click
    aboutOverlay?.addEventListener('click', (e) => {
        if (e.target === aboutOverlay) {
            aboutOverlay.classList.add('hidden');
        }
    });
}

function _handleA11yUpdate(btnId, val) {
    _save();
    sounds.click();
    _updateToggleUI(btnId, val);
    applyAccessibilitySettings();
}

function _save() {
    saveSettings({
        soundEnabled: state.soundEnabled,
        speechEnabled: state.speechEnabled,
        highContrast: state.highContrast,
        dyslexicFont: state.dyslexicFont,
        reducedMotion: state.reducedMotion
    });
}

function _updateToggleUI(id, on) {
    const btn = document.getElementById(id);
    if (btn) {
        btn.classList.toggle('toggle-on', on);
        btn.setAttribute('aria-checked', on);
    }
}

function _updateIconUI(id, iconName) {
    const el = document.getElementById(id);
    if (el) {
        el.setAttribute('data-lucide', iconName);
        if (window.lucide) window.lucide.createIcons();
    }
}
