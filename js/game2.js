// --- DATA --- "9"
const GAME_DATA = {
    "NightLase® Snoring Treatment": ["Loud Snoring", "Sleep Apnea", "Waking up tired"],
    "TouchWhite® Tooth Whitening": ["Yellow Teeth", "Coffee Stains", "Darkened Enamel"],
    "SWEEP® Endodontics Treatment": ["Root Canal Infection", "Deep Tooth Pain", "Nerve Inflammation"],
    "TwinLight® Periodontal Treatment": ["Bleeding Gums", "Swollen Gums", "Gum Disease"],
    "Facial Aesthetics Treatment": ["Wrinkles", "Sagging Skin", "Crow's Feet"],
    "TwinLight® Peri-implantisis": ["Removal of Bacteria Biofilm Implant"],
    "Oral Surgery": ["Wisdom Tooth Removal", "Impacted Tooth", "Bone Extraction"],
    "Desensitization": ["Sensitive to Cold Water", "Pain from Ice Cream", "Exposed Roots"],
    "Photobiomudulation and Pain Management (PBM)": ["Chronic Pain", "Muscle Soreness", "TMJ disorder"]
};

// --- STATE ---
const MAX_QUESTIONS = 5;
let score = 0;
let questionCount = 0;
let currentRound = null;
let isProcessing = false;

// --- DOM ELEMENTS ---
const scoreEl = document.getElementById('score');   
const qCountEl = document.getElementById('qCount');
const symptomEl = document.getElementById('symptom');
const buttons = document.querySelectorAll('.answer-btn');

const gameSection = document.getElementById('gameSection');
const gameOverSection = document.getElementById('gameOverSection');
const headerInfo = document.getElementById('headerInfo');
const gameRestartBtn = document.getElementById('gameRestartBtn');
const finalScoreEl = document.getElementById('finalScore');

// --- LOGIC ---

function shuffle(array) {
    return array.sort(() => Math.random() - 0.5);
}

function generateRound() {
    const apps = Object.keys(GAME_DATA);
    const correctApp = apps[Math.floor(Math.random() * apps.length)];
    const symptoms = GAME_DATA[correctApp];
    const symptom = symptoms[Math.floor(Math.random() * symptoms.length)];

    // Get 3 wrong answers
    const others = apps.filter(a => a !== correctApp);
    const shuffledOthers = shuffle(others);
    const choices = shuffle([...shuffledOthers.slice(0, 3), correctApp]);

    return { symptom, correctApp, choices };
}

function updateDisplay() {
    symptomEl.textContent = currentRound.symptom;
    qCountEl.textContent = questionCount + 1;

    buttons.forEach((btn, index) => {
        btn.textContent = currentRound.choices[index];
        btn.disabled = false;
        btn.classList.remove('correct', 'wrong');
    });
}

function endGame() {
    gameSection.classList.add('hidden');
    headerInfo.classList.add('hidden');
    gameRestartBtn.classList.add('hidden');
    gameOverSection.style.display = 'flex';
    finalScoreEl.textContent = score;
}

function resetGame() {
    score = 0;
    questionCount = 0;
    scoreEl.textContent = '0';
    
    gameOverSection.style.display = 'none';
    gameSection.classList.remove('hidden');
    headerInfo.classList.remove('hidden');
    gameRestartBtn.classList.remove('hidden');

    currentRound = generateRound();
    updateDisplay();
}

function handleAnswer(index) {
    if (isProcessing) return;
    isProcessing = true;

    const selected = currentRound.choices[index];
    const isCorrect = selected === currentRound.correctApp;

    // Find the correct button index
    const correctIndex = currentRound.choices.indexOf(currentRound.correctApp);

    // Visual Feedback
    buttons.forEach(btn => btn.disabled = true);
    if (isCorrect) {
        score++;
        scoreEl.textContent = score;
        document.body.classList.add('correct');
        buttons[index].classList.add('correct');
    } else {
        document.body.classList.add('wrong');
        buttons[index].classList.add('wrong');
        buttons[correctIndex].classList.add('correct');
    }

    // Wait, then Next Question OR End Game
    setTimeout(() => {
        document.body.classList.remove('correct', 'wrong');
        questionCount++;

        if (questionCount >= MAX_QUESTIONS) {
            endGame();
        } else {
            currentRound = generateRound();
            updateDisplay();
        }
        isProcessing = false;
    }, 500);
}

// Start the game on load
currentRound = generateRound();
updateDisplay();