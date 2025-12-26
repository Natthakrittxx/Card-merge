// --- CONFIGURATION ---
// Note: Ensure your images are in a folder named 'assets' next to your index.html
const imageSources = [
    'assets/1.jpg', 
    'assets/2.png', 
    'assets/3.png', 
    'assets/4.jpg', 
    'assets/5.jpg', 
    'assets/6.jpeg' 
];

// --- GAME VARIABLES ---
let cardsData = [];
let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;
let matchedPairs = 0;
let timerInterval;
let timeLeft;
let isGameActive = false;

const grid = document.getElementById('grid');
const message = document.getElementById('result-message');
const resetBtn = document.querySelector('.reset-btn');
const startBtn = document.querySelector('.start-btn');
const timerDisplay = document.getElementById('timer');
const timerIcon = document.querySelector('.timer-icon');
const durationSelect = document.getElementById('duration-select');

// --- DYNAMIC DURATION LISTENER ---
// When user changes dropdown, update display immediately if game hasn't started
durationSelect.addEventListener('change', function() {
    if (!isGameActive) {
        timeLeft = parseInt(this.value);
        updateTimerDisplay();
    }
});

// --- INITIALIZATION ---
function initGame() {
    grid.innerHTML = '';
    message.textContent = '';
    resetBtn.style.display = 'none';
    startBtn.style.display = 'block';
    message.style.color = 'var(--text-color)';
    durationSelect.disabled = false; // Enable selection before start

    matchedPairs = 0;
    
    // Set time based on dropdown value
    timeLeft = parseInt(durationSelect.value);

    isGameActive = false;
    hasFlippedCard = false;
    lockBoard = false;
    firstCard = null;
    secondCard = null;

    timerDisplay.style.color = 'var(--accent-red)';
    timerIcon.style.backgroundColor = 'var(--accent-red)';

    updateTimerDisplay();

    const pairs = [...imageSources, ...imageSources];
    pairs.sort(() => 0.5 - Math.random());

    pairs.forEach((imgSrc) => {
        const card = document.createElement('div');
        card.classList.add('card-container');
        card.dataset.name = imgSrc;

        // Note: The logo path is also updated to 'assets/Logo.png'
        card.innerHTML = `
            <div class="card-inner">
                <div class="card-front">
                    <img src="assets/Logo.png" class="logo-img" alt="Fotona Logo">
                </div>
                <div class="card-back">
                    <img src="${imgSrc}" class="card-img" alt="Memory Asset">
                </div>
            </div>
        `;

        card.addEventListener('click', flipCard);
        grid.appendChild(card);
    });
}

// --- START GAME ---
function startGame() {
    startBtn.style.display = 'none';
    durationSelect.disabled = true; // Lock selection during game
    isGameActive = true;
    startTimer();
}

// --- CORE LOGIC ---
function flipCard() {
    if (!isGameActive) return;
    if (lockBoard) return;
    if (this === firstCard) return;

    this.classList.add('flipped');

    if (!hasFlippedCard) {
        hasFlippedCard = true;
        firstCard = this;
        return;
    }

    secondCard = this;
    checkForMatch();
}

function checkForMatch() {
    let isMatch = firstCard.dataset.name === secondCard.dataset.name;
    isMatch ? disableCards() : unflipCards();
}

function disableCards() {
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);
    
    firstCard.classList.add('matched');
    secondCard.classList.add('matched');

    resetBoard();
    matchedPairs++;

    if (matchedPairs === imageSources.length) {
        gameWin();
    }
}

function unflipCards() {
    lockBoard = true;
    setTimeout(() => {
        firstCard.classList.remove('flipped');
        secondCard.classList.remove('flipped');
        resetBoard();
    }, 700);
}

function resetBoard() {
    [hasFlippedCard, lockBoard] = [false, false];
    [firstCard, secondCard] = [null, null];
}

// --- TIMER ---
function startTimer() {
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        if (!isGameActive) return;
        
        timeLeft--;
        updateTimerDisplay();

        if (timeLeft <= 0) {
            gameLost();
        }
    }, 1000);
}

function updateTimerDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timerDisplay.textContent = `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

// --- END STATES ---
function gameWin() {
    isGameActive = false;
    clearInterval(timerInterval);
    durationSelect.disabled = false;
    message.textContent = 'Congratulation';
    message.style.color = 'var(--accent-red)';
    resetBtn.style.display = 'block';
    celebrate(); 
}

function gameLost() {
    isGameActive = false;
    clearInterval(timerInterval);
    durationSelect.disabled = false;
    lockBoard = true;
    message.textContent = 'Failed';
    message.style.color = 'var(--text-color)';
    timerIcon.style.backgroundColor = '#999'; // Gray out timer icon
    timerDisplay.style.color = '#999';
    resetBtn.style.display = 'block';
    document.querySelectorAll('.card-container').forEach(card => card.classList.add('flipped'));
}

function resetGame() {
    initGame();
}

// --- RED & WHITE CONFETTI ---
function celebrate() {
    const colors = ['#E30613', '#ffffff', '#E30613'];
    
    for(let i=0; i<100; i++) {
        const confetti = document.createElement('div');
        confetti.style.position = 'fixed';
        confetti.style.top = '50%';
        confetti.style.left = '50%';
        confetti.style.width = Math.random() * 8 + 4 + 'px';
        confetti.style.height = Math.random() * 8 + 4 + 'px';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.zIndex = '9999';
        confetti.style.borderRadius = '0';

        document.body.appendChild(confetti);

        const angle = Math.random() * Math.PI * 2;
        const velocity = 3 + Math.random() * 7; 
        const tx = Math.cos(angle) * velocity * 70;
        const ty = Math.sin(angle) * velocity * 70;

        confetti.animate([
            { transform: 'translate(0,0) rotate(0deg) scale(1)', opacity: 1 },
            { transform: `translate(${tx}px, ${ty}px) rotate(${Math.random()*360}deg) scale(0)`, opacity: 0 }
        ], {
            duration: 1200,
            easing: 'cubic-bezier(0.2, 0.8, 0.2, 1)'
        }).onfinish = () => confetti.remove();
    }
}

// Start the game logic (init)
initGame();