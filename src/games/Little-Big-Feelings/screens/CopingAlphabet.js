// ============================================================
//  screens/CopingAlphabet.js — Mini-Game: Alphabet Coping
// ============================================================
import { COPING_ALPHABET } from '../copingAtoZData.js';
import { sounds } from '../utils/sounds.js';

let currentIndex = 0;
let score = 0;
let streak = 0;
let timer;
let timeLeft = 60;
let shuffledAlphabet = []; // Holds the current session's random order

export function template() {
    return /* html */`
    <section id="screen-alphabet-game" class="screen az-screen-fixed" aria-label="Alphabet Coping Game">
        <div class="az-container">
            <header class="az-header">
                <button id="btn-az-back" class="btn-icon" aria-label="Exit">
                    <i data-lucide="log-out"></i>
                </button>
                <div class="az-time-badge">
                    <span id="az-timer-text">60s</span>
                    <label>Time</label>
                </div>
                <div class="az-progress-rail">
                    <div id="az-progress-fill" class="az-progress-fill" style="width: 100%;"></div>
                </div>
                <div class="az-score-badge">
                    <span id="az-skills-count">0</span>
                    <label>Skills Found</label>
                </div>
            </header>

            <div class="az-game-main">
                <div id="az-start-screen" class="az-overlay-screen">
                    <h2 class="premium-title">A-Z Feelings Explorer</h2>
                    <p>Let's discover a fun way to feel better for every letter of the alphabet!</p>
                    <div class="az-tutorial-preview">
                         <div class="tutorial-item"><i data-lucide="sparkles"></i> <span>A to Z</span></div>
                         <div class="tutorial-item"><i data-lucide="heart"></i> <span>Feel Good</span></div>
                    </div>
                    <button class="btn-primary" id="btn-az-tutorial">How to Play?</button>
                    <button class="btn-secondary" id="btn-az-start" style="margin-top: 1rem;">Start Exploring</button>
                </div>

                <!-- Step-by-Step Tutorial -->
                <div id="az-tutorial-overlay" class="az-overlay hidden">
                    <div class="az-modal">
                        <div id="az-tutorial-content" class="az-tutorial-content">
                            <!-- Slides will be injected here -->
                        </div>
                        <div class="az-tutorial-dots" id="az-tutorial-dots"></div>
                        <button class="btn-primary" id="btn-az-tut-next">Next Tip</button>
                    </div>
                </div>

                <div id="az-game-play" class="az-play-area hidden">
                    <div class="az-huge-letter" id="az-letter">A</div>
                    
                    <div class="az-options-grid" id="az-options">
                        <!-- 3 Options will be injected here -->
                    </div>

                    <div id="az-streak" class="az-streak-badge hidden">
                        <i data-lucide="zap"></i> <span id="az-streak-val">2x</span> STREAK
                    </div>
                </div>

                <div id="az-victory" class="az-overlay-screen hidden">
                    <div class="victory-stars-display" id="az-final-stars"></div>
                    <h3 id="az-final-title">Alphabet Master!</h3>
                    <p id="az-final-score">Final Score: 1250</p>
                    <div class="az-victory-actions" style="display: flex; gap: 1rem; margin-top: 1.5rem;">
                        <button class="btn-primary" id="btn-az-retry">Retry Game</button>
                        <button class="btn-secondary" id="btn-az-finish">Exit Game</button>
                    </div>
                </div>
            </div>
        </div>
    </section>`;
}

export function onShow() {
    resetGame();
    // Ensure we start at the start screen
    document.getElementById('az-start-screen').classList.remove('hidden');
    document.getElementById('az-game-play').classList.add('hidden');
    document.getElementById('az-victory').classList.add('hidden');
    document.getElementById('az-tutorial-overlay').classList.add('hidden');
    
    // Reset HUD
    document.getElementById('az-skills-count').textContent = '0';
    document.getElementById('az-timer-text').textContent = '60s';
    document.getElementById('az-progress-fill').style.width = '100%';
}

export function init({ navigate }) {
    document.getElementById('btn-az-back').addEventListener('click', () => {
        resetGame();
        navigate('emotionSelect');
    });

    document.getElementById('btn-az-tutorial').addEventListener('click', () => {
        showTutorial();
    });

    document.getElementById('btn-az-start').addEventListener('click', () => {
        startGame();
    });

    document.getElementById('btn-az-tut-next').addEventListener('click', () => {
        nextTutorialStep();
    });

    document.getElementById('btn-az-retry').addEventListener('click', () => {
        sounds.click();
        startGame();
    });

    document.getElementById('btn-az-finish').addEventListener('click', () => {
        resetGame();
        navigate('emotionSelect');
    });
}

let tutorialStep = 0;
const tutorialSlides = [
    {
        icon: 'type',
        title: 'The Big Letter',
        text: 'Look at the giant letter in the middle. This is your target!'
    },
    {
        icon: 'mouse-pointer-2',
        title: 'Pick the Skill',
        text: 'Find the coping skill that starts with that letter and click it!'
    },
    {
        icon: 'timer',
        title: 'Watch the Time',
        text: 'The orange bar shows your time. Go fast to get a high score!'
    }
];

function showTutorial() {
    tutorialStep = 0;
    document.getElementById('az-tutorial-overlay').classList.remove('hidden');
    updateTutorialUI();
}

function nextTutorialStep() {
    tutorialStep++;
    if (tutorialStep >= tutorialSlides.length) {
        document.getElementById('az-tutorial-overlay').classList.add('hidden');
        startGame();
    } else {
        updateTutorialUI();
    }
}

function updateTutorialUI() {
    const content = document.getElementById('az-tutorial-content');
    const slide = tutorialSlides[tutorialStep];
    const nextBtn = document.getElementById('btn-az-tut-next');
    
    content.innerHTML = `
        <div class="az-modal-icon"><i data-lucide="${slide.icon}"></i></div>
        <h3>${slide.title}</h3>
        <p>${slide.text}</p>
    `;

    const dots = document.getElementById('az-tutorial-dots');
    dots.innerHTML = tutorialSlides.map((_, i) => 
        `<span class="dot ${i === tutorialStep ? 'active' : ''}"></span>`
    ).join('');

    nextBtn.textContent = tutorialStep === tutorialSlides.length - 1 ? "Let's Play!" : "Next Tip";
    
    if (window.lucide) window.lucide.createIcons();
}

function startGame() {
    // Generate a fresh shuffle for this session
    shuffledAlphabet = [...COPING_ALPHABET].sort(() => Math.random() - 0.5);
    
    currentIndex = 0;
    score = 0;
    streak = 0;
    timeLeft = 60; // 1 minute
    document.getElementById('az-start-screen').classList.add('hidden');
    document.getElementById('az-game-play').classList.remove('hidden');
    document.getElementById('az-victory').classList.add('hidden');
    
    // Start global 60s timer
    startGlobalTimer();
    nextRound();
}

function nextRound() {
    // Round loop: If we reach the end of the shuffled list, re-shuffle for a fresh round
    if (currentIndex >= shuffledAlphabet.length) {
        shuffledAlphabet = [...COPING_ALPHABET].sort(() => Math.random() - 0.5);
        currentIndex = 0; 
    }

    const currentData = shuffledAlphabet[currentIndex];
    
    // Update UI with a fun random color
    const letterEl = document.getElementById('az-letter');
    letterEl.textContent = currentData.letter;
    
    // Remove any existing color-X classes
    letterEl.className = 'az-huge-letter'; 
    const randomColor = Math.floor(Math.random() * 6) + 1;
    letterEl.classList.add(`color-${randomColor}`);

    // Generate Options
    const options = generateOptions(currentData);
    const optionsGrid = document.getElementById('az-options');
    optionsGrid.innerHTML = options.map(opt => `
        <button class="az-option-card" data-is-correct="${opt.isCorrect}">
            <div class="az-opt-icon"><i data-lucide="${opt.icon}"></i></div>
            <p>${opt.action}</p>
        </button>
    `).join('');

    if (window.lucide) window.lucide.createIcons();

    // Event listeners
    optionsGrid.querySelectorAll('.az-option-card').forEach(card => {
        card.addEventListener('click', () => handleChoice(card));
    });
}

function generateOptions(correct) {
    let opts = [{ ...correct, isCorrect: true }];
    
    // Use the fixed funny wrong options if available
    if (correct.wrong && Array.isArray(correct.wrong)) {
        correct.wrong.forEach(wAction => {
            opts.push({
                action: wAction,
                icon: 'help-circle', // Generic funny icon for wrong ones
                isCorrect: false,
                letter: correct.letter
            });
        });
    }

    // Fallback in case something is missing
    if (opts.length < 3) {
        const pool = COPING_ALPHABET.filter(item => item.letter !== correct.letter);
        while (opts.length < 3) {
            const rand = pool[Math.floor(Math.random() * pool.length)];
            if (!opts.find(o => o.action === rand.action)) {
                opts.push({ ...rand, isCorrect: false });
            }
        }
    }

    // Shuffle
    return opts.sort(() => Math.random() - 0.5);
}

function handleChoice(card) {
    if (card.dataset.isCorrect === 'true') {
        sounds.match();
        card.classList.add('correct');
        streak++;
        score++; // We'll count skills found as the score
        updateScore();
        currentIndex++;
        
        if (streak >= 3) {
            const sb = document.getElementById('az-streak');
            sb.classList.remove('hidden');
            document.getElementById('az-streak-val').textContent = `${streak}x`;
        }

        setTimeout(nextRound, 400); // Shorter pause for "rush" feel
    } else {
        sounds.wrong();
        card.classList.add('wrong');
        streak = 0;
        document.getElementById('az-streak').classList.add('hidden');
        timeLeft -= 1; // 1s penalty for wrong answer
    }
}

function updateScore() {
    document.getElementById('az-skills-count').textContent = score;
}

function startGlobalTimer() {
    const fill = document.getElementById('az-progress-fill');
    const text = document.getElementById('az-timer-text');
    
    clearInterval(timer);
    timer = setInterval(() => {
        timeLeft -= 0.1;
        if (timeLeft < 0) timeLeft = 0;

        const pct = (timeLeft / 60) * 100;
        fill.style.width = `${pct}%`;
        text.textContent = Math.ceil(timeLeft) + 's';
        
        if (timeLeft <= 0) {
            clearInterval(timer);
            sounds.wrong();
            showVictory();
        }
    }, 100);
}

function showVictory() {
    clearInterval(timer);
    document.getElementById('az-game-play').classList.add('hidden');
    document.getElementById('az-victory').classList.remove('hidden');
    document.getElementById('az-final-score').textContent = `Coping Skills Found: ${score}`;
    
    const starsContainer = document.getElementById('az-final-stars');
    const starCount = score >= 20 ? 3 : score >= 10 ? 2 : 1;
    starsContainer.innerHTML = '';
    for(let i=0; i<3; i++) {
        const active = i < starCount ? 'star-active' : 'star-inactive';
        starsContainer.innerHTML += `<i data-lucide="star" class="ui-star ${active}"></i>`;
    }
    if (window.lucide) window.lucide.createIcons();
}

function resetGame() {
    clearInterval(timer);
    currentIndex = 0;
    score = 0;
    streak = 0;
}
