document.addEventListener('DOMContentLoaded', function() {
  const playBtn = document.getElementById('play-btn');
  const submitBtn = document.getElementById('submit-btn');
  const resultMessage = document.getElementById('result-message');
  const leftInput = document.getElementById('left-input');
  const rightInput = document.getElementById('right-input');
  const leftArrow = document.getElementById('left-arrow');
  const rightArrow = document.getElementById('right-arrow');
  
  // Initial positions
  leftArrow.style.transform = 'translate(25px, 0) rotate(45deg)';
  rightArrow.style.transform = 'translate(-25px, 0) rotate(-45deg)';
  
  let leftCrosses = 0;
  let rightCrosses = 0;
  let animationId = null;
  
  playBtn.addEventListener('click', startGame);
  submitBtn.addEventListener('click', checkAnswers);
  
  function startGame() {
    // Reset game state
    resetGame();
    
    playBtn.disabled = true;
    submitBtn.disabled = true;
    resultMessage.textContent = '';
    leftInput.value = '';
    rightInput.value = '';
    
    // Reset arrow positions
    leftArrow.style.transform = 'translate(25px, 0) rotate(45deg)';
    rightArrow.style.transform = 'translate(-25px, 0) rotate(-45deg)';
    
    leftCrosses = 0;
    rightCrosses = 0;
    
    // Start animations
    const startTime = performance.now();
    const duration = 5000; // 5 seconds
    
    function animate(time) {
      const elapsed = time - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      if (progress < 1) {
        // Left circle rotates clockwise (increasing angle)
        const leftAngle = 45 + progress * 360 * 3; // 3 full rotations
        leftArrow.style.transform = `translate(25px, 0) rotate(${leftAngle}deg)`;
        
        // Right circle rotates counter-clockwise (decreasing angle)
        const rightAngle = -45 - progress * 360 * 2; // 2 full rotations
        rightArrow.style.transform = `translate(-25px, 0) rotate(${rightAngle}deg)`;
        
        // Count crosses (every 360 degrees)
        leftCrosses = Math.floor(leftAngle / 360);
        rightCrosses = Math.floor(Math.abs(rightAngle) / 360);
        
        animationId = requestAnimationFrame(animate);
      } else {
        // Animation complete
        leftArrow.style.transform = 'translate(25px, 0) rotate(45deg)';
        rightArrow.style.transform = 'translate(-25px, 0) rotate(-45deg)';
        playBtn.disabled = false;
        submitBtn.disabled = false;
      }
    }
    
    animationId = requestAnimationFrame(animate);
  }
  
  function checkAnswers() {
    const userLeft = parseInt(leftInput.value) || 0;
    const userRight = parseInt(rightInput.value) || 0;
    
    if (userLeft === leftCrosses && userRight === rightCrosses) {
      resultMessage.textContent = 'Correct!';
      resultMessage.style.color = '#4CAF50';
    } else {
      resultMessage.textContent = `Wrong! Correct was: Left ${leftCrosses}, Right ${rightCrosses}`;
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
});
