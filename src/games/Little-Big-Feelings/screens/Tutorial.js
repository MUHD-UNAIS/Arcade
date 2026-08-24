// ============================================================
//  screens/Tutorial.js — Screen 3: How to Play
// ============================================================
import { sounds } from '../utils/sounds.js';

export function template() {
    return /* html */`
    <section id="screen-tutorial" class="screen" aria-label="How to Play">
        <div class="tutorial-container">
            <header class="tutorial-header">
                <button id="btn-tutorial-back" class="btn-icon back-arrow" aria-label="Go back to level select" type="button">
                    <i data-lucide="arrow-left"></i>
                </button>
                <div class="tutorial-titles">
                    <h2 class="premium-title">How to Play</h2>
                </div>
            </header>

            <div class="tutorial-grid">
                <div class="tutorial-step" data-step="1">
                    <div class="step-num-badge">1</div>
                    <div class="step-icon-wrap">
                        <i data-lucide="help-circle" class="icon-blue"></i>
                    </div>
                    <p>Flip a card to reveal an <span class="highlight-blue">Emotion</span> — like Anger, Sadness, or Anxiety.</p>
                </div>

                <div class="tutorial-step" data-step="2">
                    <div class="step-num-badge">2</div>
                    <div class="step-icon-wrap">
                        <i data-lucide="layers" class="icon-pink"></i>
                    </div>
                    <p>Find its matching <span class="highlight-pink">Coping Action</span> — a healthy tool to handle that feeling!</p>
                </div>

                <div class="tutorial-step" data-step="3">
                    <div class="step-num-badge">3</div>
                    <div class="step-icon-wrap">
                        <i data-lucide="star" class="icon-yellow"></i>
                    </div>
                    <p>Match them all to earn <span class="highlight-yellow">Stars</span> and discover your emotional toolkit!</p>
                </div>
            </div>

            <div class="tutorial-footer">
                <button id="btn-tutorial-ok" class="btn-primary">Got it! Let's Play!</button>
            </div>
        </div>
    </section>`;
}

/**
 * @param {{ navigate: (screen: string) => void, startGame: () => void }} deps
 */
export function init({ navigate, startGame }) {
    const okBtn = document.getElementById('btn-tutorial-ok');
    const backBtn = document.getElementById('btn-tutorial-back');

    if (okBtn) {
        okBtn.addEventListener('mouseenter', () => sounds.hover());
        okBtn.addEventListener('click', () => {
            sounds.click();
            navigate('game');
            startGame();
        });
    }

    if (backBtn) {
        backBtn.addEventListener('mouseenter', () => sounds.hover());
        backBtn.addEventListener('click', () => {
            sounds.click();
            navigate('levelSelect');
        });
    }

    // Add hover sounds to steps
    document.querySelectorAll('.tutorial-step').forEach(step => {
        step.addEventListener('mouseenter', () => sounds.hover());
    });
}
