var score = 0;

function updateScore() {
    score++;
    document.getElementById("score-count").innerHTML = `<strong>${score}</strong>`;
}

function displayGameOverMessage() {
    // Display game over message
    alert("Game Over! Your score: " + score);

    // Ask the player if they want to restart the game
    let playAgain = confirm("Do you want to restart the game?");
    if (playAgain) {
        restartGame();
    } else {
        location.reload(); // Reloads the current page, resetting the game to its initial state
    }
}

