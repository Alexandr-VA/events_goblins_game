import { GOBLIN_LIFETIME } from './constants';

export default class Goblin {
  constructor() {
    this.element = null;
    this.cell = null;
    this.isAlive = false;
    this.timeout = null;
    this.onMissCallback = null;
    this.lifetime = GOBLIN_LIFETIME;
  }

  createElement() {
    const element = document.createElement('div');
    element.className = 'goblin';
    return element;
  }

  appear(cell) {
    if (this.isAlive) {
      this.die();
    }
    
    this.cell = cell;
    this.element = this.createElement();
    this.cell.append(this.element); // append вместо appendChild
    this.cell.classList.add('has-goblin');
    this.isAlive = true;
    
    this.timeout = setTimeout(() => {
      this.disappear(true);
    }, this.lifetime);
  }

  disappear(isMiss = false) {
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
      this.onMissCallback();
    }
  }

  die() {
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