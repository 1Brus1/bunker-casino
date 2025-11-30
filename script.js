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
        credits = 500; // first-time starter pack
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

// Neon flicker effect on win (visual only)
function triggerWinFlicker() {
    // Add a temporary class on body or slots card if you want more effects later
}

// Spin handling
let isSpinning = false;

function spin() {
    if (isSpinning) return;

    // Clear message
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

    // Apply animation classes staggered
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
        // triple
        return bet * a.multiplier;
    }
    return 0;
}

// Event bindings
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

// Initial symbol setup (fallback if images don't load yet)
reelEls.forEach((reel) => {
    const symbol = randomSymbol();
    setReelSymbol(reel, symbol);
});

// Symbols for the reels
const symbols = ["A", "B", "C", "7", "🍒", "★"];

const creditsEl = document.getElementById("credits");
const messageEl = document.getElementById("message");
const spinBtn = document.getElementById("spin-btn");

let credits = 0;

// Load credits from localStorage
if (localStorage.getItem("bunker_slots_credits")) {
    credits = parseInt(localStorage.getItem("bunker_slots_credits"));
} else {
    credits = 500; // starting credits
}
updateCredits();

function updateCredits() {
    creditsEl.textContent = credits;
    localStorage.setItem("bunker_slots_credits", credits);
}

// Slot spin logic
spinBtn.addEventListener("click", () => {
    if (credits < 10) {
        messageEl.textContent = "Not enough credits.";
        return;
    }

    credits -= 10;
    updateCredits();
    messageEl.textContent = "";

    // Spin animation
    spinReel("reel1", 300);
    spinReel("reel2", 450);
    spinReel("reel3", 600);

    setTimeout(() => {
        const r1 = getRandomSymbol();
        const r2 = getRandomSymbol();
        const r3 = getRandomSymbol();

        document.getElementById("reel1").textContent = r1;
        document.getElementById("reel2").textContent = r2;
        document.getElementById("reel3").textContent = r3;

        checkWin(r1, r2, r3);
    }, 650);
});

function getRandomSymbol() {
    return symbols[Math.floor(Math.random() * symbols.length)];
}

function spinReel(id, duration) {
    const reel = document.getElementById(id);
    reel.style.transition = "transform " + duration + "ms ease";
    reel.style.transform = "translateY(20px)";
    setTimeout(() => {
        reel.style.transform = "translateY(0px)";
    }, duration);
}

// Win conditions
function checkWin(a, b, c) {
    if (a === b && b === c) {
        let win = 0

        if (a === "7") win = 500;
        else if (a === "★") win = 250;
        else if (a === "🍒") win = 100;
        else win = 50;

        credits += win;
        updateCredits();

        messageEl.textContent = "WIN +" + win + " credits!";
        return;
    }

    messageEl.textContent = "No win. Try again.";
}
