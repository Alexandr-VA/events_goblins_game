import Board from './Board';
import Score from './Score';
import { MAX_MISSES, SPAWN_INTERVAL } from './constants';

export default class Game {
  constructor(boardElement) {
    this.board = new Board(boardElement);
    this.score = new Score();
    this.misses = 0;
    this.maxMisses = MAX_MISSES;
    this.isRunning = false;
    this.isStarted = false;
    this.goblinInterval = null;
    
    this.startButton = document.getElementById('start-btn');
    this.restartButton = document.getElementById('restart-btn');
    this.scoreElement = document.getElementById('score');
    this.missesElement = document.getElementById('misses');
    this.gameOverElement = document.getElementById('game-over');
    this.finalScoreElement = document.getElementById('final-score');
    
    // Критические ошибки выбрасываем через throw
    if (!this.startButton) {
      throw new Error('Кнопка #start-btn не найдена в DOM!');
    }
    if (!this.restartButton) {
      throw new Error('Кнопка #restart-btn не найдена в DOM!');
    }
    
    this.board.onGoblinHit(() => {
      this.handleGoblinHit();
    });
    
    this.board.onGoblinMiss(() => {
      this.handleGoblinMiss();
    });
    
    this.startButton.addEventListener('click', () => this.start());
    this.restartButton.addEventListener('click', () => this.restart());
    
    this.setBoardDisabled(true);
    this.updateUI();
  }

  start() {
    if (this.isStarted) return;
    
    this.isStarted = true;
    this.isRunning = true;
    this.score.reset();
    this.misses = 0;
    
    this.startButton.disabled = true;
    this.startButton.textContent = '⏳ Игра идет...';
    
    if (this.gameOverElement) {
      this.gameOverElement.classList.add('hidden');
    }
    
    this.board.reset();
    this.board.setGameActive(true);
    this.setBoardDisabled(false);
    this.updateUI();
    this.startGoblinSpawning();
  }

  startGoblinSpawning() {
    if (this.goblinInterval) {
      clearInterval(this.goblinInterval);
    }
    this.board.spawnGoblin();
    
    this.goblinInterval = setInterval(() => {
      if (this.isRunning) {
        this.board.spawnGoblin();
      }
    }, SPAWN_INTERVAL);
  }

  handleGoblinHit() {
    if (!this.isRunning) return;
    this.score.addPoints(1);
    this.updateUI();
  }

  handleGoblinMiss() {
    if (!this.isRunning) return;
    
    this.misses += 1;
    this.updateUI();
    
    if (this.misses >= this.maxMisses) {
      this.endGame();
    }
  }

  endGame() {
    this.isRunning = false;
    this.isStarted = false;
    
    if (this.goblinInterval) {
      clearInterval(this.goblinInterval);
      this.goblinInterval = null;
    }
    
    this.board.setGameActive(false);
    this.board.hideGoblin();
    this.setBoardDisabled(true);
    
    this.startButton.disabled = false;
    this.startButton.textContent = '🎮 Играть снова';
    
    this.showGameOver();
  }

  showGameOver() {
    if (this.finalScoreElement) {
      this.finalScoreElement.textContent = this.score.getScore();
    }
    if (this.gameOverElement) {
      this.gameOverElement.classList.remove('hidden');
    }
  }

  updateUI() {
    if (this.scoreElement) {
      this.scoreElement.textContent = this.score.getScore();
    }
    if (this.missesElement) {
      this.missesElement.textContent = this.misses;
    }
  }

  setBoardDisabled(disabled) {
    const cells = document.querySelectorAll('.cell');
    cells.forEach((cell) => {
      if (disabled) {
        cell.classList.add('disabled');
      } else {
        cell.classList.remove('disabled');
      }
    });
  }

  restart() {
    if (this.gameOverElement) {
      this.gameOverElement.classList.add('hidden');
    }
    
    this.startButton.textContent = '🎮 Начать игру';
    this.startButton.disabled = false;
    
    this.isStarted = false;
    this.isRunning = false;
    this.board.reset();
    this.board.setGameActive(false);
    this.setBoardDisabled(true);
    this.score.reset();
    this.misses = 0;
    this.updateUI();
  }

  destroy() {
    if (this.goblinInterval) {
      clearInterval(this.goblinInterval);
      this.goblinInterval = null;
    }
    this.isRunning = false;
    this.board.destroy();
  }
}