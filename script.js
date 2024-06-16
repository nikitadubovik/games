const gameBoard = document.getElementById('game-board');
const timerElement = document.getElementById('timer');
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
  createGameBoard();
  let time = 5;
  let timeRemainingMs = time * 1000;

  interval = setInterval(() => {
    timeRemainingMs -= 10;
    time = (timeRemainingMs / 1000).toFixed(2);
    timerElement.textContent = time;

    if (timeRemainingMs <= 0) {
      clearInterval(interval);
      const cells = Array.from(gameBoard.children);
      const missingIndex = Math.floor(Math.random() * cells.length);
      missingNumber = cells[missingIndex].textContent;
      cells[missingIndex].textContent = '';
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
  if (!gameStarted) {
    const userInput = inputField.value.trim();
    if (userInput === missingNumber) {
      resultElement.textContent = 'Correct';
      const cells = Array.from(gameBoard.children);
      const missingCell = cells.find(cell => !cell.textContent);
      missingCell.textContent = missingNumber;

            missingCell.classList.add('correct');
          } else {
            resultElement.textContent = 'Wrong';
            const cells = Array.from(gameBoard.children);
            const missingCell = cells.find(cell => !cell.textContent);
            missingCell.textContent = missingNumber;
            missingCell.classList.add('incorrect');
          }

          inputField.value = '';
          missingNumber = null; // Сбросить исчезнувшее число
        }
      });
