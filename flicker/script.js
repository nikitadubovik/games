const gameBoard = document.querySelector('.game-board');
const playButton = document.querySelector('.play-btn');
const checkButton = document.querySelector('.check-btn');
const answerInput = document.querySelector('.answer-input');
const resultMessage = document.querySelector('.result-message');

const CELL_COUNT = 8 * 8;
let flashedCells = [];
let allCells = [];
let isGameInProgress = false;

function createGameBoard() {
  for (let i = 0; i < CELL_COUNT; i++) {
    const cell = document.createElement('div');
    cell.classList.add('cell');
    const flashedSquare = document.createElement('div');
    flashedSquare.classList.add('flashed-square');
    cell.appendChild(flashedSquare);
    gameBoard.appendChild(cell);
    allCells.push(i); // Добавляем ячейку в массив всех ячеек
  }
}

function flashCells() {
  const flashDuration = 1100;
  const minFlashDelay = 2000;
  const maxFlashDelay = 4000; 
  const minFlashedCells = 9;
  const maxFlashedCells = 13;

  isGameInProgress = true;
  console.log('Game started');
  const delay = Math.floor(Math.random() * (maxFlashDelay - minFlashDelay)) + minFlashDelay;
  setTimeout(() => {
    flashedCells = [];
    const cellElements = document.querySelectorAll('.cell .flashed-square');
    const flashedCount = Math.min(Math.floor(Math.random() * (maxFlashedCells - minFlashedCells + 1)) + minFlashedCells, allCells.length); // Не допускаем выбор больше ячеек, чем осталось в массиве
    console.log(`Flashing ${flashedCount} cells`);
    for (let i = 0; i < flashedCount; i++) {
      const randomIndex = Math.floor(Math.random() * allCells.length);
      const flashedSquare = cellElements[allCells[randomIndex]];
      flashedSquare.style.display = 'block';
      flashedCells.push(allCells[randomIndex]);
      allCells.splice(randomIndex, 1); // Удаляем выбранную ячейку из массива всех ячеек
    }
    setTimeout(() => {
      cellElements.forEach((flashedSquare, index) => {
        if (flashedCells.includes(index)) {
          flashedSquare.style.display = 'none';
        }
      });
      console.log('Flashing ended');
    }, flashDuration);
  }, delay);
}

checkButton.addEventListener('click', () => {
  console.log('Check button clicked');
  if (!isGameInProgress) {
    console.log('Game is not in progress');
    return;
  }

  const userAnswer = Number(answerInput.value);
  console.log(`User answer: ${userAnswer}, Correct answer: ${flashedCells.length}`);
  if (userAnswer === flashedCells.length) {
    resultMessage.textContent = 'Correct!';
  } else {
    resultMessage.textContent = 'Wrong!';
  }
  const cellElements = document.querySelectorAll('.cell .flashed-square');
  flashedCells.forEach((index) => {
    cellElements[index].style.display = 'block';
  });
  isGameInProgress = false;
  allCells = Array.from({ length: CELL_COUNT }, (_, i) => i); // Восстанавливаем массив всех ячеек
});

playButton.addEventListener('click', () => {
  console.log('Play button clicked');
  clearGameBoard();
  resultMessage.textContent = ''; // Очистка сообщения о результате
  flashCells();
});

function clearGameBoard() {
  const cellElements = document.querySelectorAll('.cell .flashed-square');
  cellElements.forEach((flashedSquare) => {
    flashedSquare.style.display = 'none';
  });
  flashedCells = [];
  isGameInProgress = false;
  allCells = Array.from({ length: CELL_COUNT }, (_, i) => i); // Восстанавливаем массив всех ячеек
  console.log('Game board cleared');
}

createGameBoard();
