// Car image
const carImage = new Image();
carImage.src = "assets/images/car.png";

function drawCar() {
    // Check if the image is loaded before drawing
    if (carImage.complete) {
        ctx.drawImage(carImage, car.x, car.y, car.width, car.height);
    } else {
        // If the image is not yet loaded, you can optionally draw a placeholder like the blue rectangle
        ctx.fillStyle = 'blue';
        ctx.fillRect(car.x, car.y, car.width, car.height);
    }
}

// Load the background image
const backgroundImage = new Image();
backgroundImage.src = 'assets/images/road.jpg';
let backgroundY = 0;
let speed = .5;

function drawBackground() {
    ctx.drawImage(backgroundImage, 0, backgroundY, canvas.width, canvas.height);
    ctx.drawImage(backgroundImage, 0, backgroundY - canvas.height, canvas.width, canvas.height);

    // Update the Y position
    backgroundY += speed;

    // Adjusted reset condition
    if (backgroundY >= canvas.height) {
        backgroundY -= canvas.height;
    }
}


function drawObstacles() {
    obstacles.forEach(obstacle => {
        // Check if the image is loaded before drawing
        if (obstacle.image.complete) {
            ctx.drawImage(obstacle.image, obstacle.x, obstacle.y, obstacle.width, obstacle.height);
        } else {
            // If the image is not yet loaded, draw a placeholder
            ctx.fillStyle = 'grey'; // Placeholder color
            ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
        }
    });
}

function drawCoins() {
    coins.forEach(coin => {
        if (coin.image.complete) {
            ctx.drawImage(coin.image, coin.x, coin.y, coin.width, coin.height);
        } else {
            // If the image is not yet loaded, draw a placeholder
            ctx.fillStyle = 'yellow'; // Placeholder color for coins
            ctx.fillRect(coin.x, coin.y, coin.width, coin.height);
        }
    });
}
