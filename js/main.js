const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const play = document.getElementById("play");
const start = document.getElementById("start");
const startingScreen = document.getElementById("homepage")
const minScoreUpdateInterval = 50; 
const minObstacleCreationInterval = 800;
var laneWidth = canvas.width / 3;
var halfCarWidth = car.width / 2;
var laneCenters = [
    laneWidth / 2,
    laneWidth + laneWidth / 2,
    laneWidth * 2 + laneWidth / 2
];
let currentLane = 1;
let obstacleCreationIntervalId;
let animationFrameId;
let scoreIntervalId;
let isGamePaused = false;
let scoreUpdateInterval = 1000;
let obstacleUpdateInterval = 5000;
let obstacleOccurrenceUpdateIntervalId;
let lastScoreThreshold = 0;
let lastObstacleThreshold = 0;
let coinCreationIntervalId;
let obstaclesCreated = 0;
let lastTime = 0;


function adjustSpeedForScreenSize() {
    const baseSpeed = 0.5; // Base speed for a standard screen size (e.g., 1920x1080)
    const standardWidth = 1920; // Width of the standard screen size

    // Calculate speed factor based on current screen width
    const speedFactor = (window.innerWidth / standardWidth) + 1.5;

    // Adjust speeds
    speed = baseSpeed * speedFactor;
    obstacleSpeed = baseSpeed * speedFactor;
    coinSpeed = baseSpeed * speedFactor;
}

function resizeCanvas() {
    const maxWidth = 1200; // Maximum width you want for the canvas
    const maxHeight = 600; // Maximum height or based on aspect ratio
    const width = Math.min(window.innerWidth, maxWidth);
    const height = Math.min(window.innerHeight, maxHeight);

    canvas.width = width;
    canvas.height = height;

    // Recalculate lane widths and car position
    laneWidth = canvas.width / 3;
    halfCarWidth = car.width / 2;
    laneCenters = [
        laneWidth / 2,
        laneWidth + laneWidth / 2,
        laneWidth * 2 + laneWidth / 2
    ];

    adjustSpeedForScreenSize();

    // Update car position based on current lane
    updateCarLane(currentLane);

    // Redraw game state
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBackground();
    drawCar();
    drawObstacles();
    drawCoins();
}

window.addEventListener('load', resizeCanvas);
window.addEventListener('resize', resizeCanvas);


document.addEventListener('keydown', (event) => {
    if (event.key === 'a') {
        updateCarLane(currentLane - 1);
    } else if (event.key === 'd') {
        updateCarLane(currentLane + 1);
    }
});

function update() {
}

function updateBackgroundSpeed() {
    if (score % 5 === 0 && score !== 0) { // Example: Increase speed for every 10 points
        speed += 0.0025; // Adjust the increment as needed
    }
}

function updateScoreCounterSpeed() {
    if (score % 5 === 0 && score !== 0 && score !== lastScoreThreshold && scoreUpdateInterval > minScoreUpdateInterval) {
        clearInterval(scoreIntervalId); 
        scoreUpdateInterval -= 50; 
        scoreIntervalId = setInterval(updateScore, scoreUpdateInterval);
        lastScoreThreshold = score; // Update the last score threshold
    }
}

function updateObstacleOccurance() {
    // Only adjust the interval if an obstacle has been created since the last check
    if (obstaclesCreated > 0 && obstacleUpdateInterval - 100 >= minObstacleCreationInterval) {
        clearInterval(obstacleCreationIntervalId);
        obstacleUpdateInterval -= 100;
        obstacleCreationIntervalId = setInterval(createObstacle, obstacleUpdateInterval);
        
        // Reset the counter
        obstaclesCreated = 0;
    }
}


// Set up the interval to call this function every 5 seconds
obstacleOccurrenceUpdateIntervalId = setInterval(updateObstacleOccurance, 5000);



// Game loop function
function gameLoop(timestamp) {
    if (isGameOver) {
        cancelAnimationFrame(animationFrameId); // Stop the game loop
        clearInterval(obstacleCreationIntervalId); // Clear obstacle creation interval
        clearInterval(scoreIntervalId); // Clear score interval
        clearInterval(coinCreationIntervalId);
        displayGameOverMessage();
        return; // Exit the function
    }

    let deltaTime = timestamp - lastTime;
    lastTime = timestamp;

    // Use delta time to adjust movement
    const movementSpeed = 0.05; // Base speed
    const adjustedSpeed = movementSpeed * deltaTime;
    
    // Game update logic
    updateBackgroundSpeed(adjustedSpeed);
    updateObstacleSpeed(adjustedSpeed);
    updateScoreCounterSpeed(adjustedSpeed);
    updateObstacleOccurance(adjustedSpeed);
    updateCoins(adjustedSpeed);

    console.log("Speed: " + speed)
    console.log("Obstacle Interval: " + obstacleUpdateInterval)
    console.log("Obstacle Speed: " + obstacleSpeed)
    console.log("Score: " + scoreIntervalId)

    // Clear and redraw all game elements
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBackground();
    drawCar();
    updateObstacles(); // Assuming this updates and draws obstacles
    drawObstacles(); // If needed
    drawCoins();

    animationFrameId = requestAnimationFrame(gameLoop);
}

// Start the game loop, score counter, and obstacle creation when "play" is clicked
play.addEventListener("click", function() {
    if (!animationFrameId) {
        isGamePaused = false;
        isGameOver = false; // Reset the game over flag
        score = 0; // Reset the score
        document.getElementById("score-count").innerHTML = `<strong>${score}</strong>`;
        obstacles = []; // Clear existing obstacles
        gameLoop();
        scoreIntervalId = setInterval(updateScore, scoreUpdateInterval); // Start score counter, updating every second
        obstacleCreationIntervalId = setInterval(createObstacle, obstacleUpdateInterval); // Start obstacle creation
        coinCreationIntervalId = setInterval(createCoin, 4000);
    }
});


function restartGame() {
    // Clear intervals
    clearInterval(obstacleCreationIntervalId);
    clearInterval(scoreIntervalId);
    clearInterval(coinCreationIntervalId);
    clearInterval(obstacleOccurrenceUpdateIntervalId);

    // Reset game variables
    score = 0;
    scoreUpdateInterval = 1000;
    obstacleUpdateInterval = 5000;
    isGameOver = false;
    obstacles = []; // Clear existing obstacles
    backgroundY = 0; // Reset background position
    speed = 0.5; // Reset background speed if it changes during the game
    obstacleSpeed = 0.5; // Reset obstacle speed if it changes
    currentLane = 1;
    updateCarLane(currentLane);

    // Reset score display
    document.getElementById("score-count").innerHTML = `<strong>${score}</strong>`;

    // Start the game loop and obstacle creation
    if (!animationFrameId) {
        gameLoop();
    }
    scoreIntervalId = setInterval(updateScore, 1000);
}


// Initialize the game
updateCarLane(currentLane);

start.addEventListener("click", function(){
    startingScreen.classList.add("hide");
})

canvas.addEventListener('touchstart', handleTouchStart, false);

function handleTouchStart(event) {
    event.preventDefault(); // Prevent default behavior

    let touch = event.touches[0];
    let rect = canvas.getBoundingClientRect();
    let scaleX = canvas.width / rect.width;    // relationship bitmap vs. element for X

    let touchX = (touch.clientX - rect.left) * scaleX; // Scale touch coordinates

    // Determine which lane was touched and move the car to that lane
    if (touchX < laneWidth) {
        updateCarLane(0); // Left lane
    } else if (touchX < laneWidth * 2) {
        updateCarLane(1); // Middle lane
    } else {
        updateCarLane(2); // Right lane
    }
}
