function Projectile() {
  this.range = 0;
  this.size = 0;
  this.startX = 0;
  this.startY = 0;
}

Projectile.inheritsFrom(Entity);
  
Projectile.prototype.update = function (delta) {
  this.parent.update.call(this, delta);
  
  if ((this.x - this.startX) ** 2 + (this.y - this.startY) ** 2 > this.range ** 2 ||
      this.x != bound(this.x, 0, Constants.CANVAS_WIDTH) ||
      this.y != bound(this.y, 0, Constants.CANVAS_HEIGHT)) {
    this.shouldExist = false;
  }
};
