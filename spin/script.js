document.addEventListener('DOMContentLoaded', function() {
  const playBtn = document.getElementById('play-btn');
  const submitBtn = document.getElementById('submit-btn');
  const resultMessage = document.getElementById('result-message');
  const leftInput = document.getElementById('left-input');
  const rightInput = document.getElementById('right-input');
  const leftArrow = document.getElementById('left-arrow');
  const rightArrow = document.getElementById('right-arrow');
  
  // Начальные позиции (левая стрелка вправо-вверх под 45 градусов)
  resetArrowsPosition();
  
  let leftCrosses = 0;
  let rightCrosses = 0;
  let animationId = null;
  let leftRotations = 0;
  let rightRotations = 0;
  
  playBtn.addEventListener('click', startGame);
  submitBtn.addEventListener('click', checkAnswers);
  
  function resetArrowsPosition() {
    leftArrow.style.transform = 'rotate(45deg)';
    rightArrow.style.transform = 'rotate(-45deg)';
  }
  
  function startGame() {
    resetGame();
    
    playBtn.disabled = true;
    submitBtn.disabled = true;
    resultMessage.textContent = '';
    leftInput.value = '';
    rightInput.value = '';
    
    resetArrowsPosition();
    
    // Генерируем случайное количество вращений
    generateRandomRotations();
    
    const startTime = performance.now();
    const duration = 4000; // Уменьшили длительность для более быстрого вращения
    
    function animate(time) {
      const elapsed = time - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Функция плавного ускорения/замедления
      const easingProgress = easeInOutCubic(progress);
      
      if (progress < 1) {
        // Левая окружность - по часовой стрелке
        const leftAngle = 45 + easingProgress * 360 * leftRotations;
        leftArrow.style.transform = `rotate(${leftAngle}deg)`;
        
        // Правая окружность - против часовой стрелки
        const rightAngle = -45 - easingProgress * 360 * rightRotations;
        rightArrow.style.transform = `rotate(${rightAngle}deg)`;
        
        // Считаем пересечения
        leftCrosses = Math.floor(leftAngle / 360);
        rightCrosses = Math.floor(Math.abs(rightAngle) / 360);
        
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
    const totalRotations = getRandomFromArray([10, 11, 12, 13, 14]);
    leftRotations = 3 + Math.floor(Math.random() * 3); // От 3 до 5
    rightRotations = totalRotations - leftRotations;
    
    console.log(`Rotations: Left ${leftRotations}, Right ${rightRotations}, Total ${totalRotations}`);
  }
  
  function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }
  
  function checkAnswers() {
    const userLeft = parseInt(leftInput.value) || 0;
    const userRight = parseInt(rightInput.value) || 0;
    
    if (userLeft === leftRotations && userRight === rightRotations) {
      resultMessage.textContent = 'Correct!';
      resultMessage.style.color = '#4CAF50';
    } else {
      resultMessage.textContent = `Wrong! Correct was: Left ${leftRotations}, Right ${rightRotations}`;
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
  }
  
  function getRandomFromArray(array) {
    return array[Math.floor(Math.random() * array.length)];
  }
});
