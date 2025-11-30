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
const rouHistoryListEl  = document.getElementById("rou-history-list");

// Stats DOM
const statTotalSpinsEl     = document.getElementById("stat-total-spins");
const statTotalBjHandsEl   = document.getElementById("stat-total-bj-hands");
const statTotalBjWinsEl    = document.getElementById("stat-total-bj-wins");
const statTotalRouSpinsEl  = document.getElementById("stat-total-rou-spins");
const statTotalRouWinsEl   = document.getElementById("stat-total-rou-wins");
const statBiggestWinEl     = document.getElementById("stat-biggest-win");
const statSessionNetEl     = document.getElementById("stat-session-net");

// History DOM
const historyListEl  = document.getElementById("history-list");
const historyEmptyEl = document.getElementById("history-empty");

// Settings DOM
const settingsBtn        = document.getElementById("settings-btn");
const settingsOverlay    = document.getElementById("settings-overlay");
const settingsCloseBtn   = document.getElementById("settings-close-btn");
const settingSoundToggle = document.getElementById("setting-sound-toggle");
const settingFastToggle  = document.getElementById("setting-fast-toggle");

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
let rouHistory      = [];
const MAX_ROU_HISTORY = 12;

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

// Settings state
let settings = {
    soundOn: true,
    fastMode: false
};

// History state
const HISTORY_KEY = "bunker_history_v1";
const MAX_HISTORY = 20;
let historyEntries = [];

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
    if (creditsEl)        creditsEl.textContent = credits;
    if (creditsHeroEl)    creditsHeroEl.textContent = credits;
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
    if (betAmountEl) betAmountEl.textContent = betAmount;
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

// History helpers
function loadHistory() {
    const stored = localStorage.getItem(HISTORY_KEY);
    if (stored) {
        try {
            const parsed = JSON.parse(stored);
            if (Array.isArray(parsed)) {
                historyEntries = parsed;
            }
        } catch (e) {
            historyEntries = [];
        }
    }
    renderHistory();
}

function saveHistory() {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(historyEntries));
}

function addHistoryEntry(game, detail, net) {
    const entry = {
        id: Date.now().toString(36) + Math.random().toString(16).slice(2),
        ts: Date.now(),
        game,
        detail,
        net
    };
    historyEntries.unshift(entry);
    if (historyEntries.length > MAX_HISTORY) {
        historyEntries = historyEntries.slice(0, MAX_HISTORY);
    }
    saveHistory();
    renderHistory();
}

function renderHistory() {
    if (!historyListEl || !historyEmptyEl) return;

    historyListEl.innerHTML = "";

    if (historyEntries.length === 0) {
        historyEmptyEl.style.display = "block";
        historyListEl.style.display = "none";
        return;
    }

    historyEmptyEl.style.display = "none";
    historyListEl.style.display = "block";

    historyEntries.forEach((entry) => {
        const li = document.createElement("li");
        li.className = "history-item";

        const left = document.createElement("div");
        left.className = "history-main";
        left.textContent = `${entry.game} · ${entry.detail}`;

        const right = document.createElement("div");
        right.className = "history-net";
        if (entry.net > 0) {
            right.textContent = `+${entry.net}`;
            right.classList.add("history-net-positive");
        } else if (entry.net < 0) {
            right.textContent = `${entry.net}`;
            right.classList.add("history-net-negative");
        } else {
            right.textContent = "0";
        }

        li.appendChild(left);
        li.appendChild(right);
        historyListEl.appendChild(li);
    });
}

// Settings helpers
function loadSettings() {
    const stored = localStorage.getItem("bunker_settings_v1");
    if (stored) {
        try {
            const parsed = JSON.parse(stored);
            settings.soundOn = parsed.soundOn !== false; // default true
            settings.fastMode = !!parsed.fastMode;
        } catch (e) {
            settings = { soundOn: true, fastMode: false };
        }
    }
    applySettingsToUI();
}

function saveSettings() {
    localStorage.setItem("bunker_settings_v1", JSON.stringify(settings));
}

function applySettingsToUI() {
    if (settingSoundToggle) {
        settingSoundToggle.classList.toggle("toggle-on", settings.soundOn);
    }
    if (settingFastToggle) {
        settingFastToggle.classList.toggle("toggle-on", settings.fastMode);
    }
}

function openSettings() {
    if (!settingsOverlay) return;
    settingsOverlay.classList.add("open");
}

function closeSettings() {
    if (!settingsOverlay) return;
    settingsOverlay.classList.remove("open");
}

// Timing helpers
function getSlotSpinDuration() {
    return settings.fastMode ? 350 : 650;
}

function getRouletteSpinDuration() {
    return settings.fastMode ? 500 : 900;
}

// Slots helpers
function randomSymbol() {
    const index = Math.floor(Math.random() * SYMBOLS.length);
    return SYMBOLS[index];
}

function setReelSymbol(reelEl, symbol) {
    if (!reelEl || !symbol) return;
    reelEl.dataset.symbol = symbol.key;
    reelEl.style.backgroundImage = `url(${symbol.image})`;
}

function triggerWinFlicker() {
    // hook for future FX
}

function playSound(audioEl) {
    if (!audioEl || !settings.soundOn) return;
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

    if (messageEl) {
        messageEl.textContent = "";
        messageEl.className = "message";
    }

    if (credits < betAmount) {
        if (messageEl) {
            messageEl.textContent = "Not enough credits. Add more demo credits.";
            messageEl.classList.add("error");
        }
        return;
    }

    credits -= betAmount;
    updateCreditsDisplay();

    isSpinning = true;
    if (spinBtn) {
        spinBtn.disabled = true;
        spinBtn.textContent = "SPINNING";
    }

    reelEls.forEach((reel, idx) => {
        if (!reel) return;
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
        const net = winAmount - betAmount;

        stats.totalSpins += 1;

        if (winAmount > 0) {
            credits += winAmount;
            updateCreditsDisplay();

            lastWin = winAmount;
            bumpBiggestWin(winAmount);
            updateLastWinDisplay();

            if (messageEl) {
                messageEl.textContent = `WIN +${winAmount} credits`;
                messageEl.classList.add("win");
            }
            triggerWinFlicker();
            playSound(soundWin);

            addHistoryEntry(
                "Slots",
                `bet ${betAmount} → +${net} (win ${winAmount})`,
                net
            );
        } else {
            lastWin = -betAmount;
            updateLastWinDisplay();

            if (messageEl) {
                messageEl.textContent = "No win. Try again.";
                messageEl.classList.add("lose");
            }

            addHistoryEntry(
                "Slots",
                `bet ${betAmount} → -${betAmount} (no win)`,
                -betAmount
            );
        }

        saveStats();
        updateStatsDisplay();

        isSpinning = false;
        if (spinBtn) {
            spinBtn.disabled = false;
            spinBtn.textContent = "SPIN";
        }
    }, getSlotSpinDuration());
}

function evaluateWin(symbols, bet) {
    const [a, b, c] = symbols;
    if (a && b && c && a.key === b.key && b.key === c.key) {
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
    if (!containerEl) return;
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
    if (bjDealerHandEl) bjDealerHandEl.innerHTML = "";
    if (bjPlayerHandEl) bjPlayerHandEl.innerHTML = "";
    if (bjDealerScoreEl) bjDealerScoreEl.textContent = "";
    if (bjPlayerScoreEl) bjPlayerScoreEl.textContent = "";
    if (bjMessageEl) {
        bjMessageEl.textContent = "";
        bjMessageEl.className = "bj-message";
    }
}

// BLACKJACK: round flow
function startBlackjackRound() {
    if (bjInRound) return;

    playSound(soundClick);
    resetBlackjackUI();

    if (credits < bjBetAmount) {
        if (bjMessageEl) {
            bjMessageEl.textContent = "Not enough credits for this bet.";
            bjMessageEl.classList.add("lose");
        }
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
    if (bjPlayerScoreEl) bjPlayerScoreEl.textContent = playerVal;
    if (bjDealerScoreEl) bjDealerScoreEl.textContent = "";

    if (bjDealBtn) bjDealBtn.disabled = true;
    if (bjHitBtn) bjHitBtn.disabled = false;
    if (bjStandBtn) bjStandBtn.disabled = false;

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
    if (bjPlayerScoreEl) bjPlayerScoreEl.textContent = playerVal;

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
    if (bjDealerScoreEl) bjDealerScoreEl.textContent = dealerVal;

    finishBlackjackRound(false, false);
}

function finishBlackjackRound(fromBlackjack, playerBusted) {
    const playerVal = handValue(bjPlayerHand);
    const dealerVal = handValue(bjDealerHand);

    renderHand(bjDealerHand, bjDealerHandEl, false);
    if (bjDealerScoreEl) bjDealerScoreEl.textContent = dealerVal;
    if (bjPlayerScoreEl) bjPlayerScoreEl.textContent = playerVal;

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

    const net = payout - bjCurrentBet;

    if (payout > 0) {
        if (outcome === "blackjack" || outcome === "win") {
            stats.totalBjWins += 1;
            bumpBiggestWin(payout);
        }

        credits += payout;
        updateCreditsDisplay();
    }

    if (bjMessageEl) {
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
    }

    // History entry
    let detail;
    if (outcome === "blackjack") {
        detail = `bet ${bjCurrentBet} → +${net} (blackjack, payout ${payout})`;
    } else if (outcome === "win") {
        detail = `bet ${bjCurrentBet} → +${net} (win, payout ${payout})`;
    } else if (outcome === "push") {
        detail = `bet ${bjCurrentBet} → 0 (push)`;
    } else {
        detail = `bet ${bjCurrentBet} → -${bjCurrentBet} (dealer wins)`;
    }
    addHistoryEntry("Blackjack", detail, net);

    saveStats();
    updateStatsDisplay();

    bjInRound = false;
    if (bjDealBtn) bjDealBtn.disabled = false;
    if (bjHitBtn) bjHitBtn.disabled = true;
    if (bjStandBtn) bjStandBtn.disabled = true;
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

// Roulette history (ball history)
function addRouletteHistoryEntry(result) {
    rouHistory.unshift(result);
    if (rouHistory.length > MAX_ROU_HISTORY) {
        rouHistory = rouHistory.slice(0, MAX_ROU_HISTORY);
    }
    renderRouletteHistory();
}

function renderRouletteHistory() {
    if (!rouHistoryListEl) return;
    rouHistoryListEl.innerHTML = "";

    rouHistory.forEach((entry) => {
        const chip = document.createElement("div");
        chip.className = "roulette-history-chip";

        if (entry.color === "red") {
            chip.classList.add("roulette-history-red");
        } else if (entry.color === "black") {
            chip.classList.add("roulette-history-black");
        } else {
            chip.classList.add("roulette-history-green");
        }

        chip.textContent = entry.number;
        rouHistoryListEl.appendChild(chip);
    });
}

function spinRoulette() {
    if (rouIsSpinning) return;

    if (rouMessageEl) {
        rouMessageEl.textContent = "";
        rouMessageEl.className = "roulette-message";
    }

    if (credits < rouBetAmount) {
        if (rouMessageEl) {
            rouMessageEl.textContent = "Not enough credits. Add more demo credits.";
            rouMessageEl.classList.add("lose");
        }
        return;
    }

    playSound(soundSpin);

    credits -= rouBetAmount;
    updateCreditsDisplay();

    stats.totalRouSpins += 1;

    rouIsSpinning = true;
    if (rouSpinBtn) rouSpinBtn.disabled = true;
    if (rouletteWheelEl) {
        rouletteWheelEl.classList.add("spinning");
    }

    setTimeout(() => {
        const result = randomRouletteResult();
        const { winAmount } = evaluateRouletteWin(result, rouBetAmount, rouSelectedColor);
        const net = winAmount - rouBetAmount;

        // Update last result display
        if (rouLastResultEl) {
            rouLastResultEl.textContent = `${result.number} ${result.color.toUpperCase()}`;
            rouLastResultEl.classList.remove("roulette-last-red", "roulette-last-black", "roulette-last-green");
            rouLastResultEl.classList.add(`roulette-last-${result.color}`);
        }

        // Update ball history
        addRouletteHistoryEntry(result);

        if (winAmount > 0) {
            credits += winAmount;
            updateCreditsDisplay();

            stats.totalRouWins += 1;
            bumpBiggestWin(winAmount);

            if (rouMessageEl) {
                rouMessageEl.textContent = `You win +${winAmount} credits`;
                rouMessageEl.classList.add("win");
            }
            playSound(soundWin);

            addHistoryEntry(
                "Roulette",
                `bet ${rouBetAmount} on ${rouSelectedColor.toUpperCase()} → +${net} (win ${winAmount})`,
                net
            );
        } else {
            if (rouMessageEl) {
                rouMessageEl.textContent = "No win. Try again.";
                rouMessageEl.classList.add("lose");
            }

            addHistoryEntry(
                "Roulette",
                `bet ${rouBetAmount} on ${rouSelectedColor.toUpperCase()} → -${rouBetAmount} (no hit)`,
                -rouBetAmount
            );
        }

        saveStats();
        updateStatsDisplay();

        rouIsSpinning = false;
        if (rouSpinBtn) rouSpinBtn.disabled = false;
        if (rouletteWheelEl) {
            rouletteWheelEl.classList.remove("spinning");
        }
    }, getRouletteSpinDuration());
}

// Events – Slots
if (spinBtn) {
    spinBtn.addEventListener("click", spin);
}

if (addCreditsBtn) {
    addCreditsBtn.addEventListener("click", () => {
        playSound(soundClick);

        const boost = 500;
        credits += boost;
        updateCreditsDisplay();

        lastWin = boost;
        updateLastWinDisplay();

        if (messageEl) {
            messageEl.textContent = `Added +${boost} demo credits.`;
            messageEl.className = "message win";
        }

        addHistoryEntry("System", `added +${boost} demo credits`, boost);
    });
}

if (resetCreditsBtn) {
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
        historyEntries = [];
        rouHistory = [];
        localStorage.removeItem("bunker_slots_credits");
        localStorage.removeItem("bunker_stats_v1");
        localStorage.removeItem(HISTORY_KEY);

        sessionStartCredits = credits;
        updateCreditsDisplay();
        updateLastWinDisplay();
        updateStatsDisplay();
        updateSessionNetDisplay();
        renderHistory();
        renderRouletteHistory();

        if (messageEl) {
            messageEl.textContent = "Progress reset. Back to 500 credits.";
            messageEl.className = "message";
        }
    });
}

if (betDecreaseBtn) {
    betDecreaseBtn.addEventListener("click", () => {
        betAmount = Math.max(MIN_BET, betAmount - 5);
        updateBetDisplay();
    });
}

if (betIncreaseBtn) {
    betIncreaseBtn.addEventListener("click", () => {
        betAmount = Math.min(MAX_BET, betAmount + 5);
        updateBetDisplay();
    });
}

// Events – Blackjack
if (bjBetDecreaseBtn) {
    bjBetDecreaseBtn.addEventListener("click", () => {
        bjBetAmount = Math.max(MIN_BET, bjBetAmount - 5);
        if (bjBetAmountEl) bjBetAmountEl.textContent = bjBetAmount;
    });
}

if (bjBetIncreaseBtn) {
    bjBetIncreaseBtn.addEventListener("click", () => {
        bjBetAmount = Math.min(MAX_BET, bjBetAmount + 5);
        if (bjBetAmountEl) bjBetAmountEl.textContent = bjBetAmount;
    });
}

if (bjDealBtn)  bjDealBtn.addEventListener("click", startBlackjackRound);
if (bjHitBtn)   bjHitBtn.addEventListener("click", hitBlackjack);
if (bjStandBtn) bjStandBtn.addEventListener("click", standBlackjack);

// Events – Roulette
if (rouBetDecreaseBtn) {
    rouBetDecreaseBtn.addEventListener("click", () => {
        rouBetAmount = Math.max(MIN_BET, rouBetAmount - 5);
        if (rouBetAmountEl) rouBetAmountEl.textContent = rouBetAmount;
    });
}

if (rouBetIncreaseBtn) {
    rouBetIncreaseBtn.addEventListener("click", () => {
        rouBetAmount = Math.min(MAX_BET, rouBetAmount + 5);
        if (rouBetAmountEl) rouBetAmountEl.textContent = rouBetAmount;
    });
}

if (rouColorRedBtn) {
    rouColorRedBtn.addEventListener("click", () => {
        playSound(soundClick);
        setRouletteColor("red");
    });
}

if (rouColorBlackBtn) {
    rouColorBlackBtn.addEventListener("click", () => {
        playSound(soundClick);
        setRouletteColor("black");
    });
}

if (rouColorGreenBtn) {
    rouColorGreenBtn.addEventListener("click", () => {
        playSound(soundClick);
        setRouletteColor("green");
    });
}

if (rouSpinBtn) {
    rouSpinBtn.addEventListener("click", spinRoulette);
}

// Events – Settings
if (settingsBtn) {
    settingsBtn.addEventListener("click", () => {
        playSound(soundClick);
        openSettings();
    });
}

if (settingsCloseBtn) {
    settingsCloseBtn.addEventListener("click", () => {
        playSound(soundClick);
        closeSettings();
    });
}

if (settingsOverlay) {
    settingsOverlay.addEventListener("click", (e) => {
        if (e.target === settingsOverlay) {
            closeSettings();
        }
    });
}

if (settingSoundToggle) {
    settingSoundToggle.addEventListener("click", () => {
        settings.soundOn = !settings.soundOn;
        applySettingsToUI();
        saveSettings();
        if (settings.soundOn) {
            playSound(soundClick);
        }
    });
}

if (settingFastToggle) {
    settingFastToggle.addEventListener("click", () => {
        settings.fastMode = !settings.fastMode;
        applySettingsToUI();
        saveSettings();
        playSound(soundClick);
    });
}

// Footer year
if (YEAR_EL) {
    YEAR_EL.textContent = new Date().getFullYear();
}

// Initial render
loadCredits();
sessionStartCredits = credits;
loadStats();
loadSettings();
loadHistory();
updateBetDisplay();
updateLastWinDisplay();
if (bjBetAmountEl)  bjBetAmountEl.textContent = bjBetAmount;
if (rouBetAmountEl) rouBetAmountEl.textContent = rouBetAmount;
setRouletteColor("red");
updateSessionNetDisplay();
renderRouletteHistory();
reelEls.forEach((reel) => {
    const symbol = randomSymbol();
    setReelSymbol(reel, symbol);
});
