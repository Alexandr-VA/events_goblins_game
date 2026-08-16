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
      if (this.onMissCallback && this.isGameActive) this.onMissCallback();
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
    if (this.goblin) this.goblin.destroy();
    this.cells.forEach((cell) => {
      cell.classList.remove('has-goblin', 'hit', 'miss');
      cell.innerHTML = '';
      const hammer = cell.querySelector('.hammer-strike');
      if (hammer) hammer.remove();
      const fig = cell.querySelector('.fig-miss');
      if (fig) fig.remove();
    });
    this.isGameActive = true;
    this.isSpawning = false;
    this.initGoblin();
  }

  spawnGoblin() {
    if (!this.isGameActive || this.isSpawning) return;
    if (this.goblin && this.goblin.isActive()) return;
    this.isSpawning = true;
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * this.cells.length);
    } while (this.goblin && this.cells[newIndex] === this.goblin.cell && this.cells.length > 1);
    this.goblin.appear(this.cells[newIndex]);
  }

  hideGoblin() { 
    if (this.goblin) this.goblin.disappear(false); 
    this.isSpawning = false; 
  }

  handleCellClick(index) {
    if (!this.isGameActive) return;
    const cell = this.cells[index];
    
    if (this.goblin && this.goblin.isActive() && this.goblin.cell === cell) {
      // Попали в гоблина!
      this.showHammer(cell);
      cell.classList.add('hit');
      setTimeout(() => cell.classList.remove('hit'), 400);
      this.goblin.die();
      this.isSpawning = false;
      if (this.onHitCallback) this.onHitCallback();
    } else {
      // Клик мимо гоблина - показываем Fig
      this.showFig(cell);
      
      // Добавляем эффект промаха
      cell.classList.add('miss');
      setTimeout(() => cell.classList.remove('miss'), 500);
      
      if (this.onMissCallback && this.isGameActive) this.onMissCallback();
      if (this.goblin && this.goblin.isActive()) {
        this.goblin.disappear(false);
        this.isSpawning = false;
      }
    }
  }

  showHammer(cell) {
    const oldHammer = cell.querySelector('.hammer-strike');
    if (oldHammer) oldHammer.remove();
    const hammer = document.createElement('div');
    hammer.className = 'hammer-strike';
    cell.appendChild(hammer);
    setTimeout(() => { if (hammer.parentNode) hammer.remove(); }, 500);
  }

  /**
   * Показывает картинку Fig.png при клике мимо гоблина
   */
  showFig(cell) {
    // Удаляем старую картинку если есть
    const oldFig = cell.querySelector('.fig-miss');
    if (oldFig) oldFig.remove();
    
    // Создаем элемент с картинкой
    const fig = document.createElement('div');
    fig.className = 'fig-miss';
    cell.appendChild(fig);
    
    // Удаляем после анимации
    setTimeout(() => {
      if (fig.parentNode) fig.remove();
    }, 600);
  }

  onGoblinHit(callback) { this.onHitCallback = callback; }
  onGoblinMiss(callback) { this.onMissCallback = callback; }

  setGameActive(active) {
    this.isGameActive = active;
    if (!active && this.goblin) this.goblin.disappear(false);
    if (!active) this.isSpawning = false;
  }

  destroy() {
    if (this.goblin) this.goblin.destroy();
    this.cells.forEach((cell) => cell.replaceWith(cell.cloneNode(true)));
  }
}