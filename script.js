const symbols = ['🍒', '🍋', '🍉', '🍇', '🍓', '🍍', '🥝', '🍏', '🍌', '🍊'];
const reel1 = document.getElementById('reel1');
const reel2 = document.getElementById('reel2');
const reel3 = document.getElementById('reel3');
const startButton = document.getElementById('start-button');
const stopButton = document.getElementById('stop-button');

let spinningInterval = null;
let stopCount = 0;

const symbolHeight = 50; // Height of each symbol in pixels
const symbolsToShow = 3; // Number of symbols visible in the reel

// Define target symbols for each reel
const targetSymbols = [
    symbols[Math.floor(Math.random() * symbols.length)],
    symbols[Math.floor(Math.random() * symbols.length)],
    symbols[Math.floor(Math.random() * symbols.length)]
];

function clearReelContent(reel) {
    const reelInner = reel.querySelector('.reel-inner');
    while (reelInner.firstChild) {
        reelInner.removeChild(reelInner.firstChild);
    }
}

function shuffleSymbols() {
    for (let i = symbols.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [symbols[i], symbols[j]] = [symbols[j], symbols[i]];
    }
}

function createReelContent(reel, targetSymbol) {
    const reelInner = reel.querySelector('.reel-inner');
    shuffleSymbols(); // Shuffle symbols before creating content
    const index = symbols.indexOf(targetSymbol);
    const adjustedSymbols = symbols.slice(index).concat(symbols.slice(0, index));
    for (let i = 0; i < adjustedSymbols.length; i++) {
        const symbolElement = document.createElement('div');
        symbolElement.className = 'symbol';
        symbolElement.textContent = adjustedSymbols[i];
        reelInner.appendChild(symbolElement);
    }
    
    // Add extra symbols to fill the reel
    const symbolsNeeded = Math.ceil(reel.clientHeight / symbolHeight);
    for (let i = 0; i < symbolsNeeded; i++) {
        const symbolElement = document.createElement('div');
        symbolElement.className = 'symbol';
        symbolElement.textContent = adjustedSymbols[i % adjustedSymbols.length];
        reelInner.appendChild(symbolElement);
    }
}

// Initialize reels with fixed symbols and target positions
createReelContent(reel1, targetSymbols[0]);
createReelContent(reel2, targetSymbols[1]);
createReelContent(reel3, targetSymbols[2]);

startButton.addEventListener('click', function() {
    if (!spinningInterval) {
        startSpin();
    }
});

stopButton.addEventListener('click', function() {
    if (spinningInterval && stopCount < 3) {
        stopCount++;
        stopReel(stopCount);
        if (stopCount === 3) {
            stopButton.disabled = true;
            startButton.disabled = false;
            determineStoppedSymbols();
        }
    }
});

function startSpin() {
    stopCount = 0;
    clearReelContent(reel1);
    clearReelContent(reel2);
    clearReelContent(reel3);
    createReelContent(reel1, targetSymbols[0]);
    createReelContent(reel2, targetSymbols[1]);
    createReelContent(reel3, targetSymbols[2]);

    reel1.firstElementChild.classList.add('spin');
    reel2.firstElementChild.classList.add('spin');
    reel3.firstElementChild.classList.add('spin');
    
    startButton.disabled = true;
    stopButton.disabled = false;

    // Set interval for spinning
    spinningInterval = setInterval(function() {
        if (stopCount === 3) {
            clearInterval(spinningInterval);
            spinningInterval = null;
        }
    }, 100); // Adjusted speed for smoother appearance
}

function stopReel(count) {
    switch (count) {
        case 1:
            reel1.firstElementChild.classList.remove('spin');
            adjustStopPosition(reel1, targetSymbols[0]);
            break;
        case 2:
            reel2.firstElementChild.classList.remove('spin');
            adjustStopPosition(reel2, targetSymbols[1]);
            break;
        case 3:
            reel3.firstElementChild.classList.remove('spin');
            adjustStopPosition(reel3, targetSymbols[2]);
            break;
    }
}

function adjustStopPosition(reel, targetSymbol) {
    const reelInner = reel.querySelector('.reel-inner');
    const currentOffset = reelInner.offsetTop % (symbols.length * symbolHeight);
    let moveAmount = Math.floor(currentOffset / symbolHeight) * symbolHeight;
    
    // Determine position of target symbol
    const targetIndex = symbols.indexOf(targetSymbol);
    const targetPosition = targetIndex * symbolHeight;

    // Calculate final position based on target position
    const totalReelHeight = symbols.length * symbolHeight;
    let finalPosition = totalReelHeight + targetPosition - moveAmount;

    // Set position within the symbol range
    finalPosition %= totalReelHeight;

    reelInner.style.transform = `translateY(-${finalPosition}px)`;
}

function determineStoppedSymbols() {
    // No need to update symbols since they are set initially
}
