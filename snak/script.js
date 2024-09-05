const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const snakeSize = 20;
const foodSize = 20;
const snakeSpeed = 200; // Milliseconds between frames

let snake = [{ x: 100, y: 100 }];
let direction = 'RIGHT';
let food = { x: 200, y: 200 };
let joystickActive = false;
let joystickPos = { x: 50, y: 50 };

function drawSnake() {
    ctx.fillStyle = 'green';
    for (const segment of snake) {
        ctx.fillRect(segment.x, segment.y, snakeSize, snakeSize);
    }
}

function drawFood() {
    ctx.fillStyle = 'red';
    ctx.fillRect(food.x, food.y, foodSize, foodSize);
}

function moveSnake() {
    const head = { ...snake[0] };

    switch (direction) {
        case 'UP':
            head.y -= snakeSize;
            break;
        case 'DOWN':
            head.y += snakeSize;
            break;
        case 'LEFT':
            head.x -= snakeSize;
            break;
        case 'RIGHT':
            head.x += snakeSize;
            break;
    }

    snake.unshift(head);
    if (head.x === food.x && head.y === food.y) {
        // Food eaten, generate new food
        food = {
            x: Math.floor(Math.random() * (canvas.width / foodSize)) * foodSize,
            y: Math.floor(Math.random() * (canvas.height / foodSize)) * foodSize
        };
    } else {
        snake.pop();
    }
}

function checkCollision() {
    const head = snake[0];
    if (head.x < 0 || head.x >= canvas.width || head.y < 0 || head.y >= canvas.height) {
        return true; // Wall collision
    }
    for (let i = 1; i < snake.length; i++) {
        if (snake[i].x === head.x && snake[i].y === head.y) {
            return true; // Self collision
        }
    }
    return false;
}

function updateGame() {
    moveSnake();
    if (checkCollision()) {
        alert('Game Over');
        snake = [{ x: 100, y: 100 }];
        direction = 'RIGHT';
        food = { x: 200, y: 200 };
        return;
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawSnake();
    drawFood();
}

function handleJoystickMove(event) {
    const joystick = document.getElementById('joystick');
    const joystickRect = joystick.getBoundingClientRect();
    const x = event.clientX - joystickRect.left - joystickRect.width / 2;
    const y = event.clientY - joystickRect.top - joystickRect.height / 2;
    const angle = Math.atan2(y, x);
    const distance = Math.min(Math.sqrt(x * x + y * y), joystickRect.width / 2);
    
    joystickPos.x = distance * Math.cos(angle) + joystickRect.width / 2;
    joystickPos.y = distance * Math.sin(angle) + joystickRect.height / 2;
    document.querySelector('.joystick-inner').style.transform = `translate(-50%, -50%) translate(${joystickPos.x - 50}px, ${joystickPos.y - 50}px)`;
    
    if (Math.abs(joystickPos.x - joystickRect.width / 2) > 30 || Math.abs(joystickPos.y - joystickRect.height / 2) > 30) {
        switch (true) {
            case Math.abs(x) > Math.abs(y):
                direction = x > 0 ? 'RIGHT' : 'LEFT';
                break;
            case Math.abs(x) < Math.abs(y):
                direction = y > 0 ? 'DOWN' : 'UP';
                break;
        }
    }
}

document.getElementById('joystick').addEventListener('mousedown', (event) => {
    joystickActive = true;
    handleJoystickMove(event);
});

document.addEventListener('mouseup', () => {
    joystickActive = false;
    document.querySelector('.joystick-inner').style.transform = 'translate(-50%, -50%)';
});

document.addEventListener('mousemove', (event) => {
    if (joystickActive) {
        handleJoystickMove(event);
    }
});

setInterval(updateGame, snakeSpeed);
