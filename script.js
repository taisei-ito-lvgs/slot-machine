const reel1 = document.getElementById('reel1');
const reel2 = document.getElementById('reel2');
const reel3 = document.getElementById('reel3');
const startButton = document.getElementById('start-button');
const stopButton1 = document.getElementById('stop-button-1');
const stopButton2 = document.getElementById('stop-button-2');
const stopButton3 = document.getElementById('stop-button-3');
const messageElement = document.getElementById('message');
const symbolsInput = document.getElementById('symbols-input');
const setSymbolsButton = document.getElementById('set-symbols-button');
const imageContainer = document.getElementById('image-container');
const modal = document.getElementById('modal');
const closeModal = document.getElementById('close-modal');

let symbols = [];
let spinningIntervals = [null, null, null];
let stopCount = 0;

const symbolHeight = 100; // Height of each symbol in pixels
const symbolsToShow = 3; // Number of symbols visible in the reel

// Event listener for file input
setSymbolsButton.addEventListener('click', function() {
    const files = symbolsInput.files;
    if (files.length >= 5) {
        symbols = [];
        imageContainer.innerHTML = ''; // Clear previous images
        for (const file of files) {
            const reader = new FileReader();
            reader.onload = function(e) {
                symbols.push(e.target.result);
                const img = document.createElement('img');
                img.src = e.target.result;
                img.style.width = '50px';
                img.style.height = '50px';
                imageContainer.appendChild(img);
            };
            reader.readAsDataURL(file);
        }
    } else {
        alert('5枚以上の画像をアップロードしてください。');
    }
});

// Define target symbols for each reel
let targetSymbols = [];

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
        const symbolImg = document.createElement('img');
        symbolImg.src = adjustedSymbols[i % adjustedSymbols.length];
        symbolImg.style.height = `${symbolHeight}px`;
        symbolElement.appendChild(symbolImg);
        reelInner.appendChild(symbolElement);
    }
}

startButton.addEventListener('click', function() {
    if (symbols.length < 5) {
        showModal();
    } else {
        if (!spinningIntervals.some(interval => interval !== null)) {
            targetSymbols = [
                symbols[Math.floor(Math.random() * symbols.length)],
                symbols[Math.floor(Math.random() * symbols.length)],
                symbols[Math.floor(Math.random() * symbols.length)]
            ];
            hideMessages(); // Hide messages when START button is pressed
            startSpin();
        }
    }
});

stopButton1.addEventListener('click', function() {
    stopReel(1);
    stopButton1.disabled = true; // Disable button after pressing
});

stopButton2.addEventListener('click', function() {
    stopReel(2);
    stopButton2.disabled = true; // Disable button after pressing
});

stopButton3.addEventListener('click', function() {
    stopReel(3);
    stopButton3.disabled = true; // Disable button after pressing
});

closeModal.addEventListener('click', function() {
    modal.style.display = "none";
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
    stopButton1.disabled = false;
    stopButton2.disabled = false;
    stopButton3.disabled = false;

    spinningIntervals[0] = setInterval(() => shiftSymbols(reel1), 300); // Adjusted interval for slower spin
    spinningIntervals[1] = setInterval(() => shiftSymbols(reel2), 300); // Adjusted interval for slower spin
    spinningIntervals[2] = setInterval(() => shiftSymbols(reel3), 300); // Adjusted interval for slower spin
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
            startButton.disabled = false;
            break;
    }
    stopCount++;
    if (stopCount === 3) {
        stopButton1.disabled = true;
        stopButton2.disabled = true;
        stopButton3.disabled = true;
        checkMatch();
    }
}

function shiftSymbols(reel) {
    const reelInner = reel.querySelector('.reel-inner');
    const firstSymbol = reelInner.firstElementChild;
    reelInner.appendChild(firstSymbol.cloneNode(true));
    reelInner.removeChild(firstSymbol);
}

function checkMatch() {
    const reel1Symbols = reel1.querySelectorAll('.symbol img');
    const reel2Symbols = reel2.querySelectorAll('.symbol img');
    const reel3Symbols = reel3.querySelectorAll('.symbol img');

    if (reel1Symbols[1].src === reel2Symbols[1].src && reel2Symbols[1].src === reel3Symbols[1].src) {
        showBingoMessage();
    } else if (reel1Symbols[1].src === reel2Symbols[1].src || reel2Symbols[1].src === reel3Symbols[1].src || reel1Symbols[1].src === reel3Symbols[1].src) {
        showChanceMessage();
    } else {
        hideMessages();
    }
}

function showChanceMessage() {
    messageElement.textContent = 'MISS';
    messageElement.classList.add('show');
}

function showBingoMessage() {
    messageElement.textContent = 'PERFECT';
    messageElement.classList.add('show');
}

function hideMessages() {
    messageElement.textContent = '';
    messageElement.classList.remove('show');
}

function showModal() {
    modal.style.display = "block";
}

// Close the modal when the user clicks anywhere outside of the modal
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}
