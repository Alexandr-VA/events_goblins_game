import Goblin from './Goblin';
import { 
  CELLS_COUNT, 
  HIT_ANIMATION_DURATION, 
  HAMMER_ANIMATION_DURATION 
} from './constants';

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
      if (this.onMissCallback && this.isGameActive) {
        this.onMissCallback();
      }
      this.isSpawning = false;
    });
  }

  render() {
    this.element.innerHTML = '';
    this.cells = [];
    for (let i = 0; i < CELLS_COUNT; i++) {
      const cell = document.createElement('div');
      cell.className = 'cell';
      cell.dataset.index = i;
      cell.addEventListener('click', () => this.handleCellClick(i));
      this.element.append(cell); // append вместо appendChild
      this.cells.push(cell);
    }
  }

  reset() {
    if (this.goblin) {
      this.goblin.destroy();
    }
    this.cells.forEach((cell) => {
      cell.classList.remove('has-goblin', 'hit');
      cell.innerHTML = '';
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
    if (!this.isGameActive) return;
    if (this.isSpawning) return;
    
    if (this.goblin && this.goblin.isActive()) {
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
    if (!this.isGameActive) return;
    
    const cell = this.cells[index];
    
    if (this.goblin && this.goblin.isActive() && this.goblin.cell === cell) {
      this.showHammer(cell);
      
      cell.classList.add('hit');
      setTimeout(() => {
        cell.classList.remove('hit');
      }, HIT_ANIMATION_DURATION);
      
      this.goblin.die();
      this.isSpawning = false;
      if (this.onHitCallback) {
        this.onHitCallback();
      }
    } else {
      if (this.onMissCallback && this.isGameActive) {
        this.onMissCallback();
      }
      
      if (this.goblin && this.goblin.isActive()) {
        this.goblin.disappear(false);
        this.isSpawning = false;
      }
    }
  }

  showHammer(cell) {
    const oldHammer = cell.querySelector('.hammer-strike');
    if (oldHammer) {
      oldHammer.remove();
    }
    
    const hammer = document.createElement('div');
    hammer.className = 'hammer-strike';
    cell.append(hammer); // append вместо appendChild
    
    setTimeout(() => {
      if (hammer.parentNode) {
        hammer.remove();
      }
    }, HAMMER_ANIMATION_DURATION);
  }

  onGoblinHit(callback) {
    this.onHitCallback = callback;
  }

  onGoblinMiss(callback) {
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