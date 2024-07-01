document.getElementById('spin-button').addEventListener('click', function() {
    const reel1 = document.getElementById('reel1');
    const reel2 = document.getElementById('reel2');
    const reel3 = document.getElementById('reel3');

    const symbols = ['🍒', '🍋', '🍉', '🍇', '🍓'];

    reel1.classList.add('spin');
    reel2.classList.add('spin');
    reel3.classList.add('spin');

    setTimeout(() => {
        reel1.classList.remove('spin');
        reel2.classList.remove('spin');
        reel3.classList.remove('spin');

        reel1.textContent = symbols[Math.floor(Math.random() * symbols.length)];
        reel2.textContent = symbols[Math.floor(Math.random() * symbols.length)];
        reel3.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    }, 1000);
});
