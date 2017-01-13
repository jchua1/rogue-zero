function Entity() {

}

Entity.prototype.update = function (delta) {
  this.vx += this.ax * delta;
  this.vy += this.ay * delta;
  this.x += this.vx * delta;
  this.y += this.vy * delta;
};
