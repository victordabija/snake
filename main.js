import './style.css'
import {initGame} from "./snake.js";

const playButton = document.getElementById('play');

playButton.addEventListener('click', () => {
    if (sessionStorage.points === undefined) {
        sessionStorage.setItem('points', '1');
    }
    initGame();
});
