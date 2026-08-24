// ============================================================
//  screens/MoodAnimo.js
//  Mini-Game: Animo — The Emotional Explorer (Ages 6-12)
// ============================================================
import { sounds } from '../utils/sounds.js';
import { state } from '../gameState.js';
import { EMOTIONS_DATA } from '../gameData.js';

/**
 * Emotion Lines: Representative phrases for each of the 8 core emotions.
 */
const EMOTION_LINES = {
    anger: [
        "This is so UNFAIR!",
        "I just want to scream and stomp my feet!",
        "I can't believe they broke my favorite toy...",
        "I'm so mad, I feel like I might explode!",
        "Why do I always have to wait my turn? It's not right!"
    ],
    sadness: [
        "I'm feeling very lonely and quiet right now...",
        "I wish I could have my old blanket back.",
        "Nobody seems to want to play with me today.",
        "It's okay to cry, I'm just feeling a bit blue.",
        "I really miss my friends so much."
    ],
    joy: [
        "That was the best day ever!",
        "Look at that beautiful sunshine, it makes me smile!",
        "I am so happy to see you, let's play!",
        "Let's jump for joy together! Everything is great!",
        "I just shared my snacks and it felt so good!"
    ],
    fear: [
        "What was that loud noise?! It was so sudden...",
        "Is someone hiding in the dark shadows?",
        "I don't like being in the dark all alone.",
        "My heart is beating so fast, I'm a bit nervous.",
        "That creepy crawly bug is moving closer!"
    ],
    trust: [
        "I feel so safe here with you.",
        "Thank you for listening to my secret and keeping it.",
        "I know you will always have my back, thank you friend.",
        "Let's share this snack together, I trust you.",
        "A warm hug makes me feel so much better."
    ],
    disgust: [
        "Eww, that smells really gross!",
        "I don't like the texture of this slimy, gooey stuff.",
        "My room is so messy and yucky, I need to clean up.",
        "Yuck! That food tastes like it has gone bad.",
        "Look at all that trash on the floor, it's icky!"
    ],
    anticipation: [
        "I can't wait for my birthday to finally come!",
        "Is it time for our big trip yet? I'm counting down!",
        "I am so excited to start school tomorrow!",
        "Look at that mystery box, I wonder what could be inside!",
        "I'm waiting for the seeds we planted to finally grow!"
    ],
    surprise: [
        "WOW! A surprise party just for me?!",
        "I didn't expect to find my lost toy here at all!",
        "Pop! That balloon gave me a sudden startle!",
        "Hahaha, what a funny and unexpected face!",
        "I found a lost treasure under the cushions! Amazing!"
    ]
};

function getAnimoFolder() {
    return state.animoId || 'dog';
}

function getAnimoMovementClass(folder) {
    const flyers = ['bee', 'bird', 'butterfly', 'owl'];
    const hoppers = ['frog', 'rabbit'];
    if (flyers.includes(folder)) {
        // Special: Baby butterfly is a caterpillar (worm), it shouldn't fly
        if (folder === 'butterfly' && animoStage === 1) return 'animo-sway';
        return 'animo-fly';
    }
    if (hoppers.includes(folder)) {
        // Special: Baby frog is a tadpole, it shouldn't hop
        if (folder === 'frog' && animoStage === 1) return 'animo-sway';
        return 'animo-hop';
    }
    return 'animo-sway';
}

let animoStage = 1; 
let currentLine = "";
let correctEmotionId = "";
let currentCopingId = ""; // Track the correct action ID
let quizMode = "emotion"; // 'emotion' or 'coping'
let gameCount = 0;

export function template() {
    const animoFolder = getAnimoFolder();
    const moveClass = getAnimoMovementClass(animoFolder);
    
    return /* html */`
    <section id="screen-mood-battery" class="screen full-animo" aria-label="Animo Care"
             style="background-image: url('/assets/animo/${animoFolder}/bg.svg'); background-size: cover; background-position: center;">
        <div id="mood-animo-screen" class="mg-container animo-mode ${moveClass}">
            <header class="mg-header">
                <button id="btn-mg-back" class="btn-icon" aria-label="Exit">
                    <i data-lucide="log-out"></i>
                </button>
                <div class="mg-header-text">
                    <h1>Animo: The Emotional Explorer</h1>
                    <p>Help your friend identify their feelings and find ways to cope!</p>
                </div>
                <div class="header-spacer"></div>
            </header>
 
            <div class="mg-garden-stage quiz-layout">
                <div class="mg-animal-column">
                    <!-- Speech Bubble -->
                    <div class="mg-speech-bubble" id="mg-speech-bubble">
                        <p id="mg-line-text">${currentLine}</p>
                    </div>

                    <div id="mg-animo-target" class="mg-animo-target stage-1 ${moveClass}">
                        <div id="mg-animo-wrap" class="mg-animo-wrap">
                            <img id="mg-animo-asset" src="/assets/animo/${animoFolder}/baby.svg" class="mg-animo-asset" alt="Your Friend">
                        </div>
                    </div>
                </div>
 
                <div class="mg-quiz-column">
                    <h2 id="quiz-question">How is your friend feeling?</h2>
                    <div class="mg-emotion-grid" id="mg-quiz-options">
                        <!-- Options injected here -->
                    </div>
                </div>
            </div>
 
            <!-- Result Overlay (Final Victory) -->
            <div id="mg-result-overlay" class="mg-overlay hidden">
                <div class="mg-modal celebration-modal">
                    <div class="mg-modal-icon">🏆</div>
                    <h2>You're a True Friend!</h2>
                    <p>You've helped your friend understand all their feelings. Watching them grow has been a wonderful journey! Keep being kind and listening with your heart.</p>
                    <button class="btn-primary" id="btn-mg-exit">Return to Map</button>
                </div>
            </div>
 
            <!-- Feedback Modal -->
             <div id="mg-feedback-overlay" class="mg-overlay hidden">
                <div class="mg-modal feedback-modal">
                    <div id="feedback-icon" class="fb-icon">😊</div>
                    <h3 id="feedback-title">Great Job!</h3>
                    <p id="feedback-desc"></p>
                    <button class="btn-primary" id="btn-next-round">Next Step</button>
                </div>
            </div>
 
            <!-- Tutorial -->
            <div id="mg-tutorial" class="mg-overlay">
                <div class="mg-modal tutorial-modal">
                    <div class="tutorial-img" id="mg-tutorial-img"></div>
                    <h3>Understanding Our Feelings</h3>
                    <p>Your friend is telling you how they feel. First, identify the emotion. Then, pick a coping way to help them grow!</p>
                    <button class="btn-primary" id="btn-mg-start">Let's Help!</button>
                </div>
            </div>
        </div>
    </section>`;
}

export function init({ navigate }) {
    const exitBtn = document.getElementById('btn-mg-exit');
    const startBtn = document.getElementById('btn-mg-start');
    const backBtn = document.getElementById('btn-mg-back');
    const nextRoundBtn = document.getElementById('btn-next-round');

    backBtn.addEventListener('click', () => navigate('emotionSelect'));
    exitBtn.addEventListener('click', () => navigate('emotionSelect'));
    
    startBtn.addEventListener('click', () => {
        sounds.click();
        document.getElementById('mg-tutorial').classList.add('hidden');
        startNewChallenge();
    });

    nextRoundBtn.addEventListener('click', () => {
        sounds.click();
        document.getElementById('mg-feedback-overlay').classList.add('hidden');
        if (animoStage >= 4) {
            document.getElementById('mg-result-overlay').classList.remove('hidden');
            sounds.victory();
        } else {
            startNewChallenge();
        }
    });
}

function startNewChallenge() {
    quizMode = "emotion";
    const emotionsIds = Object.keys(EMOTION_LINES);
    correctEmotionId = emotionsIds[Math.floor(Math.random() * emotionsIds.length)];
    
    // Pick a specific pair from EMOTIONS_DATA for this emotion
    const pairs = EMOTIONS_DATA[correctEmotionId].pairs;
    const randomPair = pairs[Math.floor(Math.random() * pairs.length)];
    
    // Set the line to the emotion's description from the pair
    currentLine = randomPair.emotion.desc || EMOTION_LINES[correctEmotionId][0];
    currentCopingId = randomPair.action.id; // Correct coping action ID
    
    document.getElementById('mg-line-text').textContent = currentLine;
    document.getElementById('mg-speech-bubble').classList.add('pop-in');
    setTimeout(() => document.getElementById('mg-speech-bubble').classList.remove('pop-in'), 500);

    renderChoices();
}

function renderChoices() {
    const grid = document.getElementById('mg-quiz-options');
    const question = document.getElementById('quiz-question');
    grid.innerHTML = "";

    if (quizMode === "emotion") {
        question.textContent = "How is your friend feeling?";
        const emotions = Object.values(EMOTIONS_DATA);
        emotions.forEach(emo => {
            const btn = document.createElement('button');
            btn.className = "btn-emotion-choice";
            btn.style.setProperty('--emo-color', emo.color);
            btn.innerHTML = `
                <div class="emo-choice-icon"><img src="${emo.icon}" alt=""></div>
                <span>${emo.name}</span>
            `;
            btn.onclick = () => handleEmotionChoice(emo.id);
            grid.appendChild(btn);
        });
    } else {
        question.textContent = "What can help them feel better?";
        const options = getCopingOptions(correctEmotionId);
        options.forEach(opt => {
            const btn = document.createElement('button');
            btn.className = "btn-emotion-choice";
            btn.style.setProperty('--emo-color', EMOTIONS_DATA[correctEmotionId].color);
            btn.innerHTML = `
                <div class="emo-choice-icon"><img src="${opt.img}" alt=""></div>
                <span>${opt.name}</span>
            `;
            btn.onclick = () => handleCopingChoice(opt.id);
            grid.appendChild(btn);
        });
    }
}

function getCopingOptions(emotionId) {
    const emotion = EMOTIONS_DATA[emotionId];
    // Use the already-stored currentCopingId as the correct one
    const correctPair = emotion.pairs.find(p => p.action.id === currentCopingId) || emotion.pairs[0];
    const correctAction = correctPair.action;

    // Others
    const otherActions = [];
    Object.keys(EMOTIONS_DATA).forEach(key => {
        if (key !== emotionId) {
            EMOTIONS_DATA[key].pairs.forEach(p => otherActions.push(p.action));
        }
    });

    const shuffledOthers = otherActions.sort(() => 0.5 - Math.random()).slice(0, 3);
    const final = [correctAction, ...shuffledOthers].sort(() => 0.5 - Math.random());
    return final;
}

function handleEmotionChoice(chosenId) {
    const overlay = document.getElementById('mg-feedback-overlay');
    const title = document.getElementById('feedback-title');
    const desc = document.getElementById('feedback-desc');
    const icon = document.getElementById('feedback-icon');

    if (chosenId === correctEmotionId) {
        sounds.match();
        quizMode = "coping";
        renderChoices();
        // No modal yet, just move to phase 2
    } else {
        animoStage = Math.max(1, animoStage - 1);
        sounds.wrong();
        
        icon.textContent = "💡";
        title.textContent = "Try Again!";
        desc.textContent = `Almost! Your friend was actually feeling ${EMOTIONS_DATA[correctEmotionId].name}. They feel a bit smaller, but don't worry, you're learning!`;
        overlay.classList.remove('hidden');
        updateAnimoUI();
    }
}

function handleCopingChoice(chosenId) {
    const overlay = document.getElementById('mg-feedback-overlay');
    const title = document.getElementById('feedback-title');
    const desc = document.getElementById('feedback-desc');
    const icon = document.getElementById('feedback-icon');

    if (chosenId === currentCopingId) {
        animoStage = Math.min(4, animoStage + 1);
        sounds.match();
        sounds.shimmer();
        
        icon.textContent = "🌟";
        title.textContent = "Perfect! They feel better!";
        
        // Find the action name for the text
        const action = EMOTIONS_DATA[correctEmotionId].pairs.find(p => p.action.id === chosenId).action;
        desc.textContent = `Yes! By choosing to '${action.name}', you've helped your friend manage their ${EMOTIONS_DATA[correctEmotionId].name}. Look how much they grew!`;
        
        triggerGrowthVFX();
    } else {
        animoStage = Math.max(1, animoStage - 1);
        sounds.wrong();
        
        // Find correct action name for feedback
        const correctAction = EMOTIONS_DATA[correctEmotionId].pairs.find(p => p.action.id === currentCopingId).action;
        
        icon.textContent = "🌊";
        title.textContent = "Keep Practicing!";
        desc.textContent = `That's a good way to help sometimes, but for ${EMOTIONS_DATA[correctEmotionId].name}, choosing to '${correctAction.name}' is what helps your friend grow. Let's try that next time!`;
    }

    overlay.classList.remove('hidden');
    updateAnimoUI();
}

export function onShow() {
    animoStage = 1;
    gameCount = 0;
    quizMode = "emotion";
    correctEmotionId = "";
    currentLine = "";
    currentCopingId = "";

    updateAnimoUI();
    document.getElementById('mg-result-overlay').classList.add('hidden');
    document.getElementById('mg-feedback-overlay').classList.add('hidden');
    document.getElementById('mg-tutorial').classList.remove('hidden');
}

function updateAnimoUI() {
    const animoFolder = getAnimoFolder();
    const asset = document.getElementById('mg-animo-asset');
    const target = document.getElementById('mg-animo-target');
    const screen = document.getElementById('screen-mood-battery');
    const container = document.getElementById('mood-animo-screen');

    let stageName = 'baby';
    if (animoStage === 2) stageName = 'teen';
    if (animoStage >= 3) stageName = 'adult';

    // 1. Force absolute paths for the character asset
    if (asset) {
        asset.src = `/assets/animo/${animoFolder}/${stageName}.svg`;
    }
    
    // 2. Update Stage & Movement on Target
    if (target) {
        const moveClass = getAnimoMovementClass(animoFolder);
        target.className = `mg-animo-target stage-${animoStage} ${moveClass}`;
    }

    // 3. Force absolute paths for the screen background
    if (screen) {
        screen.style.backgroundImage = `url('/assets/animo/${animoFolder}/bg.svg')`;
        screen.style.backgroundSize = 'cover';
        screen.style.backgroundPosition = 'center';
    }

    // 4. Update container movement class
    if (container) {
        const moveClass = getAnimoMovementClass(animoFolder);
        container.classList.remove('animo-fly', 'animo-hop', 'animo-sway');
        container.classList.add(moveClass);
    }

    // 5. Update tutorial image
    const tutImg = document.getElementById('mg-tutorial-img');
    if (tutImg) {
        tutImg.innerHTML = `<img src="/assets/animo/${animoFolder}/baby.svg" style="width: 80px; height: 80px;">`;
    }
}

function triggerGrowthVFX() {
    const asset = document.getElementById('mg-animo-asset');
    if (asset) {
        asset.classList.add('mg-animating');
        setTimeout(() => asset.classList.remove('mg-animating'), 1000);
    }
}
