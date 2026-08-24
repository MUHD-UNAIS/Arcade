// ============================================================
//  screens/Game.js — Screen 4: Game Board + All Card Logic
// ============================================================
import { state, resetRound } from '../gameState.js';
import { EMOTIONS_DATA, LEVELS } from '../gameData.js';
import { show as showMatch } from './OverlayMatch.js';
import { show as showWrong } from './OverlayWrong.js';
import { sounds } from '../utils/sounds.js';
import { spawnSparkles, spawnConfetti } from '../utils/effects.js';

// Grid column classes (avoids inline styles)
const GRID_COLS = {
    3: 'grid-cols-3',
    4: 'grid-cols-4',
    5: 'grid-cols-5',
    6: 'grid-cols-6',
};

// ── Template ────────────────────────────────────────────────
export function template() {
    return /* html */`
    <section id="screen-game" class="screen" aria-label="Game Board">

        <!-- HUD bar -->
        <div class="game-header">
            <button id="btn-game-exit" class="btn-icon exit-btn" aria-label="Exit game" title="Exit" type="button">
                <i data-lucide="log-out"></i>
                <span class="btn-text-label">EXIT</span>
            </button>

            <div class="hud-stats">
                <div class="stat-item">
                    <span class="stat-label">Feeling</span>
                    <span id="stat-emotion-wrap" class="stat-value">
                        <img id="stat-emotion-icon" class="stat-icon" alt="">
                        <span id="stat-emotion-name">Anger</span>
                    </span>
                </div>
                <div class="stat-divider"></div>
                <div class="stat-item">
                    <span class="stat-label">Level</span>
                    <span id="stat-level-wrap" class="stat-value">
                        <i id="stat-level-icon"></i>
                        <span id="stat-level-text">Easy</span>
                    </span>
                </div>
                <div class="stat-divider"></div>
                <div class="stat-item">
                    <span class="stat-label">Matched</span>
                    <span class="stat-value">
                        <span id="stat-matched">0</span>/<span id="stat-total">0</span>
                    </span>
                </div>
                <div class="stat-divider"></div>
                <div id="stat-chances-wrap" class="stat-item">
                    <span class="stat-label">Chances</span>
                    <span id="stat-mistakes" class="stat-value"></span>
                </div>
            </div>


            <div class="hud-right-actions">
                <button id="btn-peek"  class="btn-icon peek-btn" aria-label="Peek at all cards" title="Peek" type="button">
                    <i data-lucide="eye"></i>
                    <span class="btn-badge" id="peek-count-badge">0</span>
                </button>
                <button id="btn-hint"  class="btn-icon hint-btn" aria-label="Get a hint" title="Hint (max 3)" type="button">
                    <i data-lucide="sparkles"></i>
                    <span class="btn-badge" id="hint-count-badge">3</span>
                </button>
                <button id="btn-reset" class="btn-icon" aria-label="Reset game" title="Reset" type="button">
                    <i data-lucide="rotate-ccw"></i>
                </button>
            </div>
        </div>

        <!-- Progress bar -->
        <div class="progress-bar-wrap" aria-label="Progress" role="progressbar"
             aria-valuemin="0" aria-valuemax="100" aria-valuenow="0" id="progress-bar-wrap">
            <div class="progress-bar-fill" id="progress-bar-fill"></div>
            <span class="progress-bar-label" id="progress-bar-label">0%</span>
        </div>

        <!-- Card grid (populated by JS) -->
        <div class="game-board-container">
            <div id="game-board" class="game-grid"></div>
        </div>

        <!-- Exit Confirmation Overlay -->
        <div id="overlay-exit" class="overlay">
            <div class="overlay-card exit-confirm-card">
                <div class="exit-icon-wrap">
                    <i data-lucide="help-circle"></i>
                </div>
                <h3>Exit Game?</h3>
                <p>Are you sure you want to stop playing? You'll lose your current progress!</p>
                <div class="overlay-actions exit-actions">
                    <button id="btn-exit-yes" class="btn-primary exit-yes">YES, EXIT</button>
                    <button id="btn-exit-no" class="btn-secondary exit-no">NO, STAY</button>
                </div>
            </div>
        </div>
        
        <!-- Card Preview Overlay (Pop-up) -->
        <div id="overlay-card-preview" class="overlay">
            <div id="preview-content" class="preview-card-wrap">
                <!-- Injected by _showCardPopup -->
            </div>
        </div>

        <!-- Game Over Overlay -->
        <div id="overlay-game-over" class="overlay">
            <div class="overlay-card game-over-card">
                <div class="game-over-emoji">💔</div>
                <h3>Oh No! Game Over</h3>
                <p>You used all your chances! Don't worry — every mistake is a chance to learn!</p>
                <div class="overlay-actions">
                    <button id="btn-gameover-retry" class="btn-primary">Try Again 🔄</button>
                    <button id="btn-gameover-level" class="btn-secondary">Choose Level</button>
                </div>
            </div>
        </div>

    </section>`;
}

// ── Helpers ──────────────────────────────────────────────────
function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

function updateHUD() {
    const pairs = state.matchedCount / 2;
    const total = state.gameCards.length / 2;
    const pct = total > 0 ? Math.round((pairs / total) * 100) : 0;

    document.getElementById('stat-matched').textContent = pairs;
    document.getElementById('stat-total').textContent = total;

    // Emotion and Level label
    const emoNameEl = document.getElementById('stat-emotion-name');
    const emoIconEl = document.getElementById('stat-emotion-icon');
    const lvlText = document.getElementById('stat-level-text');
    const lvlIcon = document.getElementById('stat-level-icon');

    const emoData = EMOTIONS_DATA[state.selectedEmotion] || EMOTIONS_DATA.anger;
    if (emoNameEl) {
        emoNameEl.textContent = emoData.name;
        emoNameEl.parentElement.style.color = emoData.color;
    }
    if (emoIconEl) {
        emoIconEl.src = emoData.icon;
        emoIconEl.style.display = 'inline-block';
    }

    if (lvlText) lvlText.textContent = LEVELS[state.currentLevel].label;
    if (lvlIcon) {
        const iconName = state.currentLevel === 1 ? 'sprout' : state.currentLevel === 2 ? 'flower' : 'tree-pine';
        const iconColor = state.currentLevel === 1 ? 'var(--green)' : state.currentLevel === 2 ? 'var(--yellow)' : 'var(--orange)';
        lvlIcon.setAttribute('data-lucide', iconName);
        lvlIcon.style.color = iconColor;
        if (window.lucide) window.lucide.createIcons();
    }

    // Progress bar
    const fill = document.getElementById('progress-bar-fill');
    const label = document.getElementById('progress-bar-label');
    const wrap = document.getElementById('progress-bar-wrap');
    if (fill) fill.style.width = `${pct}%`;
    if (label) label.textContent = `${pct}%`;
    if (wrap) wrap.setAttribute('aria-valuenow', pct);

    // Mistakes HUD (Standardized: Heart Icon + Numerical Counter)
    const mistakesEl = document.getElementById('stat-mistakes');
    if (mistakesEl) {
        const remaining = Math.max(0, state.maxMistakes - state.mistakes);
        
        mistakesEl.innerHTML = `
            <i data-lucide="heart" class="heart-indicator" style="fill: var(--pink); color: var(--pink);"></i>
            <span class="chance-counter">${remaining} / ${state.maxMistakes}</span>
        `;
        
        if (window.lucide) window.lucide.createIcons();
    }

    // Peak button
    const peekBtn = document.getElementById('btn-peek');
    const peekBadge = document.getElementById('peek-count-badge');
    if (peekBtn) {
        const maxPeeks = LEVELS[state.currentLevel].peekUses;
        const left = maxPeeks - state.peeksUsed;
        peekBtn.disabled = left <= 0;
        if (peekBadge) peekBadge.textContent = left;
    }

    // Disable hint after 3 uses
    const hintBtn = document.getElementById('btn-hint');
    const hintBadge = document.getElementById('hint-count-badge');
    if (hintBtn) {
        const left = 3 - state.hintsUsed;
        hintBtn.disabled = left <= 0;
        if (hintBadge) hintBadge.textContent = left;
    }
}

// ── Card creation ─────────────────────────────────────────────
function createCardEl(cardData) {
    const card = document.createElement('div');
    card.className = 'card';
    card.dataset.id = cardData.id;
    card.setAttribute('role', 'button');
    card.setAttribute('tabindex', '0');
    card.setAttribute('aria-label', `Emotion card: ${cardData.name}`);

    card.innerHTML = /* html */`
        <div class="card-inner">
            <div class="card-face card-back">
                <div class="card-back-pattern">
                    <img src="/assets/brand/nextlogo.svg" alt="" style="width: 80%; height: 80%; opacity: 0.9;">
                </div>
            </div>
            <div class="card-face card-front">
                <div class="card-label">${cardData.label}</div>
                <img src="${cardData.image}" alt="${cardData.name}" draggable="false">
                <div class="card-name">${cardData.name}</div>
            </div>
        </div>`;

    card.addEventListener('click', () => _flipCard(card, cardData));
    card.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            _flipCard(card, cardData);
        }
    });

    return card;
}

function _showCardPopup(cardData, callback) {
    const overlay = document.getElementById('overlay-card-preview');
    const content = document.getElementById('preview-content');
    if (!overlay || !content) return;

    content.innerHTML = `
        <div class="premium-preview-card ${cardData.type}">
            <div class="preview-label">${cardData.label}</div>
            <div class="preview-img-wrap">
                <img src="${cardData.image}" alt="${cardData.name}">
            </div>
            <div class="preview-info">
                <h2 class="preview-name">${cardData.name}</h2>
                <p class="preview-desc">${cardData.description || ''}</p>
            </div>
            <button id="btn-close-preview" class="btn-primary">GOT IT!</button>
        </div>
    `;

    overlay.classList.add('active');

    const closeBtn = document.getElementById('btn-close-preview');
    const close = () => {
        overlay.classList.remove('active');
        if (callback) callback();
    };

    closeBtn.onclick = close;
    overlay.onclick = (e) => { if (e.target === overlay) close(); };
}

// ── Flip / Match logic ────────────────────────────────────────
function _flipCard(cardEl, cardData) {
    if (state.isLocked) return;
    if (cardEl.classList.contains('matched')) return;
    
    // allow un-flipping the first card
    if (state.flippedCards.length === 1 && state.flippedCards[0].el === cardEl) {
        sounds.flip();
        cardEl.classList.remove('flipped');
        state.flippedCards = [];
        return;
    }

    if (cardEl.classList.contains('flipped')) return;
    if (state.flippedCards.length === 2) return;

    sounds.flip();
    cardEl.classList.add('flipped');
    state.flippedCards.push({ el: cardEl, data: cardData });

    if (state.flippedCards.length === 1) {
        // Show the info popup for the FIRST card
        state.isLocked = true;
        setTimeout(() => {
            _showCardPopup(cardData, () => {
                state.isLocked = false;
            });
        }, 400); // Reduced delay for better feel
    } else if (state.flippedCards.length === 2) {
        state.isLocked = true;
        state.totalAttempts++;
        updateHUD();
        
        // No popup for 2nd card, just check match
        setTimeout(_checkMatch, 600); // Reduced delay to show result faster
    }
}

function _checkMatch() {
    const [c1, c2] = state.flippedCards;
    if (c1.data.matchId === c2.data.id) {
        _handleMatch(c1, c2);
    } else {
        _handleNoMatch(c1, c2);
    }
}

function _handleMatch(c1, c2) {
    sounds.match(state.selectedEmotion);
    c1.el.classList.add('matched');
    c2.el.classList.add('matched');

    spawnSparkles(c1.el);
    spawnSparkles(c2.el);
    if (state.matchedCount % 4 === 0) spawnConfetti();

    state.matchedCount += 2;
    state.flippedCards = [];
    state.isLocked = false;
    updateHUD();
    showMatch({ d1: c1.data, d2: c2.data });
}

function _handleNoMatch(c1, c2) {
    sounds.wrong(state.selectedEmotion);
    state.mistakes++;
    updateHUD();

    c1.el.classList.add('shake');
    c2.el.classList.add('shake');

    showWrong();

    setTimeout(() => {
        c1.el.classList.remove('shake', 'flipped');
        c2.el.classList.remove('shake', 'flipped');
        state.flippedCards = [];
        state.isLocked = false;

        // Check game over AFTER cards flip back
        if (state.mistakes >= state.maxMistakes) {
            state.isLocked = true;
            setTimeout(() => {
                const overlay = document.getElementById('overlay-game-over');
                if (overlay) overlay.classList.add('active');
            }, 400);
        }
    }, 1500);
}

// ── Hint ─────────────────────────────────────────────────────
function _giveHint() {
    if (state.hintsUsed >= 3 || state.isLocked) return;

    // Find first unmatched pair
    const unmatched = state.gameCards.filter(c => {
        const el = document.querySelector(`[data-id="${c.id}"]`);
        return el && !el.classList.contains('matched') && !el.classList.contains('flipped');
    });
    if (unmatched.length < 2) return;

    const first = unmatched[0];
    const partner = state.gameCards.find(c => c.id === first.matchId);
    if (!partner) return;

    const el1 = document.querySelector(`[data-id="${first.id}"]`);
    const el2 = document.querySelector(`[data-id="${partner.id}"]`);

    [el1, el2].forEach(el => el?.classList.add('hint-glow'));

    state.hintsUsed++;
    sounds.click();
    updateHUD();

    setTimeout(() => {
        [el1, el2].forEach(el => el?.classList.remove('hint-glow'));
    }, 1800);
}

// ── Peek ─────────────────────────────────────────────────────
function _peekAll() {
    const cfg = LEVELS[state.currentLevel];
    if (state.peeksUsed >= cfg.peekUses || state.isLocked) return;

    sounds.click();
    state.peeksUsed++;
    state.isLocked = true; // prevent interaction while peeking
    updateHUD();

    const allCards = document.querySelectorAll('.card');
    const cardsToUnflip = [];

    allCards.forEach(card => {
        if (!card.classList.contains('matched') && !card.classList.contains('flipped')) {
            card.classList.add('flipped', 'peeking');
            cardsToUnflip.push(card);
        }
    });

    setTimeout(() => {
        cardsToUnflip.forEach(card => {
            card.classList.remove('flipped', 'peeking');
        });
        state.isLocked = false;
    }, cfg.peekDuration);
}

// ── Victory / GameOver callbacks (injected by main.js) ───────
let _onVictory = () => { };
let _onGameOver = () => { };

// ── Public API ────────────────────────────────────────────────

/** Build + shuffle the board for the current level */
export function startGame() {
    resetRound();

    const cfg = LEVELS[state.currentLevel];
    const board = document.getElementById('game-board');
    if (!board) return;
    board.innerHTML = '';

    // Remove any previous grid-col class and set the right one
    Object.values(GRID_COLS).forEach(c => board.classList.remove(c));
    // Determine optimal columns for wider landscape layout (bigger cards)
    const totalCards = cfg.pairs * 2;
    let cols = 3; 
    if (totalCards === 8) cols = 4; // 4x2
    if (totalCards === 12) cols = 4; // 4x3 (still 4 columns, but we could do 6x2)
    if (totalCards >= 20) cols = 5; // 5x4 or similar
    
    // Actually, let's keep it simple based on pairs
    if (cfg.pairs === 3) cols = 3; // 3x2 (Beginner)
    if (cfg.pairs === 4) cols = 4; // 4x2 (Intermediate)
    if (cfg.pairs === 6) cols = 6; // 6x2 (Full Journey)
    if (cfg.pairs === 10) cols = 5; // 5x4 (Grand Master)
    
    state.maxMistakes = cfg.chances || 3;
    board.classList.add(GRID_COLS[cols] || 'grid-cols-4');

    // Pick pairs from the selected emotion's pool
    const emoData = EMOTIONS_DATA[state.selectedEmotion] || EMOTIONS_DATA.anger;
    let availablePairs = shuffle(emoData.pairs).slice(0, cfg.pairs);

    state.gameCards = [];
    availablePairs.forEach(pair => {
        state.gameCards.push({
            id: pair.emotion.id,
            matchId: pair.action.id,
            image: pair.emotion.img,
            type: 'emotion',
            name: pair.emotion.name,
            label: 'Emotion',
            description: pair.emotion.desc
        });
        state.gameCards.push({
            id: pair.action.id,
            matchId: pair.emotion.id,
            image: pair.action.img,
            type: 'action',
            name: pair.action.name,
            label: 'Coping Action',
            description: pair.action.desc
        });
    });

    state.gameCards = shuffle(state.gameCards);

    state.gameCards.forEach(card => board.appendChild(createCardEl(card)));
    updateHUD();
}

/**
 * @param {{ navigate: (screen: string) => void, onVictory: () => void, onGameOver: () => void }} deps
 */
export function init({ navigate, onVictory, onGameOver }) {
    _onVictory = onVictory;
    _onGameOver = onGameOver ?? (() => {});

    const exitBtn = document.getElementById('btn-game-exit');
    const exitOverlay = document.getElementById('overlay-exit');
    const exitYes = document.getElementById('btn-exit-yes');
    const exitNo = document.getElementById('btn-exit-no');

    if (exitBtn) {
        exitBtn.addEventListener('click', () => {
            sounds.click();
            exitOverlay.classList.add('active');
            state.isLocked = true; // Pause interaction
        });
    }

    if (exitNo) {
        exitNo.addEventListener('click', () => {
            sounds.click();
            exitOverlay.classList.remove('active');
            state.isLocked = false;
        });
    }

    if (exitYes) {
        exitYes.addEventListener('click', () => {
            sounds.click();
            exitOverlay.classList.remove('active');
            navigate('levelSelect');
        });
    }

    document.getElementById('btn-reset').addEventListener('click', () => {
        sounds.click();
        // Close game over overlay if open
        const goOverlay = document.getElementById('overlay-game-over');
        if (goOverlay) goOverlay.classList.remove('active');
        startGame();
    });

    // Game Over overlay buttons
    const gameOverOverlay = document.getElementById('overlay-game-over');
    const retryBtn = document.getElementById('btn-gameover-retry');
    const chooseLevelBtn = document.getElementById('btn-gameover-level');

    if (retryBtn) {
        retryBtn.addEventListener('click', () => {
            sounds.click();
            if (gameOverOverlay) gameOverOverlay.classList.remove('active');
            state.isLocked = false;
            startGame();
        });
    }
    if (chooseLevelBtn) {
        chooseLevelBtn.addEventListener('click', () => {
            sounds.click();
            if (gameOverOverlay) gameOverOverlay.classList.remove('active');
            state.isLocked = false;
            navigate('levelSelect');
        });
    }

    document.getElementById('btn-hint').addEventListener('click', _giveHint);
    document.getElementById('btn-peek').addEventListener('click', _peekAll);
}

/** True when all pairs on this board are matched */
export function isComplete() {
    return state.gameCards.length > 0 &&
        state.matchedCount === state.gameCards.length;
}

/** Star rating: based on pair-match efficiency */
export function calcStars() {
    const pairs = state.matchedCount / 2;
    const efficiency = pairs / Math.max(state.totalAttempts, 1);
    if (efficiency >= 0.75) return 3;
    if (efficiency >= 0.50) return 2;
    return 1;
}
