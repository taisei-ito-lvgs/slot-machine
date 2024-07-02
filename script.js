// Initial symbols array (default values(sample))
let symbols = [
    'https://www.inside-games.jp/imgs/ogp_f/1103894.jpg',
    'https://www.inside-games.jp/imgs/zoom/1103869.jpg',
    'https://static-cdn.jtvnw.net/jtv_user_pictures/cda793c5-a533-4b7c-9412-d4f364a732d2-profile_image-300x300.png',
    'https://yt3.googleusercontent.com/76a_ty_OwF-nJWNuuxxeJokcgqlmkKCHwXSto9cKKkyjPO2agiu5Tc7t4f6dz5uaab7X8U5mVQ=s900-c-k-c0x00ffffff-no-rj',
    'https://i.pinimg.com/originals/c1/85/0c/c1850cb4e7b0642ffeab9e05f1be51ec.jpg',
    'https://i.pinimg.com/736x/0f/b3/c2/0fb3c251b84cad528463611c096dba49.jpg',
    'https://pbs.twimg.com/ext_tw_video_thumb/1628723515217313793/pu/img/q_hueUe40AtuOzqA.jpg:large',
    'https://pbs.twimg.com/media/FppenKFaEAAghoM.jpg:large'
];

const reel1 = document.getElementById('reel1');
const reel2 = document.getElementById('reel2');
const reel3 = document.getElementById('reel3');
const startButton = document.getElementById('start-button');
const stopButton = document.getElementById('stop-button');
const messageElement = document.getElementById('message');
const symbolsInput = document.getElementById('symbols-input');
const setSymbolsButton = document.getElementById('set-symbols-button');

let spinningIntervals = [null, null, null];
let stopCount = 0;

const symbolHeight = 100; // Height of each symbol in pixels
const symbolsToShow = 3; // Number of symbols visible in the reel

// Define target symbols for each reel
let targetSymbols = [
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

function createReelContent(reel, targetSymbol) {
    const reelInner = reel.querySelector('.reel-inner');
    const index = symbols.indexOf(targetSymbol);
    const adjustedSymbols = symbols.slice(index).concat(symbols.slice(0, index));
    
    // Clear any existing content
    clearReelContent(reel);

    // Create symbols to fill the reel
    for (let i = 0; i < adjustedSymbols.length + symbolsToShow; i++) {
        const symbolElement = document.createElement('div');
        symbolElement.className = 'symbol';
        const symbolImg = document.createElement('img'); // Create img element
        symbolImg.src = adjustedSymbols[i % adjustedSymbols.length]; // Set src attribute to image URL
        symbolImg.style.height = `${symbolHeight}px`; // Set height (adjust as needed)
        symbolElement.appendChild(symbolImg);
        reelInner.appendChild(symbolElement);
    }
}

// Initialize reels with fixed symbols and target positions
createReelContent(reel1, targetSymbols[0]);
createReelContent(reel2, targetSymbols[1]);
createReelContent(reel3, targetSymbols[2]);

startButton.addEventListener('click', function() {
    if (!spinningIntervals.some(interval => interval !== null)) {
        startSpin();
    }
});

stopButton.addEventListener('click', function() {
    if (stopCount < 3) {
        stopCount++;
        stopReel(stopCount);
        if (stopCount === 3) {
            stopButton.disabled = true;
            startButton.disabled = false;
        }
    }
});

setSymbolsButton.addEventListener('click', function() {
    const input = symbolsInput.value;
    if (input) {
        symbols = input.split(',').map(url => url.trim());
        targetSymbols = [
            symbols[Math.floor(Math.random() * symbols.length)],
            symbols[Math.floor(Math.random() * symbols.length)],
            symbols[Math.floor(Math.random() * symbols.length)]
        ];
        createReelContent(reel1, targetSymbols[0]);
        createReelContent(reel2, targetSymbols[1]);
        createReelContent(reel3, targetSymbols[2]);
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

    startButton.disabled = true;
    stopButton.disabled = false;

    spinningIntervals[0] = setInterval(() => shiftSymbols(reel1), 100); // Adjusted interval for slower spin
    spinningIntervals[1] = setInterval(() => shiftSymbols(reel2), 100); // Adjusted interval for slower spin
    spinningIntervals[2] = setInterval(() => shiftSymbols(reel3), 100); // Adjusted interval for slower spin
}

function stopReel(count) {
    switch (count) {
        case 1:
            clearInterval(spinningIntervals[0]);
            spinningIntervals[0] = null;
            break;
        case 2:
            clearInterval(spinningIntervals[1]);
            spinningIntervals[1] = null;
            break;
        case 3:
            clearInterval(spinningIntervals[2]);
            spinningIntervals[2] = null;
            break;
    }
}

function shiftSymbols(reel) {
    const reelInner = reel.querySelector('.reel-inner');
    const firstSymbol = reelInner.firstElementChild;
    reelInner.appendChild(firstSymbol.cloneNode(true));
    reelInner.removeChild(firstSymbol);
}

function shuffleSymbols() {
    for (let i = symbols.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [symbols[i], symbols[j]] = [symbols[j], symbols[i]];
    }
}
