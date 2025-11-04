const score = document.querySelector('.score');
const startScreen = document.querySelector('.startScreen');
const gameArea = document.querySelector('.gameArea');

let player = { speed: 5, score: 0, start: false };

let keys = { ArrowUp: false, ArrowDown: false, ArrowLeft: false, ArrowRight: false };

// ✅ Start the game on click, tap, or Enter
startScreen.addEventListener('click', start);
startScreen.addEventListener('touchstart', start);

document.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !player.start) start();
});

document.addEventListener('keydown', keyDown);
document.addEventListener('keyup', keyUp);

function keyDown(e) {
  e.preventDefault();
  keys[e.key] = true;
}

function keyUp(e) {
  e.preventDefault();
  keys[e.key] = false;
}

function start(e) {
  e.preventDefault();
  if (player.start) return; // avoid double start on touch devices

  startScreen.classList.add('hide');
  gameArea.innerHTML = '';
  player.start = true;
  player.score = 0;
  window.requestAnimationFrame(playGame);

  // Create road lines
  for (let x = 0; x < 5; x++) {
    let roadLine = document.createElement('div');
    roadLine.classList.add('roadLine');
    roadLine.y = x * 150;
    roadLine.style.top = roadLine.y + 'px';
    gameArea.appendChild(roadLine);
  }

  // Create player car
  let car = document.createElement('div');
  car.setAttribute('class', 'car');
  gameArea.appendChild(car);
  player.x = car.offsetLeft;
  player.y = car.offsetTop;

  // Create enemy cars
  for (let x = 0; x < 3; x++) {
    let enemy = document.createElement('div');
    enemy.classList.add('enemy');
    enemy.y = (x + 1) * 200 * -1;
    enemy.style.top = enemy.y + 'px';
    enemy.style.left = Math.floor(Math.random() * 350) + 'px';
    gameArea.appendChild(enemy);
  }
}

function moveLines() {
  let lines = document.querySelectorAll('.roadLine');
  lines.forEach((line) => {
    line.y += player.speed;
    line.style.top = line.y + 'px';
    if (line.y >= 600) {
      line.y = -150;
    }
  });
}

function moveEnemies(car) {
  let enemies = document.querySelectorAll('.enemy');
  enemies.forEach((enemy) => {
    if (isCollide(car, enemy)) {
      endGame();
    }
    enemy.y += player.speed;
    enemy.style.top = enemy.y + 'px';
    if (enemy.y >= 600) {
      enemy.y = -200;
      enemy.style.left = Math.floor(Math.random() * 350) + 'px';
      player.score++;
    }
  });
}

function isCollide(a, b) {
  const aRect = a.getBoundingClientRect();
  const bRect = b.getBoundingClientRect();
  return !(
    aRect.bottom < bRect.top ||
    aRect.top > bRect.bottom ||
    aRect.right < bRect.left ||
    aRect.left > bRect.right
  );
}

function playGame() {
  let car = document.querySelector('.car');
  let road = gameArea.getBoundingClientRect();

  if (player.start) {
    moveLines();
    moveEnemies(car);

    if (keys.ArrowUp && player.y > 0) player.y -= player.speed;
    if (keys.ArrowDown && player.y < road.height - 120) player.y += player.speed;
    if (keys.ArrowLeft && player.x > 0) player.x -= player.speed;
    if (keys.ArrowRight && player.x < road.width - 50) player.x += player.speed;

    car.style.top = player.y + 'px';
    car.style.left = player.x + 'px';

    window.requestAnimationFrame(playGame);

    player.score++;
    score.innerText = 'Score: ' + player.score;
  }
}

function endGame() {
  player.start = false;
  startScreen.classList.remove('hide');
  startScreen.innerHTML = `
    <h2>💥 Crash!</h2>
    <p>Your Score: ${player.score}</p>
    <p>Press <strong>Enter</strong> or Tap to Restart</p>
  `;
}
