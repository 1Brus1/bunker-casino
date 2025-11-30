// Symbol configuration for slots
const SYMBOLS = [
    { key: "seven",   image: "symbol-seven.png",   multiplier: 50 },
    { key: "star",    image: "symbol-star.png",    multiplier: 25 },
    { key: "cherry",  image: "symbol-cherry.png",  multiplier: 10 },
    { key: "bar",     image: "symbol-bar.png",     multiplier: 5  },
    { key: "diamond", image: "symbol-diamond.png", multiplier: 5  },
    { key: "lemon",   image: "symbol-lemon.png",   multiplier: 5  }
];

// DOM elements – credits & common
const creditsEl        = document.getElementById("credits");
const creditsHeroEl    = document.getElementById("credits-hero");
const bjCreditsMirror  = document.getElementById("bj-credits-mirror");
const rouCreditsMirror = document.getElementById("rou-credits-mirror");
const messageEl        = document.getElementById("message");
const spinBtn          = document.getElementById("spin-btn");
const addCreditsBtn    = document.getElementById("add-credits-btn");
const resetCreditsBtn  = document.getElementById("reset-credits-btn");
const betAmountEl      = document.getElementById("bet-amount");
const betDecreaseBtn   = document.getElementById("bet-decrease");
const betIncreaseBtn   = document.getElementById("bet-increase");
const lastWinEl        = document.getElementById("last-win");

const reelEls = [
    document.getElementById("reel1"),
    document.getElementById("reel2"),
    document.getElementById("reel3")
];

const YEAR_EL = document.getElementById("year");

// Blackjack DOM
const bjDealerHandEl   = document.getElementById("bj-dealer-hand");
const bjPlayerHandEl   = document.getElementById("bj-player-hand");
const bjDealerScoreEl  = document.getElementById("bj-dealer-score");
const bjPlayerScoreEl  = document.getElementById("bj-player-score");
const bjMessageEl      = document.getElementById("bj-message");
const bjBetAmountEl    = document.getElementById("bj-bet-amount");
const bjBetDecreaseBtn = document.getElementById("bj-bet-decrease");
const bjBetIncreaseBtn = document.getElementById("bj-bet-increase");
const bjDealBtn        = document.getElementById("bj-deal-btn");
const bjHitBtn         = document.getElementById("bj-hit-btn");
const bjStandBtn       = document.getElementById("bj-stand-btn");

// Roulette DOM
const rouBetAmountEl    = document.getElementById("rou-bet-amount");
const rouBetDecreaseBtn = document.getElementById("rou-bet-decrease");
const rouBetIncreaseBtn = document.getElementById("rou-bet-increase");
const rouSpinBtn        = document.getElementById("rou-spin-btn");
const rouMessageEl      = document.getElementById("rou-message");
const rouLastResultEl   = document.getElementById("rou-last-result");
const rouColorRedBtn    = document.getElementById("rou-color-red");
const rouColorBlackBtn  = document.getElementById("rou-color-black");
const rouColorGreenBtn  = document.getElementById("rou-color-green");
const rouletteWheelEl   = document.getElementById("roulette-wheel");

// Stats DOM
const statTotalSpinsEl     = document.getElementById("stat-total-spins");
const statTotalBjHandsEl   = document.getElementById("stat-total-bj-hands");
const statTotalBjWinsEl    = document.getElementById("stat-total-bj-wins");
const statTotalRouSpinsEl  = document.getElementById("stat-total-rou-spins");
const statTotalRouWinsEl   = document.getElementById("stat-total-rou-wins");
const statBiggestWinEl     = document.getElementById("stat-biggest-win");
const statSessionNetEl     = document.getElementById("stat-session-net");

// Audio elements
const soundSpin  = document.getElementById("sound-spin");
const soundWin   = document.getElementById("sound-win");
const soundClick = document.getElementById("sound-click");

// Shared credits state
let credits   = 0;
let betAmount = 10;
let lastWin   = 0;
const MIN_BET = 5;
const MAX_BET = 100;
let isSpinning = false;

// Blackjack state
let bjBetAmount  = 10;
let bjDeck       = [];
let bjPlayerHand = [];
let bjDealerHand = [];
let bjInRound    = false;
let bjCurrentBet = 0;

// Roulette state
let rouBetAmount    = 10;
let rouSelectedColor = "red"; // "red" | "black" | "green"
let rouIsSpinning   = false;

// Stats state
let stats = {
    totalSpins: 0,
    totalBjHands: 0,
    totalBjWins: 0,
    totalRouSpins: 0,
    totalRouWins: 0,
    biggestWin: 0
};

let sessionStartCredits = 0;

// Helpers: credits & stats
function loadCredits() {
    const stored = localStorage.getItem("bunker_slots_credits");
    if (stored) {
        credits = parseInt(stored, 10) || 0;
    } else {
        credits = 500;
    }
    updateCreditsDisplay();
}

function updateCreditsDisplay() {
    creditsEl.textContent = credits;
    creditsHeroEl.textContent = credits;
    if (bjCreditsMirror)  bjCreditsMirror.textContent  = credits;
    if (rouCreditsMirror) rouCreditsMirror.textContent = credits;

    localStorage.setItem("bunker_slots_credits", credits);
    updateSessionNetDisplay();
}

function loadStats() {
    const stored = localStorage.getItem("bunker_stats_v1");
    if (stored) {
        try {
            const parsed = JSON.parse(stored);
            stats = {
                totalSpins:    parsed.totalSpins    || 0,
                totalBjHands:  parsed.totalBjHands || 0,
                totalBjWins:   parsed.totalBjWins  || 0,
                totalRouSpins: parsed.totalRouSpins || 0,
                totalRouWins:  parsed.totalRouWins  || 0,
                biggestWin:    parsed.biggestWin   || 0
            };
        } catch (e) {
            stats = {
                totalSpins: 0,
                totalBjHands: 0,
                totalBjWins: 0,
                totalRouSpins: 0,
                totalRouWins: 0,
                biggestWin: 0
            };
        }
    }
    updateStatsDisplay();
}

function saveStats() {
    localStorage.setItem("bunker_stats_v1", JSON.stringify(stats));
}

function updateStatsDisplay() {
    if (statTotalSpinsEl)    statTotalSpinsEl.textContent    = stats.totalSpins;
    if (statTotalBjHandsEl)  statTotalBjHandsEl.textContent  = stats.totalBjHands;
    if (statTotalBjWinsEl)   statTotalBjWinsEl.textContent   = stats.totalBjWins;
    if (statTotalRouSpinsEl) statTotalRouSpinsEl.textContent = stats.totalRouSpins;
    if (statTotalRouWinsEl)  statTotalRouWinsEl.textContent  = stats.totalRouWins;
    if (statBiggestWinEl)    statBiggestWinEl.textContent    = stats.biggestWin;
}

function bumpBiggestWin(winAmount) {
    if (winAmount > stats.biggestWin) {
        stats.biggestWin = winAmount;
    }
}

function updateSessionNetDisplay() {
    if (!statSessionNetEl) return;
    const net = credits - sessionStartCredits;
    statSessionNetEl.textContent = net;

    statSessionNetEl.classList.remove(
        "stats-session-positive",
        "stats-session-negative"
    );

    if (net > 0) {
        statSessionNetEl.classList.add("stats-session-positive");
    } else if (net < 0) {
        statSessionNetEl.classList.add("stats-session-negative");
    }
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

// Slots helpers
function randomSymbol() {
    const index = Math.floor(Math.random() * SYMBOLS.length);
    return SYMBOLS[index];
}

function setReelSymbol(reelEl, symbol) {
    reelEl.dataset.symbol = symbol.key;
    reelEl.style.backgroundImage = `url(${symbol.image})`;
}

function triggerWinFlicker() {
    // hook for future FX
}

function playSound(audioEl) {
    if (!audioEl) return;
    try {
        audioEl.currentTime = 0;
        audioEl.play();
    } catch (e) {
        // ignore autoplay errors
    }
}

// SLOTS: spin logic
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

    reelEls.forEach((reel, idx) => {
        reel.classList.add("spinning");
        setTimeout(() => {
            reel.classList.remove("spinning");
        }, 350 + idx * 140);
    });

    setTimeout(() => {
        const resultSymbols = reelEls.map((reel) => {
            const symbol = randomSymbol();
            setReelSymbol(reel, symbol);
            return symbol;
        });

        const winAmount = evaluateWin(resultSymbols, betAmount);

        stats.totalSpins += 1;

        if (winAmount > 0) {
            credits += winAmount;
            updateCreditsDisplay();

            lastWin = winAmount;
            bumpBiggestWin(winAmount);
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
        }

        saveStats();
        updateStatsDisplay();

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

// BLACKJACK: deck + scoring
function createDeck() {
    const suits = ["♠", "♥", "♦", "♣"];
    const ranks = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
    const deck = [];
    for (let s of suits) {
        for (let r of ranks) {
            deck.push({ rank: r, suit: s });
        }
    }
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    return deck;
}

function cardValue(card) {
    if (card.rank === "A") return 11;
    if (["J", "Q", "K"].includes(card.rank)) return 10;
    return parseInt(card.rank, 10);
}

function handValue(hand) {
    let total = 0;
    let aces = 0;
    for (let card of hand) {
        total += cardValue(card);
        if (card.rank === "A") aces++;
    }
    while (total > 21 && aces > 0) {
        total -= 10;
        aces--;
    }
    return total;
}

function renderHand(hand, containerEl, hideFirstCard) {
    containerEl.innerHTML = "";
    hand.forEach((card, index) => {
        const cardDiv = document.createElement("div");
        cardDiv.classList.add("bj-card");
        const isRed = card.suit === "♥" || card.suit === "♦";
        if (isRed) cardDiv.classList.add("red");

        if (hideFirstCard && index === 0) {
            cardDiv.classList.add("hidden");
            cardDiv.textContent = "??";
        } else {
            cardDiv.textContent = card.rank + card.suit;
        }
        containerEl.appendChild(cardDiv);
    });
}

function resetBlackjackUI() {
    bjDealerHandEl.innerHTML = "";
    bjPlayerHandEl.innerHTML = "";
    bjDealerScoreEl.textContent = "";
    bjPlayerScoreEl.textContent = "";
    bjMessageEl.textContent = "";
    bjMessageEl.className = "bj-message";
}

// BLACKJACK: round flow
function startBlackjackRound() {
    if (bjInRound) return;

    playSound(soundClick);
    resetBlackjackUI();

    if (credits < bjBetAmount) {
        bjMessageEl.textContent = "Not enough credits for this bet.";
        bjMessageEl.classList.add("lose");
        return;
    }

    credits -= bjBetAmount;
    bjCurrentBet = bjBetAmount;
    updateCreditsDisplay();

    bjDeck = createDeck();
    bjPlayerHand = [];
    bjDealerHand = [];
    bjInRound = true;

    bjPlayerHand.push(bjDeck.pop());
    bjDealerHand.push(bjDeck.pop());
    bjPlayerHand.push(bjDeck.pop());
    bjDealerHand.push(bjDeck.pop());

    const playerVal = handValue(bjPlayerHand);

    renderHand(bjDealerHand, bjDealerHandEl, true);
    renderHand(bjPlayerHand, bjPlayerHandEl, false);
    bjPlayerScoreEl.textContent = playerVal;
    bjDealerScoreEl.textContent = "";

    bjDealBtn.disabled = true;
    bjHitBtn.disabled = false;
    bjStandBtn.disabled = false;

    if (playerVal === 21) {
        finishBlackjackRound(true, false);
    }
}

function hitBlackjack() {
    if (!bjInRound) return;

    playSound(soundClick);

    bjPlayerHand.push(bjDeck.pop());
    const playerVal = handValue(bjPlayerHand);

    renderHand(bjDealerHand, bjDealerHandEl, true);
    renderHand(bjPlayerHand, bjPlayerHandEl, false);
    bjPlayerScoreEl.textContent = playerVal;

    if (playerVal > 21) {
        finishBlackjackRound(false, true);
    }
}

function standBlackjack() {
    if (!bjInRound) return;

    playSound(soundClick);

    renderHand(bjDealerHand, bjDealerHandEl, false);
    let dealerVal = handValue(bjDealerHand);
    while (dealerVal < 17) {
        bjDealerHand.push(bjDeck.pop());
        dealerVal = handValue(bjDealerHand);
    }
    renderHand(bjDealerHand, bjDealerHandEl, false);
    bjDealerScoreEl.textContent = dealerVal;

    finishBlackjackRound(false, false);
}

function finishBlackjackRound(fromBlackjack, playerBusted) {
    const playerVal = handValue(bjPlayerHand);
    const dealerVal = handValue(bjDealerHand);

    renderHand(bjDealerHand, bjDealerHandEl, false);
    bjDealerScoreEl.textContent = dealerVal;
    bjPlayerScoreEl.textContent = playerVal;

    let outcome = "";
    let payout = 0;

    if (playerBusted) {
        outcome = "lose";
        payout = 0;
    } else if (fromBlackjack && playerVal === 21) {
        payout = Math.round(bjCurrentBet * 2.5);
        outcome = "blackjack";
    } else if (dealerVal > 21) {
        payout = bjCurrentBet * 2;
        outcome = "win";
    } else if (playerVal > dealerVal) {
        payout = bjCurrentBet * 2;
        outcome = "win";
    } else if (playerVal < dealerVal) {
        payout = 0;
        outcome = "lose";
    } else {
        payout = bjCurrentBet;
        outcome = "push";
    }

    stats.totalBjHands += 1;

    if (payout > 0) {
        if (outcome === "blackjack" || outcome === "win") {
            stats.totalBjWins += 1;
            bumpBiggestWin(payout);
        }

        credits += payout;
        updateCreditsDisplay();
    }

    if (outcome === "blackjack" || outcome === "win") {
        bjMessageEl.textContent =
            outcome === "blackjack"
                ? `Blackjack! Payout +${payout} credits`
                : `You win! Payout +${payout} credits`;
        bjMessageEl.classList.add("win");
        playSound(soundWin);
    } else if (outcome === "push") {
        bjMessageEl.textContent = "Push. Bet returned.";
        bjMessageEl.classList.add("push");
    } else {
        bjMessageEl.textContent = "Dealer wins.";
        bjMessageEl.classList.add("lose");
    }

    saveStats();
    updateStatsDisplay();

    bjInRound = false;
    bjDealBtn.disabled = false;
    bjHitBtn.disabled = true;
    bjStandBtn.disabled = true;
}

// Roulette helpers
function setRouletteColor(color) {
    rouSelectedColor = color;

    [rouColorRedBtn, rouColorBlackBtn, rouColorGreenBtn].forEach((btn) => {
        if (!btn) return;
        btn.classList.remove("active");
    });

    if (color === "red" && rouColorRedBtn) rouColorRedBtn.classList.add("active");
    if (color === "black" && rouColorBlackBtn) rouColorBlackBtn.classList.add("active");
    if (color === "green" && rouColorGreenBtn) rouColorGreenBtn.classList.add("active");
}

// European roulette color rules (0–36)
function randomRouletteResult() {
    const n = Math.floor(Math.random() * 37); // 0-36
    let color;

    if (n === 0) {
        color = "green";
    } else {
        const inFirstOrSecondDozen =
            (n >= 1 && n <= 10) || (n >= 19 && n <= 28);
        const isOdd = n % 2 === 1;

        if (inFirstOrSecondDozen) {
            color = isOdd ? "red" : "black";
        } else {
            color = isOdd ? "black" : "red";
        }
    }

    return { number: n, color };
}

function evaluateRouletteWin(result, bet, selectedColor) {
    if (result.color !== selectedColor) {
        return { winAmount: 0 };
    }

    let multiplier;
    if (selectedColor === "green") {
        multiplier = 14; // rare, higher payout
    } else {
        multiplier = 2; // red / black
    }

    const payout = bet * multiplier;
    return { winAmount: payout };
}

function spinRoulette() {
    if (rouIsSpinning) return;

    rouMessageEl.textContent = "";
    rouMessageEl.className = "roulette-message";

    if (credits < rouBetAmount) {
        rouMessageEl.textContent = "Not enough credits. Add more demo credits.";
        rouMessageEl.classList.add("lose");
        return;
    }

    playSound(soundSpin);

    credits -= rouBetAmount;
    updateCreditsDisplay();

    stats.totalRouSpins += 1;

    rouIsSpinning = true;
    rouSpinBtn.disabled = true;
    if (rouletteWheelEl) {
        rouletteWheelEl.classList.add("spinning");
    }

    setTimeout(() => {
        const result = randomRouletteResult();
        const { winAmount } = evaluateRouletteWin(result, rouBetAmount, rouSelectedColor);

        rouLastResultEl.textContent = `${result.number} ${result.color.toUpperCase()}`;

        if (winAmount > 0) {
            credits += winAmount;
            updateCreditsDisplay();

            stats.totalRouWins += 1;
            bumpBiggestWin(winAmount);

            rouMessageEl.textContent = `You win +${winAmount} credits`;
            rouMessageEl.classList.add("win");
            playSound(soundWin);
        } else {
            rouMessageEl.textContent = "No win. Try again.";
            rouMessageEl.classList.add("lose");
        }

        saveStats();
        updateStatsDisplay();

        rouIsSpinning = false;
        rouSpinBtn.disabled = false;
        if (rouletteWheelEl) {
            rouletteWheelEl.classList.remove("spinning");
        }
    }, 900);
}

// Events – Slots
spinBtn.addEventListener("click", spin);

addCreditsBtn.addEventListener("click", () => {
    playSound(soundClick);

    const boost = 500;
    credits += boost;
    updateCreditsDisplay();

    lastWin = boost;
    updateLastWinDisplay();

    messageEl.textContent = `Added +${boost} demo credits.`;
    messageEl.className = "message win";
});

resetCreditsBtn.addEventListener("click", () => {
    playSound(soundClick);

    const confirmReset = window.confirm(
        "Reset your BUNKER Casino progress? This will set credits back to 500 and clear history (including stats)."
    );
    if (!confirmReset) return;

    credits = 500;
    lastWin = 0;
    stats = {
        totalSpins: 0,
        totalBjHands: 0,
        totalBjWins: 0,
        totalRouSpins: 0,
        totalRouWins: 0,
        biggestWin: 0
    };
    localStorage.removeItem("bunker_slots_credits");
    localStorage.removeItem("bunker_stats_v1");

    sessionStartCredits = credits;
    updateCreditsDisplay();
    updateLastWinDisplay();
    updateStatsDisplay();
    updateSessionNetDisplay();

    messageEl.textContent = "Progress reset. Back to 500 credits.";
    messageEl.className = "message";
});

betDecreaseBtn.addEventListener("click", () => {
    betAmount = Math.max(MIN_BET, betAmount - 5);
    updateBetDisplay();
});

betIncreaseBtn.addEventListener("click", () => {
    betAmount = Math.min(MAX_BET, betAmount + 5);
    updateBetDisplay();
});

// Events – Blackjack
bjBetDecreaseBtn.addEventListener("click", () => {
    bjBetAmount = Math.max(MIN_BET, bjBetAmount - 5);
    bjBetAmountEl.textContent = bjBetAmount;
});

bjBetIncreaseBtn.addEventListener("click", () => {
    bjBetAmount = Math.min(MAX_BET, bjBetAmount + 5);
    b
