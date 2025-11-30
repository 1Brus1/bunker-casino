// Symbol configuration
// Each symbol has a key, image path, and payout multiplier for a triple.
const SYMBOLS = [
    { key: "seven",   image: "symbol-seven.png",   multiplier: 50 },
    { key: "star",    image: "symbol-star.png",    multiplier: 25 },
    { key: "cherry",  image: "symbol-cherry.png",  multiplier: 10 },
    { key: "bar",     image: "symbol-bar.png",     multiplier: 5  },
    { key: "diamond", image: "symbol-diamond.png", multiplier: 5  },
    { key: "lemon",   image: "symbol-lemon.png",   multiplier: 5  }
];

// DOM elements
const creditsEl        = document.getElementById("credits");
const creditsHeroEl    = document.getElementById("credits-hero");
const messageEl        = document.getElementById("message");
const spinBtn          = document.getElementById("spin-btn");
const addCreditsBtn    = document.getElementById("add-credits-btn");
const resetCreditsBtn  = document.getElementById("reset-credits-btn");
const betAmountEl      = document.getElementById("bet-amount");
const betDecreaseBtn   = document.getElementById("bet-decrease");
const betIncreaseBtn   = document.getElementById("bet-increase");
const lastWinEl        = document.getElementById("last-win");
const soundSpin  = document.getElementById("sound-spin");
const soundWin   = document.getElementById("sound-win");
const soundClick = document.getElementById("sound-click");
const reelEls = [
    document.getElementById("reel1"),
    document.getElementById("reel2"),
    document.getElementById("reel3")
];

const YEAR_EL = document.getElementById("year");

// State
let credits  = 0;
let betAmount = 10;
let lastWin   = 0;
const MIN_BET = 5;
const MAX_BET = 100;
let isSpinning = false;

// Init helpers
function loadCredits() {
    const stored = localStorage.getItem("bunker_slots_credits");
    if (stored) {
        credits = parseInt(stored, 10) || 0;
    } else {
        credits = 500; // starter pack
    }
    updateCreditsDisplay();
}

function updateCreditsDisplay() {
    creditsEl.textContent = credits;
    creditsHeroEl.textContent = credits;
    localStorage.setItem("bunker_slots_credits", credits);
}

function updateBetDisplay() {
    betAmountEl.textContent = betAmount;
}

function updateLastWinDisplay() {
    if (!lastWinEl) return;

    const sign = lastWin > 0 ? "+" : lastWin < 0 ? "−" : "";
    const absValue = Math.abs(lastWin);

    if (lastWin === 0) {
        lastWinEl.textContent = "0";
    } else {
        lastWinEl.textContent = `${sign}${absValue}`;
    }
}

function randomSymbol() {
    const index = Math.floor(Math.random() * SYMBOLS.length);
    return SYMBOLS[index];
}

function setReelSymbol(reelEl, symbol) {
    reelEl.dataset.symbol = symbol.key;
    reelEl.style.backgroundImage = `url(${symbol.image})`;
}

5function playSound(audioEl) {
    if (!audioEl) return;
    try {
        audioEl.currentTime = 0;
        audioEl.play();
    } catch (e) {
        // Ignore play errors (e.g. autoplay restrictions)
    }
}

// Neon flicker hook (extend later if you want)
function triggerWinFlicker() {
    // Add visual FX here if you want (temporary class on body/card).
}

// Spin handling
function spin() {
    if (isSpinning) return;
    playSound(soundSpin);

    messageEl.textContent = "";
    messageEl.className = "message";

    if (credits < betAmount) {
        messageEl.textContent = "Not enough credits. Add more demo credits.";
        messageEl.classList.add("error");
        return;
    }

    credits -= betAmount;
    updateCreditsDisplay();

    isSpinning = true;
    spinBtn.disabled = true;
    spinBtn.textContent = "SPINNING";

    // Apply reel animation class (staggered)
    reelEls.forEach((reel, idx) => {
        reel.classList.add("spinning");
        setTimeout(() => {
            reel.classList.remove("spinning");
        }, 350 + idx * 140);
    });

    // Finish spin and determine outcome
    setTimeout(() => {
        const resultSymbols = reelEls.map((reel) => {
            const symbol = randomSymbol();
            setReelSymbol(reel, symbol);
            return symbol;
        });

        if (winAmount > 0) {
    credits += winAmount;
    updateCreditsDisplay();

    lastWin = winAmount;
    updateLastWinDisplay();

    messageEl.textContent = `WIN +${winAmount} credits`;
    messageEl.classList.add("win");
    triggerWinFlicker();
    playSound(soundWin);
} else {
    lastWin = -betAmount;
    updateLastWinDisplay();

    messageEl.textContent = "No win. Try again.";
    messageEl.classList.add("lose");
            
        
function evaluateWin(symbols, bet) {
    const [a, b, c] = symbols;
    if (a.key === b.key && b.key === c.key) {
        return bet * a.multiplier;
    }
    return 0;
}

// Events
spinBtn.addEventListener("click", spin);

addCreditsBtn.addEventListener("click", () => {
    playSound(soundClick);

    const boost = 500;
    ...
});

    lastWin = boost;
    updateLastWinDisplay();

    messageEl.textContent = `Added +${boost} demo credits.`;
    messageEl.className = "message win";
});

    resetCreditsBtn.addEventListener("click", () => {
    playSound(soundClick);
    const confirmReset = window.confirm(
        "Reset your BUNKER Casino progress? This will set credits back to 500 and clear history."
    );
    if (!confirmReset) return;

    ...
});
    credits = 500;
    lastWin = 0;
    localStorage.removeItem("bunker_slots_credits");
    updateCreditsDisplay();
    updateLastWinDisplay();

    messageEl.textContent = "Progress reset. Back to 500 credits.";
    messageEl.className = "message";
});

betDecreaseBtn.addEventListener("click", () => {
    playSound(soundClick);
    betAmount = Math.max(MIN_BET, betAmount - 5);
    updateBetDisplay();
});

betIncreaseBtn.addEventListener("click", () => {
    playSound(soundClick);
    betAmount = Math.min(MAX_BET, betAmount + 5);
    updateBetDisplay();
});

// Footer year
if (YEAR_EL) {
    YEAR_EL.textContent = new Date().getFullYear();
}

// Initial render
loadCredits();
updateBetDisplay();
updateLastWinDisplay();
reelEls.forEach((reel) => {
    const symbol = randomSymbol();
    setReelSymbol(reel, symbol);
});
