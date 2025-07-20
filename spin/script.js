document.addEventListener('DOMContentLoaded', function() {
  const playBtn = document.getElementById('play-btn');
  const submitBtn = document.getElementById('submit-btn');
  const resultMessage = document.getElementById('result-message');
  const leftInput = document.getElementById('left-input');
  const rightInput = document.getElementById('right-input');
  const leftArrow = document.getElementById('left-arrow');
  const rightArrow = document.getElementById('right-arrow');

  let leftRotations = 0;
  let rightRotations = 0;

  let animationId = null;

  // Углы в градусах
  let leftAngle = 0;   // 0 - стрелка направлена вправо
  let rightAngle = 0;

  // Счётчики пересечений
  let leftCrossesCount = 0;
  let rightCrossesCount = 0;

  // Предыдущее значение угла для подсчёта пересечений
  let leftPrevAngle = 0;
  let rightPrevAngle = 0;

  playBtn.addEventListener('click', startGame);
  submitBtn.addEventListener('click', checkAnswers);

  function resetGame() {
    if (animationId) {
      cancelAnimationFrame(animationId);
      animationId = null;
    }
    leftInput.value = '';
    rightInput.value = '';
    resultMessage.textContent = '';
    resultMessage.style.color = '';
    playBtn.disabled = false;
    submitBtn.disabled = true;

    leftCrossesCount = 0;
    rightCrossesCount = 0;

    leftArrow.style.transform = `rotate(45deg)`;
    rightArrow.style.transform = `rotate(-45deg)`;
  }

  function startGame() {
    resetGame();
    playBtn.disabled = true;
    submitBtn.disabled = true;

    // Генерируем количество полных оборотов (целое число)
    const totalRotations = getRandomFromArray([9, 10, 11, 12]);

    // Распределяем между левой и правой стрелками (от 3 до 7)
    let validCombinations = [];
    for (let left = 3; left <= 7; left++) {
      const right = totalRotations - left;
      if (right >= 3 && right <= 7) {
        validCombinations.push({ left, right });
      }
    }
    const combination = validCombinations[Math.floor(Math.random() * validCombinations.length)];
    leftRotations = combination.left;
    rightRotations = combination.right;

    console.log(`Вращения: Левая ${leftRotations}, Правая ${rightRotations}`);

    // Начальные углы
    leftAngle = 0;
    rightAngle = 0;
    leftPrevAngle = 0;
    rightPrevAngle = 0;

    leftCrossesCount = 0;
    rightCrossesCount = 0;

    const duration = 7000; // 7 секунд
    const startTime = performance.now();

    function animate(time) {
      const elapsed = time - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Плавный разгон/замедление с ease-in-out
      const easedProgress = easeInOutCubic(progress);

      // Углы по прогрессу
      leftAngle = easedProgress * 360 * leftRotations;   // Вращение по часовой (угол растёт)
      rightAngle = -easedProgress * 360 * rightRotations; // Вращение против часовой (угол уменьшается)

      // Обновляем стрелки
      leftArrow.style.transform = `rotate(${45 + leftAngle}deg)`;
      rightArrow.style.transform = `rotate(${-45 - rightAngle}deg)`;

      // Проверяем пересечения с меткой (метка в 0 градусах)
      leftCrossesCount += countCrosses(leftPrevAngle, leftAngle);
      rightCrossesCount += countCrosses(rightPrevAngle, rightAngle);

      leftPrevAngle = leftAngle;
      rightPrevAngle = rightAngle;

      if (progress < 1) {
        animationId = requestAnimationFrame(animate);
      } else {
        // Завершение анимации
        playBtn.disabled = false;
        submitBtn.disabled = false;

        // Сбрасываем углы стрелок
        leftArrow.style.transform = `translate(-50%, -50%) rotate(0deg)`;
        rightArrow.style.transform = `translate(-50%, -50%) rotate(0deg)`;
      }
    }

    animationId = requestAnimationFrame(animate);
  }

  function countCrosses(prevAngle, currentAngle) {
    // Подсчёт, сколько раз стрелка пересекла угол 0 (или 360)
    // Угол может расти или уменьшаться (для правой стрелки)
    // Считаем количество переходов через 0
    let crosses = 0;

    // Нормализуем углы 0..360
    const prev = ((prevAngle % 360) + 360) % 360;
    const curr = ((currentAngle % 360) + 360) % 360;

    if (currentAngle > prevAngle) {
      // Вращение по часовой (угол растёт)
      if (prev > curr) {
        crosses = 1;
      }
    } else if (currentAngle < prevAngle) {
      // Вращение против часовой (угол уменьшается)
      if (prev < curr) {
        crosses = 1;
      }
    }
    return crosses;
  }

  function checkAnswers() {
    const userLeft = parseInt(leftInput.value) || 0;
    const userRight = parseInt(rightInput.value) || 0;

    if (userLeft === leftRotations && userRight === rightRotations) {
      resultMessage.textContent = 'Correct!';
      resultMessage.style.color = '#4CAF50';
    } else {
      resultMessage.textContent = `Wrong! Correct answers: Left ${leftRotations}, Right ${rightRotations}`;
      resultMessage.style.color = '#f44336';
    }
  }

  function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  function getRandomFromArray(array) {
    return array[Math.floor(Math.random() * array.length)];
  }
});
