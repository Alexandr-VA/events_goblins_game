import Board from './Board';
import Score from './Score';

export default class Game {
  constructor(boardElement) {
    console.log('Game: создание игры');
    this.board = new Board(boardElement);
    this.score = new Score();
    this.misses = 0;
    this.maxMisses = 5;
    this.isRunning = false;
    this.isStarted = false;
    this.goblinInterval = null;
    
    // Получаем элементы с проверкой
    this.startButton = document.getElementById('start-btn');
    this.restartButton = document.getElementById('restart-btn');
    this.scoreElement = document.getElementById('score');
    this.missesElement = document.getElementById('misses');
    this.gameOverElement = document.getElementById('game-over');
    this.finalScoreElement = document.getElementById('final-score');
    
    // Проверяем, что кнопка найдена
    if (!this.startButton) {
      console.error('Кнопка #start-btn не найдена в DOM!');
    }
    if (!this.restartButton) {
      console.error('Кнопка #restart-btn не найдена в DOM!');
    }
    
    this.board.onGoblinHit(() => {
      console.log('Game: попадание!');
      this.handleGoblinHit();
    });
    
    this.board.onGoblinMiss(() => {
      console.log('Game: промах!');
      this.handleGoblinMiss();
    });
    
    // Вешаем обработчики на кнопки (с проверкой)
    if (this.startButton) {
      this.startButton.addEventListener('click', () => this.start());
    }
    if (this.restartButton) {
      this.restartButton.addEventListener('click', () => this.restart());
    }
    
    // Изначально поле заблокировано
    this.setBoardDisabled(true);
    this.updateUI();
  }

  start() {
    if (this.isStarted) return;
    
    console.log('Game: старт по кнопке');
    this.isStarted = true;
    this.isRunning = true;
    this.score.reset();
    this.misses = 0;
    
    if (this.startButton) {
      this.startButton.disabled = true;
      this.startButton.textContent = '⏳ Игра идет...';
    }
    
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
    // Запускаем первого гоблина сразу
    this.board.spawnGoblin();
    
    // Затем каждую секунду пытаемся спавнить нового
    this.goblinInterval = setInterval(() => {
      if (this.isRunning) {
        this.board.spawnGoblin();
      }
    }, 1000);
  }

  handleGoblinHit() {
    console.log('Game: обработка попадания');
    if (!this.isRunning) return;
    this.score.addPoints(1);
    this.updateUI();
  }

  handleGoblinMiss() {
    console.log(`Game: обработка промаха, текущее значение: ${this.misses}`);
    if (!this.isRunning) return;
    
    this.misses += 1;
    console.log(`Game: промахов стало: ${this.misses}`);
    this.updateUI();
    
    if (this.misses >= this.maxMisses) {
      console.log('Game: игра окончена!');
      this.endGame();
    }
  }

  endGame() {
    console.log('Game: завершение игры');
    this.isRunning = false;
    this.isStarted = false;
    
    if (this.goblinInterval) {
      clearInterval(this.goblinInterval);
      this.goblinInterval = null;
    }
    
    this.board.setGameActive(false);
    this.board.hideGoblin();
    this.setBoardDisabled(true);
    
    if (this.startButton) {
      this.startButton.disabled = false;
      this.startButton.textContent = '🎮 Играть снова';
    }
    
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
      console.log(`UI обновлен: промахи = ${this.missesElement.textContent}`);
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
    console.log('Game: рестарт');
    
    if (this.gameOverElement) {
      this.gameOverElement.classList.add('hidden');
    }
    
    if (this.startButton) {
      this.startButton.textContent = '🎮 Начать игру';
      this.startButton.disabled = false;
    }
    
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