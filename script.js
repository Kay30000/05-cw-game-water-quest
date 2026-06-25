// Game configuration and state variables
const GOAL_CANS = 25;        // Total items needed to collect
let currentCans = 0;         // Current number of items collected
let gameActive = false;      // Tracks if game is currently running
let gamePaused = false;      // Tracks whether the spawn loop is paused
let spawnInterval;           // Holds the interval for spawning items
let timerInterval;           // Holds the interval for the countdown timer
let timeLeft = 30;           // Countdown timer value in seconds
let confettiInterval;        // Holds the interval for confetti cleanup

function updateCanCount() {
  document.getElementById('current-cans').textContent = currentCans;
}

function updateTimer() {
  document.getElementById('timer').textContent = timeLeft;
}

function showConfetti() {
  const confettiLayer = document.getElementById('confetti-layer');
  confettiLayer.innerHTML = '';

  for (let i = 0; i < 28; i++) {
    const confetti = document.createElement('span');
    confetti.className = 'confetti-piece';
    confetti.style.left = `${Math.random() * 100}%`;
    confetti.style.backgroundColor = ['#FFC907', '#2E9DF7', '#4FCB53', '#FF902A', '#F5402C'][Math.floor(Math.random() * 5)];
    confetti.style.animationDelay = `${Math.random() * 0.35}s`;
    confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
    confettiLayer.appendChild(confetti);
  }

  clearTimeout(confettiInterval);
  confettiInterval = setTimeout(() => {
    confettiLayer.innerHTML = '';
  }, 2500);
}

// Creates the 3x3 game grid where items will appear
function createGrid() {
  const grid = document.querySelector('.game-grid');
  grid.innerHTML = ''; // Clear any existing grid cells
  for (let i = 0; i < 9; i++) {
    const cell = document.createElement('div');
    cell.className = 'grid-cell'; // Each cell represents a grid square
    grid.appendChild(cell);
  }
}

// Ensure the grid is created when the page loads
createGrid();
updateTimer();

// Spawns a new item in a random grid cell
function spawnWaterCan() {
  if (!gameActive || gamePaused) return; // Stop if the game is not active or paused
  const cells = document.querySelectorAll('.grid-cell');
  
  // Clear all cells before spawning a new water can
  cells.forEach(cell => (cell.innerHTML = ''));

  // Select a random cell from the grid to place the water can
  const randomCell = cells[Math.floor(Math.random() * cells.length)];

  // Use a template literal to create the wrapper and water-can element
  randomCell.innerHTML = `
    <div class="water-can-wrapper">
      <div class="water-can"></div>
    </div>
  `;
}

// Handle collecting a water can when it is clicked
document.querySelector('.game-grid').addEventListener('click', event => {
  if (!gameActive || gamePaused || !event.target.classList.contains('water-can')) return;

  currentCans += 1;
  updateCanCount();
  event.target.closest('.grid-cell').innerHTML = '';
});

// Initializes and starts a new game
function startGame() {
  if (gameActive) return; // Prevent starting a new game if one is already active
  gameActive = true;
  gamePaused = false;
  currentCans = 0;
  timeLeft = 30;
  document.getElementById('start-game').textContent = 'Start Game';
  updateCanCount();
  updateTimer();
  createGrid(); // Set up the game grid
  document.getElementById('confetti-layer').innerHTML = '';
  spawnInterval = setInterval(spawnWaterCan, 1000); // Spawn water cans every second
  timerInterval = setInterval(() => {
    if (!gameActive || gamePaused) return;

    timeLeft -= 1;
    updateTimer();

    if (timeLeft <= 0) {
      timeLeft = 0;
      updateTimer();
      endGame();
    }
  }, 1000);
}

function pauseGame() {
  if (!gameActive) return;

  const pauseButton = document.getElementById('pause-game');

  if (gamePaused) {
    gamePaused = false;
    pauseButton.textContent = 'Pause';
    spawnInterval = setInterval(spawnWaterCan, 1000);
    timerInterval = setInterval(() => {
      if (!gameActive || gamePaused) return;

      timeLeft -= 1;
      updateTimer();

      if (timeLeft <= 0) {
        timeLeft = 0;
        updateTimer();
        endGame();
      }
    }, 1000);
    return;
  }

  gamePaused = true;
  pauseButton.textContent = 'Resume';
  clearInterval(spawnInterval);
  clearInterval(timerInterval);
}

function endGame() {
  gameActive = false; // Mark the game as inactive
  clearInterval(spawnInterval); // Stop spawning water cans
  clearInterval(timerInterval); // Stop the countdown timer
  document.getElementById('pause-game').textContent = 'Pause';
  document.getElementById('start-game').textContent = 'Start Over?';

  if (currentCans >= 20) {
    showConfetti();
  }
}

// Set up click handler for the start button
document.getElementById('start-game').addEventListener('click', startGame);

// Set up click handler for the pause button
document.getElementById('pause-game').addEventListener('click', pauseGame);
