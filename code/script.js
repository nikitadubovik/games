const codeDisplay = document.getElementById('code');
const codeInput = document.getElementById('code-input');
const playButton = document.getElementById('play');
const okButton = document.getElementById('ok');
const resultDiv = document.getElementById('result');
const timerBar = document.getElementById('timer-bar');

let timer;
let timeLeft;
let code;

function generateCode() {
    code = '';
    for (let i = 0; i < 8; i++) {
        code += Math.floor(Math.random() * 10);
    }
    return code;
}

function disableKeys(disable) {
    document.querySelectorAll('.key').forEach(key => {
        if (key.id !== 'play' && key.id !== 'ok') {
            key.disabled = disable;
            key.style.opacity = disable ? 0.5 : 1;
        }
    });
}

function startGame() {
    playButton.disabled = true;
    codeDisplay.textContent = generateCode();
    codeInput.value = '';
    resultDiv.textContent = '';
    timeLeft = 3;
    timerBar.style.width = '100%';
    disableKeys(true);
    timer = setInterval(() => {
        timeLeft--;
        timerBar.style.width = (timeLeft / 3) * 100 + '%';
        if (timeLeft === 0) {
            clearInterval(timer);
            codeDisplay.textContent = '';
            startInputTimer();
        }
    }, 1000);
}

function startInputTimer() {
    timeLeft = 6;
    timerBar.style.width = '100%';
    disableKeys(false);
    timer = setInterval(() => {
        timeLeft--;
        timerBar.style.width = (timeLeft / 6) * 100 + '%';
        if (timeLeft === 0) {
            clearInterval(timer);
            checkCode();
        }
    }, 1000);
}

function checkCode() {
    if (codeInput.value === code) {
        resultDiv.textContent = 'You won!';
    } else {
        resultDiv.textContent = 'You lost.';
    }
    codeDisplay.textContent = `${code}`;
    playButton.disabled = false;
    disableKeys(true);
}

playButton.addEventListener('click', startGame);
okButton.addEventListener('click', checkCode);

document.querySelectorAll('.key').forEach(key => {
    key.addEventListener('click', () => {
        if (key.id !== 'play' && key.id !== 'ok') {
            codeInput.value += key.textContent;
        }
    });
});
