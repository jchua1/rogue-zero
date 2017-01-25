function Projectile() {
  this.range = 0;
  this.size = 0;
  this.startX = 0;
  this.startY = 0;
  this.damage = 0;
  this.origColor = Constants.PROJECTILE_COLOR;
  this.color = this.origColor;
  this.shape = 'circle';
}

Projectile.inheritsFrom(Entity);
  
Projectile.prototype.update = function (delta) {
  this.parent.update.call(this, delta);
  
  if (distance(this.x, this.y, this.startX, this.startY) > this.range ||
      this.x != bound(this.x, 0, Constants.CANVAS_WIDTH) ||
      this.y != bound(this.y, 0, Constants.CANVAS_HEIGHT)) {
    this.shouldExist = false;
  }
};

