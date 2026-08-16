import Goblin from './Goblin';

export default class Board {
  constructor(element) {
    this.element = element;
    this.cells = [];
    this.goblin = null;
    this.onHitCallback = null;
    this.onMissCallback = null;
    this.isGameActive = true;
    this.isSpawning = false;
    this.render();
    this.initGoblin();
  }

  initGoblin() {
    this.goblin = new Goblin();
    this.goblin.onMiss(() => {
      console.log('Board: получен сигнал о промахе (таймаут)');
      if (this.onMissCallback && this.isGameActive) {
        console.log('Board: вызываем onMissCallback');
        this.onMissCallback();
      }
      this.isSpawning = false;
    });
  }

  render() {
    this.element.innerHTML = '';
    this.cells = [];
    for (let i = 0; i < 16; i++) {
      const cell = document.createElement('div');
      cell.className = 'cell';
      cell.dataset.index = i;
      cell.addEventListener('click', () => this.handleCellClick(i));
      this.element.appendChild(cell);
      this.cells.push(cell);
    }
  }

  reset() {
    console.log('Board: сброс');
    if (this.goblin) {
      this.goblin.destroy();
    }
    this.cells.forEach((cell) => {
      cell.classList.remove('has-goblin', 'hit');
      cell.innerHTML = '';
      // Удаляем молоток если есть
      const hammer = cell.querySelector('.hammer-strike');
      if (hammer) {
        hammer.remove();
      }
    });
    this.isGameActive = true;
    this.isSpawning = false;
    this.initGoblin();
  }

  spawnGoblin() {
    console.log('Board: спавн гоблина');
    if (!this.isGameActive) return;
    if (this.isSpawning) {
      console.log('Board: гоблин уже появляется, пропускаем');
      return;
    }
    
    if (this.goblin && this.goblin.isActive()) {
      console.log('Board: гоблин еще жив, не спавним нового');
      return;
    }
    
    this.isSpawning = true;
    
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * this.cells.length);
    } while (this.goblin && this.cells[newIndex] === this.goblin.cell && this.cells.length > 1);
    
    const cell = this.cells[newIndex];
    this.goblin.appear(cell);
  }

  hideGoblin() {
    if (this.goblin) {
      this.goblin.disappear(false);
    }
    this.isSpawning = false;
  }

  handleCellClick(index) {
    console.log(`Board: клик по клетке ${index}`);
    if (!this.isGameActive) return;
    
    const cell = this.cells[index];
    
    // Проверяем, есть ли гоблин в этой клетке
    if (this.goblin && this.goblin.isActive() && this.goblin.cell === cell) {
      // Попали в гоблина!
      console.log('Board: попали в гоблина!');
      
      // Показываем молоток в клетке
      this.showHammer(cell);
      
      // Эффект удара
      cell.classList.add('hit');
      setTimeout(() => {
        cell.classList.remove('hit');
      }, 400);
      
      this.goblin.die();
      this.isSpawning = false;
      if (this.onHitCallback) {
        this.onHitCallback();
      }
    } else {
      // Клик по пустой клетке - засчитываем промах
      console.log('Board: промах - клик по пустой клетке');
      
      if (this.onMissCallback && this.isGameActive) {
        console.log('Board: вызываем onMissCallback (клик мимо)');
        this.onMissCallback();
      }
      
      if (this.goblin && this.goblin.isActive()) {
        this.goblin.disappear(false);
        this.isSpawning = false;
      }
    }
  }

  /**
   * Показывает анимацию молотка в клетке
   */
  showHammer(cell) {
    // Удаляем старый молоток если есть
    const oldHammer = cell.querySelector('.hammer-strike');
    if (oldHammer) {
      oldHammer.remove();
    }
    
    // Создаем элемент молотка
    const hammer = document.createElement('div');
    hammer.className = 'hammer-strike';
    cell.appendChild(hammer);
    
    // Удаляем молоток после анимации
    setTimeout(() => {
      if (hammer.parentNode) {
        hammer.remove();
      }
    }, 500);
  }

  onGoblinHit(callback) {
    this.onHitCallback = callback;
  }

  onGoblinMiss(callback) {
    console.log('Board: установлен onMissCallback');
    this.onMissCallback = callback;
  }

  setGameActive(active) {
    this.isGameActive = active;
    if (!active && this.goblin) {
      this.goblin.disappear(false);
    }
    if (!active) {
      this.isSpawning = false;
    }
  }

  destroy() {
    if (this.goblin) {
      this.goblin.destroy();
    }
    this.cells.forEach((cell) => {
      cell.replaceWith(cell.cloneNode(true));
    });
  }
}