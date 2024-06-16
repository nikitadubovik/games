const gameBoard = document.getElementById('game-board');
const timerElement = document.getElementById('timer');
const inputWrapper = document.getElementById('input-wrapper');
const inputField = document.getElementById('input-field');
const playButton = document.getElementById('play-button');
const checkButton = document.getElementById('check-button');
const resultElement = document.getElementById('result');

let interval;
let gameStarted = false;
let missingNumber;

function generateRandomNumber() {
    return Math.floor(Math.random() * 10);
}

function createGameBoard() {
    gameBoard.innerHTML = '';
    for (let i = 0; i < 30; i++) {
        const cell = document.createElement('div');
        cell.textContent = generateRandomNumber();
        gameBoard.appendChild(cell);
    }
}

function startGame() {
    gameStarted = true;
    resultElement.textContent = '';
    inputWrapper.style.display = 'none';
    createGameBoard();
    let time = 5;
    let timeRemainingMs = time * 1000;

    interval = setInterval(() => {
        timeRemainingMs -= 10;
        timerElement.textContent = time = (timeRemainingMs / 1000).toFixed(2);

        if (timeRemainingMs <= 0) {
            clearInterval(interval);
            const cells = Array.from(gameBoard.children);
            const missingIndex = Math.floor(Math.random() * cells.length);
            missingNumber = cells[missingIndex].textContent;
            cells[missingIndex].textContent = '';
            inputWrapper.style.display = 'block';
            gameStarted = false;
        }
    }, 10);
}

playButton.addEventListener('click', () => {
    if (!gameStarted) {
        startGame();
    }
});

checkButton.addEventListener('click', () => {
    if (inputField.value.trim() === missingNumber) {
        const cells = Array.from(gameBoard.children);
        const missingCell = cells.find(cell => !cell.textContent);
        missingCell.textContent = missingNumber;
        missingCell.classList.add('correct');
        resultElement.textContent = 'Вы угадали!';
    } else {
        const cells = Array.from(gameBoard.children);
        const missingCell = cells.find(cell => !cell.textContent);
        missingCell.textContent = missingNumber;
        missingCell.classList.add('incorrect');
        resultElement.textContent = 'Неправильно.';
    }
    
    inputWrapper.style.display = 'none'; // Скроем поля ввода повторно
    inputField.value = ''; // Очистим поле ввода
});
