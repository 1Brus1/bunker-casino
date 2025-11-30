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
        let win = 0;

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
