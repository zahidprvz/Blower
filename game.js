// Get the game elements
const character = document.getElementById('character');
const gameContainer = document.getElementById('game-container');
const itemContainer = document.getElementById('item-container');
const startButton = document.getElementById('start-button');
const scoreDisplay = document.getElementById('score');
const timeDisplay = document.getElementById('time');

// Game state
let score = 0;
let timeLeft = 30; // Updated game duration to 60 seconds
let gameRunning = false;
let timerInterval;
let itemInterval;
let itemCollectionInterval;

// Update score and time display
function updateGameUI() {
    scoreDisplay.innerText = `Score: ${score}`;
    timeDisplay.innerText = `Time: ${timeLeft}`;
}

// Move the character
function moveCharacter(event) {
    const key = event.key;
    const stepSize = 20; // Increase the step size for faster movement

    const currentTop = parseInt(character.style.top) || 0;
    const currentLeft = parseInt(character.style.left) || 0;
    const containerWidth = gameContainer.clientWidth;
    const containerHeight = gameContainer.clientHeight;
    const characterWidth = character.clientWidth;
    const characterHeight = character.clientHeight;

    switch (key) {
        case "ArrowLeft":
            character.style.left = Math.max(0, currentLeft - stepSize) + "px";
            break;
        case "ArrowUp":
            character.style.top = Math.max(0, currentTop - stepSize) + "px";
            break;
        case "ArrowRight":
            character.style.left = Math.min(containerWidth - characterWidth, currentLeft + stepSize) + "px";
            break;
        case "ArrowDown":
            character.style.top = Math.min(containerHeight - characterHeight, currentTop + stepSize) + "px";
            break;
    }
}

// Move the character with touch events
function handleTouchMove(event) {
    const touch = event.touches[0];
    const containerRect = gameContainer.getBoundingClientRect();
    const containerLeft = containerRect.left;
    const containerTop = containerRect.top;
    const touchX = touch.clientX - containerLeft;
    const touchY = touch.clientY - containerTop;
    const characterWidth = character.offsetWidth;
    const characterHeight = character.offsetHeight;

    character.style.left = Math.max(0, Math.min(touchX - characterWidth / 2, containerRect.width - characterWidth)) + "px";
    character.style.top = Math.max(0, Math.min(touchY - characterHeight / 2, containerRect.height - characterHeight)) + "px";
}

// Create item
function createItem() {
    const item = document.createElement('div');
    item.className = 'item';
    item.style.top = Math.floor(Math.random() * (gameContainer.clientHeight - 30)) + 'px';
    item.style.left = Math.floor(Math.random() * (gameContainer.clientWidth - 30)) + 'px';

    itemContainer.appendChild(item);
}

// Collect items
function collectItems() {
    const items = document.getElementsByClassName('item');

    for (let i = 0; i < items.length; i++) {
        const item = items[i];

        if (isColliding(character, item)) {
            item.parentNode.removeChild(item);
            score++;
            updateGameUI();
        }
    }
}

// Check collision between two elements
function isColliding(element1, element2) {
    const rect1 = element1.getBoundingClientRect();
    const rect2 = element2.getBoundingClientRect();

    return (
        rect1.top < rect2.bottom &&
        rect1.bottom > rect2.top &&
        rect1.left < rect2.right &&
        rect1.right > rect2.left
    );
}

// Start the game
function startGame() {
    if (!gameRunning) {
        gameRunning = true;
        score = 0;
        timeLeft = 30;

        // Initialize game UI
        updateGameUI();

        // Set up character movement
        window.addEventListener('keydown', moveCharacter);

        // Set up character movement with touch events
        gameContainer.addEventListener('touchmove', handleTouchMove);

        // Disable default touch move behavior to prevent scrolling on mobile devices
        document.addEventListener('touchmove', function (event) {
            event.preventDefault();
        }, { passive: false });

        // Create items every second
        itemInterval = setInterval(createItem, 1000);

        // Collect items every 100 milliseconds
        itemCollectionInterval = setInterval(collectItems, 100);

        // Start timer countdown
        timerInterval = setInterval(() => {
            timeLeft--;
            updateGameUI();

            if (timeLeft === 0) {
                endGame();
            }
        }, 1000);
    }
}

// End the game
function endGame() {
    gameRunning = false;
    clearInterval(timerInterval);
    clearInterval(itemInterval);
    clearInterval(itemCollectionInterval);

    // Remove items from the container
    while (itemContainer.firstChild) {
        itemContainer.firstChild.remove();
    }

    // Remove character movement event listener
    window.removeEventListener('keydown', moveCharacter);

    alert(`Game Over! Your score is ${score}`);
}

// Event listener for start button click
startButton.addEventListener('click', startGame);
