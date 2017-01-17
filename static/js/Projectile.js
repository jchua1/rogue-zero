function Projectile() {
  this.range = 0;
  this.size = 0;
  this.startX = 0;
  this.startY = 0;
}

Projectile.inheritsFrom(Entity);
  
Projectile.fromObject = function (obj) {
  return cast(cast(obj, Entity), Projectile);
};

Projectile.create = function (x, y, vx, vy, range, size) {
  var ret = new Entity();
  ret = cast(ret, Projectile);

  ret.x = x;
  ret.y = y;
  ret.vx = vx;
  ret.vy = vy;

  ret.range = range;
  ret.size = size;
  ret.startX = x;
  ret.startY = y;

  return ret;
};

Projectile.prototype.update = function (delta) {
  bind(this, this.parent.update)(delta);

  if ((this.x - this.startX) ** 2 + (this.y - this.startY) ** 2 > this.range ** 2 ||
      this.x != bound(this.x, 0, Constants.CANVAS_WIDTH) ||
      this.y != bound(this.y, 0, Constants.CANVAS_HEIGHT)) {
    this.shouldExist = false;
  }
};
