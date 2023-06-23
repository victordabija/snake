const startContainer = document.getElementById('start');
const gameContainer = document.getElementById('game');
const gameOverContainer = document.getElementById('game-over');
const tryAgainButton = document.getElementById('try-again');
const record = document.getElementById('record');
const counter = document.getElementById('counter');

const cols = 16;
const rows = 16;

const width = 600;
const height = 600;

const squareSize = width / cols === height / rows ? width / cols : null;

const canvas = document.getElementById('snake');
const context = canvas.getContext('2d');

let direction = "right";
let snake = [];
let food = {};

canvas.setAttribute('height', `${height}`);
canvas.setAttribute('width', `${width}`);

const clearField = () => {
    context.clearRect(0, 0, width, height);
}

const drawField = () => {
    clearField();
    // draw vertical lines
    for (let x = 0; x <= height + 1; x += squareSize) {
        context.moveTo(x, 0);
        context.lineTo(x, height);
    }

    // draw horizontal lines
    for (let y = 0; y <= width + 1; y += squareSize) {
        context.moveTo(0, y);
        context.lineTo(width, y);
    }

    context.strokeStyle = "#fff";
    context.stroke();
}

const drawSnake = () => {
    snake.forEach((square) => {
        drawSquare("green", square)
    })
}

const drawFood = () => {
    drawSquare("red", food);
}

const getFood = () => {
    // todo: check if food is not spawned in snake's body

    return {
        x: getRandom(squareSize, height),
        y: getRandom(squareSize, width)
    };
}

const drawSquare = (style, {x, y}) => {
    context.fillStyle = style;
    context.fillRect(x, y, squareSize, squareSize);
}

const getRandom = (num = 1, limit) => {
    const random = Math.random() * limit;
    return Math.floor(random / num) * num;
}

const checkEndGame = (game) => {
    if (snake[0].x > (cols - 1) * squareSize && direction === "right") {
        return endGame(game);
    }

    if (snake[0].x < 0 && direction === "left") {
        return endGame(game)
    }

    if (snake[0].y > (rows - 1) * squareSize && direction === "down") {
        return endGame(game)
    }

    if (snake[0].y < 0 && direction === "up") {
        return endGame(game)
    }

    snake.slice(1).forEach((square) => {
        if (snake[0].x === square.x && snake[0].y === square.y) {
            return endGame(game)
        }
    })
}

const endGame = (game) => {
    let points = parseInt(sessionStorage.points) ?? 1;
    const currentPoints = snake.length;

    if (currentPoints > points) {
        points = currentPoints;
        sessionStorage.points = points;
    }

    clearInterval(game)
    gameOverContainer.classList.remove('d-none');
    gameContainer.classList.add('d-none');
    record.innerText = `Record: ${points}`;
}

export const initGame = () => {
    if (squareSize === null) {
        throw new Error("Cols must be equal with rows, height must be equal with width");
    }

    startContainer.classList.add('d-none');
    gameContainer.classList.remove('d-none');
    if (!gameOverContainer.classList.contains('d-none')){
        gameOverContainer.classList.add('d-none');
    }

    food = getFood();
    snake = [{
        x: 8 * squareSize,
        y: 8 * squareSize
    }];

    const init = () => {
        checkEndGame(game);

        drawField();
        drawSnake();
        drawFood();

        let snakeX = snake[0].x;
        let snakeY = snake[0].y;
        let foodX = food.x;
        let foodY = food.y;

        switch (direction) {
            case "up":
                snakeY -= squareSize;
                break;

            case "down":
                snakeY += squareSize;
                break;

            case "right":
                snakeX += squareSize;
                break;

            case "left":
                snakeX -= squareSize;
                break;
        }

        if (snakeX !== foodX || snakeY !== foodY) {
            snake.pop();
        } else {
            food = getFood();
        }

        snake.unshift({x: snakeX, y: snakeY});
        counter.innerText = `Points: ${snake.length}`;
    }
    const game = setInterval(init, 200);
}

const updateDirection = (event) => {
    if (event.keyCode === 37 && direction !== 'right') direction = 'left';
    if (event.keyCode === 38 && direction !== 'down') direction = 'up';
    if (event.keyCode === 39 && direction !== 'left') direction = 'right';
    if (event.keyCode === 40 && direction !== 'up') direction = 'down';
}

document.addEventListener('keydown', updateDirection);
tryAgainButton.addEventListener('click', () => {
    initGame();
})