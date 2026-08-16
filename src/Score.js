export default class Score {
  constructor() {
    this.score = 0;
  }

  addPoints(points) {
    this.score += points;
  }

  getScore() {
    return this.score;
  }

  reset() {
    this.score = 0;
  }
}