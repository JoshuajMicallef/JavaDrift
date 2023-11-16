const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const play = document.getElementById("play");
const minScoreUpdateInterval = 50; 
const minObstacleCreationInterval = 450;
const laneWidth = canvas.width / 3;
const halfCarWidth = car.width / 2;
const laneCenters = [
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
let obstacleUpdateInterval = 2000;
let lastScoreThreshold = 0;
let lastObstacleThreshold = 0;
let coinCreationIntervalId;

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
        speed += 0.0005; // Adjust the increment as needed
    }
}

function updateScoreCounterSpeed() {
    if (score % 10 === 0 && score !== 0 && score !== lastScoreThreshold && scoreUpdateInterval > minScoreUpdateInterval) {
        clearInterval(scoreIntervalId); 
        scoreUpdateInterval -= 50; 
        scoreIntervalId = setInterval(updateScore, scoreUpdateInterval);
        lastScoreThreshold = score; // Update the last score threshold
    }
}

function updateObstacleOccurance() {
    if (score % 10 === 0 && score !== 0 && score !== lastObstacleThreshold && obstacleUpdateInterval > minObstacleCreationInterval) {
        clearInterval(obstacleCreationIntervalId);

        // Adjust the interval time but ensure it does not drop below the minimum threshold
        obstacleUpdateInterval = Math.max(minObstacleCreationInterval, obstacleUpdateInterval - 200);

        obstacleCreationIntervalId = setInterval(createObstacle, obstacleUpdateInterval);
        lastObstacleThreshold = score;
    }
}



// Game loop function
function gameLoop() {
    if (isGameOver) {
        cancelAnimationFrame(animationFrameId); // Stop the game loop
        clearInterval(obstacleCreationIntervalId); // Clear obstacle creation interval
        clearInterval(scoreIntervalId); // Clear score interval
        displayGameOverMessage();
        return; // Exit the function
    }
    
    updateBackgroundSpeed();
    updateObstacleSpeed();
    updateScoreCounterSpeed();
    updateObstacleOccurance();
    updateCoins();

    console.log("Speed: " + speed)
    console.log("Obstacle Interval: " + obstacleUpdateInterval)
    console.log("Obstacle Speed: " + obstacleSpeed)
    console.log("Score: " + scoreIntervalId)

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBackground();
    drawCar();
    updateObstacles();
    drawObstacles();
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
        scoreIntervalId = setInterval(updateScore, 1000); // Start score counter, updating every second
        obstacleCreationIntervalId = setInterval(createObstacle, 2000); // Start obstacle creation
        coinCreationIntervalId = setInterval(createCoin, 4000);
    }
});


function restartGame() {
    // Clear intervals
    clearInterval(obstacleCreationIntervalId);
    clearInterval(scoreIntervalId);
    clearInterval(coinCreationIntervalId);

    // Reset game variables
    score = 0;
    scoreUpdateInterval = 1000;
    obstacleUpdateInterval = 2000;
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
