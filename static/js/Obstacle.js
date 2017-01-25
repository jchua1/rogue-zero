function Obstacle() {
  this.x = 0;
  this.y = 0;
  this.size = 0;
  this.type = 0;
}

Obstacle.prototype.getShape = function () {
  return {
    type: 'circle',
    x: this.x,
    y: this.y,
    r: this.size
  };
};
