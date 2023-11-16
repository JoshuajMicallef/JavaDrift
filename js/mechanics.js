let isGameOver = false;
let car = { width: 20, height: 30 };
const coinImageSrc = "assets/images/coin.png"; // Path to coin image
const coinWidth = 15;
const coinHeight = 15;
let coins = []; // Array to hold coins
let coinSpeed = 0.5;


// Function to update car's x position based on the current lane
function updateCarLane(laneIndex) {
    currentLane = Math.max(0, Math.min(laneIndex, laneCenters.length - 1));
    car.x = laneCenters[currentLane] - halfCarWidth;
    car.y = canvas.height - car.height - 5; // Position car towards the bottom
}

let obstacles = [];
const obstacleWidth = 20;
const obstacleHeight = 10;
let obstacleSpeed = .5;
const obstacleImages = [
    { src: "assets/images/granny.png", width: 23, height: 27 },
    { src: "assets/images/pothole.png", width: 30, height: 30 },
    { src: "assets/images/puppy.png", width: 20, height: 20 }
];

// Function to create a new obstacle
function createObstacle() {
    const lane = Math.floor(Math.random() * 3); // Randomly choose a lane
    const x = laneCenters[lane] - obstacleWidth / 2;
    const y = -obstacleHeight; // Start just above the canvas

    const imageInfo = obstacleImages[Math.floor(Math.random() * obstacleImages.length)];
    const obstacleImage = new Image();
    obstacleImage.src = imageInfo.src;

    obstacles.push({ 
        x, 
        y, 
        width: imageInfo.width, 
        height: imageInfo.height, 
        image: obstacleImage 
    });
}


// Function to check collision between two rectangles (car and obstacle)
function isColliding(rect1, rect2) {
    return rect1.x < rect2.x + rect2.width &&
           rect1.x + rect1.width > rect2.x &&
           rect1.y < rect2.y + rect2.height &&
           rect1.y + rect1.height > rect2.y;
}

// Function to update obstacles
function updateObstacles() {
    for (let i = obstacles.length - 1; i >= 0; i--) {
        obstacles[i].y += obstacleSpeed;

        // Check for collision
        if (isColliding(obstacles[i], car)) {
            // Collision detected
            isGameOver = true;
            displayGameOverMessage();
            restartGame();
            break; // Stop checking other obstacles
        }

        // Remove obstacle if it moves off the bottom of the canvas
        if (obstacles[i].y > canvas.height) {
            obstacles.splice(i, 1);
        }

    }
}

function updateObstacleSpeed() {
    if (score % 5 === 0 && score !== 0) { // Example: Increase speed for every 10 points
        obstacleSpeed += 0.0005; // Adjust the increment as needed
    }
}

function isLaneAvailable(laneIndex) {
    return !obstacles.some(obstacle => {
        return Math.abs(laneCenters[laneIndex] - obstacle.x) < Math.max(obstacleWidth, coinWidth);
    });
}

function updateCoins() {
    for (let i = coins.length - 1; i >= 0; i--) {
        coins[i].y += coinSpeed;

        // Check for collision with the car
        if (isColliding(coins[i], car)) {
            score += 10; // Increase score by 10
            document.getElementById("score-count").innerHTML = `<strong>${score}</strong>`;
            coins.splice(i, 1); // Remove the coin
            continue; // Skip to next coin
        }

        // Remove coin if it moves off the bottom of the canvas
        if (coins[i].y > canvas.height) {
            coins.splice(i, 1);
        }
    }
}

function createCoin() {
    let lane = Math.floor(Math.random() * 3);
    let attempts = 0;

    // Find next available lane if the chosen lane is occupied
    while (!isLaneAvailable(lane) && attempts < 3) {
        lane = (lane + 1) % 3; // Move to the next lane
        attempts++;
    }

    // If all lanes are occupied, don't create a coin
    if (!isLaneAvailable(lane)) return;

    const x = laneCenters[lane] - coinWidth / 2;
    const y = -coinHeight; // Start just above the canvas

    const coinImage = new Image();
    coinImage.src = coinImageSrc;

    coins.push({ 
        x, 
        y, 
        width: coinWidth, 
        height: coinHeight, 
        image: coinImage 
    });
}

