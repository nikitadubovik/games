document.addEventListener('DOMContentLoaded', function() {
  const playBtn = document.getElementById('play-btn');
  const submitBtn = document.getElementById('submit-btn');
  const resultMessage = document.getElementById('result-message');
  const leftInput = document.getElementById('left-input');
  const rightInput = document.getElementById('right-input');
  const leftArrow = document.getElementById('left-arrow');
  const rightArrow = document.getElementById('right-arrow');
  
  // Начальные позиции стрелок
  resetArrowsPosition();
  
  let leftRotations = 0;
  let rightRotations = 0;
  let animationId = null;
  
  playBtn.addEventListener('click', startGame);
  submitBtn.addEventListener('click', checkAnswers);
  
  function resetArrowsPosition() {
    leftArrow.style.transform = 'rotate(45deg)';
    rightArrow.style.transform = 'rotate(-45deg)';
    leftArrow.style.transition = 'none';
    rightArrow.style.transition = 'none';
  }
  
  function startGame() {
    resetGame();
    
    playBtn.disabled = true;
    submitBtn.disabled = true;
    resultMessage.textContent = '';
    leftInput.value = '';
    rightInput.value = '';
    
    resetArrowsPosition();
    generateRandomRotations();
    
    const startTime = performance.now();
    const duration = 7000; // Общее время анимации (7 секунд)
    const accelerationTime = 800; // Время разгона/замедления (0.8 сек)
    
    function animate(time) {
      const elapsed = time - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Рассчитываем текущую фазу движения
      let rotationProgress;
      if (elapsed < accelerationTime) {
        // Фаза разгона
        const t = elapsed / accelerationTime;
        rotationProgress = smoothStart(t) * progress;
      } else if (elapsed > duration - accelerationTime) {
        // Фаза замедления
        const t = (elapsed - (duration - accelerationTime)) / accelerationTime;
        rotationProgress = 1 - smoothStop(t) * (1 - progress);
      } else {
        // Равномерное движение
        rotationProgress = progress;
      }
      
      if (progress < 1) {
        // Левая окружность - по часовой стрелке
        const leftAngle = 45 + rotationProgress * 360 * leftRotations;
        leftArrow.style.transform = `rotate(${leftAngle}deg)`;
        
        // Правая окружность - против часовой стрелки
        const rightAngle = -45 - rotationProgress * 360 * rightRotations;
        rightArrow.style.transform = `rotate(${rightAngle}deg)`;
        
        animationId = requestAnimationFrame(animate);
      } else {
        // Анимация завершена
        resetArrowsPosition();
        playBtn.disabled = false;
        submitBtn.disabled = false;
      }
    }
    
    animationId = requestAnimationFrame(animate);
  }
  
  function generateRandomRotations() {
    const totalRotations = getRandomFromArray([9, 10, 11, 12]);
    
    // Случайное распределение вращений
    const minRotations = 3;
    const maxRotations = 7;
    
    // Генерируем допустимые комбинации
    let validCombinations = [];
    for (let left = minRotations; left <= maxRotations; left++) {
      const right = totalRotations - left;
      if (right >= minRotations && right <= maxRotations) {
        validCombinations.push({left, right});
      }
    }
    
    // Выбираем случайную комбинацию
    const combination = validCombinations[Math.floor(Math.random() * validCombinations.length)];
    leftRotations = combination.left;
    rightRotations = combination.right;
    
    console.log(`Вращения: Левая ${leftRotations}, Правая ${rightRotations}, Всего ${totalRotations}`);
  }
  
  function checkAnswers() {
    const userLeft = parseInt(leftInput.value) || 0;
    const userRight = parseInt(rightInput.value) || 0;
    
    if (userLeft === leftRotations && userRight === rightRotations) {
      resultMessage.textContent = 'Правильно!';
      resultMessage.style.color = '#4CAF50';
    } else {
      resultMessage.textContent = `Неверно! Правильный ответ: Левая ${leftRotations}, Правая ${rightRotations}`;
      resultMessage.style.color = '#f44336';
    }
  }
  
  function resetGame() {
    if (animationId) {
      cancelAnimationFrame(animationId);
      animationId = null;
    }
    
    leftInput.value = '';
    rightInput.value = '';
    resultMessage.textContent = '';
    resultMessage.style.color = '';
  }
  
  // Функции для плавного разгона/замедления
  function smoothStart(t) {
    // Плавный старт с постепенным увеличением скорости
    return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
  }
  
  function smoothStop(t) {
    // Плавная остановка с постепенным уменьшением скорости
    return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
  }
  
  function getRandomFromArray(array) {
    return array[Math.floor(Math.random() * array.length)];
  }
});
