// ============================================================
//  screens/OverlayMatch.js — Overlay: Correct Match Found
// ============================================================
import { sounds } from '../utils/sounds.js';
import { state } from '../gameState.js';
import { saveUnlockedInsights } from '../utils/storage.js';

export function template() {
    return /* html */`
    <div id="overlay-match" class="overlay" role="dialog" aria-modal="true" aria-label="Match Found">
        <div class="overlay-card match-overlay-card">
            <div class="match-badge">You Found a Match!</div>
            <h3 id="match-pair-title" class="match-title">Pair Name</h3>

            <div class="match-visuals">
                <div class="matched-pair">
                    <img id="match-img-1" src="" alt="First matched card">
                    <i data-lucide="sparkles" class="sparkle-icon" style="color: var(--yellow); fill: var(--yellow); width: 40px; height: 40px;"></i>
                    <img id="match-img-2" src="" alt="Second matched card">
                </div>
            </div>

            <div class="match-explanation">
                <p id="match-full-explanation" class="match-desc-primary"></p>
            </div>

            <div class="match-motivation-box">
                <p id="match-motivational" class="match-motivational"></p>
            </div>

            <button id="btn-match-continue" class="btn-primary">Keep Exploring!</button>
        </div>
    </div>`;
}

let autoDismissTimer = null;

export function show({ d1, d2 }) {
    sounds.congratulate();

    // Motivational phrases for correct matches
    const motivations = [
        "You're an emotional superstar!",
        "Understanding feelings is your superpower!",
        "Wow, you're learning so much about yourself!",
        "Fantastic! Your brain is growing stronger!",
        "You did it! Being kind to yourself is great!",
        "Spot on! You're a true feelings explorer!"
    ];

    const randomMotive = motivations[Math.floor(Math.random() * motivations.length)];

    document.getElementById('match-img-1').src = d1.image;
    document.getElementById('match-img-2').src = d2.image;
    document.getElementById('match-pair-title').textContent = `${d1.name} + ${d2.name}`;

    // Combine trigger and action into a cohesive explanation
    const fullExplanation = `When you feel like: "${d1.description}"... you can try to: "${d2.description}"`;
    document.getElementById('match-full-explanation').textContent = fullExplanation;
    document.getElementById('match-motivational').textContent = randomMotive;

    document.getElementById('overlay-match').classList.add('active');

    // Unlock insight (save the emotion ID part)
    const insightId = d1.type === 'emotion' ? d1.id : d2.id;
    if (!state.unlockedInsights.includes(insightId)) {
        state.unlockedInsights.push(insightId);
        saveUnlockedInsights(state.unlockedInsights);
    }

    // Narrate for children (DISABLED - User requested no reading out)
    /*
    if ('speechSynthesis' in window && state.speechEnabled) {
        window.speechSynthesis.cancel();
        const text = `Brilliant! ${randomMotive}. ${fullExplanation}`;
        const msg = new SpeechSynthesisUtterance(text);
        msg.rate = 1.0;
        msg.pitch = 1.1;
        window.speechSynthesis.speak(msg);
    }
    */

    // Auto-dismiss after 7 seconds for more reading time
    clearTimeout(autoDismissTimer);
    autoDismissTimer = setTimeout(() => {
        const btn = document.getElementById('btn-match-continue');
        if (document.getElementById('overlay-match').classList.contains('active')) {
            btn.click();
        }
    }, 7000);
}

export function hide() {
    document.getElementById('overlay-match').classList.remove('active');
    clearTimeout(autoDismissTimer);
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
}

/**
 * @param {{ onContinue: () => void }} deps
 */
export function init({ onContinue }) {
    document.getElementById('btn-match-continue')
        .addEventListener('click', () => {
            hide();
            onContinue();
        });
}
