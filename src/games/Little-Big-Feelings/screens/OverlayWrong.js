// ============================================================
//  screens/OverlayWrong.js — Overlay: Wrong / No Match
// ============================================================

const AUTO_DISMISS_MS = 2200;
let _dismissTimer = null;

export function template() {
    return /* html */`
    <div id="overlay-wrong" class="overlay overlay-wrong" role="alert" aria-live="assertive">
        <div class="overlay-card wrong-card">
            <div class="wrong-icon-wrapper">
                <img id="wrong-svg-icon" src="" alt="Encouraging Friend" class="wrong-img-icon">
            </div>
            <h3 id="wrong-title">Not quite yet!</h3>
            <p id="wrong-message">Those two are different, but keep looking! You've got this!</p>
            <button id="btn-wrong-continue" class="btn-secondary">Try Again!</button>
        </div>
    </div>`;
}

export function show() {
    const messages = [
        { text: "Your brain is growing with every card you flip! ✨", icon: "/assets/avatars/avatar_11.svg", title: "Keep Exploring!" },
        { text: "Let's find the partner for that card! You can do it! 🌟", icon: "/assets/avatars/avatar_12.svg", title: "Keep Looking!" },
        { text: "Every try brings you closer to a match! Great job! 🚀", icon: "/assets/avatars/avatar_10.svg", title: "Doing Great!" },
        { text: "Your heart is learning so much today! Let's keep playing! ❤️", icon: "/assets/avatars/avatar_9.svg", title: "Heart Learning!" },
        { text: "Almost! There's a perfect match waiting for you! 🌈", icon: "/assets/avatars/avatar_8.svg", title: "So Close!" }
    ];

    const random = messages[Math.floor(Math.random() * messages.length)];
    
    document.getElementById('wrong-message').textContent = random.text;
    document.getElementById('wrong-svg-icon').src = random.icon;
    document.getElementById('wrong-title').textContent = random.title;

    document.getElementById('overlay-wrong').classList.add('active');

    // Auto-dismiss after 2.5 seconds
    clearTimeout(_dismissTimer);
    _dismissTimer = setTimeout(hide, 2500);
}

export function hide() {
    clearTimeout(_dismissTimer);
    document.getElementById('overlay-wrong').classList.remove('active');
}

/**
 * @param {object} _deps  — no external deps needed; included for consistency
 */
export function init(_deps = {}) {
    document.getElementById('btn-wrong-continue')
        .addEventListener('click', hide);
}
