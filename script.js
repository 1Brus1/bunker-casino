// Symbol configuration
// Each symbol has a key, image path, and payout multiplier for a triple.
const SYMBOLS = [
    {
        key: "seven",
        image: "symbol-seven.png",
        multiplier: 50
    },
    {
        key: "star",
        image: "symbol-star.png",
        multiplier: 25
    },
    {
        key: "cherry",
        image: "symbol-cherry.png",
        multiplier: 10
    },
    {
        key: "bar",
        image: "symbol-bar.png",
        multiplier: 5
    },
    {
        key: "diamond",
        image: "symbol-diamond.png",
        multiplier: 5
    },
    {
        key: "lemon",
        image: "symbol-lemon.png",
        multiplier: 5
    }
];

// DOM elements
const creditsEl = document.getElementById("credits");
const creditsHeroEl = document.getElementById("credits-hero");
const messageEl = document.getElementById("message");
const spinBtn = document.getElementById("spin-btn");
const addCreditsBtn = document.getElementById("add-credits-btn");
const betAmountEl = document.getElementById("bet-amount");
const betDecreaseBtn = document.getElementById("bet-decrease");
const betIncreaseBtn = document.getElementById("bet-increase");

const reelEls = [
    document.getElementById("reel1"),
    document.getElementById("reel2"),
    document.getElementById("reel3")
];

const YEAR_EL = document.getElementById("year");

// State
let credits = 0;
let betAmount = 10;
const MIN_BET = 5;
const MAX_BET = 100;

// Init
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

function randomSymbol() {
    const index = Math.floor(Math.random() * SYMBOLS.length);
    return SYMBOLS[index];
}

function setReelSymbol(reelEl, symbol) {
    reelEl.dataset.symbol = symbol.key;
    reelEl.style.backgroundImage = `url(${symbol.image})`;
}

// Neon flicker hook (extend later if you want)
function triggerWinFlicker() {
    // You can add extra CSS class effects here if desired.
}

// Spin handling
let isSpinning = false;

function spin() {
    if (isSpinning) return;

    // Reset message
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

        const winAmount = evaluateWin(resultSymbols, betAmount);

        if (winAmount > 0) {
            credits += winAmount;
            updateCreditsDisplay();
            messageEl.textContent = `WIN +${winAmount} credits`;
            messageEl.classList.add("win");
            triggerWinFlicker();
        } else {
            messageEl.textContent = "No win. Try again.";
            messageEl.classList.add("lose");
        }

        isSpinning = false;
        spinBtn.disabled = false;
        spinBtn.textContent = "SPIN";
    }, 650);
}

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
    const boost = 500;
    credits += boost;
    updateCreditsDisplay();
    messageEl.textContent = `Added +${boost} demo credits.`;
    messageEl.className = "message win";
});

betDecreaseBtn.addEventListener("click", () => {
    betAmount = Math.max(MIN_BET, betAmount - 5);
    updateBetDisplay();
});

betIncreaseBtn.addEventListener("click", () => {
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
reelEls.forEach((reel) => {
    const symbol = randomSymbol();
    setReelSymbol(reel, symbol);
});
