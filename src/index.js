import './styles.css';
import Game from './Game';

// Инициализация игры
const boardElement = document.getElementById('board');
const game = new Game(boardElement);

// Экспорт для тестирования
export { Game };