document.addEventListener('DOMContentLoaded', function() {
  const playBtn = document.getElementById('play-btn');
  const submitBtn = document.getElementById('submit-btn');
  const resultMessage = document.getElementById('result-message');
  const leftInput = document.getElementById('left-input');
  const rightInput = document.getElementById('right-input');
  const leftArrow = document.getElementById('left-arrow');
  const rightArrow = document.getElementById('right-arrow');
  
  // Начальные позиции стрелок (левая - вправо вверх, правая - влево вверх)
  resetArrowsPosition();
  
  let leftRotations = 0;
  let rightRotations = 0;
  let animationId = null;
  
  playBtn.addEventListener('click', startGame);
  submitBtn.addEventListener('click', checkAnswers);
  
  function resetArrowsPosition() {
    leftArrow.style.transform = 'translate(50%, 50%) rotate(45deg)';
    rightArrow.style.transform = 'translate(50%, 50%) rotate(-45deg)';
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
    const duration = 6000; // Увеличили общее время вращения (6 секунд)
    const accelerationTime = 250; // Уменьшили время разгона/замедления (0.25 сек)
    
    function animate(time) {
      const elapsed = time - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Рассчитываем текущую фазу движения
      let rotationProgress;
      if (elapsed < accelerationTime) {
        // Фаза разгона
        rotationProgress = easeIn(elapsed / accelerationTime) * progress;
      } else if (elapsed > duration - accelerationTime) {
        // Фаза замедления
        rotationProgress = 1 - easeOut((duration - elapsed) / accelerationTime) * (1 - progress);
      } else {
        // Равномерное движение
        rotationProgress = progress;
      }
      
      if (progress < 1) {
        // Левая окружность - по часовой стрелке
        const leftAngle = 45 + rotationProgress * 360 * leftRotations;
        leftArrow.style.transform = `translate(50%, 50%) rotate(${leftAngle}deg)`;
        
        // Правая окружность - против часовой стрелки
        const rightAngle = -45 - rotationProgress * 360 * rightRotations;
        rightArrow.style.transform = `translate(50%, 50%) rotate(${rightAngle}deg)`;
        
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
    
    // Случайно выбираем, какая стрелка будет вращаться быстрее
    const leftIsFaster = Math.random() > 0.5;
    
    if (leftIsFaster) {
      leftRotations = 4 + Math.floor(Math.random() * 3); // 4-6 вращений
      rightRotations = totalRotations - leftRotations;
      
      // Гарантируем, что правые вращения будут 3-7
      while (rightRotations < 3 || rightRotations > 7) {
        leftRotations = 4 + Math.floor(Math.random() * 3);
        rightRotations = totalRotations - leftRotations;
      }
    } else {
      rightRotations = 4 + Math.floor(Math.random() * 3); // 4-6 вращений
      leftRotations = totalRotations - rightRotations;
      
      // Гарантируем, что левые вращения будут 3-7
      while (leftRotations < 3 || leftRotations > 7) {
        rightRotations = 4 + Math.floor(Math.random() * 3);
        leftRotations = totalRotations - rightRotations;
      }
    }
    
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
  function easeIn(t) {
    return t * t;
  }
  
  function easeOut(t) {
    return 1 - (1 - t) * (1 - t);
  }
  
  function getRandomFromArray(array) {
    return array[Math.floor(Math.random() * array.length)];
  }
});
