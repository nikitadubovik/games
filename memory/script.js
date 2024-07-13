const gameBoard = document.querySelector('.game-board');
const playButton = document.querySelector('.play-btn');

const CELL_COUNT = 8 * 8;
const FLASH_COUNT = 18;
let flashedCells = [];
let missingCell = null;
let isGameInProgress = false;

function createGameBoard() {
  for (let i = 0; i < CELL_COUNT; i++) {
    const cell = document.createElement('div');
    cell.classList.add('cell');
    cell.addEventListener('click', () => handleCellClick(i));
    gameBoard.appendChild(cell);
  }
}

function getRandomCells(count) {
  const cells = Array.from({ length: CELL_COUNT }, (_, i) => i);
  const randomCells = [];
  for (let i = 0; i < count; i++) {
    const randomIndex = Math.floor(Math.random() * cells.length);
    randomCells.push(cells[randomIndex]);
    cells.splice(randomIndex, 1);
  }
  return randomCells;
}

function flashCells() {
  flashedCells = getRandomCells(FLASH_COUNT);
  const cellElements = document.querySelectorAll('.cell');
  flashedCells.forEach(index => {
    const flashedSquare = document.createElement('div');
    flashedSquare.classList.add('flashed-square');
    cellElements[index].appendChild(flashedSquare);
    flashedSquare.style.display = 'block';
  });

  setTimeout(() => {
    flashedCells.forEach(index => {
      cellElements[index].innerHTML = '';
    });
    setTimeout(() => {
      missingCell = flashedCells.pop();
      flashedCells.forEach(index => {
        const flashedSquare = document.createElement('div');
        flashedSquare.classList.add('flashed-square');
        cellElements[index].appendChild(flashedSquare);
        flashedSquare.style.display = 'block';
      });
      isGameInProgress = true;
      playButton.disabled = false;
    }, 2000);
  }, 4000);
}

function handleCellClick(index) {
  if (!isGameInProgress) return;
  const cellElements = document.querySelectorAll('.cell');
  if (cellElements[index].querySelector('.selected-square')) return;

  const selectedSquare = document.createElement('div');
  selectedSquare.classList.add('selected-square');
  cellElements[index].appendChild(selectedSquare);
  isGameInProgress = false;

  setTimeout(() => {
    if (index === missingCell) {
      selectedSquare.classList.remove('selected-square');
      selectedSquare.classList.add('correct-square');
    } else {
      cellElements[missingCell].innerHTML = '';
      const correctSquare = document.createElement('div');
      correctSquare.classList.add('correct-square');
      cellElements[missingCell].appendChild(correctSquare);
    }
  }, 2000);
}

playButton.addEventListener('click', () => {
  playButton.disabled = true;
  clearGameBoard();
  setTimeout(() => {
    flashCells();
  }, 1000);
});

function clearGameBoard() {
  const cellElements = document.querySelectorAll('.cell');
  cellElements.forEach(cell => {
    cell.style.backgroundColor = '#333';
    cell.innerHTML = '';
  });
  flashedCells = [];
  missingCell = null;
  isGameInProgress = false;
}

createGameBoard();
