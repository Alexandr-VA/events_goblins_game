export default class Goblin {
  constructor() {
    this.element = null;
    this.cell = null;
    this.isAlive = false;
    this.timeout = null;
    this.onMissCallback = null;
    this.lifetime = 1000;
  }

  createElement() {
    const element = document.createElement('div');
    element.className = 'goblin';
    return element;
  }

  appear(cell) {
    console.log('Goblin: появляется');
    if (this.isAlive) {
      this.die();
    }
    
    this.cell = cell;
    this.element = this.createElement();
    this.cell.appendChild(this.element);
    this.cell.classList.add('has-goblin');
    this.isAlive = true;
    
    // Таймаут на исчезновение
    this.timeout = setTimeout(() => {
      console.log('Goblin: таймаут - исчезает');
      this.disappear(true);
    }, this.lifetime);
  }

  disappear(isMiss = false) {
    console.log(`Goblin: исчезает, isMiss=${isMiss}`);
    if (!this.isAlive) return;
    
    this.clearTimeout();
    
    if (this.cell) {
      this.cell.classList.remove('has-goblin');
      if (this.element && this.element.parentNode) {
        this.element.remove();
      }
    }
    
    this.isAlive = false;
    this.element = null;
    this.cell = null;
    
    if (isMiss && this.onMissCallback) {
      console.log('Goblin: вызываем onMissCallback (промах)');
      this.onMissCallback();
    }
  }

  die() {
    console.log('Goblin: убит!');
    if (!this.isAlive) return;
    
    this.clearTimeout();
    
    if (this.cell) {
      this.cell.classList.add('hit');
      setTimeout(() => {
        if (this.cell) {
          this.cell.classList.remove('hit');
        }
      }, 300);
      
      this.cell.classList.remove('has-goblin');
      if (this.element && this.element.parentNode) {
        this.element.remove();
      }
    }
    
    this.isAlive = false;
    this.element = null;
    this.cell = null;
  }

  clearTimeout() {
    if (this.timeout) {
      clearTimeout(this.timeout);
      this.timeout = null;
    }
  }

  isActive() {
    return this.isAlive;
  }

  onMiss(callback) {
    this.onMissCallback = callback;
  }

  destroy() {
    this.clearTimeout();
    this.isAlive = false;
    this.element = null;
    this.cell = null;
    this.onMissCallback = null;
  }
}