let missingCellIndex;
let cells = [];
const gridElement = document.getElementById('grid');
const messageElement = document.getElementById('message');
const playButton = document.getElementById('playButton');
let animationInProgress = false;

function initializeGame() {
    gridElement.innerHTML = '';
    cells = [];
    for (let i = 0; i < 16; i++) {
        const cell = document.createElement('div');
        cell.className = 'cell';
        cell.innerHTML = '<div class="cell-inner"></div>';
        cell.addEventListener('click', () => checkCell(i));
        gridElement.appendChild(cell);
        cells.push(cell);
    }
    messageElement.textContent = '';
}

function startGame() {
    initializeGame();
    missingCellIndex = Math.floor(Math.random() * 16);
    const visibleCells = cells.filter((_, index) => index !== missingCellIndex);

    // Shuffle the visible cells for random order
    for (let i = visibleCells.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [visibleCells[i], visibleCells[j]] = [visibleCells[j], visibleCells[i]];
    }

    let currentIndex = 0;
    animationInProgress = true;
    playButton.disabled = true;

    const intervalId = setInterval(() => {
        if (currentIndex > 0) {
            visibleCells[currentIndex - 1].classList.remove('active');
        }
        if (currentIndex < visibleCells.length) {
            visibleCells[currentIndex].classList.add('active');
            currentIndex++;
        } else {
            clearInterval(intervalId);
            setTimeout(() => {
                visibleCells.forEach(cell => cell.classList.remove('active'));
                enableCells();
                animationInProgress = false;
                playButton.disabled = false;
            }, 700); // Time cells remain active after last blink
        }
    }, 1000); // Total interval between cells blinks (0.7s active + 0.3s delay)
}

function enableCells() {
    cells.forEach(cell => cell.style.pointerEvents = 'auto');
}

function disableCells() {
    cells.forEach(cell => cell.style.pointerEvents = 'none');
}

function checkCell(index) {
    if (animationInProgress) return; // Prevent clicking during animation
    disableCells(); // Prevent changing the choice after first click

    if (index === missingCellIndex) {
        messageElement.textContent = 'Correct!';
        cells[missingCellIndex].classList.add('correct');
    } else {
        messageElement.textContent = 'Wrong';
        cells[index].classList.add('wrong');
        cells[missingCellIndex].classList.add('correct');
    }
    playButton.disabled = false;
}

playButton.addEventListener('click', () => {
    playButton.disabled = true;
    startGame();
});

initializeGame();
