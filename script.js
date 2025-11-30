// ----- DOM ELEMENTS -----
// Credits
const creditsEl = document.getElementById("credits");
const creditsHeroEl = document.getElementById("credits-hero");
const bjCreditsMirrorEl = document.getElementById("bj-credits-mirror");
const rouCreditsMirrorEl = document.getElementById("rou-credits-mirror");

// Stats
const statTotalSpinsEl = document.getElementById("stat-total-spins");
const statTotalBjHandsEl = document.getElementById("stat-total-bj-hands");
const statTotalBjWinsEl = document.getElementById("stat-total-bj-wins");
const statTotalRouSpinsEl = document.getElementById("stat-total-rou-spins");
const statTotalRouWinsEl = document.getElementById("stat-total-rou-wins");
const statBiggestWinEl = document.getElementById("stat-biggest-win");
const statSessionNetEl = document.getElementById("stat-session-net");
const historyEmptyEl = document.getElementById("history-empty");
const historyListEl = document.getElementById("history-list");

// General buttons
const addCreditsBtn = document.getElementById("add-credits-btn");
const resetCreditsBtn = document.getElementById("reset-credits-btn");

// Settings
const settingsOverlayEl = document.getElementById("settings-overlay");
const settingsBtn = document.getElementById("settings-btn");
const settingsCloseBtn = document.getElementById("settings-close-btn");
const soundToggleBtn = document.getElementById("setting-sound-toggle");
const fastToggleBtn = document.getElementById("setting-fast-toggle");

// Sounds
const soundSpin = document.getElementById("sound-spin");
const soundWin = document.getElementById("sound-win");
const soundClick = document.getElementById("sound-click");

// Slots DOM
const lastWinEl = document.getElementById("last-win");
const messageEl = document.getElementById("message");
const spinBtn = document.getElementById("spin-btn");
const betAmountEl = document.getElementById("bet-amount");
const betDecreaseBtn = document.getElementById("bet-decrease");
const betIncreaseBtn = document.getElementById("bet-increase");
const reelEls = [
    document.getElementById("reel1"),
    document.getElementById("reel2"),
    document.getElementById("reel3")
];

// Blackjack DOM
const bjDealerHandEl = document.getElementById("bj-dealer-hand");
const bjDealerScoreEl = document.getElementById("bj-dealer-score");
const bjPlayerHandEl = document.getElementById("bj-player-hand");
const bjPlayerScoreEl = document.getElementById("bj-player-score");
const bjBetAmountEl = document.getElementById("bj-bet-amount");
const bjBetDecreaseBtn = document.getElementById("bj-bet-decrease");
const bjBetIncreaseBtn = document.getElementById("bj-bet-increase");
const bjDealBtn = document.getElementById("bj-deal-btn");
const bjHitBtn = document.getElementById("bj-hit-btn");
const bjStandBtn = document.getElementById("bj-stand-btn");
const bjMessageEl = document.getElementById("bj-message");

// Roulette DOM
const rouBetAmountEl = document.getElementById("rou-bet-amount");
const rouBetDecreaseBtn = document.getElementById("rou-bet-decrease");
const rouBetIncreaseBtn = document.getElementById("rou-bet-increase");
const rouColorRedBtn = document.getElementById("rou-color-red");
const rouColorBlackBtn = document.getElementById("rou-color-black");
const rouColorGreenBtn = document.getElementById("rou-color-green");
const rouSpinBtn = document.getElementById("rou-spin-btn");
const rouletteWheelEl = document.getElementById("roulette-wheel");
const rouLastResultEl = document.getElementById("rou-last-result");
const rouHistoryListEl = document.getElementById("rou-history-list");
const rouMessageEl = document.getElementById("rou-message");

// Footer year
const YEAR_EL = document.getElementById("year");

if (YEAR_EL) {
    YEAR_EL.textContent = new Date().getFullYear();
}

// ----- STATE & STORAGE -----

const STORAGE_KEYS = {
    credits: "bunker_credits_v1",
    stats: "bunker_stats_v1",
    settings: "bunker_settings_v1"
};

let credits = 0;
let sessionNet = 0;

let stats = {
    totalSlotSpins: 0,
    totalBjHands: 0,
    totalBjWins: 0,
    totalRouSpins: 0,
    totalRouWins: 0,
    biggestWin: 0
};

let settings = {
    sound: true,
    fastMode: false
};

function loadState() {
    const storedCredits = localStorage.getItem(STORAGE_KEYS.credits);
    credits = storedCredits ? parseInt(storedCredits, 10) || 0 : 500;

    const storedStats = localStorage.getItem(STORAGE_KEYS.stats);
    if (storedStats) {
        try {
            const parsed = JSON.parse(storedStats);
            stats = Object.assign(stats, parsed);
        } catch (e) {}
    }

    const storedSettings = localStorage.getItem(STORAGE_KEYS.settings);
    if (storedSettings) {
        try {
            const parsed = JSON.parse(storedSettings);
            settings = Object.assign(settings, parsed);
        } catch (e) {}
    }

    updateCreditsDisplay();
    updateStatDisplays();
    applySettingsToUI();
}

function saveCredits() {
    localStorage.setItem(STORAGE_KEYS.credits, String(credits));
}

function saveStats() {
    localStorage.setItem(STORAGE_KEYS.stats, JSON.stringify(stats));
}

function saveSettings() {
    localStorage.setItem(STORAGE_KEYS.settings, JSON.stringify(settings));
}

function changeCredits(delta) {
    credits += delta;
    if (credits < 0) credits = 0;
    sessionNet += delta;
    updateCreditsDisplay();
    updateSessionDisplay();
    saveCredits();
}

function updateCreditsDisplay() {
    if (creditsEl) creditsEl.textContent = credits;
    if (creditsHeroEl) creditsHeroEl.textContent = credits;
    if (bjCreditsMirrorEl) bjCreditsMirrorEl.textContent = credits;
    if (rouCreditsMirrorEl) rouCreditsMirrorEl.textContent = credits;
}

function updateStatDisplays() {
    if (statTotalSpinsEl) statTotalSpinsEl.textContent = stats.totalSlotSpins;
    if (statTotalBjHandsEl) statTotalBjHandsEl.textContent = stats.totalBjHands;
    if (statTotalBjWinsEl) statTotalBjWinsEl.textContent = stats.totalBjWins;
    if (statTotalRouSpinsEl) statTotalRouSpinsEl.textContent = stats.totalRouSpins;
    if (statTotalRouWinsEl) statTotalRouWinsEl.textContent = stats.totalRouWins;
    if (statBiggestWinEl) statBiggestWinEl.textContent = stats.biggestWin;
}

function updateSessionDisplay() {
    if (!statSessionNetEl) return;
    statSessionNetEl.textContent = sessionNet;
    statSessionNetEl.classList.remove("stats-session-positive", "stats-session-negative");
    if (sessionNet > 0) {
        statSessionNetEl.classList.add("stats-session-positive");
    } else if (sessionNet < 0) {
        statSessionNetEl.classList.add("stats-session-negative");
    }
}

// ----- HISTORY PANEL -----

function addHistoryEntry(type, description, net) {
    if (!historyListEl || !historyEmptyEl) return;

    historyEmptyEl.style.display = "none";
    historyListEl.style.display = "block";

    const li = document.createElement("li");
    li.className = "history-item";

    const mainSpan = document.createElement("span");
    mainSpan.className = "history-main";
    mainSpan.textContent = description;

    const netSpan = document.createElement("span");
    netSpan.className = "history-net";
    if (net > 0) {
        netSpan.classList.add("history-net-positive");
        netSpan.textContent = `+${net}`;
    } else if (net < 0) {
        netSpan.classList.add("history-net-negative");
        netSpan.textContent = `${net}`;
    } else {
        netSpan.textContent = "0";
    }

    li.appendChild(mainSpan);
    li.appendChild(netSpan);

    historyListEl.insertBefore(li, historyListEl.firstChild);

    while (historyListEl.children.length > 15) {
        historyListEl.removeChild(historyListEl.lastChild);
    }
}

// ----- SOUNDS -----

function playSfx(type) {
    if (!settings.sound) return;
    let el = null;
    if (type === "spin") el = soundSpin;
    else if (type === "win") el = soundWin;
    else if (type === "click") el = soundClick;

    if (el) {
        try {
            el.currentTime = 0;
            el.play();
        } catch (e) {
            // ignore autoplay issues
        }
    }
}

// ----- SETTINGS UI -----

function applySettingsToUI() {
    if (settings.sound) soundToggleBtn.classList.add("toggle-on");
    else soundToggleBtn.classList.remove("toggle-on");

    if (settings.fastMode) fastToggleBtn.classList.add("toggle-on");
    else fastToggleBtn.classList.remove("toggle-on");
}

if (settingsBtn && settingsOverlayEl && settingsCloseBtn) {
    settingsBtn.addEventListener("click", () => {
        playSfx("click");
        settingsOverlayEl.classList.add("open");
    });
    settingsCloseBtn.addEventListener("click", () => {
        playSfx("click");
        settingsOverlayEl.classList.remove("open");
    });
    settingsOverlayEl.addEventListener("click", (e) => {
        if (e.target === settingsOverlayEl) {
            settingsOverlayEl.classList.remove("open");
        }
    });
}

if (soundToggleBtn) {
    soundToggleBtn.addEventListener("click", () => {
        settings.sound = !settings.sound;
        playSfx("click");
        applySettingsToUI();
        saveSettings();
    });
}

if (fastToggleBtn) {
    fastToggleBtn.addEventListener("click", () => {
        settings.fastMode = !settings.fastMode;
        playSfx("click");
        applySettingsToUI();
        saveSettings();
    });
}

function getSlotSpinDuration() {
    return settings.fastMode ? 450 : 750;
}

function getRouletteSpinDuration() {
    return settings.fastMode ? 400 : 900;
}

// ----- GLOBAL BUTTONS -----

if (addCreditsBtn) {
    addCreditsBtn.addEventListener("click", () => {
        const boost = 500;
        changeCredits(boost);
        if (lastWinEl) {
            lastWin = boost;
            updateLastWinDisplay();
        }
        if (messageEl) {
            messageEl.textContent = `Added +${boost} demo credits.`;
            messageEl.className = "message win";
        }
        addHistoryEntry("system", "Demo credits added", boost);
        playSfx("win");
    });
}

if (resetCreditsBtn) {
    resetCreditsBtn.addEventListener("click", () => {
        const confirmReset = window.confirm(
            "Reset your BUNKER Casino progress? This will set credits back to 500 and clear history."
        );
        if (!confirmReset) return;

        credits = 500;
        sessionNet = 0;
        stats = {
            totalSlotSpins: 0,
            totalBjHands: 0,
            totalBjWins: 0,
            totalRouSpins: 0,
            totalRouWins: 0,
            biggestWin: 0
        };

        localStorage.removeItem(STORAGE_KEYS.credits);
        localStorage.removeItem(STORAGE_KEYS.stats);

        updateCreditsDisplay();
        updateStatDisplays();
        updateSessionDisplay();

        if (historyListEl) {
            historyListEl.innerHTML = "";
            historyListEl.style.display = "none";
        }
        if (historyEmptyEl) {
            historyEmptyEl.style.display = "block";
        }

        rouletteHistory = [];
        renderRouletteHistory();
        rouLastResultEl.textContent = "–";
        rouLastResultEl.className = "roulette-result-value";

        if (lastWinEl) {
            lastWin = 0;
            updateLastWinDisplay();
        }
        if (messageEl) {
            messageEl.textContent = "Progress reset. Back to 500 credits.";
            messageEl.className = "message";
        }
    });
}

// ----- SLOTS LOGIC -----

const SYMBOLS = [
    { key: "seven", image: "symbol-seven.png", multiplier: 50 },
    { key: "star", image: "symbol-star.png", multiplier: 25 },
    { key: "cherry", image: "symbol-cherry.png", multiplier: 10 },
    { key: "bar", image: "symbol-bar.png", multiplier: 5 },
    { key: "diamond", image: "symbol-diamond.png", multiplier: 5 },
    { key: "lemon", image: "symbol-lemon.png", multiplier: 5 }
];

let lastWin = 0;
let betAmount = 10;
const MIN_BET = 5;
const MAX_BET = 100;
let isSpinning = false;

function updateBetDisplay() {
    if (betAmountEl) betAmountEl.textContent = betAmount;
}

function updateLastWinDisplay() {
    if (!lastWinEl) return;
    const sign = lastWin > 0 ? "+" : lastWin < 0 ? "−" : "";
    const abs = Math.abs(lastWin);
    if (lastWin === 0) lastWinEl.textContent = "0";
    else lastWinEl.textContent = `${sign}${abs}`;
}

function randomSymbol() {
    const index = Math.floor(Math.random() * SYMBOLS.length);
    return SYMBOLS[index];
}

function setReelSymbol(reelEl, symbol) {
    if (!reelEl) return;
    reelEl.dataset.symbol = symbol.key;
    reelEl.style.backgroundImage = `url(${symbol.image})`;
}

function evaluateWin(symbols, bet) {
    const [a, b, c] = symbols;
    if (a.key === b.key && b.key === c.key) {
        return bet * a.multiplier;
    }
    return 0;
}

function spinSlots() {
    if (isSpinning) return;

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

    isSpinning = true;
    if (spinBtn) {
        spinBtn.disabled = true;
        spinBtn.textContent = "SPINNING";
    }

    changeCredits(-betAmount);
    stats.totalSlotSpins += 1;

    reelEls.forEach((reel, idx) => {
        if (!reel) return;
        reel.classList.add("spinning");
        setTimeout(() => {
            reel.classList.remove("spinning");
        }, 350 + idx * 140);
    });

    playSfx("spin");

    const spinDuration = getSlotSpinDuration();

    setTimeout(() => {
        const resultSymbols = reelEls.map((reel) => {
            const symbol = randomSymbol();
            setReelSymbol(reel, symbol);
            return symbol;
        });

        const winAmount = evaluateWin(resultSymbols, betAmount);
        let net = -betAmount;

        if (winAmount > 0) {
            changeCredits(winAmount);
            net += winAmount;
            lastWin = winAmount;
            if (messageEl) {
                messageEl.textContent = `WIN +${winAmount} credits`;
                messageEl.classList.add("win");
            }
            playSfx("win");
        } else {
            lastWin = -betAmount;
            if (messageEl) {
                messageEl.textContent = "No win. Try again.";
                messageEl.classList.add("lose");
            }
        }

        stats.biggestWin = Math.max(stats.biggestWin, winAmount);
        saveStats();
        updateStatDisplays();
        updateLastWinDisplay();

        addHistoryEntry(
            "slots",
            `Slots spin (bet ${betAmount})`,
            net
        );

        isSpinning = false;
        if (spinBtn) {
            spinBtn.disabled = false;
            spinBtn.textContent = "SPIN";
        }
    }, spinDuration);
}

// Slots events
if (spinBtn) spinBtn.addEventListener("click", spinSlots);
if (betDecreaseBtn) {
    betDecreaseBtn.addEventListener("click", () => {
        betAmount = Math.max(MIN_BET, betAmount - 5);
        updateBetDisplay();
        playSfx("click");
    });
}
if (betIncreaseBtn) {
    betIncreaseBtn.addEventListener("click", () => {
        betAmount = Math.min(MAX_BET, betAmount + 5);
        updateBetDisplay();
        playSfx("click");
    });
}

// ----- BLACKJACK LOGIC -----

const BJ_MIN_BET = 5;
const BJ_MAX_BET = 100;
let bjBetAmount = 10;

let bjDeck = [];
let bjPlayerHand = [];
let bjDealerHand = [];
let bjInHand = false;

function updateBjBetDisplay() {
    if (bjBetAmountEl) bjBetAmountEl.textContent = bjBetAmount;
}

function createDeck() {
    const suits = ["♠", "♥", "♦", "♣"];
    const deck = [];
    const ranks = [
        { label: "A", value: 11 },
        { label: "2", value: 2 },
        { label: "3", value: 3 },
        { label: "4", value: 4 },
        { label: "5", value: 5 },
        { label: "6", value: 6 },
        { label: "7", value: 7 },
        { label: "8", value: 8 },
        { label: "9", value: 9 },
        { label: "10", value: 10 },
        { label: "J", value: 10 },
        { label: "Q", value: 10 },
        { label: "K", value: 10 }
    ];
    suits.forEach((suit) => {
        ranks.forEach((r) => {
            deck.push({
                label: r.label + suit,
                value: r.value,
                isAce: r.label === "A",
                isRed: suit === "♥" || suit === "♦"
            });
        });
    });
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    return deck;
}

function bjDrawCard() {
    if (bjDeck.length === 0) {
        bjDeck = createDeck();
    }
    return bjDeck.pop();
}

function bjHandValue(hand) {
    let total = 0;
    let aces = 0;
    hand.forEach((card) => {
        total += card.value;
        if (card.isAce) aces += 1;
    });
    while (total > 21 && aces > 0) {
        total -= 10;
        aces -= 1;
    }
    return total;
}

function renderBjHands(hideDealerHole) {
    bjDealerHandEl.innerHTML = "";
    bjPlayerHandEl.innerHTML = "";

    bjDealerHand.forEach((card, idx) => {
        const div = document.createElement("div");
        div.className = "bj-card";
        if (hideDealerHole && idx === 1) {
            div.classList.add("hidden");
            div.textContent = "??";
        } else {
            if (card.isRed) div.classList.add("red");
            div.textContent = card.label;
        }
        bjDealerHandEl.appendChild(div);
    });

    bjPlayerHand.forEach((card) => {
        const div = document.createElement("div");
        div.className = "bj-card";
        if (card.isRed) div.classList.add("red");
        div.textContent = card.label;
        bjPlayerHandEl.appendChild(div);
    });
}

function updateBjScores(hideDealerHole) {
    const playerVal = bjHandValue(bjPlayerHand);
    const dealerVal = hideDealerHole
        ? bjDealerHand[0]
            ? bjDealerHand[0].value
            : 0
        : bjHandValue(bjDealerHand);

    bjPlayerScoreEl.textContent = playerVal;
    bjDealerScoreEl.textContent = dealerVal;
}

function bjStartHand() {
    if (bjInHand) return;
    if (credits < bjBetAmount) {
        bjMessageEl.textContent = "Not enough credits for this bet.";
        bjMessageEl.className = "bj-message lose";
        return;
    }

    bjInHand = true;
    playSfx("click");
    bjMessageEl.textContent = "";
    bjMessageEl.className = "bj-message";

    bjPlayerHand = [];
    bjDealerHand = [];

    changeCredits(-bjBetAmount);
    stats.totalBjHands += 1;

    bjPlayerHand.push(bjDrawCard(), bjDrawCard());
    bjDealerHand.push(bjDrawCard(), bjDrawCard());

    renderBjHands(true);
    updateBjScores(true);

    bjDealBtn.disabled = true;
    bjHitBtn.disabled = false;
    bjStandBtn.disabled = false;

    saveStats();
    updateStatDisplays();
}

function bjHit() {
    if (!bjInHand) return;
    bjPlayerHand.push(bjDrawCard());
    renderBjHands(true);
    updateBjScores(true);

    const playerVal = bjHandValue(bjPlayerHand);
    if (playerVal > 21) {
        bjEndHand("lose");
    }
}

function bjStand() {
    if (!bjInHand) return;
    while (bjHandValue(bjDealerHand) < 17) {
        bjDealerHand.push(bjDrawCard());
    }
    bjResolveStand();
}

function bjResolveStand() {
    const playerVal = bjHandValue(bjPlayerHand);
    const dealerVal = bjHandValue(bjDealerHand);

    let outcome = "push";
    let payout = 0;

    if (playerVal > 21) {
        outcome = "lose";
    } else if (dealerVal > 21 || playerVal > dealerVal) {
        outcome = "win";
        payout = bjBetAmount * 2;
    } else if (playerVal < dealerVal) {
        outcome = "lose";
    } else {
        outcome = "push";
        payout = bjBetAmount; // refund
    }

    if (payout > 0) changeCredits(payout);

    const net = -bjBetAmount + payout;
    if (outcome === "win") {
        stats.totalBjWins += 1;
        stats.biggestWin = Math.max(stats.biggestWin, payout - bjBetAmount);
        playSfx("win");
    }

    renderBjHands(false);
    updateBjScores(false);

    bjMessageEl.className = "bj-message " + outcome;
    if (outcome === "win") bjMessageEl.textContent = `You win! ${playerVal} vs ${dealerVal}`;
    else if (outcome === "lose") bjMessageEl.textContent = `You lose. ${playerVal} vs ${dealerVal}`;
    else bjMessageEl.textContent = `Push. ${playerVal} vs ${dealerVal}`;

    saveStats();
    updateStatDisplays();

    addHistoryEntry(
        "blackjack",
        `Blackjack (bet ${bjBetAmount}) ${outcome.toUpperCase()} ${playerVal}-${dealerVal}`,
        net
    );

    bjInHand = false;
    bjDealBtn.disabled = false;
    bjHitBtn.disabled = true;
    bjStandBtn.disabled = true;
}

function bjEndHand(outcome) {
    // only used for bust shortcut
    while (bjHandValue(bjDealerHand) < 17) {
        bjDealerHand.push(bjDrawCard());
    }
    bjResolveStand();
}

// Blackjack events
if (bjDealBtn) bjDealBtn.addEventListener("click", bjStartHand);
if (bjHitBtn) bjHitBtn.addEventListener("click", bjHit);
if (bjStandBtn) bjStandBtn.addEventListener("click", bjStand);

if (bjBetDecreaseBtn) {
    bjBetDecreaseBtn.addEventListener("click", () => {
        bjBetAmount = Math.max(BJ_MIN_BET, bjBetAmount - 5);
        updateBjBetDisplay();
        playSfx("click");
    });
}
if (bjBetIncreaseBtn) {
    bjBetIncreaseBtn.addEventListener("click", () => {
        bjBetAmount = Math.min(BJ_MAX_BET, bjBetAmount + 5);
        updateBjBetDisplay();
        playSfx("click");
    });
}

// ----- ROULETTE LOGIC -----

const ROU_MIN_BET = 5;
const ROU_MAX_BET = 100;
let rouBetAmount = 10;
let selectedColor = "red";
let isRouSpinning = false;
let rouletteHistory = [];

const redNumbers = new Set([
    1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36
]);

function updateRouBetDisplay() {
    if (rouBetAmountEl) rouBetAmountEl.textContent = rouBetAmount;
}

function selectRouColor(color) {
    selectedColor = color;
    [rouColorRedBtn, rouColorBlackBtn, rouColorGreenBtn].forEach(btn => {
        if (!btn) return;
        btn.classList.remove("active");
    });
    if (color === "red" && rouColorRedBtn) rouColorRedBtn.classList.add("active");
    if (color === "black" && rouColorBlackBtn) rouColorBlackBtn.classList.add("active");
    if (color === "green" && rouColorGreenBtn) rouColorGreenBtn.classList.add("active");
}

function getRouletteColor(num) {
    if (num === 0) return "green";
    return redNumbers.has(num) ? "red" : "black";
}

function renderRouletteHistory() {
    if (!rouHistoryListEl) return;
    rouHistoryListEl.innerHTML = "";
    rouletteHistory.forEach((entry) => {
        const chip = document.createElement("div");
        chip.className = "roulette-history-chip";
        if (entry.color === "red") chip.classList.add("roulette-history-red");
        if (entry.color === "black") chip.classList.add("roulette-history-black");
        if (entry.color === "green") chip.classList.add("roulette-history-green");
        chip.textContent = entry.number;
        rouHistoryListEl.appendChild(chip);
    });
}

function spinRoulette() {
    if (isRouSpinning) return;

    if (credits < rouBetAmount) {
        rouMessageEl.textContent = "Not enough credits for this bet.";
        rouMessageEl.className = "roulette-message lose";
        return;
    }

    isRouSpinning = true;
    rouSpinBtn.disabled = true;
    rouMessageEl.textContent = "";
    rouMessageEl.className = "roulette-message";

    changeCredits(-rouBetAmount);
    stats.totalRouSpins += 1;

    rouletteWheelEl.classList.add("spinning");
    playSfx("spin");

    const spinDuration = getRouletteSpinDuration();

    setTimeout(() => {
        rouletteWheelEl.classList.remove("spinning");

        const number = Math.floor(Math.random() * 37); // 0-36
        const color = getRouletteColor(number);

        let colorClass = "";
        if (color === "red") colorClass = "roulette-last-red";
        else if (color === "black") colorClass = "roulette-last-black";
        else colorClass = "roulette-last-green";

        rouLastResultEl.textContent = number;
        rouLastResultEl.className = "roulette-result-value " + colorClass;

        let payout = 0;
        if (color === selectedColor) {
            if (selectedColor === "green") payout = rouBetAmount * 10;
            else payout = rouBetAmount * 2;
            changeCredits(payout);
            stats.totalRouWins += 1;
            stats.biggestWin = Math.max(stats.biggestWin, payout - rouBetAmount);
            rouMessageEl.textContent = `WIN on ${color.toUpperCase()}!`;
            rouMessageEl.className = "roulette-message win";
            playSfx("win");
        } else {
            rouMessageEl.textContent = "No hit. Try again.";
            rouMessageEl.className = "roulette-message lose";
        }

        const net = -rouBetAmount + payout;
        addHistoryEntry(
            "roulette",
            `Roulette (bet ${rouBetAmount}) ${color.toUpperCase()} ${number}`,
            net
        );

        rouletteHistory.unshift({ number, color });
        if (rouletteHistory.length > 12) rouletteHistory.pop();
        renderRouletteHistory();

        saveStats();
        updateStatDisplays();

        isRouSpinning = false;
        rouSpinBtn.disabled = false;
    }, spinDuration);
}

// Roulette events
if (rouBetDecreaseBtn) {
    rouBetDecreaseBtn.addEventListener("click", () => {
        rouBetAmount = Math.max(ROU_MIN_BET, rouBetAmount - 5);
        updateRouBetDisplay();
        playSfx("click");
    });
}
if (rouBetIncreaseBtn) {
    rouBetIncreaseBtn.addEventListener("click", () => {
        rouBetAmount = Math.min(ROU_MAX_BET, rouBetAmount + 5);
        updateRouBetDisplay();
        playSfx("click");
    });
}

if (rouColorRedBtn) rouColorRedBtn.addEventListener("click", () => { selectRouColor("red"); playSfx("click"); });
if (rouColorBlackBtn) rouColorBlackBtn.addEventListener("click", () => { selectRouColor("black"); playSfx("click"); });
if (rouColorGreenBtn) rouColorGreenBtn.addEventListener("click", () => { selectRouColor("green"); playSfx("click"); });

if (rouSpinBtn) rouSpinBtn.addEventListener("click", spinRoulette);

// ----- INIT -----

loadState();
updateBetDisplay();
updateBjBetDisplay();
updateRouBetDisplay();
selectRouColor("red");

// Set random initial symbols on the reels
reelEls.forEach((reel) => {
    const symbol = randomSymbol();
    setReelSymbol(reel, symbol);
});
updateLastWinDisplay();
