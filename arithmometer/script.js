const gameBoard = document.querySelector('.game-board');
const playButton = document.querySelector('.play-btn');
const checkButton = document.querySelector('.check-btn');
const answerInput = document.querySelector('.answer-input');
const resultMessage = document.querySelector('.result-message');
const resultNumber = document.querySelector('.result-number');

const ROW_COUNT = 5;
let totalSquares = 0;
let isGameInProgress = false;

function createGameBoard() {
  for (let row = 0; row < ROW_COUNT; row++) {
    for (let col = 0; col < ROW_COUNT; col++) {
      const cell = document.createElement('div');
      cell.classList.add('cell');
      cell.style.top = `${row * 75}px`;
      cell.style.left = `${col * 75}px`;
      const square = document.createElement('div');
      square.classList.add('square');
      cell.appendChild(square);
      gameBoard.appendChild(cell);
    }
  }
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function showSquares() {
  totalSquares = 0;
  let rowDelay = 0;

  for (let row = 0; row < 10; row++) {
    const squaresInRow = getRandomInt(2, 5);
    totalSquares += squaresInRow;
    const currentRow = row % ROW_COUNT;

    setTimeout(() => {
      const rowCells = Array.from(gameBoard.children).slice(currentRow * ROW_COUNT, (currentRow + 1) * ROW_COUNT);
      const shuffledCells = rowCells.sort(() => 0.5 - Math.random()).slice(0, squaresInRow);

      shuffledCells.forEach(cell => {
        const square = cell.querySelector('.square');
        square.style.display = 'block';
      });

      setTimeout(() => {
        shuffledCells.forEach(cell => {
          const square = cell.querySelector('.square');
          square.style.display = 'none';
        });

        if (row === 9) {
          isGameInProgress = true;
          playButton.disabled = false;
          checkButton.disabled = false;
          answerInput.disabled = false;
        }
      }, 900);
    }, rowDelay);

    rowDelay += 900;
  }
}

playButton.addEventListener('click', () => {
  playButton.disabled = true;
  checkButton.disabled = true;
  answerInput.disabled = true;
  clearGameBoard();
  resultMessage.style.display = 'none';
  resultNumber.style.display = 'none';
  setTimeout(() => {
    showSquares();
  }, 1000);
});

checkButton.addEventListener('click', () => {
  if (!isGameInProgress) return;

  const userAnswer = Number(answerInput.value);
  resultNumber.textContent = totalSquares;
  setTimeout(() => {
    resultMessage.textContent = userAnswer === totalSquares ? 'Correct!' : 'Wrong!';
    resultMessage.style.display = 'block';
    resultNumber.style.display = 'block';
  }, 1000);
  isGameInProgress = false;
});

function clearGameBoard() {
  const squares = document.querySelectorAll('.square');
  squares.forEach(square => {
    square.style.display = 'none';
  });
  totalSquares = 0;
  isGameInProgress = false;
}

createGameBoard();
