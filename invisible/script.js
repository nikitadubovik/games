document.addEventListener('DOMContentLoaded', function() {
  const playBtn = document.getElementById('play-btn');
  const resultMessage = document.getElementById('result-message');
  const cells = document.querySelectorAll('.cell');
  const gameBoard = document.querySelector('.game-board');
  let movingSquare = null;
  let intervalId = null;
  let timeoutId = null;
  let demoEndTimeoutId = null;

  const moveOrder = [12, 8, 4, 0, 1, 2, 3, 7, 11, 15, 14, 13]; // Порядок перемещения

  playBtn.addEventListener('click', startGame);

  function startGame() {
    // Сначала сбросим текущую игру
    resetGame();

    // Затем задержка в 500ms перед началом новой игры
    setTimeout(() => {
      playBtn.disabled = true;
      resultMessage.textContent = '';

      // Immediately show moving square in a random cell
      const initialCellIndex = moveOrder[Math.floor(Math.random() * moveOrder.length)];
      const initialCell = cells[initialCellIndex];
      movingSquare = createMovingSquare(initialCell);

      // Start moving
      let currentIndex = moveOrder.indexOf(initialCellIndex);
      intervalId = setInterval(() => {
        currentIndex = (currentIndex + 1) % moveOrder.length;
        const nextCellIndex = moveOrder[currentIndex];
        const nextCell = cells[nextCellIndex];
        moveSquareToNextCell(nextCell);

        // Log current position
        console.log(`Moving to cell ${nextCellIndex}`);
      }, 500);

      // Schedule disappearance with increased delay
      const hideTime = getRandomFromArray([4000, 4500, 5000]);
      timeoutId = setTimeout(hideMovingSquare, hideTime);
      console.log(`Square will hide in ${hideTime} ms`);

      // Disable cell selection during demonstration
      gameBoard.removeEventListener('click', handleCellClick);

      // Schedule demo end
      const demoEndTime = getRandomFromArray([10250, 10750, 11250, 11750, 12250]);
      demoEndTimeoutId = setTimeout(showQuestionMark, demoEndTime);
      console.log(`Demo will end in ${demoEndTime} ms`);
    }, 500);
  }

  function createMovingSquare(cell) {
    const square = document.createElement('div');
    square.classList.add('moving-square');
    cell.appendChild(square);
    return square;
  }

  function moveSquareToNextCell(nextCell) {
    const square = gameBoard.querySelector('.moving-square');
    nextCell.appendChild(square);
  }

  function hideMovingSquare() {
    clearInterval(intervalId);
    if (movingSquare) {
      movingSquare.style.visibility = 'hidden'; // Hide the square visually
      console.log('Square hidden');
    }

    // Enable cell selection after a delay
    setTimeout(enableCellSelection, 500);
  }

  function enableCellSelection() {
    gameBoard.addEventListener('click', handleCellClick);
    console.log('Cell selection enabled');
  }

  function handleCellClick(event) {
    const clickedCell = event.target.closest('.cell');
    if (!clickedCell || clickedCell.classList.contains('empty')) return;

    gameBoard.removeEventListener('click', handleCellClick);

    // Определение текущей ячейки, где остановился квадрат
    const currentCell = gameBoard.querySelector('.moving-square').parentNode;
    const currentCellIndex = Array.from(cells).indexOf(currentCell);

    // Проверка выбранной ячейки
    if (clickedCell === currentCell) {
      resultMessage.textContent = 'Correct!';
      currentCell.classList.add('correct');
      console.log('Correct answer selected');
    } else {
      resultMessage.textContent = 'Wrong!';
      clickedCell.classList.add('wrong');
      currentCell.classList.add('correct');
      console.log('Wrong answer selected');
    }

    // Показ правильной ячейки визуально
    setTimeout(() => {
      currentCell.appendChild(createMovingSquare(currentCell));
    }, 500);

    playBtn.disabled = false;
  }

  function showQuestionMark() {
    const questionMark = document.createElement('div');
    questionMark.textContent = '?';
    questionMark.classList.add('moving-square');
    questionMark.style.fontSize = '60px';
    gameBoard.appendChild(questionMark);

    clearTimeout(timeoutId); // stop the hiding timeout if it hasn't fired yet

    // Remove question mark after some time
    setTimeout(function() {
      questionMark.remove();
      playBtn.disabled = false;
      console.log('Question mark shown');
    }, 2000);
  }

  function resetGame() {
    clearInterval(intervalId);
    clearTimeout(timeoutId);
    clearTimeout(demoEndTimeoutId);
    if (movingSquare) {
      movingSquare.remove();
      movingSquare = null;
    }
    cells.forEach(cell => {
      cell.classList.remove('correct', 'wrong');
      // Удаляем визуальное отображение квадрата, если он есть
      if (cell.querySelector('.moving-square')) {
        cell.removeChild(cell.querySelector('.moving-square'));
      }
    });
    resultMessage.textContent = '';
    console.log('Game reset');
  }

  function getRandomFromArray(array) {
    const randomIndex = Math.floor(Math.random() * array.length);
    return array[randomIndex];
  }
});
