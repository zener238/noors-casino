const reels = document.querySelectorAll('.reel');
const spinButton = document.getElementById('spin-button');
const balanceDisplay = document.querySelector('.balance');
const winningsDisplay = document.querySelector('.winnings');

const spinSound = document.getElementById('spin-sound');
const winSound = document.getElementById('win-sound');
const loseSound = document.getElementById('lose-sound');

let balance = 100;

const symbols = ['cherry', 'lemon', 'bell', 'seven'];
const paylines = [
    [0, 1, 2] // Add more paylines as needed
];

function spin() {
    if (balance <= 0) {
        alert('Insufficient balance!');
        return;
    }

    balance--;
    balanceDisplay.textContent = `Balance: $${balance}`;
    winningsDisplay.textContent = `Winnings: $0`;

    spinSound.play(); // Play spin sound

    reels.forEach(reel => {
        const randomIndex = Math.floor(Math.random() * symbols.length);
        const randomSymbol = symbols[randomIndex];
        reel.querySelector('img').src = `images/${randomSymbol}.png`;
    });

    // Check for wins
    let winnings = 0;
    paylines.forEach(payline => {
        const symbolsOnPayline = payline.map(index => reels[index].querySelector('img').alt);
        if (symbolsOnPayline.every(symbol => symbol === symbolsOnPayline[0])) {
            // Simple win condition: all symbols match
            winnings += 10; // Replace with appropriate payout
        }
    });

    balance += winnings;
    winningsDisplay.textContent = `Winnings: $${winnings}`;
    balanceDisplay.textContent = `Balance: $${balance}`;

    if (winnings > 0) {
        winSound.play(); // Play win sound
    } else {
        loseSound.play(); // Play lose sound
    }
}

spinButton.addEventListener('click', spin);



